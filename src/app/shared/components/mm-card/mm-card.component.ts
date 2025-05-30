import { Component, input, output } from '@angular/core';
import { ImageLoaderComponent } from '@components/image-loader/image-loader.component';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mm-card',
  template: ` <ion-card class="ion-no-padding">
    <ion-card-header>
      @if (title(); as title) {
      <ion-card-title [class]="{ 'small-title': smallTitle() }">
        <div class="flex-row align-items-center">
          @if(showIcon()) {
          <div class="m-r-1">
            <app-image-loader
              src="assets/icon/mm-cc-logo.png"
              imageClass="iconize"
              maxWidth="30px"
              skeletonDiameter="30px"
              skeletonBorderRadius="30px"
            ></app-image-loader>
          </div>
          } {{ title }}
          @if (showCloseButton()) {
          <ion-button shape="round" fill="clear" size="small" class="m-l-1" (click)="closeEvent.emit()">
            <ion-icon name="close-circle-outline" size="large" color="danger" slot="icon-only"></ion-icon>
          </ion-button>
          }
        </div>
      </ion-card-title>
      }
    </ion-card-header>

    <ion-card-content>
      <ng-content></ng-content>
    </ion-card-content>
  </ion-card>`,
  styles: [
    `
      .small-title {
        font-size: 1em;
      }
    `
  ],
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, ImageLoaderComponent, IonButton, IonIcon]
})
export class MmCardComponent {
  title = input('Mama Money');
  smallTitle = input(false);
  showIcon = input(true);
  showCloseButton = input(false);
  closeEvent = output<void>();

  constructor() {
    addIcons({ closeCircleOutline });
  }
}
