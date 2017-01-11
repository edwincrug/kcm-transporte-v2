import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';

/*
  Generated class for the Evidencia page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-evidencia',
  templateUrl: 'evidencia.html'
})
export class EvidenciaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EvidenciaPage');
  }

  redirectHome() {
    let loading = this.loadingCtrl.create({
      content: '¡Trabajo Terminado!',
      duration: 2000
    });

    loading.present();

    this.navCtrl.setRoot(HomePage);
  }

  openCamera() {
    let loading = this.loadingCtrl.create({
      content: 'Iniciando la camara...',
      duration: 2000
    });

    loading.present();
  }

}
