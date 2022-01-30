import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment.dev';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { MainService } from '../../main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

  @Input() post: any;
  @Input() postUser: any;
  @Input() index: number;

  user: User;
  userSubscription: Subscription
  serverDir: string;
  postUserImage: string;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dataStorageService: DataStorageService,
    private mainService: MainService,
    private router: Router,
    private authService: AuthService
  ) {
    this.matIconRegistry.addSvgIcon(
      "more_vert",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/more_vert.svg"));
  }

  ngOnInit(): void {   
    this.userSubscription = this.authService.user
      .subscribe(
        (user: User) => {                    
        this.user = user;  
        if (this.user) {
          this.serverDir = environment.IMAGES_PATH;    
          if (this.postUser.profilePicture === '' || this.postUser.profilePicture === 'assets/defaultProfile.png') {                  
            this.postUserImage = 'assets/defaultProfile.png';
          } else {        
            this.postUserImage = this.serverDir + this.postUser.profilePicture;      
          }
        }        
    });         
  }

  goToUser() {    
    if(this.user._id === this.post.creator) {
      this.router.navigate(['/account']);
    } else {
      this.router.navigate(['user-profile', this.post.creator, 'view']);
    }
  }

  updatePostLikes() {
    this.dataStorageService
      .likePost(this.post['_id'])
      .subscribe(res => {
        this.post.likes = res['likes'];        
        this.mainService.updatePost(this.index, this.post)
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
