import {
    Component,
    OnInit
} from '@angular/core';
import { DataService } from './data.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
    isLoggedIn: boolean = false;

    constructor(
        private dataService: DataService,
        private router: Router
    ) {};

    public ngOnInit() {
        this.dataService.isLoggedIn().subscribe((value) => {
            this.isLoggedIn = true;
        }, (error) => {
            this.isLoggedIn = false;
        });
    }
    public signup() {
        alert("회원가입은 관리자를 통해 문의하세요.");
    }

    public signout() {
        this.dataService.signout().subscribe((value) => {
            this.router.navigateByUrl("/");
        });
    }
}
