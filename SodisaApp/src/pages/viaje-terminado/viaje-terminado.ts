import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { DocumentacionPage } from '../documentacion/documentacion';
import { HomePage } from '../home/home';

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
    });
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      subTitle: '¿Se realiza entrega de mercancía?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.navCtrl.setRoot(DocumentacionPage);
          }
        }
      ]
    });
    confirm.present();
  }

}
