import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ChuckNorrisService } from '../../services/chuck-norris.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() id: number;
  content: Observable<string>;
  queued: Observable<boolean>;
  loading: Observable<boolean>;

  constructor(private chuckNorrisService: ChuckNorrisService) {}

  ngOnInit() {
    this.content = this.chuckNorrisService.getContent(this.id);
    this.queued = this.chuckNorrisService.getQueueState(this.id);
    this.loading = this.chuckNorrisService.getLoadingState(this.id);
  }

  loadContent(itemIsInViewport: boolean) {
    if (itemIsInViewport) {
      this.chuckNorrisService.loadContent(this.id);
    }
  }
}
