import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, Platform, ViewController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import { ViajeAceptadoPage } from '../viaje-aceptado/viaje-aceptado';
import { HomePage } from '../home/home';
import { ViajeAsignadoPage } from '../viaje-asignado/viaje-asignado';
import { SincronizacionPage } from '../sincronizacion/sincronizacion';

/*
  Generated class for the NuevoViaje page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-nuevo-viaje',
  templateUrl: 'nuevo-viaje.html'
})
export class NuevoViajePage {
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    public alertCtrl: AlertController) {

    this.loadMap();
    this.map = { lat: 0, lng: 0, zoom: 15 };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoViajePage');
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

  muestraMotivos() {
    // this.imei = Device.device.uuid;
    let alert = this.alertCtrl.create();
    alert.setTitle('Motivos de Rechazo');

    alert.addInput({
      type: 'radio',
      label: 'Salud del operador',
      value: '1',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Día de descanso',
      value: '2',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Negativa del Operador',
      value: '3',
      checked: false
    });

    alert.addButton('Cerrar');
    alert.addButton({
      text: 'Aceptar',
      handler: data => {

        // if (this.idRechazoSelected != null) {
        //   this.RechazaViaje(idViaje, idOrigen, idConcentrado, indice);
        // }

      }
    });

    alert.present();

  }

  redirectViajeAceptado() {
    this.navCtrl.setRoot(ViajeAceptadoPage);
  }

  redirectHome() {
    this.navCtrl.setRoot(HomePage);
  }

  redirectSync() {
    this.navCtrl.setRoot(SincronizacionPage);;
  }

  viajesAsignados() {
    this.navCtrl.setRoot(ViajeAsignadoPage);
  }

}