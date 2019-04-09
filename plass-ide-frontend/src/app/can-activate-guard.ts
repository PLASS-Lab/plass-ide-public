import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { DataService } from './data.service';

@Injectable()
export class CanActivateGuard implements CanActivate {
    constructor(
        private dataService: DataService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.dataService.verify();
    }
}
