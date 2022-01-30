import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post, PostUser } from './post.model';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  userId: string;
  postsChanged = new Subject<PostUser[]>();
  private posts: PostUser[] = [];

  constructor() { }

  getHomeInfo() {
    return this.posts.length === 0;
  }

  setPosts(posts: PostUser[]) {
    this.posts = posts;
    this.postsChanged.next(this.posts.slice());    
  }

  getPosts() {
    return this.posts.slice();
  }

  updatePost(postIndex: number, updatedPost: Post) {        
    this.posts[postIndex].post = updatedPost; 
    this.postsChanged.next(this.posts.slice());
  }
}
