import {
    Component,
    OnInit
} from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { Project, File, Problem } from '../types';


@Component({
    selector: 'app-console',
    templateUrl: './problem-console.component.html',
    styleUrls: ['./problem-console.component.scss'],
})
export class ProblemConsoleComponent implements OnInit {
    project: Project;
    problem: Problem;
    mainFile: File;
    text: string = "";
    resultConsole: string = "";
    resultHash: string = null;
    resultSubmit: any;

    public constructor(
        private dataService: DataService,
        private route: ActivatedRoute
    ) {}

    public ngOnInit() {
        const id = parseInt(this.route.snapshot.paramMap.get("id"));
        // TODO: error exception

        this.dataService.getProject({id}).subscribe((project) => {
            this.project = project;
            this.mainFile = project.files.find((value) => value.name.toLowerCase().includes("main")); // find main file
            this.text = this.mainFile.data;
        }, (error) => {
            // TODO: error exception
        });
    }

    compileProject = () => {
        if(!confirm("컴파일 하시겠습니까?")) { return; }
        const { mainFile, text } = this;
        
        this.dataService.putFile(this.project.id,{
            data: text,
            path: mainFile.path + "/" + mainFile.name,
        }).subscribe(value => {
            this.resultConsole = "";
            this.dataService.run(this.project.id).subscribe((value) => {
                this.resultHash = value.hash;
                this.callResult();
            });
        }, error => {
            alert("잠시 후 다시 시도해주세요.");
        });

    }

    callResult() {
        if (!this.resultHash) return;

        this.dataService.result(this.resultHash).subscribe((result) => {
            if(result["wait"]) {
                setTimeout(() => {
                    this.callResult();
                }, 1000);
                return;
            }

            if(result.closed)  { this.resultHash = null; return; }
            this.resultConsole += result.data;
            this.callResult();
        });
    }

    consoleInput($event) {
        if(!this.resultHash) { return; }
        if($event.key!="Enter") { return; }

        const value = $event.target.value;
        this.dataService.input(this.resultHash, value).subscribe(() => {});
        $event.target.value = "";
    }

    submitProject = () => {
        if(!confirm("제출 하시겠습니까?")) { return; }

        const { mainFile, text } = this;
        
        this.dataService.putFile(this.project.id,{
            data: text,
            path: mainFile.path + "/" + mainFile.name,
        }).subscribe(value => {
            this.resultConsole = "";
            this.dataService.submit(this.project.id).subscribe((value) => {
                this.resultSubmit = value;
            });
        }, error => {
            alert("잠시 후 다시 시도해주세요.");
        });
    }

    dismissResult() {
        this.resultSubmit = null;
    }
}