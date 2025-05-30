import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InboxService {
  isVisible = signal<boolean>(false);

  constructor() {}

  show(): void {
    this.isVisible.set(true);
  }
  hide(): void {
    this.isVisible.set(false);
  }
}
