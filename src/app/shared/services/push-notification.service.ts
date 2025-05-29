import { Injectable, inject } from '@angular/core';
import { BrazePushNotification } from '@models/braze/braze-push-notification';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { BrazeService } from './braze.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  braze = inject(BrazeService);

  constructor() {}

  init() {
    PushNotifications.addListener('registration', (token) => {
      console.log('~ PushNotificationService ~ token:', token);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema | BrazePushNotification) => {
        if (this.braze.isBrazePushNotification(notification as BrazePushNotification)) {
          this.handleBrazePushNotification(notification as BrazePushNotification);
        } else {
          this.handleOtherPushNotification(notification as PushNotificationSchema);
        }
      }
    );

    this.registerPush();
  }

  handleBrazePushNotification(notification: BrazePushNotification): void {
    if (this.braze.isInboxNotification(notification)) {
      const data = this.braze.parsePushNotification(notification);
      // Handle Braze inbox notification
      console.log('Received Braze inbox notification:', JSON.stringify(data));
      // You can navigate to the inbox or show a specific content card here
    }
  }

  handleOtherPushNotification(notification: PushNotificationSchema): void {
    // Handle other push notifications here
    console.log('Received push notification:', notification);
  }

  async registerPush(): Promise<void> {
    let pushReq = await PushNotifications.checkPermissions();

    if (pushReq.receive === 'prompt') {
      pushReq = await PushNotifications.requestPermissions();
    }

    if (pushReq.receive) {
      // Ask iOS user for permission/auto grant android permission
      await PushNotifications.register();
    }
  }
}
