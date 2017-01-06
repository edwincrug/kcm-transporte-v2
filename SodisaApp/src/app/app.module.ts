import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ViajeAsignadoPage } from '../pages/viaje-asignado/viaje-asignado';
import { NuevoViajePage } from '../pages/nuevo-viaje/nuevo-viaje';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ViajeAsignadoPage,
    NuevoViajePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ViajeAsignadoPage,
    NuevoViajePage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
