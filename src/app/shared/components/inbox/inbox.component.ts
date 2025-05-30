import { Component, inject, computed, input, forwardRef, output, signal, ViewEncapsulation } from '@angular/core';
import { BrazeService } from '@services/braze.service';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { MmCardComponent } from '@components/mm-card/mm-card.component';
import { IonList, IonHeader, IonContent, IonModal, IonAlert } from '@ionic/angular/standalone';
import { HeaderComponent } from '../header/header.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  standalone: true,
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ],
  imports: [IonAlert, IonHeader, IonList, IonContent, MmCardComponent, IonModal, forwardRef(() => HeaderComponent)]
})
export class InboxComponent {
  showInbox = input(false);
  cardToDismiss = signal<BrazeContentCard | null>(null);
  braze = inject(BrazeService);
  contentCards = computed(() => this.braze.contentCards());
  showDismissConfirmation = computed(() => this.cardToDismiss() !== null);
  backEvent = output<void>();

  confirmationActions = [
    {
      text: 'No',
      role: 'cancel',
      handler: () => {
        this.cancelDismissCard();
      }
    },
    {
      text: 'Yes',
      role: 'confirm',
      handler: () => {
        this.braze.removeCard(this.cardToDismiss()!.id);
        this.cardToDismiss.set(null);
      }
    }
  ];

  openCard(card: BrazeContentCard) {
    if (card.url) {
      if (card.url.startsWith('/') || card.url.startsWith('#/')) {
        const route = card.url.replace(/^#/, '');
        window.dispatchEvent(new CustomEvent('navigate', { detail: { route } }));
      } else {
        window.open(card.url, card.openURLInWebView ? '_blank' : '_self');
      }
    }
  }

  dismissCard(card: BrazeContentCard) {
    this.cardToDismiss.set(card);
  }

  cancelDismissCard() {
    this.cardToDismiss.set(null);
  }
}
