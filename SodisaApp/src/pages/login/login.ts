import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Device } from 'ionic-native';

import { NetworkProvider } from '../../providers/network-provider';
import { LocalDataProvider } from '../../providers/local-data-provider';
import { WebApiProvider } from '../../providers/web-api-provider';

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
  imei: string;
  username: string;
  password: string;
  public credenciales: any;
  mensaje: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    private loadingCtrl: LoadingController, public networkService: NetworkProvider, public dataServices: LocalDataProvider,
    private sodisaService: WebApiProvider) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  validaCredenciales() {
    // this.sodisaService.aceptaRechazaViaje(0, '101010', 'M72580', 0, 3, '6a98398898fe140c').subscribe(data => {
    //     this.credenciales = data;
    // });

    this.imei = Device.uuid;

    let loading = this.loadingCtrl.create({
      content: 'Autenticando...',
      duration: 10000
    });

    if (this.networkService.noConnection()) {
      loading.present();

      this.dataServices.openDatabase()
        .then(() => this.dataServices.checkUsuario(this.username, this.password, this.imei).then(respuesta => {
          loading.dismiss();

          if (respuesta == 'KO') {
            alert('Credenciales incorrectas');
          }
          else {
            let toast = this.toastCtrl.create({
              message: '¡Bienvenido ' + respuesta.Nombre + ' !',
              duration: 1000,
              position: 'middle'
            });
            toast.present();

            this.navCtrl.setRoot(ViajeAsignadoPage, {
              usuario: this.username,
              nombre: respuesta.Nombre,
              eco: respuesta.tracto
            });
          }
        }).catch(error => {
          loading.dismiss();
        }));

    }
    else {
      loading.present();

      // this.sodisaService.login('C55163', 'C55163', 'aa1add0d87db4099').subscribe(data => {
      this.sodisaService.login(this.username, this.password, this.imei).subscribe(data => {
        loading.dismiss();
        this.credenciales = data;
        alert('Viajes en login: ' + data.pListaViajeMovil.length);
        this.interpretaRespuesta(this.credenciales);
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
      case 1:
        this.mensaje = "¡Bienvenido " + codigoRespuesta.pOperadorNombre + ' !';
    }

    let toast = this.toastCtrl.create({
      message: this.mensaje,
      duration: 1000,
      position: 'middle'
    });
    toast.present();

    if (codigoRespuesta.pResponseCode == 1) {
      this.registraUsuario(codigoRespuesta.pIdOperador, this.password, codigoRespuesta.pNumeroEconomicoTractocamion, codigoRespuesta.pOperadorNombre, this.imei);

      this.registraViajesAsignados(codigoRespuesta.pListaViajeMovil);

      this.navCtrl.setRoot(HomePage, {
        usuario: codigoRespuesta.pIdOperador,
        nombre: codigoRespuesta.pOperadorNombre,
        eco: codigoRespuesta.pNumeroEconomicoTractocamion
      });

    }
  }

  registraViajesAsignados(ListaViajes) {
    if (ListaViajes.length > 0) {
      this.dataServices.openDatabase()
        .then(response => {
          this.dataServices.insertaViajesAsignados(ListaViajes);
        });
    }
  }

  registraUsuario(userName, password, noTracto, nombreCompleto, imei) {
    this.dataServices.openDatabase()
      .then(response => {
        this.dataServices.insertaUsuario(userName, password, noTracto, nombreCompleto, imei);
      });
  }


}
