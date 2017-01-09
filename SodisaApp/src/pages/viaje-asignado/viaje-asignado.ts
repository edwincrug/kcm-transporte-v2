import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { NuevoViajePage } from '../nuevo-viaje/nuevo-viaje';

/*
  Generated class for the ViajeAsignado page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-viaje-asignado',
  templateUrl: 'viaje-asignado.html'
})
export class ViajeAsignadoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViajeAsignadoPage');
  }

  ViajeTracking() {
    this.navCtrl.setRoot(NuevoViajePage);
  }
}
