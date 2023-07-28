import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, createEffect } from '@ngrx/effects'
import { of, throwError } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

import * as AuthActions from './auth.actions'
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  email: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user))
  return new AuthActions.AuthenticateSuccess({ email: email, userId: userId, token: token, expirationDate: expirationDate, redirect: true });
};
const handleError = (errRes: any) => {
  let errorMessage = 'An unknown error occurred!'
  if (!errRes.error || !errRes.error.error) {
    return throwError(errorMessage);
  }
  switch (errRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The password is incorrect';
      break;
    default:
      errorMessage = errRes.error.error.message;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {


  authSignup = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey;
        let payload = {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true,
        }
        return this.http.post<AuthResponseData>(url, payload).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          }),
          map(
            (resData) => {
              return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
            }
          ),
          catchError(
            errRes => {
              return handleError(errRes);
            }
          )
        )
      })
    )
  })


  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey;
        let payload = {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true,
        }
        return this.http.post<AuthResponseData>(url, payload).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          }),
          map(resData => {
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
          }),
          catchError(errRes => {
            return handleError(errRes);
          })
        )
      }),
    );

  })

  authRedirect = createEffect(() => {
    return this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
        if (authSuccessAction.payload.redirect) {
          this.router.navigate(['/'])
        }
      }
      ))
  }, {dispatch: false})


  authLogout = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        this.authService.clearLogoutTimer();
        this.router.navigate(['/auth'])
        localStorage.removeItem('userData')
      })
    )
  },{dispatch: false})


authAutoLogin = createEffect(() => {
  return this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'DUMMY' };
      }
      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))
      if (loadedUser.token) {
        // this.user.next(loadedUser);
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({ email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpirationDate), redirect: false })
      }
      return { type: 'DUMMY' };
    })
  )
})


constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService){ }
}
