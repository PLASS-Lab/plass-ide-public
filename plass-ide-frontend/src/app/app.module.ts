import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    BrowserAnimationsModule,
    NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { SharedModule } from 'primeng/shared';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanActivateGuard } from './can-activate-guard';
import { ConsoleModule } from './console/console.module';
import { LoginModule } from './login/login.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        AppRoutingModule,
        SharedModule,
        HttpClientModule,
        LoginModule,
        ConsoleModule,
    ],
    providers: [
        CanActivateGuard,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
