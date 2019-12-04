import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

import { InViewportDirective } from './in-viewport.directive';
import { WINDOW } from '../../models/window-token';
import { WINDOW_MOCK_WITHOUT_INTERSECTION_OBSERVER } from '../../models/window-mock';

describe('InViewportDirective', () => {
  let elementRef: ElementRef;
  let windowRef: Window;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ElementRef,
        { provide: WINDOW, useValue: WINDOW_MOCK_WITHOUT_INTERSECTION_OBSERVER }
      ]
    });

    elementRef = TestBed.get(ElementRef);
    windowRef = TestBed.get(WINDOW);
  });

  it('should create an instance', () => {
    const directive = new InViewportDirective(elementRef, windowRef);
    expect(directive).toBeTruthy();
  });
});
