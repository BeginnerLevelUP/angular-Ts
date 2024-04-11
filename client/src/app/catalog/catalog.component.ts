import { Component, OnInit, WritableSignal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EcommerceService } from '../ecommerce.service';
import { Product } from '../product';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatChipsModule} from '@angular/material/chips';
import {ThemePalette} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [MatCardModule,RouterModule,CommonModule,MatButtonModule,MatTableModule,MatGridListModule,MatChipsModule,MatCheckboxModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
products$={}as WritableSignal<Product[]>
  displayedColumns: string[] = [
    'col-name',
    'col-position',
    'col-level',
  ];
constructor(private ecommerceService:EcommerceService) {}
ngOnInit(){
  this.fetchProducts()
}
private fetchProducts():void{
  this.products$=this.ecommerceService.products$
  console.log(this.products$())
  this.ecommerceService.getProducts()
}

 task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary'},
      {name: 'Accent', completed: false, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'},
    ],
  };

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }
}

