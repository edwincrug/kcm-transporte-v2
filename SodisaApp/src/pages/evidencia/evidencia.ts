import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Camera, Device, Geolocation } from 'ionic-native';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

import { WebApiProvider } from '../../providers/web-api-provider';

/*
  Generated class for the Evidencia page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-evidencia',
  templateUrl: 'evidencia.html'
})
export class EvidenciaPage {
  base64Image: any = null;
  imagenSend: any = null;
  lat: any;
  lng: any;
  mensaje: string;
  idOrigen;
  idConcentrado;
  userName: string;
  idTipoEntrega: any;
  idDocumento: any;
  idEstatus: any;
  noTracto: string;
  nombre: string;

  constructor(public navCtrl: NavController, public params: NavParams, private loadingCtrl: LoadingController,
    public sodisaService: WebApiProvider, public alertCtrl: AlertController, public toastCtrl: ToastController) {

    this.idOrigen = params.get('origen');
    this.idConcentrado = params.get('concentrado');
    this.userName = params.get('usuario');
    this.idTipoEntrega = params.get('tipoEntrega');
    this.noTracto = params.get('eco');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EvidenciaPage');
  }

  redirectHome() {
    this.navCtrl.setRoot(HomePage, {
      usuario: this.userName,
      nombre: this.nombre,
      eco: this.noTracto
    });
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
    Geolocation.getCurrentPosition()
      .then(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

    let fecha = new Date();
    let fechaEnviada = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes();
    let coordenadas = this.lat + ',' + this.lng;

    if (this.lat == null || this.lng == null) { coordenadas = 'Sin Cobertura'; }

    if (this.idTipoEntrega == 1) {
      this.idDocumento = 0;
      this.idEstatus = 14
    }
    else {
      this.idEstatus = 15
    }

    if (this.imagenSend != null) {
      this.sodisaService.actualizaViaje(this.idOrigen, this.idConcentrado, this.userName, this.idDocumento, this.idEstatus, Device.uuid, fechaEnviada, coordenadas, 0, '', this.imagenSend).subscribe(data => {
        if (data.pResponseCode == 1) {
          let alert = this.alertCtrl.create({
            subTitle: 'Trabajo Terminado',
            buttons: ['OK']
          });
          alert.present();

          this.navCtrl.setRoot(HomePage, {
            usuario: this.userName,
            nombre: this.nombre,
            eco: this.noTracto
          });
        }
        else {
          this.interpretaRespuesta(data);
        }

      }, (err) => {
        alert('Hubo error en cámara');
      });

    }
  }

  interpretaRespuesta(codigoRespuesta) {
    switch (codigoRespuesta.pResponseCode) {
      case -1:
        this.mensaje = "Usuario no registrado";
        break;
      case -2:
        this.mensaje = "Más de un dispositivo asignado";
        break;
      case -3:
        this.mensaje = "Credenciales incorrectas";
        break;
      case -4:
        this.mensaje = "Dispositivo no asignado";
        break;
      case -5:
        this.mensaje = "La sesión expiro";
        break;
      case -8:
        this.mensaje = "Este viaje fue desasignado";
        break;
    }

    let toast = this.toastCtrl.create({
      message: this.mensaje,
      duration: 2000,
      position: 'middle'
    });
    toast.present();

    if (codigoRespuesta.pResponseCode == -5) {
      this.navCtrl.setRoot(LoginPage);
    }
  }

}
