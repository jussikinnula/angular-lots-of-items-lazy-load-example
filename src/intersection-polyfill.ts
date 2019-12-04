
// Exits early if all IntersectionObserver and IntersectionObserverEntry
// features are natively supported.
if (this.window && this.window.IntersectionObserver && this.window.IntersectionObserverEntry) {
  // Minimal polyfill for Edge 15's lack of `isIntersecting`
  // See: https://github.com/w3c/IntersectionObserver/issues/211
  if (!this.window.IntersectionObserverEntry.prototype.isIntersecting) {
    Object.defineProperty(
      this.window.IntersectionObserverEntry.prototype,
      'isIntersecting',
      {get() {
          return this.intersectionRatio > 0;
      }}
    );
  }
}
