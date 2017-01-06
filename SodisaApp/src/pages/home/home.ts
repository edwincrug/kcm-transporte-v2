import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { NuevoViajePage } from '../nuevo-viaje/nuevo-viaje';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  ViajeDetalle() {
    this.navCtrl.setRoot(NuevoViajePage);
  }
}
