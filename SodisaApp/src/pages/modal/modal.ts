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
  odometro: string;
  remolque: string;
  tipoOdometro: string;

  constructor(public navCtrl: NavController, public params: NavParams, public viewCtrl: ViewController) {
    this.remolque = params.get('noRemolque');

    if (params.get('idTipoOdometro') == 1) {
      this.tipoOdometro = 'Inicial';
    }
    else {
      this.tipoOdometro = 'Final';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss({ km: 0, remolque: 0 });
  }

  validarDatos() {
    if ((this.odometro == null || this.odometro.trim() == '') && (this.remolque == null || this.remolque.trim() == '')) {
      alert('Los campos Odómetro y Remolque son obligatorios');
    }
    else if (this.odometro == null || this.odometro.trim() == '') {
      alert('El campo Odómetro es obligatorio');
    }
    else if (this.remolque == null || this.remolque.trim() == '') {
      alert('El campo Remolque es obligatorio');
    }
    else if (!/^([0-9])*$/.test(this.odometro)) {
      alert('El campo Odómetro sólo permite números');
    }
    else {
      this.viewCtrl.dismiss({ km: this.odometro, remolque: this.remolque });
    }
  }

}
