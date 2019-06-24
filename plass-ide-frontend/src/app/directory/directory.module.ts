import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { DirectoryComponent } from './directory.component';
import { CreatePopupComponent } from './createPopup/createPopup.component';
import { ElementComponent } from './element/element.component';

@NgModule({
    imports: [
        // ConsoleRoutingModule,
        SharedModule,
    ],
    declarations: [
        DirectoryComponent, CreatePopupComponent, ElementComponent
    ],
    exports: [
        DirectoryComponent
    ],
    providers: [],
})
export class DirectoryModule {}
