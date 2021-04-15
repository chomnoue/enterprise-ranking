import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { ApplicationConfigService } from '../config/application-config.service';
import { mergeMap, map } from 'rxjs/operators';
import {AuthService} from '@auth0/auth0-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private applicationConfigService: ApplicationConfigService,
    private auth: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const serverApiUrl = this.applicationConfigService.getEndpointFor('');
    if (!request.url || (request.url.startsWith('http') && !(serverApiUrl && request.url.startsWith(serverApiUrl)))) {
      return next.handle(request);
    }

    //const token: string | null = this.localStorage.retrieve('authenticationToken') ??
    // this.sessionStorage.retrieve('authenticationToken');
    return this.auth.getAccessTokenSilently().pipe(mergeMap(token=> {
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return next.handle(request);
    }));
  }
}
