import { Component,inject } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Inject,WritableSignal} from '@angular/core';
import { EcommerceService } from '../ecommerce.service';
import { Product } from '../product';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [MatCardModule],
  templateUrl:"./search-page.component.html",
  styles: ``
})
export class SearchPageComponent {
route:ActivatedRoute=inject(ActivatedRoute)
ecommerceService=inject(EcommerceService)
router=inject(Router)
searched$={}as WritableSignal<Product[]>

ngOnInit(){
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
