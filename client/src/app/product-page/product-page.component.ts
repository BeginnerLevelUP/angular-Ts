import { Component,effect,EventEmitter,input,Output,output,inject} from '@angular/core';
import { Router,ActivatedRoute,RouterModule } from '@angular/router';
import { Inject,WritableSignal} from '@angular/core';
import { EcommerceService } from '../ecommerce.service';
import { UserService } from '../user.service';
import { Product } from '../product';
import { User } from '../user';
import { MatCardModule } from '@angular/material/card';;
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormsModule, ReactiveFormsModule,Validators,FormBuilder} from '@angular/forms';

interface CommentForm{
rating:number,
comment:string
}

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatSliderModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl:"./product.component.html",
  styles: `
  .container{
display: flex;
flex-direction: column;
justify-content:space-evenly;
margin:0 30%;

  }
  .item{
   width:600px;
   height:600px;
   margin:2% 0
  }
  .item img{
    
    width:200px;
    height:200px;
  }
  .title{
    color:white;
    margin:5rem;
    border:2px solid black;
    width:fit-content;
    padding:2rem;
    border-radius:20px;
  }
  `
})
export class ProductPageComponent {
constructor(){
  effect(
    ()=>{
      this.commentForm.setValue({
        rating:this.initialState()?.rating||0,
        comment:this.initialState()?.comment||''
      })
    }
  )
}
route:ActivatedRoute=inject(ActivatedRoute)
ecommerceService=inject(EcommerceService)
router=inject(Router)
formBuilder=inject(FormBuilder)
product$={}as WritableSignal<Product>
realted$={}as WritableSignal<Product[]>
userService=inject(UserService)
initialState=input<CommentForm>()
user$={}as WritableSignal<User>
@Output()
formValuesChanged=new EventEmitter<CommentForm>()

@Output()
formSubmitted= new EventEmitter<CommentForm>()

commentForm=this.formBuilder.group({
rating:[0,[Validators.required]],
comment:['',[Validators.minLength(5),Validators.maxLength(256)]]
})

get rating(){
  return this.commentForm.get('rating')
}

get comment(){
  return this.commentForm.get('comment')
}

submitForm(productId:string,userId:string){
console.log(this.commentForm.value)
this.ecommerceService.addReview(this.commentForm.value,userId,productId)
}

ngOnInit(){
   this.userService.getUserData()
  this.user$=this.userService.user$
  this.fetchData()
}

private fetchData():void{
  const productId=String(this.route.snapshot.params['id'])
  this.ecommerceService.getProduct(productId)
  this.product$=this.ecommerceService.product$
  this.realted$=this.ecommerceService.realted$
}

  cart(id:string){
    this.ecommerceService.addToCart(id).subscribe({
      next: () => {
        this.router.navigate(['/cart']);
      },
      error: (error) => {
        alert('Failed to create user');
        console.error(error);
      },
    });
  }

  favorite(id:string){
    this.ecommerceService.addToFavorite(id).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to create user');
        console.error(error);
      },
    });
  }

    deleteReview(userId:string,reviewId:string){
    this.ecommerceService.deleteReview(userId,reviewId)
  }

  editReview(){
    
  }
}
