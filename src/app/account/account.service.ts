import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "../main/post.model";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    postChanged = new Subject<Post[]>();
    private posts:Post[] = [];

    constructor() {}

    setUserPosts(posts: Post[]) {        
        this.posts = posts;
        this.postChanged.next(this.posts.slice());
    }

    getPosts() {
        return this.posts.slice();
    }
}