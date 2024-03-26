import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { SettingsComponent } from './settings/settings.component';
import { CatalogComponent } from './catalog/catalog.component';
export const routes: Routes = [
    {
        path:'',
        component:HomeComponent,
        title:"Home Page"
    },
    {
        path:'cart',
        component:CartComponent,
        title: 'Your Cart'
    },
    {
        path:'settings',
        component:SettingsComponent,
        title:'Settings'
    },
    {
        path:'catalog',
        component:CatalogComponent,
        title:'Catalog'
    }
    // example for items page
   /* 
   {
    //for category
    path:'item/shirt
    //for item
    path:item/shirt/1
    }
    */
];
