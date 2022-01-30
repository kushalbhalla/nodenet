import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment.dev';
import { DataStorageService } from '../data-storage.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchQuery: string;
  serchedUsers: any;
  serverDir: string;
  userSubscription: Subscription;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.serverDir = environment.IMAGES_PATH;
    this.userSubscription = this.authService.user.subscribe((user: User) => {      
      this.user = user;                  
    });

    this.route.queryParams
      .subscribe(params => {
        this.searchQuery = params['username']; 
        this.dataStorageService.fetchSearchUser(this.searchQuery)
          .subscribe((searchedUsers: any) =>  {
            this.serchedUsers = searchedUsers;            
          });       
      });
    }

  goToUser(searchUserId: string) {
    this.router.navigate(['user-profile', searchUserId, 'view']);
  }

  onFollow(type: string, searchUserId: string) {
    const token = localStorage.getItem('token');
    if(type === 'follow') {
      this.dataStorageService
        .followUser(searchUserId)
        .subscribe(followingsResult => {
          const user = new User(
            this.user._id, 
            this.user.email, 
            this.user.username, 
            this.user.profilePicture, 
            this.user.phoneNumber, 
            this.user.bio, 
            this.user.followers, 
            followingsResult,
            this.user.posts, 
            this.user.createdAt,
            this.user.updatedAt,
            token
          );  
          this.authService.user.next(user);
        });        
    }
    if (type === 'unfollow') {
      this.dataStorageService
        .unfollowUser(searchUserId)
        .subscribe(followingsResult => {
          const user = new User(
            this.user._id, 
            this.user.email, 
            this.user.username, 
            this.user.profilePicture, 
            this.user.phoneNumber, 
            this.user.bio, 
            this.user.followers, 
            followingsResult,
            this.user.posts, 
            this.user.createdAt,
            this.user.updatedAt,
            token
          );  
          this.authService.user.next(user);
        });
    }
    
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
