import { BrazePushNotification } from '@models/braze/braze-push-notification';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { Injectable, signal } from '@angular/core';

declare var BrazePlugin: any;

type ParsedBrazePushNotification = {
  message: string;
  title: string;
  priority: string;
  campaignId: string;
  uri: string;
  channel: string;
  extra: {
    [key: string]: any;
    type?: string;
  };
  contentCard: Record<string, any> | null;
};

@Injectable({
  providedIn: 'root'
})
export class BrazeService {
  unreadMessages = signal<boolean>(false);
  contentCards = signal<BrazeContentCard[]>([]);
  constructor() {}

  get pluginAvailable(): boolean {
    return typeof BrazePlugin !== 'undefined';
  }

  isBrazePushNotification(notification: BrazePushNotification): boolean {
    if (!notification || !notification.data || !notification.data._ab) {
      return false;
    }
    return true;
  }

  isInboxNotification(notification: BrazePushNotification): boolean {
    if (!this.isBrazePushNotification(notification)) {
      return false;
    }
    const data = this.parsePushNotification(notification);
    return data.extra?.type === 'inbox';
  }

  logEvent(eventName: string, properties?: Record<string, any>): void {
    console.log(`BrazeService: Logging event '${eventName}' with properties:`, properties);
    if (this.pluginAvailable && BrazePlugin.logCustomEvent) {
      BrazePlugin.logCustomEvent(eventName, properties || {});
    } else {
      console.warn('BrazePlugin is not available or logCustomEvent method is missing.');
    }
  }

  handlePushNotification(notification: BrazePushNotification): void {
    console.log('BrazeService: Received push notification:', notification);
    if (!this.isBrazePushNotification(notification)) {
      console.warn('Received non-Braze push notification:', notification);
      return;
    }

    if (this.isInboxNotification(notification)) {
      this.refreshContentCards();
    }
  }

  parsePushNotification(notification: BrazePushNotification): ParsedBrazePushNotification {
    if (!this.isBrazePushNotification(notification)) {
      throw new Error('Not a valid Braze push notification:' + JSON.stringify(notification));
    }

    const data = notification.data;
    let parsedExtra = this.parsePushNotificationExtra(data.extra || '');
    let parsedContentCard = this.parsePushNotificationContentCard(data.ab_cd || '');

    return {
      message: data.a,
      title: data.t,
      priority: data.p,
      campaignId: data.cid,
      uri: data.uri,
      channel: data.ab_nc,
      extra: parsedExtra,
      contentCard: parsedContentCard
    } as ParsedBrazePushNotification;
  }

  parsePushNotificationExtra(extra: string): { type?: string } {
    if (!extra) {
      return {};
    }
    try {
      return JSON.parse(extra);
    } catch (e) {
      console.error('Failed to parse extra data:', e);
      return {};
    }
  }

  parsePushNotificationContentCard(contentCard: string): Record<string, any> | null {
    if (!contentCard) {
      return null;
    }
    try {
      return JSON.parse(contentCard);
    } catch (e) {
      console.error('Failed to parse content card data:', e);
      return null;
    }
  }

  refreshContentCards(): void {
    console.log('BrazeService: Refreshing content cards from server...');
    if (this.pluginAvailable && BrazePlugin.getContentCardsFromServer) {
      BrazePlugin.getContentCardsFromServer(
        (cards: BrazeContentCard[]) => {
          console.log('BrazeService: Refreshing content cards:', cards);
          this.contentCards.set(cards);
          this.unreadMessages.set(true);
        },
        (error: any) => {
          console.error('BrazeService: Error fetching content cards:', error);
        }
      );
    }
  }

  removeCard(cardId: string): void {
    this.contentCards.update((cards) => cards.filter((card) => card.id !== cardId));
    console.log(`BrazeService: Removed content card with ID: ${cardId}`, this.contentCards().length);
    BrazePlugin.logContentCardDismissed(cardId);
  }
}
