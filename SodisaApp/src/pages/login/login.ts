import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { ViajeAsignadoPage } from '../viaje-asignado/viaje-asignado';
import { HomePage } from '../home/home';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, private loadingCtrl: LoadingController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  validaCredenciales() {

    let loading = this.loadingCtrl.create({
      content: 'Autenticando...',
      duration: 2000
    });

    loading.present();

    let toast = this.toastCtrl.create({
      message: '¡Bienvenido Juan Pérez Arriaga',
      duration: 1000,
      position: 'middle'
    });
    toast.present();

    loading.dismiss();

    this.navCtrl.setRoot(HomePage);
  }


}
