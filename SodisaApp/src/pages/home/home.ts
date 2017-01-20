import { Component } from '@angular/core';
import { Geolocation, Device, Camera, Transfer } from 'ionic-native';
import { NavController, Platform, NavParams, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { NuevoViajePage } from '../nuevo-viaje/nuevo-viaje';
import { ViajeAsignadoPage } from '../viaje-asignado/viaje-asignado';
import { ModalPage } from '../modal/modal';
import { ModalAccidentePage } from '../modal-accidente/modal-accidente';
import { SincronizacionPage } from '../sincronizacion/sincronizacion';
import { ModalParadasPage } from '../modal-paradas/modal-paradas';
import { ModalIncidentePage } from '../modal-incidente/modal-incidente';
import { ViajeTerminadoPage } from '../viaje-terminado/viaje-terminado';
import { EvidenciaPage } from '../evidencia/evidencia';
import { DocumentacionPage } from '../documentacion/documentacion';
import { LoginPage } from '../login/login';

import { LocalDataProvider } from '../../providers/local-data-provider';
import { NetworkProvider } from '../../providers/network-provider';
import { WebApiProvider } from '../../providers/web-api-provider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  aceptado: any;
  slots: boolean = true;
  remolque: string = "remolque1";
  listaViajesLocales: any[] = [];
  imei: string;
  username: string;
  mensaje: string;
  nombre: string;
  economico: string;
  idRechazoSelected;
  lat: any;
  lng: any;

  constructor(public navCtrl: NavController, private platform: Platform, public params: NavParams,
    public modalCtrl: ModalController, private loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public dataServices: LocalDataProvider, public networkService: NetworkProvider, public sodisaService: WebApiProvider,
    public toastCtrl: ToastController) {

    this.username = params.get('usuario');
    this.nombre = params.get('nombre');
    this.economico = params.get('eco');

    Geolocation.getCurrentPosition()
      .then(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

    this.loadMap();
    this.map = { lat: 0, lng: 0, zoom: 15 };

    if (params.get('aceptado') != null) {
      this.aceptado = params.get('aceptado');
    }

    console.log('Valor aceptad: ' + this.aceptado);
  }

  ionViewWillEnter() {
    let loading = this.loadingCtrl.create({
      content: 'Obteniendo información...'
    });

    loading.present();

    setTimeout(() => {
      this.obtieneViajesInternos();
      loading.dismiss();
    }, 2000);
  }

  obtieneViajesInternos() {
    this.dataServices.openDatabase()
      .then(() => this.dataServices.checkViajesAsignados().then(response => {
        if (response.length > 0) {
          this.listaViajesLocales = response;
          alert('Total Viajes: ' + this.listaViajesLocales.length);
        }
        else {
          this.listaViajesLocales = [];
          alert('Total Viajes: ' + this.listaViajesLocales.length);
        }
      }));
  }

  AceptaViaje(idViaje, idOrigen, idConcentrado, indice) {
    this.imei = Device.uuid;

    // let loading = this.loadingCtrl.create({
    //   content: 'Espere por favor ...'
    // });    

    if (this.networkService.noConnection()) {
      // loading.present();
      this.dataServices.insertaAceptaRechazaViajeSync(idViaje, idOrigen, idConcentrado, this.username, 0, 3, this.imei).then(() => {
        // loading.dismiss();
        this.dataServices.actualizaViajeLocal(3, 0, idViaje, '', '').then(response => {
          let alert = this.alertCtrl.create({
            subTitle: 'Viaje Aceptado',
            buttons: ['OK']
          });
          alert.present();

          this.obtieneViajesInternos();
        });
      }).catch(error => {
        // loading.dismiss();
      });
    }
    else {
      // this.sodisaService.aceptaRechazaViaje(idOrigen, idConcentrado, 'C55163', 0, 3, 'aa1add0d87db4099').subscribe(data => {
      this.sodisaService.aceptaRechazaViaje(idOrigen, idConcentrado, this.username, 0, 3, this.imei).subscribe(data => {
        // loading.dismiss();
        if (data.pResponseCode == 1) {
          this.dataServices.openDatabase()
            .then(() => this.dataServices.actualizaViajeLocal(3, 0, idViaje, 0, '').then(response => {
              let alert = this.alertCtrl.create({
                subTitle: 'Viaje Aceptado',
                buttons: ['OK']
              });
              alert.present();

              this.obtieneViajesInternos();
            }));
        }
        else {
          this.interpretaRespuesta(data);

          if (data.pResponseCode == -8) {
            this.EliminaViajeDesasociado(idViaje, 0);
          }

          this.obtieneViajesInternos();
        }
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

    if (codigoRespuesta.pResponseCode == 1) {
      this.navCtrl.push(ViajeAsignadoPage);
    }
    else if (codigoRespuesta.pResponseCode == -5) {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  EliminaViajeDesasociado(idViaje, idViajeSync) {
    this.dataServices.openDatabase()
      .then(() => {

        this.dataServices.eliminaViajeLocal(idViaje).then(() => {
          // alert('Eliminado Local');
        });

        this.dataServices.eliminaViajeSync(idViajeSync).then(() => {
          //alert('Eliminado sync');
        });
      });
  }

  MuestraMotivos(idViaje, idOrigen, idConcentrado) {
    this.imei = Device.uuid;
    let alert = this.alertCtrl.create();
    alert.setTitle('Motivos de Rechazo');

    alert.addInput({
      type: 'radio',
      label: 'Salud del operador',
      value: '1',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Día de descanso',
      value: '2',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Negativa del Operador',
      value: '3',
      checked: false
    });

    alert.addButton('Cerrar');
    alert.addButton({
      text: 'Aceptar',
      handler: data => {
        this.idRechazoSelected = data;

        if (this.idRechazoSelected != null) {
          this.RechazaViaje(idViaje, idOrigen, idConcentrado);
        }

      }
    });

    alert.present();

  }

  RechazaViaje(idViaje, idOrigen, idConcentrado) {

    //  let loading = this.loadingCtrl.create({
    //     content: 'Espere por favor ...'
    //   });

    //   loading.present();

    if (this.networkService.noConnection()) {
      this.dataServices.insertaAceptaRechazaViajeSync(idViaje, idOrigen, idConcentrado, this.username, this.idRechazoSelected, 4, Device.uuid).then(() => {
        this.dataServices.actualizaViajeLocal(4, this.idRechazoSelected, idViaje, '', '').then(response => {
          let alert = this.alertCtrl.create({
            subTitle: 'Viaje Rechazado',
            buttons: ['OK']
          });
          alert.present();

          this.obtieneViajesInternos();
        });
      });
    }
    else {
      this.sodisaService.aceptaRechazaViaje(idOrigen, idConcentrado, this.username, this.idRechazoSelected, 4, Device.uuid).subscribe(data => {
        // this.sodisaService.aceptaRechazaViaje(idOrigen, idConcentrado, 'C55163', this.idRechazoSelected, 4, 'aa1add0d87db4099').subscribe(data => {
        if (data.pResponseCode == 1) {
          this.dataServices.openDatabase()
            .then(() => this.dataServices.eliminaViajeLocal(idViaje).then(response => {
              let alert = this.alertCtrl.create({
                subTitle: 'Viaje Rechazado',
                buttons: ['OK']
              });
              alert.present();

              this.obtieneViajesInternos();
            }));
        }
        else {
          this.interpretaRespuesta(data);

          if (data.pResponseCode == -8) {
            this.EliminaViajeDesasociado(idViaje, 0);
          }
          this.obtieneViajesInternos();
        }

      });
    }
  }

  IniciarViaje(idViaje, idOrigen, idConcentrado, noEconomico, km, noRemolque) {
    Geolocation.getCurrentPosition()
      .then(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

    let fecha = new Date();
    let fechaEnviada = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes();
    let coordenadas = this.lat + ',' + this.lng;

    if (this.lat == null || this.lng == null) { coordenadas = 'Sin Cobertura'; }

    if (this.networkService.noConnection()) {
      this.dataServices.insertaIniciaTerminaViajeSync(idViaje, idOrigen, idConcentrado, this.username, 0, 5, Device.uuid, coordenadas, fechaEnviada, km, noRemolque).then(() => {
        this.dataServices.actualizaViajeLocal(5, 0, idViaje, km, noRemolque).then(response => {
          let alert = this.alertCtrl.create({
            subTitle: 'Viaje Iniciado',
            buttons: ['OK']
          });
          alert.present();

          this.obtieneViajesInternos();
        });
      });
    }
    else {
      this.sodisaService.actualizaViaje(idOrigen, idConcentrado, this.username, 0, 5, Device.uuid, fechaEnviada, coordenadas, km, noRemolque).subscribe(data => {
        // this.sodisaService.actualizaViaje(idOrigen, idConcentrado, 'C55163', 0, 5, 'aa1add0d87db4099', fechaEnviada, coordenadas).subscribe(data => {
        if (data.pResponseCode == 1) {
          this.dataServices.openDatabase()
            .then(() => this.dataServices.actualizaViajeLocal(5, 0, idViaje, km, noRemolque).then(response => {
              let alert = this.alertCtrl.create({
                subTitle: 'Viaje Iniciado',
                buttons: ['OK']
              });
              alert.present();

              this.obtieneViajesInternos();
            }));
        }
        else {
          this.interpretaRespuesta(data);

          if (data.pResponseCode == -8) {
            this.EliminaViajeDesasociado(idViaje, 0);
          }

          this.obtieneViajesInternos();
        }

      });
    }
  }

  TerminarViaje(idViaje, idOrigen, idConcentrado, indice) {
    Geolocation.getCurrentPosition()
      .then(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

    let fecha = new Date();
    let fechaEnviada = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes();
    let coordenadas = this.lat + ',' + this.lng;

    if (this.lat == null || this.lng == null) { coordenadas = 'Sin Cobertura'; }

    if (this.networkService.noConnection()) {
      this.dataServices.insertaIniciaTerminaViajeSync(idViaje, idOrigen, idConcentrado, this.username, 0, 6, Device.uuid, coordenadas, fechaEnviada, '', '').then(() => {
        this.dataServices.actualizaViajeLocal(6, 0, idViaje, '', '').then(response => {
          let alert = this.alertCtrl.create({
            subTitle: 'Viaje Terminado',
            buttons: ['OK']
          });
          alert.present();

          this.obtieneViajesInternos();
        });
      });
    }
    else {
      this.sodisaService.actualizaViaje(idOrigen, idConcentrado, this.username, 0, 6, Device.uuid, fechaEnviada, coordenadas, '', '').subscribe(data => {
        // this.sodisaService.actualizaViaje(idOrigen, idConcentrado, 'C55163', 0, 6, 'aa1add0d87db4099', fechaEnviada, coordenadas).subscribe(data => {
        if (data.pResponseCode == 1) {
          this.dataServices.openDatabase()
            .then(() => this.dataServices.eliminaViajeLocal(idViaje).then(response => {
              let alert = this.alertCtrl.create({
                subTitle: 'Viaje Terminado',
                buttons: ['OK']
              });
              alert.present();

              this.obtieneViajesInternos();
            }));
        }
        else {
          this.interpretaRespuesta(data);

          if (data.pResponseCode == -8) {
            this.EliminaViajeDesasociado(idViaje, 0);
          }

          this.obtieneViajesInternos();
        }
      });
    }
  }

  // showPrompt(noEconomico) {
  //   let prompt = this.alertCtrl.create({
  //     subTitle: 'Iniciar Viaje',
  //     message: "",
  //     inputs: [
  //       {
  //         name: 'odometro',
  //         placeholder: 'Odómetro'
  //       },
  //       {
  //         name: 'remolque',
  //         placeholder: 'Remolque',
  //         value: noEconomico
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Iniciar Viaje',
  //         cssClass: 'customButton',
  //         handler: data => {
  //           let respMsg = this.validarDatos(data.odometro, data.remolque);
  //           if (respMsg != 'OK') {
  //             let toast = this.toastCtrl.create({
  //               message: respMsg,
  //               duration: 2000,
  //               position: 'middle'
  //             });
  //             toast.present();
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   prompt.present();
  // }

  validarDatos(km, remolque) {
    let respuesta = '';

    if ((km == null || km.trim() == '') && (remolque == null || remolque.trim() == '')) {
      return 'Los campos Odómetro y Remolque son obligatorios';
    }
    else if (km == null || km.trim() == '') {
      return 'El campo Odómetro es obligatorio';
    }
    else if (remolque == null || remolque.trim() == '') {
      return 'El campo Remolque es obligatorio';
    }
    else if (!/^([0-9])*$/.test(km)) {
      return 'El campo Odómetro sólo permite números';
    }
    else {
      return 'OK';
    }
  }

  OpenModal(idViaje, idOrigen, idConcentrado, economico) {
    let modal = this.modalCtrl.create(ModalPage);
    modal.present();

    modal.onDidDismiss(res => {
      if (res.km != 0 && res.remolque != 0) {
        this.IniciarViaje(idViaje, idOrigen, idConcentrado, economico, res.km, res.remolque);
      }
    });
  }

  OpenParadas(idViaje, idOrigen, idConcentrado) {
    Geolocation.getCurrentPosition()
      .then(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

    let coordenadas = this.lat + ',' + this.lng;
    if (this.lat == null || this.lng == null) { coordenadas = 'Sin Cobertura'; }

    let fecha = new Date();
    let fechaEnviada = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes();

    let options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      // destinationType: 0,
      sourceType: 1,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true  //Corrects Android orientation quirks
    }

    Camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      // fileTransfer.upload(imageData, 'http://dev1.sodisamovil.kcm.com.mx/_WebAPI/Operador/recibeParadaOIncidente', )
      //   .then((data) => {
      //     // success
      //   }, (err) => {
      //     // error
      //   })

      // let cadena = 'Solo Cadena!';

      // // Encode the String
      // let encodedString = btoa(cadena);


      this.sodisaService.RegistraParadaIncidente('M54321', idOrigen, idConcentrado, 1, 1, imageData, 'Con foto', coordenadas, fechaEnviada, Device.uuid).subscribe(data => {
        alert('Todo OK: ' + data.pResponseCode);
      });
    }, (err) => {
      alert('Hubo error en cámara');
    });


  }

  ViajesAsignados() {
    this.navCtrl.setRoot(ViajeAsignadoPage);
  }


  //////////////////////////////////////////////////////////////////////////////

  ViajeDetalle() {
    this.navCtrl.setRoot(NuevoViajePage);
  }

  loadMap() {
    Geolocation.getCurrentPosition().then((position) => {
      this.map =
        {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 15
        };
    }).catch((error) => {
      this.map =
        {
          lat: 19.438029,
          lng: -99.2118746,
          zoom: 15
        };
    });
  }



  viajeTracking() {
    this.navCtrl.setRoot(NuevoViajePage);
  }

  redirectSync() {
    this.navCtrl.setRoot(SincronizacionPage);;
  }

  terminaViaje() {
    this.navCtrl.setRoot(ViajeTerminadoPage);
  }

  openParadas() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Paradas en ruta');

    alert.addInput({
      type: 'radio',
      label: 'Carga de combustible',
      value: '1',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Manifestación',
      value: '2',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Mal clima',
      value: '3',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Comida',
      value: '4',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Descanso',
      value: '5',
      checked: false
    });

    alert.addButton('Cerrar');
    alert.addButton({
      text: 'Aceptar',
      handler: data => {

        let modal = this.modalCtrl.create(ModalParadasPage);
        modal.present();

      }
    });

    alert.present();
  }

  startManionbra() {
    let loading = this.loadingCtrl.create({
      content: 'Maniobra iniciada ...',
      duration: 2000
    });

    loading.present();
  }

  finishManiobra() {
    let confirm = this.alertCtrl.create({
      subTitle: '¿Se realiza entrega de mercancía?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.setRoot(EvidenciaPage);
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.navCtrl.setRoot(DocumentacionPage);
          }
        }
      ]
    });
    confirm.present();
  }

  showAnden() {
    let loading = this.loadingCtrl.create({
      content: 'Puesta en andén ...',
      duration: 2000
    });

    loading.present();
  }

  openIncidentes() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Incidentes');

    alert.addInput({
      type: 'radio',
      label: 'Bloqueo de tarjeta Iave',
      value: '6',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Desvió de ruta',
      value: '7',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Falla mecánica',
      value: '8',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Intento de robo',
      value: '9',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: 'Siniestro Unidad',
      value: '10',
      checked: false
    });

    alert.addButton('Cerrar');
    alert.addButton({
      text: 'Aceptar',
      handler: data => {

        let modal = this.modalCtrl.create(ModalIncidentePage);
        modal.present();

      }
    });

    alert.present();
  }



}