
import {Injectable} from '@angular/core';
import { AuthGateway } from '@domain/auth/gateways/auth.gateway';
import { User } from '@domain/auth/models/user.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthUseCases {
  constructor(private readonly authGateway: AuthGateway) {}

  login(email: string, password: string): Observable<User> {
    return this.authGateway.login(email, password);
  }
}
