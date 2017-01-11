import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { NavController, Platform, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';

import { NuevoViajePage } from '../nuevo-viaje/nuevo-viaje';
import { ViajeAsignadoPage } from '../viaje-asignado/viaje-asignado';
import { ModalPage } from '../modal/modal';
import { ModalAccidentePage } from '../modal-accidente/modal-accidente';
import { SincronizacionPage } from '../sincronizacion/sincronizacion';
import { ModalParadasPage } from '../modal-paradas/modal-paradas';
import { ModalIncidentePage } from '../modal-incidente/modal-incidente';
import { ViajeTerminadoPage } from '../viaje-terminado/viaje-terminado';
import { EvidenciaPage } from '../evidencia/evidencia';
import { DocumentacionPage } from '../documentacion/documentacion';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  aceptado: any;
  slots: boolean = true;
  remolque: string = "remolque1";

  constructor(public navCtrl: NavController, private platform: Platform, public params: NavParams, public modalCtrl: ModalController,
    private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
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
    }).catch((error) => {
      this.map =
        {
          lat: 19.438029,
          lng: -99.2118746,
          zoom: 15
        };
    });
  }

  viajesAsignados() {
    this.navCtrl.setRoot(ViajeAsignadoPage);
  }

  viajeTracking() {
    this.navCtrl.setRoot(NuevoViajePage);
  }

  redirectSync() {
    this.navCtrl.setRoot(SincronizacionPage);;
  }

  terminaViaje() {
    this.navCtrl.setRoot(ViajeTerminadoPage);
  }

  openParadas() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Paradas en ruta');

    alert.addInput({
      type: 'radio',
      label: 'Carga de combustible',
      value: '1',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Manifestación',
      value: '2',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Mal clima',
      value: '3',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Comida',
      value: '4',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Descanso',
      value: '5',
      checked: false
    });

    alert.addButton('Cerrar');
    alert.addButton({
      text: 'Aceptar',
      handler: data => {

        let modal = this.modalCtrl.create(ModalParadasPage);
        modal.present();

      }
    });

    alert.present();
  }

  startManionbra() {
    let loading = this.loadingCtrl.create({
      content: 'Maniobra iniciada ...',
      duration: 2000
    });

    loading.present();
  }

  finishManiobra() {
    let confirm = this.alertCtrl.create({
      subTitle: '¿Se realiza entrega de mercancía?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.setRoot(EvidenciaPage);
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

  showAnden() {
    let loading = this.loadingCtrl.create({
      content: 'Puesta en andén ...',
      duration: 2000
    });

    loading.present();
  }

  openIncidentes() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Incidentes');

    alert.addInput({
      type: 'radio',
      label: 'Bloqueo de tarjeta Iave',
      value: '6',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Desvió de ruta',
      value: '7',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Falla mecánica',
      value: '8',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Intento de robo',
      value: '9',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Siniestro Unidad',
      value: '10',
      checked: false
    });

    alert.addButton('Cerrar');
    alert.addButton({
      text: 'Aceptar',
      handler: data => {

        let modal = this.modalCtrl.create(ModalIncidentePage);
        modal.present();

      }
    });

    alert.present();
  }

  openModal(characterNum) {
    let modal = this.modalCtrl.create(ModalPage, characterNum);
    modal.present();
  }

}