
import { Component,inject,OnInit,WritableSignal } from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router,RouterModule } from '@angular/router';
import {MatGridListModule} from '@angular/material/grid-list';
import { EcommerceService } from '../ecommerce.service';
import { Product } from '../product';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: number;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ MatCardModule,MatGridListModule,MatChipsModule,MatTabsModule,RouterModule, MatTableModule, MatButtonModule, MatCardModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
products$={}as WritableSignal<Product[]>
ecommerceService=inject(EcommerceService)
router=inject(Router)

  tiles: Tile[] = [
    {text: Math.floor(Math.random() * (1 +20 -1)) + 1, cols: 1, rows: 1, color: 'none'},
    {text:Math.floor(Math.random() * (1 +20 -1)) + 1, cols: 1, rows: 1, color:  'none'},
    {text: Math.floor(Math.random() * (1 +20 -1)) + 1, cols: 1, rows: 1, color: 'none'},
    {text:Math.floor(Math.random() * (1 +20 -1)) + 1, cols: 1, rows: 1, color:'none'},
  ];

ngOnInit(): void {
  this.products$=this.ecommerceService.products$
  this.ecommerceService.getProducts()
  console.log(this.tiles)
}
}
