import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { AppComponent } from './app.component';
import { ListComponent } from './components/list/list.component';
import { ItemComponent } from './components/item/item.component';
import { ChuckNorrisService } from './services/chuck-norris.service';
import { InViewportDirective } from './directives/in-viewport/in-viewport.directive';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ItemComponent,
    InViewportDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    VirtualScrollerModule
  ],
  providers: [ChuckNorrisService],
  bootstrap: [AppComponent]
})
export class AppModule { }
