// Original version: https://github.com/thisissoon/angular-inviewport/
// CSS:
//
// .foo {
//   transition: transform 0.35s ease-out;
// }
//
// .foo.sn-viewport--out {
//   transform: translateY(-30px);
// }
//
// .foo.sn-viewport--in {
//   transform: translateY(0);
// }
//
// Template:
//
// <p
//   class="foo"
//   [ngClass]="{highlight: highlight}"
//   appInViewport
//   (inViewportChange)="onInViewportChange($event)">
//   Amet tempor excepteur occaecat nulla.
// </p>

import {
  Directive,
  ElementRef,
  HostBinding,
  EventEmitter,
  Output,
  OnDestroy,
  AfterViewInit,
  Inject,
  Input,
  OnInit
} from '@angular/core';
import { WINDOW } from '../../models/window-token';

@Directive({
  selector: '[appInViewport]'
})
export class InViewportDirective implements AfterViewInit, OnDestroy, OnInit {
  private inViewport: boolean;
  private hasIntersectionObserver: boolean;
  @Input() inViewportOptions: IntersectionObserverInit;
  @Output() inViewportChange = new EventEmitter<boolean>();
  observer: IntersectionObserver;

  @HostBinding('class.sn-viewport--in')
  get isInViewport(): boolean {
    return this.inViewport;
  }

  @HostBinding('class.sn-viewport--out')
  get isNotInViewport(): boolean {
    return !this.inViewport;
  }

  constructor(private elementRef: ElementRef, @Inject(WINDOW) private window: Window) {}

  ngOnInit() {
    this.inViewport = false;
    this.inViewportChange.emit(this.inViewport);
  }

  ngAfterViewInit() {
    this.observer = new this.window.IntersectionObserver(
      this.intersectionObserverCallback.bind(this),
      this.inViewportOptions
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.unobserve(this.elementRef.nativeElement);
    }
  }

  intersectionObserverCallback(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (this.inViewport === entry.isIntersecting) {
        return;
      }
      this.inViewport = entry.isIntersecting;
      this.inViewportChange.emit(this.inViewport);
    });
  }
}
