import { Component, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/main/post.model';
import { AccountService } from '../account.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { environment } from 'src/environments/environment.dev';
import { MatDialog} from '@angular/material/dialog';
import { FriendsComponent } from 'src/app/shared/friends/friends.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PostOpsComponent } from 'src/app/shared/post-ops/post-ops.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy, OnChanges {
  user: User;
  posts: Post[];

  userSubscription: Subscription;
  userPostSubscription: Subscription;
  serverDir: string;
  userImage: string

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private dataStorageService: DataStorageService,
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      "more_vert",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/more_vert.svg"));
  }

  async ngOnChanges() {

  }

  async ngOnInit() {             
    this.serverDir = environment.IMAGES_PATH;
    this.userSubscription = this.authService.user
      .subscribe(
        (user: User) => {                              
        this.user = user;          
          if (this.user) {
            if (this.user.profilePicture === '' || this.user.profilePicture === 'assets/defaultProfile.png') {                  
            this.userImage = 'assets/defaultProfile.png';
          } else {        
            this.userImage = this.serverDir + this.user.profilePicture;
          }       
        }
        this.getPosts();
    });                    
  }

  onFollowers() {
    let dialogRef = this.dialog.open(FriendsComponent, {
      width: '400px',
      height: '550px',
      panelClass: 'custom-modalbox',
      data: {
        user: this.user,
        type: 'followers'
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  onFollowings() {
    let dialogRef = this.dialog.open(FriendsComponent, {
      width: '400px',
      height: '550px',
      panelClass: 'custom-modalbox',
      data: {
        user: this.user,
        type: 'followings'
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  onPostOperation(post: Post) {
    const dialogRef = this.dialog.open(PostOpsComponent, {
      width: '350px',
      data: {
        postId: post._id
      },
      panelClass: 'custom-modalbox',
      closeOnNavigation: true
    });

    dialogRef.afterClosed().subscribe();
  }

  private async getPosts() {
    const userData = await this.dataStorageService
      .fetchUserPosts();          
    this.accountService.setUserPosts(userData);
    this.userPostSubscription = this.accountService.postChanged
      .subscribe(
        (posts: Post[]) => {                    
        this.posts = posts;
    });
    this.posts = this.accountService.getPosts();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.userPostSubscription.unsubscribe();
  }

}
