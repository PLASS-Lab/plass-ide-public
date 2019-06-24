import {
    Component,
    Input,
} from '@angular/core';
import { File } from 'src/app/types';

@Component({
    selector: 'tab-component',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss'],
})

export class TabComponent {
    @Input() upload = (file: File, data: string, isTemp: boolean, cb, errcb) => {};
    @Input() compile = () => {};
    public files:Array<File> = [];
    public selectFile:File = null;
    public isFileChange: boolean = false;
    public text:string = "";
    public newCount:number = 0;

    pushFile(file:File) {
        if(this.files.findIndex((value)=>(file === value)) !== -1) { this.selectFile = file; return; } // if files aready exsist

        this.files.push(file);
        if(this.files.length === 1) { this.clickFile(file) }; // if the pushed file is first
    }

    clickFile(file: File) {
        this.selectFile = file;
        this.text = file.data;
        console.log(file);
        this.isFileChange = true;
    }

    changeEditor($event) {
        if(this.isFileChange) {this.isFileChange = false; return;}
        if(this.selectFile) {
            // TODO: bug fix: a file change to modify state when change file
            this.selectFile.data = this.text;
            this.selectFile.modify = true;
        } else {
            const tempFile: File = {
                name: "undefined",
                isDirectory: false,
                path: "",
                data: this.text,
                isTemp: true,
                modify: true
            }
            this.files.push(tempFile)
            this.selectFile = tempFile;
        }
    }

    createNewFile($event) {
        const tempFile: File = {
            name: "undefined " + (this.newCount++),
            isDirectory: false,
            path: "",
            data: "",
            isTemp: true,
            modify: true
        }
        this.files.push(tempFile)
        this.clickFile(tempFile);
    }

    uploadFile($event) {
        console.log(this.upload);
        if(this.selectFile.isTemp) {
            this.selectFile.isTemp = false;

            this.upload(this.selectFile, this.text, true, ()=>{}, ()=>{});
        } else {
            this.upload(this.selectFile, this.text, false, ()=>{}, ()=>{});
        }
    }

    compileProject(event) {
        this.compile();
    }
}
