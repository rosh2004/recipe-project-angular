import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";

@NgModule({
    declarations:[
        DropdownDirective,
        PlaceholderDirective,
        AlertComponent,
        LoadingSpinnerComponent,
    ],
    imports:[
        CommonModule,
    ],
    exports: [
        CommonModule,
        DropdownDirective,
        PlaceholderDirective,
        AlertComponent,
        LoadingSpinnerComponent,
    ]
})
export class SharedModule{}