import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() error: string;
  @Output() close = new EventEmitter<void>();

  constructor() {
  }

  onClose() {
    this.close.emit();
  }
}
