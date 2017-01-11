import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the ModalIncidente page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-incidente',
  templateUrl: 'modal-incidente.html'
})
export class ModalIncidentePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalIncidentePage');
  }

dismiss() {
    this.viewCtrl.dismiss();
  }
}