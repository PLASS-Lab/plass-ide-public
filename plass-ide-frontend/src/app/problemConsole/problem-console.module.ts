import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
// import { ConsoleRoutingModule } from './console-routing.module';
import { ProblemConsoleComponent } from './problem-console.component';
import { AsideProblemComponent } from './problem/problem.component';

@NgModule({
    imports: [
        // ConsoleRoutingModule,
        SharedModule,
    ],
    declarations: [
        ProblemConsoleComponent, AsideProblemComponent
    ],
    exports: [
        ProblemConsoleComponent,
    ],
    providers: [],
})
export class ProblemConsoleModule {}
