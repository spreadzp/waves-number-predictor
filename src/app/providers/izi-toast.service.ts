import { Injectable } from '@angular/core';

import {default as iziToast, IziToastSettings} from 'izitoast';

@Injectable({
  providedIn: 'root'
})
export class IziToastService {

  defaultIziToastSettings: IziToastSettings = {
    color: 'green',
    title: '',
    icon: 'ico-success',
    message: '',
    position: 'bottomCenter',
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX',
    image: 'assets/avatar.png',
    imageWidth: 70,
    layout: 2,
    displayMode: 2
  };

  constructor() {
    console.log('IziToastService::constructor() | method called', iziToast);
  }

  show(title, message, color, icon, image) {
    const newSettings: IziToastSettings = {title: title, message: message, color: color, icon: icon, image: image};
    iziToast.show({...this.defaultIziToastSettings, ...newSettings});
  }

  errorConnection(title, message, color) {
    const newSettings: IziToastSettings = {title: title, message: message, color: color};
    iziToast.error({...this.defaultIziToastSettings, ...newSettings});
  }

  success(title, message) {
    const newSettings: IziToastSettings = {title: title, message: message, position: 'bottomCenter'};
    iziToast.success({...this.defaultIziToastSettings, ...newSettings});
  }

  gameOver (title, message) {
    const newSettings: IziToastSettings = {title: title, message: message, color: 'blue'};
    return iziToast.show({...this.defaultIziToastSettings, ...newSettings});
  }

  destroy() {
    iziToast.destroy();
  }
}
