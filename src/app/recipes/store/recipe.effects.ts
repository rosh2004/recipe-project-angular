import { HttpClient } from "@angular/common/http";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { map, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as fromApp from '../../store/app.reducer'
import * as RecipesActions from '../store/recipe.actions'
import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class RecipesEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      let url = 'https://ng-udemy-9406c-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json'
      return this.http.get<Recipe[]>(url)        
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
      })
    }), map(recipes => {
      // this.recipeService.setRecipes(recipes);
      return new RecipesActions.SetRecipes(recipes);
    }))

    @Effect({dispatch: false})
    storeRecipes = this.actions$.pipe(
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionType, recipesState])=>{
        let url = 'https://ng-udemy-9406c-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json'
        return this.http.put(url, recipesState.recipes)
         
        
      })
    )

  constructor(private actions$: Actions,  private http: HttpClient, private store: Store<fromApp.AppState>){}
}