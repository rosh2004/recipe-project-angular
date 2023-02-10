import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'
import * as RecipesActions from '../recipes/store/recipe.actions'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  collapsed = true;
  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>) { }
  ngOnInit() {
    this.userSub = this.store.select("auth").pipe(map(authState => authState.user)).subscribe(user => {
      this.isAuthenticated = !!user;
    })
  }
  onSaveData() {
    this.store.dispatch(new RecipesActions.storeRecipes());
  }
  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes())
  }
  onLogOut() {
    this.store.dispatch(new AuthActions.Logout());
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
