import {
    Component,
    OnInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Problem } from '../types';
import { DataService } from '../data.service';

@Component({
    selector: 'app-problems',
    templateUrl: './problems.component.html',
    styleUrls: ['./problems.component.scss'],
})

export class ProblemsComponent implements OnInit{
    problems:Array<Problem> = [];
    
    public constructor(
        private dataService: DataService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    public ngOnInit() {
        const page = parseInt(this.route.snapshot.queryParamMap.get("page")) || 0;

        this.dataService.getProblems({page}).subscribe((value) => {
            this.problems = value;
        });
    }

    public getDate(dateString: string) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        return `${year}.${month}.${day}`;
    }

    public handleClickProblem(seq) {
        this.router.navigateByUrl(`/problems/${seq}`);
    }

    public handlePagenation(page) {
        this.router.navigateByUrl(`/problems?page=${page}`)
        this.dataService.getProblems({page}).subscribe((value) => {
            this.problems = value;
        });
    }
}
