import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoViajePage');
  }

  // presentModal() {
  //   let modal = this.modalCtrl.create(ModalPage);
  //   modal.present();
  // }

}

