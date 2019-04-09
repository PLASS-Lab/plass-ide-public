import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AceEditorModule } from 'ng2-ace-editor';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FormsModule,
        AceEditorModule,
        PerfectScrollbarModule,
        AccordionModule,
        ButtonModule,
        CardModule,
    ],
    providers: [],
    bootstrap: [],
    exports: [
        CommonModule,
        FormsModule,
        AceEditorModule,
        PerfectScrollbarModule,
        AccordionModule,
        ButtonModule,
        CardModule,
    ],
})
export class SharedModule {}
