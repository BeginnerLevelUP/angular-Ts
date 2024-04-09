import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  user?: any;

  constructor(private userService: UserService){}
  

  ngOnInit(): void {
    const currentUser = this.userService.getCurrentAuthUser();
    if (currentUser) {
      this.user = currentUser;
      console.log(currentUser)
    }
  }


}