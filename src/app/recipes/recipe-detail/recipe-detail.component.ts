import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Recipe } from "../recipe.model";
import * as fromApp from '../../store/app.reducer'
import { map, switchMap } from "rxjs/operators";
import * as RecipesActions from '../store/recipe.actions'
import * as ShopingListActions from '../../shopping-list/store/shopping-list.actions'

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  public id: number;
  public recipe: Recipe;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => {
        return +params.id
      }),
      switchMap( id => {
        this.id = id;
        return this.store.select('recipes')
      }),
      map(recipesState => {
        return recipesState.recipes[this.id]
      })
    ).subscribe(
      (recipe)=>{
        this.recipe = recipe;
      }
    )
  }
  onAddToShoppingList(){
    this.store.dispatch(new ShopingListActions.AddIngredients(this.recipe.ingredients))
  }
  onDelete(){
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id))
    this.router.navigate(['recipes'])
  }
}