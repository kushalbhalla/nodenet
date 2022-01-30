import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-rightbar',
  templateUrl: './rightbar.component.html',
  styleUrls: ['./rightbar.component.css']
})
export class RightbarComponent implements OnInit, OnDestroy {
  user: User;
  private userSubscription: Subscription;
  users:any;
  userImage: string;
  serverDir: string

  constructor(
    private authService: AuthService,
    private dataStorageService: DataStorageService
  ) { }

  ngOnInit(): void {
    this.serverDir = environment.IMAGES_PATH;
    this.userSubscription = this.authService.user.subscribe((user: User) => {      
      this.user = user;
      if (this.user) {
          if (this.user.profilePicture === '' || this.user.profilePicture === 'assets/defaultProfile.png') {                  
          this.userImage = 'assets/defaultProfile.png';
        } else {        
          this.userImage = this.serverDir + this.user.profilePicture;
        } 
        this.dataStorageService
          .fetchUserSuggestion()
          .subscribe(users => {
            this.users = users;        
          });                 
      }                      
    });
  }

  onFollow(userId: string) {
    const token = localStorage.getItem('token');
    this.dataStorageService
      .followUser(userId)
      .subscribe(res => {
        console.log(res);
        
        const user = new User(
        this.user._id, 
        this.user.email, 
        this.user.username, 
        this.user.profilePicture, 
        this.user.phoneNumber, 
        this.user.bio, 
        this.user.followers, 
        res,
        this.user.posts, 
        this.user.createdAt,
        this.user.updatedAt,
        token
      );  
      this.authService.user.next(user);
    });
  }
  
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
