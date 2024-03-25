import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { CartComponent } from './cart/cart.component';
import { SettingsComponent } from './settings/settings.component';
export const routes: Routes = [
    {
        path:'',
        component:HomeComponent,
        title:"Home Page"
    },
    {
        path:'contact',
        component:ContactComponent,
        title:'Contact Page'
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
