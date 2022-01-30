import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment.dev";
import { User } from "./user.model";
import { DataStorageService } from "../shared/data-storage.service";

export interface AuthResponseData {
    _id: string;
    email: string;
    username: string;
    profilePicture: string;
    phoneNumber: string;
    bio: string;
    followers: Array<string>;
    followings: Array<string>;
    posts: Array<string>;
    createdAt: string;
    updatedAt: string;
    token?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    loggedIn = new Subject<Boolean>();
    private token: string;

    constructor(
        private http: HttpClient, 
        private router: Router,
        private dataStorageService: DataStorageService
    ) {}

    getToken() {
        return this.token;
    }

    signup(username: string, email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                environment.AUTH_BASE_URL+ "/" + environment.AUTH.REGISTER, 
                {
                    username: username,
                    email: email,
                    password: password
            })
            .pipe(
                tap(resData => {
                    this.handleAuthentication(
                        resData._id,
                        resData.email,
                        resData.username,
                        resData.profilePicture,
                        resData.phoneNumber,
                        resData.bio,
                        resData.followers,
                        resData.followings,
                        resData.posts,                    
                        resData.createdAt,
                        resData.updatedAt
                    )
                })
            )
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                environment.AUTH_BASE_URL+ "/" + environment.AUTH.LOGIN, 
                {
                    email: email,
                    password: password
                }
            )
            .pipe(
                tap(resData => {                    
                    this.handleAuthentication(
                        resData._id,
                        resData.email,
                        resData.username,
                        resData.profilePicture,
                        resData.phoneNumber,
                        resData.bio,
                        resData.followers,
                        resData.followings,
                        resData.posts,                    
                        resData.createdAt,
                        resData.updatedAt,
                        resData.token
                    );
                })
            )
    }

    autoLogin() {                
        const token = localStorage.getItem('token');
        this.token = token;
        const userId = localStorage.getItem('userId');
        const expiryDate = localStorage.getItem('expiryDate')
        
        if (!token || !expiryDate) {  
            this.router.navigate(['/auth']);          
        }
        if (new Date(expiryDate) <= new Date()) {            
            this.logout();
        }

        let userObs: Observable<User>;

        if(this.token) {
            userObs = this.dataStorageService.fetchUser();
            
            userObs.subscribe(resData => {
                console.log(resData);
                
                    const user = new User(
                        resData._id, 
                        resData.email, 
                        resData.username, 
                        resData.profilePicture, 
                        resData.phoneNumber, 
                        resData.bio, 
                        resData.followers, 
                        resData.followings, 
                        resData.posts, 
                        resData.createdAt,
                        resData.updatedAt,
                        token
                    );  
                    this.user.next(user);
                    this.loggedIn.next(true);
                    const remainingMilliseconds =
                        new Date(expiryDate).getTime() - new Date().getTime();
                    this.autoLogout(remainingMilliseconds);
                },
                errorMessage => {
                    console.log(errorMessage);
                }
            );
        }       
    }

    logout() {  
        this.token = null;      
        this.user.next(null);
        this.loggedIn.next(false);
        this.router.navigate(['/auth']);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiryDate')
    }

    autoLogout(milliseconds:any) {
        setTimeout(() => {
            this.logout();
            }, milliseconds);
    }

    private handleAuthentication(
        _id: string,
        email: string,
        username: string,
        profilePicture: string,
        phoneNumber: string,
        bio: string,
        followers: Array<string>,
        followings: Array<string>,
        posts: Array<string>,
        createdAt: string,
        updatedAt: string,
        token?: string
    ) {
        const user = new User(
            _id, 
            email, 
            username, 
            profilePicture,
            phoneNumber, 
            bio,  
            followers, 
            followings, 
            posts, 
            createdAt,
            updatedAt,
            token
            );
        if (user.tokenValue) {
            this.user.next(user);
            this.token = user.tokenValue;
            localStorage.setItem('userId', user._id);
            localStorage.setItem('token', user.tokenValue);
            const remainingMilliseconds = 60 * 60 * 1000;
            const expiryDate = new Date(
                new Date().getTime() + remainingMilliseconds
            );
            localStorage.setItem('expiryDate', expiryDate.toISOString());
            this.autoLogout(remainingMilliseconds);
            this.loggedIn.next(true);
        }
    }

    private handleError(errorRes: HttpErrorResponse) {}
    
}