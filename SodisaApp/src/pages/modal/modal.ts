import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the Modal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html'
})
export class ModalPage {
  odometro: any;
  remolque: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  validarDatos() {
    let respuesta = '';

    if ((this.odometro == null || this.odometro.trim() == '') && (this.remolque == null || this.remolque.trim() == '')) {
      return 'Los campos Odómetro y Remolque son obligatorios';
    }
    else if (this.odometro == null || this.odometro.trim() == '') {
      return 'El campo Odómetro es obligatorio';
    }
    else if (this.remolque == null || this.remolque.trim() == '') {
      return 'El campo Remolque es obligatorio';
    }
    else if (!/^([0-9])*$/.test(this.odometro)) {
      return 'El campo Odómetro sólo permite números';
    }
    else {
      // this.viewCtrl.dismiss({ km: this.odometro, remolque: this.remolque });
      this.viewCtrl.dismiss();
    }
  }

}
