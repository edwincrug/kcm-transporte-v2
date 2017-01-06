import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { NavController, Platform } from 'ionic-angular';

import { NuevoViajePage } from '../nuevo-viaje/nuevo-viaje';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;

  constructor(public navCtrl: NavController, private platform: Platform) {
    this.loadMap();
    this.map = { lat: 0, lng: 0, zoom: 15 };
  }

  ViajeDetalle() {
    this.navCtrl.setRoot(NuevoViajePage);
  }

  loadMap() {
    Geolocation.getCurrentPosition().then((position) => {
      this.map =
        {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 15
        };
    });
  }

}