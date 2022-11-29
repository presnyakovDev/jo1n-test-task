/* eslint-disable */
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FuseNavigationService } from '@mc/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fuse-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FuseNavigationComponent implements OnDestroy {
  navigationModel: any[];
  navigationModelChangeSubscription: Subscription;

  constructor(private fuseNavigationService: FuseNavigationService) {
    this.navigationModelChangeSubscription = this.fuseNavigationService.onNavigationModelChange.subscribe(
      navigationModel => {
        this.navigationModel = navigationModel;
      }
    );
  }

  ngOnDestroy() {
    this.navigationModelChangeSubscription.unsubscribe();
  }
}
