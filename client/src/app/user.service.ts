import { HttpClient } from '@angular/common/http';
import { Injectable, inject ,signal} from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User,Review } from './user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
private readonly JWT_TOKEN = 'JWT_TOKEN';
  user$ = signal<User>({} as User);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  private router = inject(Router);
  private http = inject(HttpClient);

  private doLoginUser(token: any) {
    this.storeJwtToken(token);
    this.isAuthenticatedSubject.next(true);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }
register(user:User){
      return this.http.post(`http://localhost:5200/api/auth/register`,user,{responseType:'text'})
      .pipe(
        tap((tokens: any) =>
          this.doLoginUser(JSON.stringify(tokens))
        )
      );

    }
    
  login(user: { email: string; password: string }): Observable<any> {
    return this.http
      .post('http://localhost:5200/api/auth/login', user)
      .pipe(
        tap((tokens: any) =>
          this.doLoginUser(JSON.stringify(tokens))
        )
      );
  }

logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

getCurrentAuthUser() {
  const jwtToken = localStorage.getItem(this.JWT_TOKEN);
  if (jwtToken) {
    return jwtDecode(jwtToken);
  } else {
    return null;
  }
}

getUserData() {
const payload:any=this.getCurrentAuthUser()
this.http.get<User>(`http://localhost:5200/api/user/profile/${payload.data._id}`).subscribe(user=>{
 this.user$.set(user)
 return this.user$()
 })

}

  isLoggedIn() {
    return !!localStorage.getItem(this.JWT_TOKEN);
  }

  isTokenExpired() {
    const tokens = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) return true;
    const token = JSON.parse(tokens).access_token;
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    const expirationDate = decoded.exp * 1000;
    const now = new Date().getTime();

    return expirationDate < now;
  }

  refreshToken() {
    let tokens: any = localStorage.getItem(this.JWT_TOKEN);
    if (!tokens) return;
    tokens = JSON.parse(tokens);
    let refreshToken = tokens.refresh_token;
    return this.http
      .post<any>('https://api.escuelajs.co/api/v1/auth/refresh-token', {
        refreshToken,
      })
      .pipe(tap((tokens: any) => this.storeJwtToken(JSON.stringify(tokens))));
  }



}

