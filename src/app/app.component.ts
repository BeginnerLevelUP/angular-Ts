import { Component } from '@angular/core';
import { RouterOutlet,RouterModule} from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,FooterComponent,HomeComponent],
  template:`
  <app-header></app-header>
  <router-outlet></router-outlet>
  <app-footer></app-footer>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'testProject';
}
