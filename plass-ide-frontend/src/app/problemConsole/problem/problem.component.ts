import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Problem } from 'src/app/types';
import { newlineToBr } from 'src/app/helper/escape-to-html';


@Component({
    selector: 'aside-problem',
    templateUrl: './problem.component.html',
    styleUrls: ['./problem.component.scss'],
})
export class AsideProblemComponent implements OnInit{
    @Input() problem_id: number;
    problem: Problem; 

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.dataService.getProblem({id: this.problem_id}).subscribe((problem)=>{
            this.problem = problem;
            console.log(problem);
        }, (error) => {

        })
    }

    public escapeString(str: string) {
        return newlineToBr(str);
    }
}
