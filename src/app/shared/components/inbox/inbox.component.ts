import { Component, inject, computed, input, forwardRef, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BrazeService } from '@services/braze.service';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { MmCardComponent } from '@components/mm-card/mm-card.component';
import { IonList, IonHeader, IonContent, IonModal, IonAlert } from '@ionic/angular/standalone';
import { HeaderComponent } from '../header/header.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { DateTimeStringPipe } from '@pipes/date-time-string.pipe';

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
  imports: [
    IonAlert,
    IonHeader,
    IonList,
    IonContent,
    MmCardComponent,
    IonModal,
    forwardRef(() => HeaderComponent),
    DateTimeStringPipe
  ]
})
export class InboxComponent {
  router = inject(Router);
  braze = inject(BrazeService);

  cardToDismiss = signal<BrazeContentCard | null>(null);
  contentCards = computed(() => this.braze.contentCards());
  showDismissConfirmation = computed(() => this.cardToDismiss() !== null);

  showInbox = input(false);
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

  constructor() {
    this.router.events.subscribe(() => {
      this.backEvent.emit();
    });
  }

  dismissCard(card: BrazeContentCard) {
    this.cardToDismiss.set(card);
  }

  cancelDismissCard() {
    this.cardToDismiss.set(null);
  }
}
