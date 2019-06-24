import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';;

import { Project } from '../types';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CreatePopupComponent } from './createPopup/createPopup.component';


@Component({
    selector: 'app-directory',
    templateUrl: './directory.component.html',
    styleUrls: ['./directory.component.scss'],
})
export class DirectoryComponent implements OnInit {
    @ViewChild("createModal") createModal: CreatePopupComponent;
    projects: Array<Project> = [];
    projectsWithProblem: Array<Project> = [];

    projectMenu: {
        visible: boolean,
        x?: number,
        y?: number,
        type?: string
    } = { visible: false};
    
    constructor(private dataService: DataService,
        private router: Router,
        private route: ActivatedRoute) {}

    public ngOnInit() {
        this.dataService.getProjects().subscribe(projects => {
            this.projects = projects.filter(value=>!value.problem);
            this.projectsWithProblem = projects.filter(value=>value.problem);
        }, error => {
            alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        });
        
        const problem_id = this.route.snapshot.queryParams.problem_id;

        if(problem_id) {
            this.dataService.getProjects({problem_id}).subscribe(projects => {
                if(projects.length === 0) {
                    this.dataService.getProblem({id: problem_id}).subscribe((problem)=> {
                        this.createModal.modalOn = true;
                        this.createModal.problem = problem;
                    }, (error) => { console.log(error) });
                } else {
                    this.router.navigate(["/console", projects[0].id]);
                }
            }, error => {console.log()});
            this.router.navigate(['.'], {relativeTo: this.route});
        }


        this.dataService.getProjects()
    }
    
    public openCreatePopup() {
        this.createModal.modalOn = true;
        this.createModal.problem = null;
    }

    public closeModal($event) {
        this.createModal.modalOn = true;
    }

    public selectProject($event: MouseEvent, project?: Project) {
        $event.stopPropagation();
        if(!project) { this.projects.forEach(value=>{value.select=false}); return };

        const selectedProjects = this.projects.filter((value) => {
            return value.select;
        });

        const normalSelect = () => {
            selectedProjects.forEach((value) => {value.select = false;});
            project.select = !project.select;
        }
        
        const ctrlSelect = () => {
            project.select = !project.select;
        }

        const shiftSelect = () => {
            const selectIndex = this.projects.findIndex(value => value===project);
            const firstIndex = this.projects.findIndex(value => value===selectedProjects[0]);
            const lastIndex = this.projects.findIndex(value => value===selectedProjects[selectedProjects.length - 1]);
            let start, last;

            if(selectIndex < firstIndex) { 
                start = selectIndex; last = firstIndex;
            } else if ( selectIndex > firstIndex && selectIndex < lastIndex ) {
                start = firstIndex; last = selectIndex;
            } else if ( selectIndex > lastIndex){
                start = firstIndex; last = selectIndex;
            } else {
                normalSelect(); return;
            }
            
            selectedProjects.forEach((value) => value.select = false);
            for(let i = start; i <= last; i++) {
                this.projects[i].select = true;
            }
        }


        if($event.ctrlKey) ctrlSelect();
        else if($event.shiftKey) shiftSelect();
        else normalSelect();
    }

    public deleteProjects() {
        const _confirm = confirm("정말로 삭제하시겠습니까?");
        if(!_confirm) { return; };

        const selectedProjects = this.projects.filter((value) => {
            return value.select;
        }); 

        selectedProjects.forEach(project => {
            this.dataService.deletProject({id: project.id}).subscribe(()=>{
                this.projects = this.projects.filter((value) => value!==project);
            }, error=>{alert("삭제 중 에러가 발생했습니다. 잠시 후 다시해주세요.");});
        });
    }

    public openContextMenu($event: MouseEvent, project?: Project) {
        $event.preventDefault();
        $event.stopPropagation();

        const { x, y } = $event;
        this.projectMenu = { x, y, visible: true, type: project? "project" : null };

        if(!project) { return; };

        const selectedProjects = this.projects.filter((value) => {
            return value.select;
        });

        if( selectedProjects.findIndex((value) => value === project) == -1 ) {
            this.projects.forEach((value) => {value.select = false;});
            project.select = true;
        }
    }

    public disableContextMenu($event: MouseEvent) {
        $event.preventDefault();
        this.projectMenu.visible = false;
    }
}