import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ProblemsComponent } from './problems.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
    imports: [
        // LoginRoutingModule,
        SharedModule,
    ],
    declarations: [
        ProblemsComponent,
        DetailComponent
    ],
    exports: [
        ProblemsComponent,
    ],
    providers: [],
})
export class ProblemsModule {}
