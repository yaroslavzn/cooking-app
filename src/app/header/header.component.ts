import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  collapsed = true;
  @Output() navigationChanged: EventEmitter<string> = new EventEmitter();

  changeNavPath(pathStr: string) {
    this.navigationChanged.emit(pathStr);
  }
}
