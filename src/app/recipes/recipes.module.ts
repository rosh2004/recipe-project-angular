import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { DropdownDirective } from "../shared/dropdown.directive";
import { SharedModule } from "../shared/shared.module";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipePlaceholderComponent } from "./recipe-placeholder/recipe-placeholder.component";
import { RecipesRoutingModule } from "./recipes-routing.modules";
import { RecipesComponent } from "./recipes.component";

@NgModule({
    declarations: [
        RecipePlaceholderComponent,
        RecipeEditComponent,
        RecipeListComponent,
        RecipeItemComponent,
        RecipeDetailComponent,
        RecipesComponent,

    ],
    imports: [
        RecipesRoutingModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    exports: [
        DropdownDirective,
    ]
})
export class RecipesModule { }