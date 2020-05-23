import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { IziToastService } from '../../providers/izi-toast.service';
import { LanguageService } from '../../providers/language.service';
import { SoundsService } from '../../providers/sounds.service';
import { LanguagesModalComponent } from '../../modals/languages-modal/languages.modal';
import { FavoritesMoviesModalComponent } from '../../modals/favorites-movies-modal/favorites.movies.modal';
import { FilterMoviePopoverComponent } from '../../popovers/filter-movie.popover';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {
  @Input() title: string;
  iconView = 'apps';
  searchControl: FormControl;
  constructor( private popoverCtrl: PopoverController, private modalCtrl: ModalController,
    private iziToast: IziToastService, translate: LanguageService, private soundsService: SoundsService) {
      translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
    this.searchControl = new FormControl();
     }

  ngOnInit() {
    console.log('@@@@@@@@@@@@@title :>> ', this.title);
  }
  switchSound() {
    this.soundsService.stop('all');
  }

  async presentModal(componentProps: any, component) {
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: componentProps
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
    }
  }
  showLanguage() {
    console.log('HomePage::showLanguage() | method called');
    const state = JSON.parse(localStorage.getItem('@@STATE'));
    const componentProps = { modalProps: { title: 'Language', favoritesMovies: state.catalog.language } };
    this.presentModal(componentProps, LanguagesModalComponent);
  }

  showFavoritesMovies() {
    console.log('HomePage::showFavoritesMovies() | method called');
    const state = JSON.parse(localStorage.getItem('@@STATE'));
    const componentProps = { modalProps: { title: 'Favorites Movies', favoritesMovies: state.catalog.favorites } };
    this.presentModal(componentProps, FavoritesMoviesModalComponent);
  }

  changeView() {
    console.log('HomePage::changeView() | method called');
    this.iconView = this.iconView === 'apps' ? 'list' : 'apps';
  }

  async presentPopover(event) {
    // console.log('presentPopover');
    const popover = await this.popoverCtrl.create({
      component: FilterMoviePopoverComponent,
      event: event
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
    }

  }

}
