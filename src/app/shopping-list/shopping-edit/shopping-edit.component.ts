import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions'
import * as fromApp from  '../../store/app.reducer'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription = new Subscription();
  editMode = false;
  editedItem: Ingredient;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue(this.editedItem)
      } else {
        this.editMode = false;
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onSubmit(form: NgForm) {
    const ingName = form.value.name;
    const ingAmout = form.value.amount;
    const newIngredient = new Ingredient(ingName, ingAmout)
    if (this.editMode) {
      // this.shoppingListService.updateIngredient(this.editItemIndex, newIngredient)
    this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
    } else {
      // this.shoppingListService.addIngredient(newIngredient)
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.slForm.reset();
    this.editMode = false;
  }
  onClear(){
    this.slForm.reset();
    this.editMode= false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
  onDelete() {
    // this.shoppingListService.removeIngredient(this.editItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }
}
