import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {        
        if (!user) {
          if (!this.authService.getToken) {
            return next.handle(req);
          }
        }
        const authToken = this.authService.getToken();
        const modifiedReq = req.clone({
          headers: req.headers.set("Authorization", "Bearer " + authToken)
        });        
        return next.handle(modifiedReq);
      })
    );
  }
}
