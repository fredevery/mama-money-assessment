import { BrazePushNotification } from '@models/braze/braze-push-notification';
import { Injectable } from '@angular/core';

declare var BrazePlugin: any;

@Injectable({
  providedIn: 'root'
})
export class BrazeService {
  constructor() {}

  get pluginAvailable(): boolean {
    return typeof BrazePlugin !== 'undefined';
  }

  isBrazePushNotification(notification: BrazePushNotification): boolean {
    if (!notification || !notification.data || !notification.data.extra) {
      return false;
    }
    return true;
  }

  logEvent(eventName: string, properties?: Record<string, any>): void {
    console.log(`BrazeService: Logging event '${eventName}' with properties:`, properties);
    if (this.pluginAvailable && BrazePlugin.logCustomEvent) {
      BrazePlugin.logCustomEvent(eventName, properties || {});
    } else {
      console.warn('BrazePlugin is not available or logCustomEvent method is missing.');
    }
  }
}
