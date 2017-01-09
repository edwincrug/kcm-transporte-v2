import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { ModalPage } from '../modal/modal';
import { ModalAccidentePage } from '../modal-accidente/modal-accidente';
import { ViajeAsignadoPage } from '../viaje-asignado/viaje-asignado';

/*
  Generated class for the ViajeAceptado page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-viaje-aceptado',
  templateUrl: 'viaje-aceptado.html'
})
export class ViajeAceptadoPage {
  slots: boolean = true;
  map: any;
  terminado: boolean = false;
  remolque: string = "remolque1";

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.loadMap();
    this.map = { lat: 0, lng: 0, zoom: 15 };
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViajeAceptadoPage');
  }

  openModal(characterNum) {
    let modal = this.modalCtrl.create(ModalPage, characterNum);
    modal.present();
  }

  openModalAccidente(characterNum) {
    let modal = this.modalCtrl.create(ModalAccidentePage, characterNum);
    modal.present();
  }

  viajesAsignados() {
    this.navCtrl.setRoot(ViajeAsignadoPage);
  }

  terminaViaje(){
    this.terminado = true;
  }

}
