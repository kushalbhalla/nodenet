import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Params, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Post, PostUser } from 'src/app/main/post.model';
import { APostData, DataStorageService } from 'src/app/shared/data-storage.service';
import { environment } from 'src/environments/environment.dev';
import { PostService } from '../post.service';

@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css']
})
export class ShowPostComponent implements OnInit, OnDestroy {

  postId: string;
  post: PostUser;
  serverDir: string;
  userImage: string;
  postSubscription: Subscription;
  userSubscription: Subscription;
  user: User;

  constructor(
    private router: Router, 
    private matDialog: MatDialog,
    private route: ActivatedRoute,
    private postService: PostService,
    private dataStorageService: DataStorageService,
    private authService: AuthService
    ) {
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart),
      tap(() => this.matDialog.closeAll())
    ).subscribe();
  }

  async ngOnInit() {    
    this.serverDir = environment.IMAGES_PATH;        
    this.route.params
      .subscribe(
        (params: Params) => {          
          this.postId = params['id'];
        }
      );
    this.userSubscription = this.authService.user.subscribe((user: User) => {
      this.user = user;
    });
    this.dataStorageService.getPost(this.postId);
    this.postSubscription = this.postService.postChanged
        .subscribe((postData: PostUser) => {
          this.post = postData; 
          if (this.post.user.profilePicture === '' || this.post.user.profilePicture === 'assets/defaultProfile.png') {                  
            this.userImage = 'assets/defaultProfile.png';
          } else {        
            this.userImage = this.serverDir + this.post.user.profilePicture;
          };         
        });
    this.post = this.postService.getPost();    
  }

  goToUser() {
    if(this.user._id === this.post.post.creator) {
      this.router.navigate(['/account']);
    } else {
      this.router.navigate(['user-profile', this.post.post.creator, 'view']);
    }
  }

  updatePostLikes() {
    this.dataStorageService
      .likePost(this.post.post._id)
      .subscribe(res => {
        this.post.post.likes = res['likes'];   
        this.postService.updatePost(this.post);
      });
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
