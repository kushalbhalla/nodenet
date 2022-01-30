import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {
  user: User;
  userSubscription: Subscription;
  userEditForm: FormGroup;
  serverDir: string;
  userImage: string | ArrayBuffer;
  file:File;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService, 
    private dataStorageService: DataStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {    
    this.serverDir = environment.IMAGES_PATH;
    this.initForm(); 
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      const fileSelected = event.target.files[0];
      this.userEditForm.patchValue({
        fileSource: fileSelected
      });
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); 
      reader.onload = (event) => { 
        this.userImage = event.target.result;
      }
    }    
  }

  async onSubmit() {    
    const formData = new FormData();    
    formData.append('username', this.userEditForm.value['username']);
    formData.append('email', this.userEditForm.value['email']);
    formData.append('bio', this.userEditForm.value['bio']);
    formData.append('phoneNumber', this.userEditForm.value['phoneNumber']);
    if (this.user.profilePicture === 'assets/defaultProfile.png') {      
      formData.append('profilePicture', '');
    } else {      
      formData.append('profilePicture', this.user.profilePicture);
    }
    formData.append('image', this.userEditForm.value['fileSource']);        
    this.dataStorageService
      .updateUser(this.user._id, formData)
      .subscribe((resData:User) => {        
        this.setUser(resData)
        this.onCancel();
      });
  }

  private setUser(userData: User) {    
    const token = localStorage.getItem('token');
    const user = new User(
        userData._id, 
        userData.email, 
        userData.username, 
        userData.profilePicture, 
        userData.phoneNumber, 
        userData.bio, 
        userData.followers, 
        userData.followings, 
        userData.posts, 
        userData.createdAt,
        userData.updatedAt,
        token
    );  
    this.authService.user.next(user);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    this.userSubscription = this.authService.user
      .subscribe(
        (user: User) => {
        this.user = user;
    });

    if (this.user.profilePicture === '' || this.user.profilePicture === 'assets/defaultProfile.png') {            
      this.userImage = 'assets/defaultProfile.png';
    } else {        
      this.userImage = this.serverDir + this.user.profilePicture;
    }    
    this.userEditForm = new FormGroup({
      username: new FormControl(this.user.username),
      email: new FormControl(this.user.email),
      phoneNumber: new FormControl(this.user.phoneNumber),
      bio: new FormControl(this.user.bio),
      fileSource: new FormControl('', [Validators.required])
    });  
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
