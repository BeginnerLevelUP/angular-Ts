import { Component, WritableSignal} from '@angular/core';
import { UserService } from '../user.service';
import { Router,RouterModule } from '@angular/router';
import { User } from '../user';
import { MatCardModule } from '@angular/material/card';
import { EcommerceService } from '../ecommerce.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [MatCardModule,MatButtonModule],
  templateUrl: "./favorite.component.html",
  styles: `.favorite-header {
    display: flex;
    justify-content: space-evenly;
}

.favorite-header h1 {
    font-weight: 900;
    margin: 0 .5em
}
img{
    width:200px;
    height:200px;
}

.item{
    max-width:400px;
    display:flex;
    justify-content:center;
    flex-direction:column;
}
.container{
  display:flex;
  flex-direction:column;
  margin:0 35%;
  
}
`
})
export class FavoriteComponent {
  user$={}as WritableSignal<User>

  constructor(private userService: UserService,private ecommerceService:EcommerceService,private router:Router){}
  


  ngOnInit(): void {
    this.user$=this.userService.user$
    console.log(this.user$())
    this.userService.getUserData()
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

  removeFavorite(id:string){
    this.ecommerceService.removeFavorite(id).subscribe({
      next: () => {
        // this.router.navigate(['/cart']);
      },
      error: (error) => {
        alert('Failed to create user');
        console.error(error);
      },
    });
  }
}
