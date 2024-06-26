import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Product } from './product';
import { Cart } from './cart';
import { UserService } from './user.service';
import { Observable, single } from 'rxjs';
import { Review } from './user';



@Injectable({
  providedIn: 'root'
})
export class EcommerceService {
  private url = 'http://localhost:5200';
  products$ = signal<Product[]>([]);
  product$ = signal<Product>({} as Product);
  realted$= signal<Product[]>([]);
  searched$=signal<Product[]>([])
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
    this.getRelated(product.category)
    return this.product$();
    });
  }

  addToCart(id:string):Observable<any>{
    const user:any=this.userService.getCurrentAuthUser()
  return  this.httpClient.get(`${this.url}/api/user/${user.data._id}/cart/${id}`)
  }

  updateCart(id:string,quant:number){
  const user:any=this.userService.getCurrentAuthUser()
  return this.httpClient.get(`${this.url}/api/user/${user.data._id}/cart/${id}/${quant}`)
  }

  removeCart(id:string){
  const user:any=this.userService.getCurrentAuthUser()
  return this.httpClient.delete(`${this.url}/api/user/${user.data._id}/cart/${id}`)
  }

  addToFavorite(id:string):Observable<any>{
  const user:any=this.userService.getCurrentAuthUser()
  return  this.httpClient.get(`${this.url}/api/user/${user.data._id}/favorite/${id}`)
  }

  removeFavorite(id:String){
    const user:any=this.userService.getCurrentAuthUser()
  return this.httpClient.delete(`${this.url}/api/user/${user.data._id}/favorite/${id}`)
  }
  getRelated(category:string){
    this.httpClient.get<Product[]>(`${this.url}/api/products/category/${category}`).subscribe(related=>{
      this.realted$.set(related)
      console.log(this.realted$())
      return this.realted$()
    })

  }

  search(term:string|undefined){
    this.httpClient.get<Product[]>(`${this.url}/api/products/search/${term}`).subscribe(search=>{
      this.searched$.set(search)
      return this.searched$
    })
  }

  addReview(review:any,userId:string,productId:string){
   return this.httpClient.post(`${this.url}/api/user/${userId}/comment/${productId}`,review).subscribe(
        data => console.log('success', data),
        error => console.log('oops', error)
      );
  }

  updateReview(review:any,userId:string,reviewId:string){
  return this.httpClient.put(`${this.url}/api/user/${userId}/review/${reviewId}`,review).subscribe(
        data => console.log('success', data),
        error => console.log('oops', error)
      );
  }

  deleteReview(userId:string,reviewId:string){
  return this.httpClient.delete(`${this.url}/api/user/${userId}/review/${reviewId}`).subscribe(
        data => console.log('success', data),
        error => console.log('oops', error)
      );
  }

  }

