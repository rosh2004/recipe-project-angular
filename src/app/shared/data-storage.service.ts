import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from 'rxjs/operators';
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer'
import * as RecipesActions from '../recipes/store/recipe.actions'

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(private http: HttpClient, private store: Store<fromApp.AppState>) { }


}