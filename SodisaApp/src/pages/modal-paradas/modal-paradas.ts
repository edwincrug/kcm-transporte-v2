import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, Device } from 'ionic-native';

import { WebApiProvider } from '../../providers/web-api-provider';

/*
  Generated class for the ModalParadas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-paradas',
  templateUrl: 'modal-paradas.html'
})
export class ModalParadasPage {
  base64Image;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public sodisaService: WebApiProvider) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalParadasPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  CapturaEvidencia() {
    let options = {
      quality: 50,
      destinationType: Camera.DestinationType.NATIVE_URI,
      // destinationType: 0,
      sourceType: 1,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true  //Corrects Android orientation quirks
    }

    Camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;

    });
  }

  EnviaEvidencia() {
    Camera.getPicture({
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.DATA_URL
    }).then((imageData) => {

      this.sodisaService.RegistraParadaIncidente('M54321', 22, 605343, 1, 1, imageData, 'Con foto', '0,0', '2017-01-20 17:50', Device.uuid).subscribe(data => {
        alert('Todo OK: ' + data.pResponseCode);
      }, (err) => {
        alert('Hubo error en cámara');
      });

    }, (err) => {
      console.log(err);
    });
  }

}
