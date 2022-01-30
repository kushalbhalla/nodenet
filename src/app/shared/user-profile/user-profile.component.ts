import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment.dev';
import { DataStorageService, UserWithPosts } from '../data-storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  shownUserId: string;
  user: User
  userSubscription: Subscription;
  visitingUserData: UserWithPosts;
  userImage: string;
  serverDir: string;

  constructor(
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.serverDir = environment.IMAGES_PATH;
    this.route.params.subscribe((params: Params) => {
      this.shownUserId = params['id'];      
    });
    this.userSubscription = this.authService.user
      .subscribe(
        (user: User) => {                              
        this.user = user;          
    });    
    this.visitingUserData = await this.dataStorageService
      .fetchUserWithPosts(this.shownUserId);
    if (this.visitingUserData.user.profilePicture === '' || this.visitingUserData.user.profilePicture === 'assets/defaultProfile.png') {                  
      this.userImage = 'assets/defaultProfile.png';
    } else {        
      this.userImage = this.serverDir + this.visitingUserData.user.profilePicture;
    }   
    
  }

  onFollowUnfollow(type: string, visitingUserId: string) {
    const token = localStorage.getItem('token');
    if(type === 'follow') {
      this.dataStorageService
        .followUser(visitingUserId)
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
          this.visitingUserData.user.followers.push(this.user._id);
        });        
    }
    if (type === 'unfollow') {
      this.dataStorageService
        .unfollowUser(visitingUserId)
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
          this.visitingUserData.user.followers.splice(this.visitingUserData.user.followers.indexOf(this.user._id));
        });
    }
  }

  onView(postId: string) {
    this.router.navigate(['/post', postId, 'view']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
