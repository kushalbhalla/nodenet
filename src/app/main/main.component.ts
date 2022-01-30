import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { DataStorageService } from '../shared/data-storage.service';
import { MainService } from './main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  intro:Boolean = true;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private mainService: MainService
    ) { }

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe((user: User) => {
      if (!!user) {
        this.mainService.userId = user._id;
      }
    });
    this.dataStorageService
      .fetchTimelines()
      .subscribe(res => {
        this.intro = this.mainService.getHomeInfo();
        console.log(this.intro);
        
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
