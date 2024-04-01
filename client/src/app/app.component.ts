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
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping</title>
</head>
<body>
   <header>
      <app-header></app-header>
  </header>
  <main>
  <router-outlet></router-outlet>
</main>

  <footer>
      <app-footer></app-footer>
  </footer>   
</body>
</html>
  `
,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'testProject';
}
