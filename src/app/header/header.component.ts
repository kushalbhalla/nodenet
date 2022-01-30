import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../auth/user.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

import { environment } from 'src/environments/environment.dev';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User;
  private userSubscription:Subscription;
  serverDir: string;
  userImage: string;
  searchForm: FormGroup;
  
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router
  ) {

    this.matIconRegistry.addSvgIcon(
      "search",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/search.svg"));
    
    this.matIconRegistry.addSvgIcon(
      "notification",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/notification.svg"));

    this.matIconRegistry.addSvgIcon(
      "face",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/face.svg"));

    this.matIconRegistry.addSvgIcon(
      "chat",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/chat.svg"));

    this.matIconRegistry.addSvgIcon(
      "home",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/home.svg"));

    this.matIconRegistry.addSvgIcon(
      "feed",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/feed.svg"));

    this.matIconRegistry.addSvgIcon(
      "add",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/add.svg"));
  }

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
      }                
    }); 
    this.initForm();
  }

  onSubmit() {
    this.router.navigate(['/search'], {queryParams: {username:this.searchForm.value.searchInput}});
  }

  onLogout() {
    this.authService.logout();    
  }

  private initForm() {
    this.searchForm = new FormGroup({
      'searchInput': new FormControl(null)
    }); 
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
