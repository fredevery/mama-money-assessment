import { Component, input, output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ImageLoaderComponent } from '@components/image-loader/image-loader.component';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mm-card',
  template: ` <ion-card class="ion-no-padding" (click)="handleClick($event)">
    <ion-card-header>
      @if (title(); as title) {
      <ion-card-title [class]="{ 'small-title': smallTitle() }">
        <div class="flex-row align-items-center justify-space-between">
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
            }
            {{ title }}
          </div>
          @if (showCloseButton()) {
          <ion-button shape="round" fill="clear" size="small" class="m-l-1" (click)="handleClose($event)">
            <ion-icon name="close-circle-outline" size="large" color="danger" slot="icon-only"></ion-icon>
          </ion-button>
          } @else {
          <div></div>
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
  url = input<string | null>(null);
  openURLInWebView = input(false);
  router = inject(Router);

  constructor() {
    addIcons({ closeCircleOutline });
  }

  handleClick(event: MouseEvent): void {
    if (this.url()) {
      this.openCard();
    }
  }

  handleClose(event: MouseEvent): void {
    event.stopPropagation(); // Prevent the card click event from firing
    this.closeEvent.emit();
  }

  // This is not the ideal solution for handling custom URL schemes,
  // but it works for the current use case.
  // Ideally, we would have a more robust URL handling mechanism, higher
  // up in the component hierarchy, or even in a service.
  openCard() {
    const cardUrl = this.url();
    console.log('Opening card with URL:', cardUrl);
    if (cardUrl) {
      if (cardUrl.startsWith('za.co.mamamoney.assessments.frontend://')) {
        const path = cardUrl.replace('za.co.mamamoney.assessments.frontend://', '/');
        console.log('Navigating to path:', path);
        this.router.navigate([path]);
      } else if (cardUrl.startsWith('/') || cardUrl.startsWith('#/')) {
        const route = cardUrl.replace(/^#/, '');
        this.router.navigate([route]);
      } else {
        window.open(cardUrl, this.openURLInWebView() ? '_blank' : '_self');
      }
    }
  }
}
