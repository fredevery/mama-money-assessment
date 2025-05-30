import { Component, forwardRef, input, output, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { InboxButtonComponent } from '@components/inbox-button/inbox-button.component';
import { IonToolbar, IonTitle, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { InboxComponent } from '@components/inbox/inbox.component';

@Component({
  selector: 'app-header',
  template: ` <ion-toolbar>
      @if (showBackButton()) {
      <ion-button class="back-btn" (click)="backEvent.emit()" fill="clear" slot="start">
        <ion-icon color="dark" name="arrow-back" slot="icon-only"></ion-icon>
      </ion-button>
      }
      <ion-title> {{ title() }} </ion-title>
      @if (showInboxButton()) {
      <app-inbox-button slot="end" (showInbox)="showInbox()"></app-inbox-button>
      }
    </ion-toolbar>
    <app-inbox [showInbox]="inboxIsVisible()"></app-inbox>`,
  styles: [
    `
      ion-toolbar {
        --min-height: 4rem;
      }

      ion-button {
        font-size: 1.5rem;
      }
    `
  ],
  standalone: true,
  imports: [IonToolbar, IonTitle, forwardRef(() => InboxButtonComponent), InboxComponent, IonButton, IonIcon]
})
export class HeaderComponent {
  router = inject(Router);
  title = input('Mama Money');
  showBackButton = input(false);
  showInboxButton = input(false);
  backEvent = output<void>();
  inboxIsVisible = signal(false);

  constructor() {
    addIcons({ arrowBack });
  }

  showInbox(): void {
    this.inboxIsVisible.set(true);
  }
}
