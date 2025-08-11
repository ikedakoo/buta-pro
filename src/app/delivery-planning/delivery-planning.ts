import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery-planning',
  imports: [],
  templateUrl: './delivery-planning.html',
  styleUrl: './delivery-planning.css'
})
export class DeliveryPlanningComponent {

  constructor(private router: Router) {}

  backToPortal() {
    this.router.navigate(['/portal']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
