import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { MyPageComponent } from './mypage.component';

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        MyPageComponent,
    ],
    exports: [
        MyPageComponent,
    ],
    providers: [],
})
export class MyPageModule {}
