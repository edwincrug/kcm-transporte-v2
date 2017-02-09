import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { WebApiProvider } from '../../providers/web-api-provider';
import { LocalDataProvider } from '../../providers/local-data-provider';
import { Http } from '@angular/http';


/*
  Generated class for the Sincronizacion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-sincronizacion',
  templateUrl: 'sincronizacion.html'
})
export class SincronizacionPage {
  username: any;
  nombre: string;
  economico: any;
  listaViajesPorSincronizar: any[] = [];
  listaIncidentesPorSincronizar = [];
  imagen: any[] = [];
  ultimaFecha: string;

  constructor(public navCtrl: NavController, public params: NavParams, private loadingCtrl: LoadingController, public dataServices: LocalDataProvider, public sodisaService: WebApiProvider, public http: Http) {
    this.username = params.get('usuario');
    this.nombre = params.get('nombre');
    this.economico = params.get('eco');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SincronizacionPage');
    this.ObtieneUltimoSincronizar();
    this.ObtieneViajesPorSincronizar();
    this.ObtieneIncidentesPorSincronizar();
  }

  redirectHome() {
    this.navCtrl.setRoot(HomePage, {
      usuario: this.username,
      nombre: this.nombre,
      eco: this.economico
    });
  }

  sincronizaViajes() {
    /*let loading = this.loadingCtrl.create({
      content: '¡ Información sincronizada !',
      duration: 2000
    });

    loading.present();*/
    /*-------------------------------------------------------------------------------------*/
    /*--Sincronizo--*/
    let loading = this.loadingCtrl.create({
      content: 'Sincronizando...'
    });
    loading.present();
    let fecha = new Date();
    let fechaEnviada = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + ' ' + fecha.getHours() + ':' + fecha.getMinutes();
    console.log(fechaEnviada);
    let wsSodisa = new WebApiProvider(this.http);
    let lstDocumento = [];
    this.dataServices.openDatabase()
      .then(() => {
        this.dataServices.viajesPorSincronizar().then(result => {
          // alert('Viajes por sincronizar: ' + result.length);

          if (result.length > 0) {
            for (let x = 0; x < result.length; x++) {

              if (result[x].idEstatus == 3 || result[x].idEstatus == 4 || result[x].idEstatus == 9 || result[x].idEstatus == 10) {
                wsSodisa.aceptaRechazaViaje(result[x].idOrigen, result[x].idConcentrado, result[x].idOperador, result[x].idMotivoRechazo, result[x].idEstatus, result[x].idDispositivo).subscribe(resp => {
                  if (resp.pResponseCode == 1) {
                    // alert('Server actualizado');
                    this.dataServices.eliminaViajeSync(result[x].idViajeSync).then(() => {
                      if (result[x].idEstatus == 4) {
                        this.dataServices.eliminaViajeLocal(result[x].idViaje).then(() => {
                          // alert('Eliminado Local');
                        });
                      }
                      /*INICIO Inserto la fecha */
                      this.dataServices.insertaUltimaActualizacion(fechaEnviada).then(() => {
                        console.log('Inserto la fecha ')

                      });
                      /*TERMINA Inserto la fecha */
                    }).catch(() => {
                      // alert('Local no eliminado');
                    });
                  }
                  else {

                  }
                });
              }
              else if (result[x].idEstatus == 5 || result[x].idEstatus == 6 || result[x].idEstatus == 7 || result[x].idEstatus == 11 || result[x].idEstatus == 12 || result[x].idEstatus == 13 || result[x].idEstatus == 14 || result[x].idEstatus == 15) {
                if (result[x].idEstatus == 15) {

                  this.dataServices.getViajeDetalleSync(result[x].idViaje).then(res => {
                    if (res.length > 0) {
                      for (let j = 0; j < res.length; j++) {
                        let detalleDocumento = {
                          pIdOperadorVc: res[j].idOperador,
                          pIdDispositvoVc: res[j].idDispositivo,
                          pIdLocalidadIn: res[j].idLocalidad,
                          pIdDestinoIn: res[j].cliente,
                          pIdConcentradoVc: res[j].idConcentrado,
                          pIdClienteAnteriorIn: res[j].clienteAnterior,
                          pIdConsignatarioIn: res[j].consignatario,
                          pIdDocumentoVc: res[j].idDocumento,
                          pIdEstatusViajeIn: res[j].idEstatus,
                          pEvidenciaFotograficaVc: res[j].evidencia,
                          pFechaEventoDt: res[j].fecha,
                          pGeoLocalizacionEventoVc: res[j].coordenadas
                        }

                        lstDocumento.push(detalleDocumento);
                      }

                      wsSodisa.actualizaViajeEntrega(result[x].idOperador, result[x].idDispositivo, lstDocumento, result[x].evidencia).subscribe(data => {
                        if (data.pResponseCode == 1) {
                          this.dataServices.eliminaViajeSync(result[x].idViajeSync).then(() => {
                            this.dataServices.eliminaViajeLocal(result[x].idViaje).then(() => {
                              this.dataServices.eliminaViajeDetalleSync(result[x].idViaje).then(() => {

                              })
                            });
                          }).catch(() => {
                            // alert('Local no eliminado');
                          });
                        }
                        else {

                        }
                      }, (err) => {
                        // alert('Error webapi: ' + err);
                      });
                      /*INICIO Inserto la fecha */
                      this.dataServices.insertaUltimaActualizacion(fechaEnviada).then(() => {
                        console.log('Inserto la fecha ')

                      });
                      /*TERMINA Inserto la fecha */
                    }
                  });

                }
                else {
                  wsSodisa.actualizaViaje(result[x].idOrigen, result[x].idConcentrado, result[x].idOperador, 0, result[x].idEstatus, result[x].idDispositivo, result[x].fecha, result[x].geolocalizacion, result[x].odometro, result[x].remolque, result[x].evidencia).subscribe(resp => {
                    if (resp.pResponseCode == 1) {
                      // alert('Server actualizado');
                      this.dataServices.eliminaViajeSync(result[x].idViajeSync).then(() => {
                        this.dataServices.eliminaViajeLocal(result[x].idViaje).then(() => {
                          // alert('Eliminado Local');
                        });
                      }).catch(() => {
                        // alert('Local no eliminado');
                      });
                      /*INICIO Inserto la fecha */
                      this.dataServices.insertaUltimaActualizacion(fechaEnviada).then(() => {
                        console.log('Inserto la fecha ')

                      });
                      /*TERMINA Inserto la fecha */
                    }
                    else {
                      // alert('No lo afecto pero hay comunicactión');
                    }
                  });
                }

              }
            }
          }

        });
      })
      .then(() => {
        this.dataServices.paradasIncidentesPorSincronizar().then(result => {

          for (let x = 0; x < result.length; x++) {

            wsSodisa.RegistraParadaIncidente(result[x].idOperador, result[x].idLocalidad, result[x].idConcentrado, result[x].idTipoEvento, result[x].idEvento, result[x].evidencia, result[x].observacion, result[x].geolocalizacion, result[x].fecha, result[x].idDispositivo).subscribe(data => {
              if (data.pResponseCode == 1) {
                this.dataServices.eliminaParadaIncidenteSync(result[x].idParadaIncidenteSync).then(() => {
                  //Elimina parada/incidente local
                }).catch(() => {
                  // alert('Local no eliminado');
                });
                /*INICIO Inserto la fecha */
                this.dataServices.insertaUltimaActualizacion(fechaEnviada).then(() => {
                  console.log('Inserto la fecha ')

                });
                /*TERMINA Inserto la fecha */
              }
            }, (err) => {
              alert('Error al sincronizar parada/incidente');
            });

          }
          loading.dismiss();
          this.redirectHome();
        });
      });
  }
  /*-------------------------------------------------------------------------------------*/
  /*--Obtengo los procesos guardados de manera local mientras el celular no tiene datos--*/
  ObtieneViajesPorSincronizar() {
    this.dataServices.openDatabase()
      .then(() => this.dataServices.viajesPorSincronizar().then(response => {
        if (response.length > 0) {
          this.listaViajesPorSincronizar = response;
          console.log(this.listaViajesPorSincronizar);
        }
        else {
          this.listaViajesPorSincronizar = [];
        }
      }));
  }
  /*---------------------------------------------------------------------------------------*/
  /*--Obtengo las evidencias guardadas de manera local mientras el celular no tiene datos--*/
  ObtieneIncidentesPorSincronizar() {
    this.dataServices.openDatabase()
      .then(() => this.dataServices.paradasIncidentesPorSincronizar().then(response => {
        if (response.length > 0) {
          this.listaIncidentesPorSincronizar = response;
          this.listaIncidentesPorSincronizar.forEach(element => {
            if (element.idTipoEvento == 1) {
              switch (element.idEvento) {
                case 1:
                  element.mensajeEvidencia = "Carga de combustible";
                  break;
                case 2:
                  element.mensajeEvidencia = "Manifestación";
                  break;
                case 3:
                  element.mensajeEvidencia = "Mal clima";
                  break;
                case 4:
                  element.mensajeEvidencia = "Comida";
                  break;
                case 5:
                  element.mensajeEvidencia = "Descanso";
                  break;
                case 6:
                  element.mensajeEvidencia = "Otro";
                  break;
              }
              element.evidencia = "data:image/jpeg;base64," + element.evidencia;
            }
            else if (element.idTipoEvento == 2) {
              switch (element.idEvento) {
                case 1:
                  element.mensajeEvidencia = 'Bloqueo de tarjeta Iave';
                  break;
                case 2:
                  element.mensajeEvidencia = 'Desvio de ruta';
                  break;
                case 3:
                  element.mensajeEvidencia = 'Falla mecánica';
                  break;
                case 4:
                  element.mensajeEvidencia = 'Intento de robo';
                  break;
                case 5:
                  element.mensajeEvidencia = 'Siniestro unidad';
                  break;
                case 6:
                  element.mensajeEvidencia = 'Otro';
                  break;
              }
              element.evidencia = "data:image/jpeg;base64," + element.evidencia;
            }

            console.log('entre');
            console.log(element.tipoEvidencia, 'es el elemnto ');
          });

          console.log(this.listaIncidentesPorSincronizar);
        }
        else {
          this.listaIncidentesPorSincronizar = [];
        }
      }));
  }
  /*-------------------------------------------------------------------------------------*/
  /*--Obtengo la ultima sicronización--*/
  ObtieneUltimoSincronizar() {
    console.log('Si entre en la Sincronizacion')
    this.dataServices.openDatabase()
      .then(() => this.dataServices.getUltimaActualizacion().then(response => {
        console.log(response.fecha, 'La respuesta de el QUERY');
        if (response != undefined) {
          this.ultimaFecha = response.fecha;
          console.log(this.ultimaFecha, 'Soy la fecha');

        } else {
          this.ultimaFecha = "Sin fecha";
          console.log(this.ultimaFecha, 'Soy la fecha');
        }

      }));
  }
}
