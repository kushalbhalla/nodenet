import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostService } from '../post.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {

  postId: string;
  editMode = false;
  imagePath: string | ArrayBuffer;
  postForm: FormGroup;
  private userSubscription: Subscription;
  user: User;

  constructor(
    private dataStorageService: DataStorageService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService
  ) {
    this.matIconRegistry.addSvgIcon(
      "media",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/media.svg"));
    this.matIconRegistry.addSvgIcon(
      "close",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/close.svg"));
  }
    
  async ngOnInit() {    
    this.userSubscription = this.authService.user.subscribe((user: User) => {
      this.user = user;
    });
    this.route.params.subscribe((params: Params) => {
      this.postId = params['id'];
      this.editMode = params['id'] != null;
    });
    if (this.editMode) {
      await this.dataStorageService.getPost(this.postId);
    }
    this.initForm();

  }
     
  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.postForm.patchValue({
        fileSource: file
      });
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); 

      reader.onload = (event) => { 
        this.imagePath = event.target.result;
      }
    }    
  }
     
  onFormSubmit(){       
    const token = localStorage.getItem('token'); 
    const formData = new FormData();    
    formData.append('image', this.postForm.value['fileSource']);
    formData.append('description', this.postForm.value['description']);
    formData.append('userId', this.user._id);

    if (this.editMode) {      
      formData.append('imageUrl', this.postService.getPost().post.imgUrl)
      this.dataStorageService
      .updatePost(
        this.postId,
        formData
      ).subscribe(posts => {
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
        this.onCancel();
      });
    } else {
      this.dataStorageService
      .createPost(
        formData
      ).subscribe(posts => {
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
        this.onCancel();
      });
    }
    this.router.navigate(['/account'], { relativeTo: this.route });
  }

  private initForm() {
    let description= '';
    let fileSource = '';

    if (this.editMode) {
      const post = this.postService.getPost();
      description = post.post.description;
      this.imagePath = environment.IMAGES_PATH + post.post.imgUrl;
    }

    this.postForm = new FormGroup({
      description: new FormControl(description, Validators.required),
      fileSource: new FormControl(fileSource, Validators.required)
    });  
  }

  onCancel():void {
    this.postForm.reset();
    this.onClearImage();
  }

  onClearImage() {
    this.imagePath = '';
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }


}
