import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription = new Subscription();
  editMode = false;
  editItemIndex: number = -1;
  editedItem: Ingredient;

  constructor(
    private shoppingListService: ShoppingListService
  ) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe((index) => {
      this.editItemIndex = index;
      this.editMode = true;
      this.editedItem = this.shoppingListService.getIngredient(index);
      this.slForm.setValue(this.editedItem)
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
      this.shoppingListService.updateIngredient(this.editItemIndex, newIngredient)
    } else {
      this.shoppingListService.addIngredient(newIngredient)
    }
    this.slForm.reset();
    this.editMode = false;
  }
  onClear(){
    this.slForm.reset();
    this.editMode= false;
  }
  onDelete() {
    this.onClear();
    this.shoppingListService.removeIngredient(this.editItemIndex);
  }
}
