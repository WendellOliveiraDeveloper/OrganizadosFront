import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-label-component',
  imports: [CommonModule],
  templateUrl: './label-component.html',
  styleUrls: ['./label-component.scss'],
})
export class LabelComponent {
  @Input() required: boolean = false;
  @Input() text: string = '';
  @Input() for: string = '';
}
