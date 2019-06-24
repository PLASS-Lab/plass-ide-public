import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';
import { Project } from 'src/app/types';
import { DataService } from 'src/app/data.service';
import { Router } from '@angular/router';


@Component({
    selector: 'list-element',
    templateUrl: './element.component.html',
    styleUrls: ['./element.component.scss'],
})
export class ElementComponent implements OnInit{
    @Input() project: Project;
    @Input() isProblem:boolean = false;
    
    isChange: boolean = false;
    name: string = "";
    isDoubleClick: boolean = false;
    constructor(private dataService: DataService, 
        private router: Router) {}

    ngOnInit() {
        this.name = this.project.name;
    }

    clickProject() {
        if(this.isDoubleClick) {
            if( !this.isProblem) {
                this.router.navigateByUrl(`console/${this.project.id}`);
            } else {
                this.router.navigateByUrl(`console/${this.project.id}/problem`);
            }
            return;
        }
        this.isDoubleClick = true;
        setTimeout(()=> {
            this.isDoubleClick = false;
        }, 200);
    }

    clickInput($event) {
        $event.stopPropagation();
    }

    toggleIsChange($event)  {
        $event.stopPropagation();
        this.isChange = !this.isChange;
    }

    modifyName($event) {
        $event.stopPropagation();
        const { id } = this.project;
        const name = this.name;
        this.dataService.putProject({id, body: {name}}).subscribe(
            (value) => {},
            (error) => {
                alert("이름 변경 중 에러가 발생 했습니다.");
            }
        )
        this.isChange = false;
        this.project.name = name;
    }
}
