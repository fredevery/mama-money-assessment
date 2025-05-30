import { Component, inject, computed, input, forwardRef } from '@angular/core';
import { BrazeService } from '@services/braze.service';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { MmCardComponent } from '@components/mm-card/mm-card.component';
import {
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
  IonHeader,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonModal
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  standalone: true,
  imports: [
    IonCardSubtitle,
    IonHeader,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonButton,
    IonIcon,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    MmCardComponent,
    IonModal,
    forwardRef(() => HeaderComponent)
  ]
})
export class InboxComponent {
  showInbox = input(false);
  braze = inject(BrazeService);
  contentCards = computed(() => this.braze.contentCards());

  openCard(card: BrazeContentCard) {
    // TODO: Implement deep link or navigation logic
    if (card.url) {
      window.open(card.url, card.openURLInWebView ? '_blank' : '_self');
    }
  }

  dismissCard(card: BrazeContentCard, event: Event) {
    event.stopPropagation();
    // TODO: Implement confirmation dialog and card dismissal logic
    // if (confirm('Are you sure you want to dismiss this message?')) {
    //   this.braze.contentCards.set(this.contentCards().filter((c) => c.id !== card.id));
    // }
  }
}
