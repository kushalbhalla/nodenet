import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment.dev';
import { DataStorageService } from '../data-storage.service';


export interface DialogData {
  user: User;
  type: string;
}

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  user: User;
  type: string;
  usersData: any;
  serverDir: string;


  constructor(
    private dataStorageService: DataStorageService,
    public dialogRef: MatDialogRef<FriendsComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.user = data.user;
    this.type = data.type;
  }

  ngOnInit(): void {  
    this.serverDir = environment.IMAGES_PATH;  
    if (this.type === 'followers') {
      this.dataStorageService
        .getUserFollowers()
        .subscribe(users => {          
          this.usersData = users;                   
        });
    } 
    if (this.type === 'followings') {
      this.dataStorageService
        .getUserFollowings()
        .subscribe(users => {          
          this.usersData = users;
        });
    }
    
  }

  onFollowUnfollow(type: string, targetUserid: string) {
    const token = localStorage.getItem('token');
    if(type === 'follow') {
      this.dataStorageService
        .followUser(targetUserid)
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
        .unfollowUser(targetUserid)
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
    this.onCancel()
  }

  onCancel():void {
    this.dialogRef.close();
  }

}
