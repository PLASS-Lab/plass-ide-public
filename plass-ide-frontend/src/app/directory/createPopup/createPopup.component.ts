import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';import { shiftInitState } from '@angular/core/src/view';
import { DataService } from 'src/app/data.service';
import { Router } from '@angular/router';
import { Problem } from 'src/app/types';


@Component({
    selector: 'app-createPopup',
    templateUrl: './createPopup.component.html',
    styleUrls: ['./createPopup.component.scss'],
})
export class CreatePopupComponent {
    modalOn: boolean = false;
    projectName: string = "";
    projectType: string = "";
    nameError: boolean = false;
    typeError: boolean = false;

    problem: Problem;

    doubleSubmit: boolean = false;
    
    constructor(private dataService: DataService,
        private router: Router) {}

    public handleName(e) {
        this.projectName = e.target.value;
    }
    public handleType(e) {
        this.projectType = e.target.value;
    }

    public create() {
        if(!this.validation()) { this.doubleSubmit = false; return; }
        this.doubleSubmit = true;

        // TODO : send data
        const body = {
            name: this.projectName,
            category: this.projectType
        };

        if(this.problem) body["problem"] = this.problem.id;

        this.dataService.postProjects({body}).subscribe(value => {
            this.router.navigateByUrl(`console/${value.id}`);
        });
    }

    private validation() {
        if(this.doubleSubmit) return false;

        let isValid = true;
        if (!this.projectName) {
            isValid = false;
            this.nameError = true;
            setTimeout(()=>{this.nameError = false;}, 800);
        }

        if( !this.projectType ) {
            isValid = false;
            this.typeError = true;
            setTimeout(()=>{this.typeError = false;}, 800);
        }
        
        return isValid;
    }

    public cancel() {
        this.modalOn = false;
    }
}
