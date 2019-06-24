import {
    Component,
    OnInit,
    ViewChild,
    ViewChildren,
    QueryList,
} from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { Project, File } from '../types';
import { TabComponent } from './tab/tab.component';


@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit {
    project: Project;
    text: string = "";
    resultConsole: string = "";
    resultHash: string = null;
    @ViewChild("nameModal") nameModal;
    apply = (body, cb, errcb) => {};
    select: File;

    public contextMenu: {
        visible: boolean;
        x?: number;
        y?: number;
        rename?: boolean;
        addFile?: boolean;
        delete?: boolean;
        addDirectory?: boolean;
    } = { 
        visible: false,
        rename: false,
        addFile: false,
        delete: false,
        addDirectory: false,
    };

    @ViewChildren("tabComponent") tabs:QueryList<TabComponent>;

    public constructor(
        private dataService: DataService,
        private route: ActivatedRoute
    ) {}

    public ngOnInit() {
        const id = parseInt(this.route.snapshot.paramMap.get("id"));
        // TODO: error exception

        this.dataService.getProject({id}).subscribe((project) => {
            this.project = project;
        }, (error) => {
            // TODO: error exception
        });
    }

    public clickFile(file: File) {
        if(file.isDirectory) {
            file.open = !file.open;
            return;
        }
        
        const id = parseInt(this.route.snapshot.paramMap.get("id"));
        const {path, name, data} = file;

        if(!data) {
            this.dataService.getFile({id, path, name}).subscribe(value => {
                file.data = value.data;
                this.text = value.data;
            });
        }
        
        this.tabs.toArray()[0].pushFile(file);
        this.tabs.toArray()[0].clickFile(file);
    }

    openContextMenu($event: MouseEvent) {
        $event.preventDefault();
        this.contextMenu.visible = true;
        this.contextMenu.x = $event.x;
        this.contextMenu.y = $event.y;
    }

    disableContextMenu($event) {
        $event.stopPropagation();
        this.contextMenu.visible = false;
    }

    navContextMenu($event) {
        $event.stopPropagation();
        this.select = null;
        this.contextMenu.addDirectory = true;
        this.contextMenu.addFile = true;
        this.contextMenu.rename = true;
        this.contextMenu.delete = false;
    }

    directoryContextMenu($event, directory) {
        $event.stopPropagation();
        this.select = directory;
        this.contextMenu.addDirectory = true;
        this.contextMenu.addFile = true;
        this.contextMenu.rename = true;
        this.contextMenu.delete = true;
    }

    addFile($event) {
        this.nameModal.modalOn = true;
        this.apply = (body, cb, errcb) => {
            const path = getPath(this.select);

            body["path"] = path
            body["data"] = "";
            body["isDirectory"] = false;
            
            this.dataService.postProject(this.project.id, body).subscribe((value) => {
                const file: File = {
                    name: body.filename,
                    data: "",
                    isDirectory: false,
                    path: path
                };

                if(this.select) {
                    if(!this.select.files) {
                        this.select.files = [];
                    } 

                    this.select.files.push(file);
                } else {
                    this.project.files.push(file);
                }

                if(typeof cb === "function") { cb(value); }
            }, error => {
                switch(error.error.code) {
                    case 0:
                        alert("프로젝트가 옳바르지 않습니다.");
                        break;
                    case 1:
                        alert("파일 이름이 존재하지 않습니다.");
                        break;
                    case 1:
                        alert("프로젝트가 옳바르지 않습니다.");
                        break;
                    case 2:
                        alert("파일이 이미 존재합니다.");
                        break;
                    case 3:
                        alert("파일 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
                        break;
                    default: 
                        alert("잠시 후 다시 시도해주세요.");
                }
                if(typeof errcb === "function") { errcb(); }
            });
        }
    }

    addDirectory($event) {
        this.nameModal.modalOn = true;
        this.apply = (body, cb, errcb) => {
            const path = getPath(this.select);
            
            body["path"] = path;
            body["data"] = "";
            body["isDirectory"] = true;
            this.dataService.postProject(this.project.id, body).subscribe((value)=> {
                const file: File = {
                    name: body.filename,
                    data: "",
                    isDirectory: true,
                    path: path
                };

                if(this.select) {
                    if(!this.select.files) {
                        this.select.files = [];
                    } 

                    this.select.files.push(file);
                } else {
                    this.project.files.push(file);
                }

                if(typeof cb === "function") { cb(value); }
            }, error => {
                console.log(error);
                switch(error.error.code) {
                    case 0:
                        alert("프로젝트가 옳바르지 않습니다.");
                        break;
                    case 1:
                        alert("파일 이름이 존재하지 않습니다.");
                        break;
                    case 1:
                        alert("프로젝트가 옳바르지 않습니다.");
                        break;
                    case 2:
                        alert("파일이 이미 존재합니다.");
                        break;
                    case 3:
                        alert("파일 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
                        break;
                    default: 
                        alert("잠시 후 다시 시도해주세요.");
                }
                if(typeof errcb === "function") { errcb(); }
            });
        }
    }

    renameFile($event) {
        this.nameModal.modalOn = true;
        this.nameModal.name = this.select.name;
        
        this.apply = (body, cb, errcb) => {
            const path = getPath(this.select);
            
            this.dataService.putFile(this.project.id,{
                name: body.filename,
                data: this.select.data,
                path: this.select.isDirectory ? path : path + "/" + this.select.name,
            }).subscribe(value => {
                this.select.name = body.filename;

                if(typeof cb === "function") { cb(value); }
            }, error => {
                switch(error.error.code) {
                    case 0:
                        alert("프로젝트가 옳바르지 않습니다.");
                        break;
                    case 1:
                        alert("파일이 존재하지 않습니다.");
                        break;
                    case 2:
                        alert("프로젝트가 옳바르지 않습니다.");
                        break;
                    case 3:
                        alert("파일이 존재하지 않습니다.");
                        break;
                    case 4:
                        alert("파일 이름이 존재합니다.");
                        break;
                    default: 
                        alert("잠시 후 다시 시도해주세요.");
                }
                if(typeof errcb === "function") { errcb(); }
            })
        }
    }

    deleteFile($event) {
        if(!confirm("정말로 삭제하시겠습니까?")){ return; };
        const path = getPath(this.select);

        this.dataService.deleteFile(this.project.id, this.select.isDirectory ? path : path + "/" + this.select.name).subscribe(value => {
            this.select.isDelete = true;
        }, error => {
            switch(error.error.code) {
                case 0:
                    alert("프로젝트가 옳바르지 않습니다.");
                    break;
                case 1:
                    alert("파일이 존재하지 않습니다.");
                    break;
                case 2:
                    alert("프로젝트가 옳바르지 않습니다.");
                case 3:
                    alert("파일이 존재하지 않습니다.");
                    break;
                default: 
                    alert("잠시 후 다시 시도해주세요.");
            }
        });
    }

    uploadFile = (file, data, isTemp, cb, errcb)  => {
        const path = getPath(file);
        file.data = data;
        
        if(isTemp) {
            this.nameModal.modalOn = true;
            this.nameModal.pathMode = true;

            this.apply = (body, cb, errcb) => {
                file["name"] = body.filename;
                file["data"] = data;
                file["path"] = body.path ? `${body.path.path}/${body.path.name}` : "";
                file["isDirectory"] = false;
                console.log(file);

                this.dataService.postProject(this.project.id, {
                    filename: file.name,
                    path: file.path,
                    data,
                    isDirectory: false
                }).subscribe(value=>{
                    if(!body.path) {
                        this.project.files.push(file);
                    } else {
                        console.log(body);
                        body.path.files.push(file);
                    }
                    if(typeof cb === "function") { cb(value); }
                }, error => {
                    switch(error.error.code) {
                        case 0:
                            alert("프로젝트가 옳바르지 않습니다.");
                            break;
                        case 1:
                            alert("파일 이름이 존재하지 않습니다.");
                            break;
                        case 1:
                            alert("프로젝트가 옳바르지 않습니다.");
                            break;
                        case 2:
                            alert("파일이 이미 존재합니다.");
                            break;
                        case 3:
                            alert("파일 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
                            break;
                        default: 
                            alert("잠시 후 다시 시도해주세요.");
                    }
                    if(typeof errcb === "function") { errcb(); }
                })
            }
        } else {
            this.dataService.putFile(this.project.id,{
                data: data,
                path: file.isDirectory ? path : path + "/" + file.name,
            }).subscribe(value => {
                file.modify = false;
                if(typeof cb === "function") { cb(value); }
            }, error => {
                switch(error.error.code) {
                    case 0:
                        alert("프로젝트가 옳바르지 않습니다.");
                        break;
                    case 1:
                        alert("파일이 존재하지 않습니다.");
                        break;
                    case 2:
                        alert("프로젝트가 옳바르지 않습니다.");
                        break;
                    case 3:
                        alert("파일이 존재하지 않습니다.");
                        break;
                    case 4:
                        alert("파일 이름이 존재합니다.");
                        break;
                    default: 
                        alert("잠시 후 다시 시도해주세요.");
                }
                if(typeof errcb === "function") { errcb(); }
            });
        }
    }

    compileProject = () => {
        if(!confirm("컴파일 하시겠습니까?")) { return; }
        this.resultConsole = "";
        this.dataService.run(this.project.id).subscribe((value) => {
            this.resultHash = value.hash;
            this.callResult();
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

    modalOff($event) {
        this.nameModal.modalOn = false;
    }
}


function getPath(target) {
    let path = "";
    if(!target) {} 
    else if (target.isDirectory) {
        path = target.path + "/" + target.name;
    } else {
        path = target.path;
    }

    return path;
}