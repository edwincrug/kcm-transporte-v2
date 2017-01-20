import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Http } from '@angular/http';

import { LoginPage } from '../pages/login/login';

import { WebApiProvider } from '../providers/web-api-provider';
import { NetworkProvider } from '../providers/network-provider';
import { LocalDataProvider } from '../providers/local-data-provider';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = null;

  constructor(public platform: Platform, public sodisaService: WebApiProvider, public dataServices: LocalDataProvider,
    public http: Http) {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.dataServices.openDatabase()
        .then(() => this.dataServices.createTableUsuario())
        .then(() => this.dataServices.createTableViaje())
        .then(() => this.dataServices.createTableViajeDetalle())
        .then(() => this.dataServices.createTableViajeSync())
        .then(() => {
          this.rootPage = LoginPage;
        });

      let wsSodisa = new WebApiProvider(this.http);
      document.addEventListener("online", function () {
        let dbService = new LocalDataProvider();

        dbService.openDatabase()
          .then(() => {
            dbService.viajesPorSincronizar().then(result => {
              // alert('Viajes por sincronizar: ' + result.length);

              if (result.length > 0) {
                for (let x = 0; x < result.length; x++) {

                  if (result[x].idEstatus == 3 || result[x].idEstatus == 4) {
                    wsSodisa.aceptaRechazaViaje(result[x].idOrigen, result[x].idConcentrado, result[x].idOperador, result[x].idMotivoRechazo, result[x].idEstatus, result[x].idDispositivo).subscribe(resp => {
                      if (resp.pResponseCode == 1) {
                        // alert('Server actualizado');
                        dbService.eliminaViajeSync(result[x].idViajeSync).then(() => {
                          if (result[x].idEstatus == 4) {
                            dbService.eliminaViajeLocal(result[x].idViaje).then(() => {
                              // alert('Eliminado Local');
                            });
                          }
                        }).catch(() => {
                          // alert('Local no eliminado');
                        });
                      }
                      else {

                      }
                    });
                  }
                  else if (result[x].idEstatus == 5 || result[x].idEstatus == 6) {
                    wsSodisa.actualizaViaje(result[x].idOrigen, result[x].idConcentrado, result[x].idOperador, 0, result[x].idEstatus, result[x].idDispositivo, result[x].fecha, result[x].geolocalizacion, '', '').subscribe(resp => {
                      if (resp.pResponseCode == 1) {
                        // alert('Server actualizado');
                        dbService.eliminaViajeSync(result[x].idViajeSync).then(() => {
                          if (result[x].idEstatus == 6) {
                            dbService.eliminaViajeLocal(result[x].idViaje).then(() => {
                              // alert('Eliminado Local');
                            });
                          }
                        }).catch(() => {
                          // alert('Local no eliminado');
                        });
                      }
                      else {
                        // alert('No lo afecto pero hay comunicactión');
                      }
                    });
                  }
                }
              }

            });
          });

      }, false);

    });

  }

}
