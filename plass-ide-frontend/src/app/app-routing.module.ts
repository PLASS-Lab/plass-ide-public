import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule,
} from '@angular/router';
import { CanActivateGuard } from './can-activate-guard';
import { ConsoleComponent } from './console/console.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    // loadChildren: './login/login.module#LoginModule' },
    { path: 'console', component: ConsoleComponent, canActivate: [CanActivateGuard] },
    // loadChildren: './console/console.module#ConsoleModule' },
    { path: '**', redirectTo: 'console' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
