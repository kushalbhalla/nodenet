import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password; 

    let authObs: Observable<any>;
    authObs = this.authService.login(email, password);

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.router.navigate(['/'])
      }, err => {
        console.log(err);
      }
    )
    form.reset();
    
  }

}
