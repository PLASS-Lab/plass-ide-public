import {
    Component,
    OnInit
} from '@angular/core';

import { Router ,RouterLink } from '@angular/router';
import { DataService } from '../data.service';

@Component({
    selector: 'app-main',
    templateUrl: './mypage.component.html',
    styleUrls: ['./mypage.component.scss'],
})

export class MyPageComponent implements OnInit{
    isLoggedIn: string | null = null;
    user:any = null;

    public constructor(
        private router: Router,
        private dataService: DataService
    ) {}
    
    public ngOnInit() {
        this.dataService.isLoggedIn().subscribe((value: any) => {
            this.user = value;
            const createdDate = new Date(value.created);
            const birthDate = new Date(value.birth);
          
            this.user.created = createdDate.getFullYear() + "-" + (createdDate.getUTCMonth() + 1) + "-" + createdDate.getDate();
            this.user.birth = birthDate.getFullYear() + "-" + (birthDate.getUTCMonth() + 1) + "-" + birthDate.getDate();
            console.log(value);
        });
    }
}
