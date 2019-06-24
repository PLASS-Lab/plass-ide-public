import {
    Component,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    private subs: Subscription[];

    public userId: string;
    public userPw: string;

    public constructor(
        private dataService: DataService,
        private router: Router,
    ) {}

    public ngOnInit() {
        this.dataService.verify()
            .subscribe(
                value => {
                    if (value) {
                        this.router.navigateByUrl('/directory');
                    }
                },
            );
    }

    public onLoginButtonClick(event) {
        this.dataService.signin(this.userId, this.userPw)
            .subscribe(
                value => {
                    if (value) {
                        localStorage.setItem("logged_in", JSON.stringify(value));
                        this.router.navigateByUrl('/directory');
                    }
                },
            );
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}
