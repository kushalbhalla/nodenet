import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "nodenet"

  loggedIn: Boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {    
  }

  ngOnInit() {    
    this.authService.autoLogin();    
    this.authService.loggedIn.subscribe(res => {            
      this.loggedIn = res;
      if (! this.loggedIn) {
        this.router.navigate(['/auth']);
      }
    });
  }
}
