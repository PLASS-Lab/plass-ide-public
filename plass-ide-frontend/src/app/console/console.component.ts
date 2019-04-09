import {
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { environment } from '../../environments/environment';
import { DataService } from '../data.service';
import { ProblemContent } from '../types';

@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit {
    @ViewChild('editor') editor;

    javaProblemLabels: string[] = [];
    javaProblems: ProblemContent[] = [];
    answer = '';
    result = '';

    apiUrl = environment.apiUrl;

    public constructor(
        private dataService: DataService,
    ) {}

    public ngOnInit() {
        this.dataService.getJavaProblems()
            .subscribe(
                value => {
                    this.javaProblemLabels = value;
                },
            );
    }

    public onProblemClick(event) {
        if (this.javaProblems[event.index] === undefined) {
            this.dataService.getJavaProblem(this.javaProblemLabels[event.index])
                .subscribe(
                    value => {
                        this.javaProblems[event.index] = value;
                    },
                );

        }
    }

    public onAnswerButtonClick(index: number) {
        if (this.javaProblems[index].type === 'A') {
            const sampleSource = 'class Main {\n    public static void main(String[] args) {\n        // 소스 코드 입력\n    }\n}\n';
            this.answer = `/*\n number: ${this.javaProblems[index].number}\n time: ${Math.floor(Date.now() / 1000)}\n */\n${sampleSource}`;
        } else {
            this.answer = this.javaProblems[index].answer;
        }
    }

    public runSource() {
        this.dataService.runJavaSource(this.answer)
            .subscribe(
                hash => {
                    this.getResult(hash, false, -1);
                    this.result = 'RUNNING...\n';
                },
            );
    }

    public getResult(hash: string, isError: boolean, index?: number) {
        this.dataService.getResult(hash, isError, index)
            .subscribe(
                value => {
                    if (value.closed) {
                        return;
                    }

                    if (value.err) {
                        this.result += `ERROR: ${value.data}`;
                    } else {
                        this.result += `OUTPUT: ${value.data}`;
                    }

                    if (isError !== value.err) {
                        // 에러 처리
                        this.getResult(hash, !isError, value.index);
                    } else {
                        this.getResult(hash, isError, value.index);
                    }
                },
            );
    }
}
