import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { LocalDataProvider } from '../../providers/local-data-provider';

/*
  Generated class for the Sincronizacion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sincronizacion',
  templateUrl: 'sincronizacion.html'
})
export class SincronizacionPage {
  username: any;
  nombre: string;
  economico: any;
  listaViajesPorSincronizar: any[] = [];
  listaIncidentesPorSincronizar = [];

  constructor(public navCtrl: NavController, public params: NavParams, private loadingCtrl: LoadingController, public dataServices: LocalDataProvider) {
    this.username = params.get('usuario');
    this.nombre = params.get('nombre');
    this.economico = params.get('eco');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SincronizacionPage'); 
       this.ObtieneViajesPorSincronizar();
       this.ObtieneIncidentesPorSincronizar();
  }

  redirectHome() {
    this.navCtrl.setRoot(HomePage, {
      usuario: this.username,
      nombre: this.nombre,
      eco: this.economico
    });
  }

  sincronizaViajes() {
    let loading = this.loadingCtrl.create({
      content: '¡ Información sincronizada !',
      duration: 2000
    });

    loading.present();
  }
  /*-------------------------------------------------------------------------------------*/
  /*--Obtengo los procesos guardados de manera local mientras el celular no tiene datos--*/
  ObtieneViajesPorSincronizar() {
    this.dataServices.openDatabase()
      .then(() => this.dataServices.viajesPorSincronizar().then(response => {
        if (response.length > 0) {
          this.listaViajesPorSincronizar = response;
          console.log(this.listaViajesPorSincronizar);
        }
        else {
          this.listaViajesPorSincronizar = [];
        }
      }));
  }
  /*---------------------------------------------------------------------------------------*/
  /*--Obtengo las evidencias guardadas de manera local mientras el celular no tiene datos--*/
  ObtieneIncidentesPorSincronizar() {
    this.dataServices.openDatabase()
      .then(() => this.dataServices.paradasIncidentesPorSincronizar().then(response => {
        if (response.length > 0) {
          this.listaIncidentesPorSincronizar = response;
          console.log(this.listaIncidentesPorSincronizar);
        }
        else {
          this.listaIncidentesPorSincronizar = [];
        }
      }));
  }
}
