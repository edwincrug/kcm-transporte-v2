import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ViajeAsignadoPage } from '../pages/viaje-asignado/viaje-asignado';
import { NuevoViajePage } from '../pages/nuevo-viaje/nuevo-viaje';
import { ModalPage } from '../pages/modal/modal';
import { ModalAccidentePage } from '../pages/modal-accidente/modal-accidente';
import { ViajeAceptadoPage } from '../pages/viaje-aceptado/viaje-aceptado';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core/services/google-maps-api-wrapper';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ViajeAsignadoPage,
    NuevoViajePage,
    ModalPage,
    ModalAccidentePage,
    ViajeAceptadoPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDDkS1LB8ob5FqMWhesQpyGXRmY0tMGZZo',
      libraries: ['places']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ViajeAsignadoPage,
    NuevoViajePage,
    ModalPage,
    ModalAccidentePage,
    ViajeAceptadoPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, GoogleMapsAPIWrapper]
})
export class AppModule { }
