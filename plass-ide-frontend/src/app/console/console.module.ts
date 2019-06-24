import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
// import { ConsoleRoutingModule } from './console-routing.module';
import { ConsoleComponent } from './console.component';
import { TabComponent } from './tab/tab.component';
import { NamePopupComponent } from './namePopup/namePopup.component';

@NgModule({
    imports: [
        // ConsoleRoutingModule,
        SharedModule,
    ],
    declarations: [
        ConsoleComponent, TabComponent, NamePopupComponent
    ],
    exports: [
        ConsoleComponent,
    ],
    providers: [],
})
export class ConsoleModule {}
