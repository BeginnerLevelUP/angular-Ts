import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { CatalogComponent } from './catalog/catalog.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
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
        path:'catalog',
        component:CatalogComponent,
        title:'Catalog'
    },
    {
    path:'favortie',
    component:FavoriteComponent,
    title:"Favorites"
    },
    {
    path:'signup',
    component:AuthenticateComponent,
    title:"Authenticate"
    },
    {
    path:'product/:id',
    component:ProductPageComponent,
    title:"Product"
    },
    {
    path:"search/:term",
    component:SearchPageComponent,
    title:"Searched"
    }

];
