import { Component,OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Inject } from '@angular/core';
import { EcommerceService } from '../ecommerce.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
constructor(private userService:UserService,private router:Router){}
ecommerceService=inject(EcommerceService)
loggedIn:boolean=false
myControl = new FormControl('');
options: string[] = [
  "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  "Mens Casual Premium Slim Fit T-Shirts",
  "Mens Cotton Jacket",
  "Mens Casual Slim Fit",
  "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
  "Solid Gold Petite Micropave",
  "White Gold Plated Princess",
  "Pierced Owl Rose Gold Plated Stainless Steel Double",
  "WD 2TB Elements Portable External Hard Drive - USB 3.0",
  "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
  "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
  "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
  "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
  "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED",
  "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
  "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
  "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
  "MBJ Women's Solid Short Sleeve Boat Neck V",
  "Opna Women's Short Sleeve Moisture",
  "DANVOUY Womens T Shirt Casual Cotton Short"
]
;
filteredOptions!: Observable<string[]>;

ngOnInit():void{
if(this.userService.isLoggedIn()){
  this.loggedIn=true
}else{
  this.loggedIn=false
}

this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
}

private _filter(value: string): string[] {
const filterValue = value.toLowerCase();
return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

logout():void{
this.userService.logout()
}

login():void{
 this.router.navigate(['/signup']);
}


}
