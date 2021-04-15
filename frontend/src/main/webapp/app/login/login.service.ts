import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

import {Account} from 'app/core/auth/account.model';
import {AccountService} from 'app/core/auth/account.service';
import {AuthServerProvider} from 'app/core/auth/auth-jwt.service';
import {Login} from './login.model';

import {AuthService} from '@auth0/auth0-angular';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private accountService: AccountService, private authServerProvider: AuthServerProvider,
              private auth: AuthService) {}

  login(credentials: Login): Observable<Account | null | undefined> {
    return this.authServerProvider.login(credentials).pipe(mergeMap(() => this.accountService.identity(true)));
  }

  logout(): void {
    this.authServerProvider.logout().subscribe({ complete: () => {
      this.accountService.authenticate(null);
      this.auth.logout({ returnTo: document.location.origin })
    } });
  }
}
