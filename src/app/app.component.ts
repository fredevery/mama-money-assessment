import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PushNotificationService } from '@services/push-notification.service';
import { InboxComponent } from '@components/inbox/inbox.component';
import { InboxService } from '@services/inbox.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, InboxComponent]
})
export class AppComponent {
  inbox = inject(InboxService);
  constructor(private pushNotificationService: PushNotificationService) {
    this.pushNotificationService.init();
  }
}
