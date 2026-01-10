import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ɵEmptyOutletComponent } from '@angular/router';
import { imagens } from '../../icons/imagem-services';

@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ɵEmptyOutletComponent],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  icon: string = imagens.error;
  @Input() error!: boolean;

  @Input() title!: string;
  @Input() isVisible: boolean = false;

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
