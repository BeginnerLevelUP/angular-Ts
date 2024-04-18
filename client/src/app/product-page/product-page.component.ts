import { Component, inject } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Inject,WritableSignal} from '@angular/core';
import { EcommerceService } from '../ecommerce.service';
import { Product } from '../product';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [MatCardModule],
  templateUrl:"./product.component.html",
  styles: ``
})
export class ProductPageComponent {
route:ActivatedRoute=inject(ActivatedRoute)
ecommerceService=inject(EcommerceService)
router=inject(Router)
product$={}as WritableSignal<Product>
realted$={}as WritableSignal<Product[]>
constructor(){

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
