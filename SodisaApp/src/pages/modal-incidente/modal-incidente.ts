import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, Device } from 'ionic-native';

import { WebApiProvider } from '../../providers/web-api-provider';

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
  base64Image;
  imagenSend;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public sodisaService: WebApiProvider) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalIncidentePage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  CapturaEvidencia() {
    let options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    Camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.imagenSend = imageData;

    });
  }

  EnviaEvidencia() {
    if (this.imagenSend != null) {

      this.sodisaService.RegistraParadaIncidente('M54321', 22, 605343, 2, 3, this.imagenSend, 'Con foto', '0,0', '2017-01-20 17:50', Device.uuid).subscribe(data => {
        alert('Todo OK: ' + data.pResponseCode);
      }, (err) => {
        alert('Hubo error en cámara');
      });

    }
  }

}
