import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MainService } from '../main/main.service';
import { Post, PostUser } from '../main/post.model';
import { environment } from 'src/environments/environment.dev';
import { User } from '../auth/user.model';
import { PostService } from '../post/post.service';


export interface APostData {
    post: Post,
    user: {_id: string, username: string, profilePicture: string}
}

export interface UserWithPosts {
  user: {
    _id: string, 
    username: string, 
    profilePicture: string,
    bio: string;
    followers: Array<string>;
    followings: Array<string>;
    posts: Array<string>;
  },
  posts: Post[]
}

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(
    private http: HttpClient, 
    private mainService: MainService,
    private postService: PostService
  ) { }

  likePost(postId: string) {    
    return this.http
      .put(
        environment.POSTS_BASE_URL+"/"+environment.POSTS.LIKE_POST+"/"+postId,
        {}
      )
  } 

  fetchTimelines() {
    return this.http
      .get<PostUser[]>(environment.POSTS_BASE_URL+"/"+environment.POSTS.TIMELINE_ALL)
      .pipe(
        tap(posts => {          
          this.mainService.setPosts(posts);    
        })
      );
  }

  fetchUser() {
    return this.http
      .get<User>(
        environment.USER_BASE_URL+"/"+environment.USERS.GET_USER
      );
  } 

  fetchSearchUser(username: string) {
    return this.http
      .get<{_id: string, username: string, profilePicture: string}[]>(
        environment.USER_BASE_URL+"/"+environment.USERS.SEARCH_USER+"/"+username
      );
  }

  async fetchUserWithPosts(visitingUserId: string) {
    return this.http
      .get<UserWithPosts>(
        environment.USER_BASE_URL+"/"+environment.USERS.GET_USER_WITH_POSTS+"/"+visitingUserId
      )
      .toPromise();
  }

  async fetchUserPosts() {
    return this.http
      .get<Post[]>(environment.POSTS_BASE_URL+"/"+environment.POSTS.USER_POSTS)
      .toPromise();
  }

  fetchUserSuggestion() {
    return this.http
      .get<{_id: string, username: string, profilePicture: string}>(
        environment.USER_BASE_URL+"/"+environment.USERS.SUGGESTION
      );
  }

  followUser(targetUserId: string) {
    return this.http
      .put<string[]>(environment.USER_BASE_URL+"/"+environment.USERS.FOLLOW_USER+"/"+targetUserId,
      {}
    );
  }

  unfollowUser(targetUserId: string) {
    return this.http
      .put<string[]>(environment.USER_BASE_URL+"/"+environment.USERS.UNFOLLOW_USER+"/"+targetUserId,
      {}
    );
  }

  createPost(formData: any) {    
    return this.http
      .post<string[]>(environment.POSTS_BASE_URL+"/"+environment.POSTS.ADD_POST, formData);
  }

  updatePost(postId: string, formData: any) {
    return this.http
      .put<string[]>(environment.POSTS_BASE_URL+"/"+environment.POSTS.UPDATE_POST+"/"+postId, formData);
  }
  

  deletePost(postId: string) {
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   }),
    //   body: {
    //     userId: userId
    //   }
    // }
    return this.http
      .delete<string[]>(environment.POSTS_BASE_URL+"/"+environment.POSTS.DELETE_POST+"/"+postId);
  }

  async getPost(postId: string) {
    return this.http
      .get<PostUser>(environment.POSTS_BASE_URL+"/"+environment.POSTS.GET_POST+"/"+postId)
      .pipe(
        tap((postData: PostUser) => {          
          this.postService.setPost(postData);                    
        })
      ).toPromise();
  }

  getUserFollowers() {
    return this.http
      .get<{_id: string, username: string, profilePicture: string}>(
        environment.USER_BASE_URL+"/"+environment.USERS.GET_FOLLOWERS
      )
  }

  getUserFollowings() {
    return this.http
      .get<{_id: string, username: string, profilePicture: string}>(
        environment.USER_BASE_URL+"/"+environment.USERS.GET_FOLLOWINGS
      )
  }

  updateUser(userId: string, formData: any) {    
    return this.http
      .put<User>(environment.USER_BASE_URL+"/"+environment.USERS.UPDATE_USER, formData)
  }
}
