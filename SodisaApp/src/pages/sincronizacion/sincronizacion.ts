import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';

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

  constructor(public navCtrl: NavController, public params: NavParams, private loadingCtrl: LoadingController) {
    this.username = params.get('usuario');
    this.nombre = params.get('nombre');
    this.economico = params.get('eco');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SincronizacionPage');
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
}
