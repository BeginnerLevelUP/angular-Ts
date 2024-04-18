import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Product } from './product';
import { Cart } from './cart';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EcommerceService {
  private url = 'http://localhost:5200';
  products$ = signal<Product[]>([]);
  product$ = signal<Product>({} as Product);
  constructor(private httpClient: HttpClient ,private userService:UserService) { }


  refreshProducts(){
    this.httpClient.get<Product[]>(`${this.url}/api/products`)
      .subscribe(products => {
        this.products$.set(products);
      });
  }

  getProducts(){
    this.refreshProducts();
    return this.products$();
  }

  getProduct(id: string){
    this.httpClient.get<Product>(`${this.url}/api/products/${id}`).subscribe(product => {
    this.product$.set(product);
    return this.product$();
    });
  }

  addToCart(id:string):Observable<any>{
    const user:any=this.userService.getCurrentAuthUser()
  return  this.httpClient.get(`${this.url}/api/user/${user.data._id}/cart/${id}`)
  }

  addToFavorite(id:string):Observable<any>{
  const user:any=this.userService.getCurrentAuthUser()
  return  this.httpClient.get(`${this.url}/api/user/${user.data._id}/favorite/${id}`)
  }

}
