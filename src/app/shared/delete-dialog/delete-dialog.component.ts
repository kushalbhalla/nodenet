import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { DataStorageService } from '../data-storage.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  postId: string;
  userSubscription: Subscription;
  user: User;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {postId: string},
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.postId = data.postId
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe((user: User) => {
      this.user = user;      
    });    
  }

  onDelete() {
    const token = localStorage.getItem('token'); 
    this.dataStorageService
      .deletePost(this.postId)
      .subscribe(posts => {
        console.log(posts);
        
        const user = new User(
            this.user._id, 
            this.user.email, 
            this.user.username, 
            this.user.profilePicture, 
            this.user.phoneNumber, 
            this.user.bio, 
            this.user.followers, 
            this.user.followings,
            posts, 
            this.user.createdAt,
            this.user.updatedAt,
            token
          );            
        this.authService.user.next(user);
        this.router.navigate(['/account']);
        this.onCancel();
      })
  }

  onCancel():void {
    this.dialogRef.close();
  }

}
