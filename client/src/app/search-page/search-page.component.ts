import { Component,effect,EventEmitter,input,Output,output,inject} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
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
import {FormControl, FormsModule, ReactiveFormsModule,Validators,FormBuilder} from '@angular/forms';
interface CommentForm{
rating:number,
comment:string
}

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl:"./search-page.component.html",
  styles: ``
})
export class SearchPageComponent {
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
formBuilder=inject(FormBuilder)
route:ActivatedRoute=inject(ActivatedRoute)
ecommerceService=inject(EcommerceService)
userService=inject(UserService)
router=inject(Router)
searched$={}as WritableSignal<Product[]>
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
  const searchedTerm=String(this.route.snapshot.params['term'])
  this.ecommerceService.search(searchedTerm)
  this.searched$=this.ecommerceService.searched$
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
