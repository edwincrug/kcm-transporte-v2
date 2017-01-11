import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { DocumentacionPage } from '../documentacion/documentacion';
import { HomePage } from '../home/home';
import { EvidenciaPage } from '../evidencia/evidencia';
import { ManiobraPage } from '../maniobra/maniobra';

/*
  Generated class for the ViajeTerminado page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-viaje-terminado',
  templateUrl: 'viaje-terminado.html'
})
export class ViajeTerminadoPage {
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.loadMap();
    this.map = { lat: 0, lng: 0, zoom: 15 };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViajeTerminadoPage');
  }

  loadMap() {
    Geolocation.getCurrentPosition().then((position) => {
      this.map =
        {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 15
        };
    }).catch((error) => {
      this.map =
        {
          lat: 19.438029,
          lng: -99.2118746,
          zoom: 15
        };
      });
  }

  redirectHome() {
    this.navCtrl.setRoot(EvidenciaPage);
  }

  redirectManiobra() {
    this.navCtrl.setRoot(ManiobraPage);
  } 

}
