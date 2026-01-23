import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-component',
  imports: [],
  templateUrl: './cards-component.html',
  styleUrl: './cards-component.scss',
})
export class CardsComponent {
  @Input() title!: string;
}
