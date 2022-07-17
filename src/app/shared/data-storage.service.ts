import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    let url = 'https://ng-udemy-9406c-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json'
    this.http.put(url, recipes).subscribe((res) => {
      console.log(res);
    })
  }
  fetchRecipes() {
    let url = 'https://ng-udemy-9406c-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json'
    return this.http.get<Recipe[]>(url).pipe(
      map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
      })
    }), tap(recipes => {
      this.recipeService.setRecipes(recipes);
    }));
  }
}