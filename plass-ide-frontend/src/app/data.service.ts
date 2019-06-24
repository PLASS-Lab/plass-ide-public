import {
    HttpClient,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    Observable,
    throwError,
} from 'rxjs';
import {
    map,
    catchError,
} from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ProblemContent, Problem, Project, File } from './types';

@Injectable({
    providedIn: 'root',
})
export class DataService {

    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {
    }

    private handleError(error: any) {
        localStorage.removeItem("logged_in");
        if (error.status === 401) {
            this.router.navigateByUrl('/login');
            return throwError(false);
        }

        let errorBody: any = error['_body'];
        try {
            errorBody = JSON.parse(error['_body']);
        } catch (err) {
        }
        console.error('API ERROR', error, errorBody);
        return throwError(error.message || error);
    }

    public isLoggedIn() {
        return this.http.get(`${this.apiUrl}/verify`);
    }

    public verify() {
        return this.http.get(`${this.apiUrl}/verify`)
            .pipe(
                map((value) => {
                    return true;
                }),
                catchError(error => this.handleError(error)),
            );
    }

    public signin(userId: string, userPw: string) {
        const payload = {
            userId,
            userPw,
        };

        return this.http.post(`${this.apiUrl}/signin`, payload)
            .pipe(
                map(() => true),
                catchError(error => this.handleError(error)),
            );
    }

    public signout() {
        return this.http.get(`${this.apiUrl}/signout`);
    }

    public run(projectId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/run/projects/${projectId}`, {});
    }

    public input(hash: string, data: string=""): Observable<any> {
        return this.http.put(`${this.apiUrl}/run/${hash}`,{data});
    } 

    public result(hash: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/run/${hash}`);
    }

    public submit(projectId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/submit/projects/${projectId}`, {});
    }

    public getProblems({page=0, unit=10}: {page: number, unit?: number}): Observable<Array<Problem>> {
        return this.http.get(`${this.apiUrl}/problems${objectSerializer({page, unit})}`)
            .pipe(
                map((value: any) => value.problems),
                catchError(error => this.handleError(error))
            );
    }

    public getProblem({id}:{id: number}): Observable<Problem> {
        return this.http.get(`${this.apiUrl}/problems/${id}`)
            .pipe(
                map((value: any)=> value),
                catchError(error => this.handleError(error))
            );
    }

    public getProjects(queryParams?: any): Observable<Array<Project>> {
        return this.http.get(`${this.apiUrl}/projects${objectSerializer(queryParams)}`)
            .pipe(
                map((value: any) => value)
            );
    }
    
    public postProjects({body} : {body: any}): Observable<any> {
        return this.http.post(`${this.apiUrl}/projects`, body)
            .pipe(
                map((value: any) => value)
            );
    }

    public getProject({id}:{id: number}): Observable<Project> {
        return this.http.get(`${this.apiUrl}/projects/${id}`)
            .pipe(
                map((value: any) => value)
            );
    }

    public postProject(id:number, body: {filename: string, data: string, path: string, isDirectory: boolean}): Observable<Project> {
        return this.http.post(`${this.apiUrl}/projects/${id}`, body)
            .pipe(
                map((value: any) => value)
            );
    }

    public putProject({id, body}: {id: number, body: any}): Observable<any> {
        return this.http.put(`${this.apiUrl}/projects/${id}`, body)
            .pipe(
                map((value: any) => value)
            );
    }

    public deletProject({id, body}: {id: number, body?: any}) :Observable<any> {
        return this.http.delete(`${this.apiUrl}/projects/${id}`, body)
            .pipe(
                map((value: any) => value)
            );
    }

    public putFile(id:number ,body: { name?: string, path: string, data: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/projects/${id}/${body.path}`, body);
    }

    public deleteFile(id:number , path: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/projects/${id}/${path}`);
    }

    public getFile({id, path, name}: {id:number, path: string, name: string}): Observable<File> {
        return this.http.get(`${this.apiUrl}/projects/${id}/${path}/${name}`)
        .pipe(
            map((value: any) => value)
        )
    }
}


function objectSerializer (obj) {
    if (!obj) return "";
    return Object.keys(obj).reduce(function (str, key, i) {
        let delimiter, val;
        delimiter = (i === 0) ? '?' : '&';
        key = encodeURIComponent(key);
        val = encodeURIComponent(obj[key]);
        return [str, delimiter, key, '=', val].join('');
    }, '');
  }