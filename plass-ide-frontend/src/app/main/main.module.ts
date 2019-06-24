import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { MainComponent } from './main.component';

@NgModule({
    imports: [
        // LoginRoutingModule,
        SharedModule,
    ],
    declarations: [
        MainComponent,
    ],
    exports: [
        MainComponent,
    ],
    providers: [],
})
export class MainModule {}
