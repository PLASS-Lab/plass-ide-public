import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
// import { ConsoleRoutingModule } from './console-routing.module';
import { ConsoleComponent } from './console.component';

@NgModule({
    imports: [
        // ConsoleRoutingModule,
        SharedModule,
    ],
    declarations: [
        ConsoleComponent,
    ],
    exports: [
        ConsoleComponent,
    ],
    providers: [],
})
export class ConsoleModule {}
