import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MainService } from '../main.service';
import { PostUser } from '../post.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {
  posts: PostUser[];
  subscription: Subscription;

  constructor(private mainService: MainService) { }

  ngOnInit(): void {        
    this.subscription = this.mainService.postsChanged
      .subscribe(
        (posts: PostUser[]) => {                    
          this.posts = posts;              
        }
      );
    this.posts = this.mainService.getPosts();        
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}