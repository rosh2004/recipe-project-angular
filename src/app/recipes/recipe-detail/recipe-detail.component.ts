import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  public id: number;
  public recipe: Recipe;
  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params)=>{
        this.id = +params.id;
        this.getRecipeById(this.id);
      }
    )
  }
getRecipeById(id: number){
  this. recipe = this.recipeService.getRecipeById(id);
}
  onAddToShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
  }
  onDelete(){
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['recipes'])
  }
}