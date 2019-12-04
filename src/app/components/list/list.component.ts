import { Component, Input } from '@angular/core';
import { ChuckNorrisService } from '../../services/chuck-norris.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  @Input() items: number[];

  constructor() {}
}
