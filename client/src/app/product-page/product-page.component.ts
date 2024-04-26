import { Component,effect,EventEmitter,input,Output,output,inject} from '@angular/core';
import { Router,ActivatedRoute,RouterModule } from '@angular/router';
import { Inject,WritableSignal} from '@angular/core';
import { EcommerceService } from '../ecommerce.service';
import { Product } from '../product';
import { MatCardModule } from '@angular/material/card';;
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule,Validators,FormBuilder} from '@angular/forms';

interface CommentForm{
rating:number,
comment:string
}

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
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
  .example-full-width {
  width: 100%;
}`
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

initialState=input<CommentForm>()

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
submitForm(){
console.log(this.commentForm.value)
}

ngOnInit(){
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

}
