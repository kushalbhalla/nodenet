import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }
  
  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }

    const username = form.value.username;
    const email = form.value.email;
    const password = form.value.password; 
    
    let authObs: Observable<any>;
    authObs = this.authService.signup(username, email, password);

    authObs.subscribe(
      resData => {
        console.log(resData);
        
        this.router.navigate(['/auth/login'])
      }, err => {
        console.log(err);
        
      }
    )
    form.reset();
  }

}
