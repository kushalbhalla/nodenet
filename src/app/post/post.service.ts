import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PostUser } from '../main/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postChanged = new Subject<PostUser>();
  private post: PostUser;

  constructor() { }

  setPost(postData: PostUser) {
    this.post = postData;
    this.postChanged.next(this.post);
  }

  getPost() {
    return this.post;
  }

  updatePost(updatedPost: PostUser) {
    this.post = updatedPost;
    this.postChanged.next(this.post);
  }
}
