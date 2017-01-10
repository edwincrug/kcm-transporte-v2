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

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SincronizacionPage');
  }

  redirectHome() {
    this.navCtrl.setRoot(HomePage);
  }

  sincronizaViajes(){
    let loading = this.loadingCtrl.create({
      content: '¡ Información sincronizada !',
      duration: 2000
    });

    loading.present();
  }
}
