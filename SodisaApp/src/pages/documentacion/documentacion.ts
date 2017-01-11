import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EvidenciaPage } from '../evidencia/evidencia';

/*
  Generated class for the Documentacion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-documentacion',
  templateUrl: 'documentacion.html'
})
export class DocumentacionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocumentacionPage');
  }

  redirectEvidencia() {
    this.navCtrl.setRoot(EvidenciaPage);
  }
}
