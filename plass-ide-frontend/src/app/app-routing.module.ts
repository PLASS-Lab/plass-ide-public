import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule,
} from '@angular/router';
import { CanActivateGuard } from './can-activate-guard';
import { ConsoleComponent } from './console/console.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { DirectoryComponent } from './directory/directory.component';
import { ProblemsComponent } from './problems/problems.component';
import { DetailComponent } from './problems/detail/detail.component';
import { MyPageComponent } from './mypage/mypage.component';
import { ProblemConsoleComponent } from './problemConsole/problem-console.component';

const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'login', component: LoginComponent },
    { path: 'directory', component: DirectoryComponent, canActivate: [CanActivateGuard] },
    { path: 'console/:id', component: ConsoleComponent, canActivate: [CanActivateGuard] },
    { path: 'console/:id/problem', component: ProblemConsoleComponent, canActivate: [CanActivateGuard]},
    { path: 'problems', component: ProblemsComponent},
    { path: 'problems/:id', component: DetailComponent},
    { path: 'mypage', component: MyPageComponent },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
