import { BrazePushNotification } from '@models/braze/braze-push-notification';
import { Injectable } from '@angular/core';

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

  parsePushNotification(notification: BrazePushNotification): ParsedBrazePushNotification {
    if (!this.isBrazePushNotification(notification)) {
      throw new Error('Not a valid Braze push notification:' + notification);
    }

    const data = notification.data;
    let parsedExtra = {};
    let parsedContentCard = null;

    if (data.extra) {
      try {
        parsedExtra = JSON.parse(data.extra);
      } catch (e) {
        console.error('Failed to parse extra data:', e);
      }
    }

    if (data.ab_cd) {
      try {
        parsedContentCard = JSON.parse(data.ab_cd);
      } catch (e) {
        console.error('Failed to parse content card data:', e);
      }
    }

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
      const parsed = JSON.parse(extra);
      return { type: parsed.type || undefined };
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
}
