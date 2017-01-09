import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { NavController, Platform, NavParams, ModalController } from 'ionic-angular';

import { NuevoViajePage } from '../nuevo-viaje/nuevo-viaje';
import { ViajeAsignadoPage } from '../viaje-asignado/viaje-asignado';
import { ModalPage } from '../modal/modal';
import { ModalAccidentePage } from '../modal-accidente/modal-accidente';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  aceptado: any;
  slots: boolean = true;

  constructor(public navCtrl: NavController, private platform: Platform, public params: NavParams, public modalCtrl: ModalController) {
    this.loadMap();
    this.map = { lat: 0, lng: 0, zoom: 15 };

    if (params.get('aceptado') != null) {
      this.aceptado = params.get('aceptado');
    }

    console.log('Valor aceptad: ' + this.aceptado);
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

  viajesAsignados() {
    this.navCtrl.setRoot(ViajeAsignadoPage);
  }

  openModal(characterNum) {
    let modal = this.modalCtrl.create(ModalPage, characterNum);
    modal.present();
  }

  openModalAccidente(characterNum) {
    let modal = this.modalCtrl.create(ModalAccidentePage, characterNum);
    modal.present();
  }

}