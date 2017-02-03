import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class WebApiProvider {
  //url: string = 'http://dev1.sodisamovil.kcm.com.mx/_WebAPI/Operador/';
  url: string = 'http://www.sodisamovil.kcm.com.mx/_WebAPI/Operador/';
  //url: string = 'http://qa1.sodisamovil.kcm.com.mx/_WebAPI/Operador/';
  data: any;
  parametros: any;

  constructor(public http: Http) {
    this.http = http;
  }

  login(pIdOperador, pPasswordOperador, pIMEI): Observable<any> {
    //let imei = "'" + pIMEI + "'";
    return this.http.get(this.url + 'Login/?strIdOperador=' + pIdOperador + '&strPasswordOperador=' + pPasswordOperador + '&strIdDispositivo=' + pIMEI)
      .map((res: Response) => {
        //alert('Respuesta original: ' + res);
        this.data = res.json();
        //alert('Respuesta con json: ' + this.data);
        return this.data;
      });
  }

  viajesAsignados(pIdOperador, pIMEI): Observable<any> {
    return this.http.get(this.url + 'viajeAsignado/?strIdOperador=' + pIdOperador + '&strIdDispositivo=' + pIMEI)
      .map((res: Response) => {
        //alert('Respuesta original: ' + res);
        this.data = res.json();
        //alert('Respuesta con json: ' + this.data);
        return this.data;
      });
  }

  // viajesAsignados(pIdOperador, pIMEI) {
  //   if (this.data) {
  //     // already loaded data
  //     return Promise.resolve(this.data);
  //   }

  //   // don't have the data yet
  //   return new Promise(resolve => {
  //     this.http.get(this.url + 'viajeAsignado/?strIdOperador=' + pIdOperador + '&strIdDispositivo=' + pIMEI)
  //       .map(res => res.json())
  //       .subscribe(data => {
  //         this.data = data;
  //         resolve(this.data);
  //       });
  //   });
  // }

  aceptaRechazaViaje(idOrigen, idConcentrado, idOperador, idMotivoRechazo, idEstautsViaje, idDispositivo): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let body = "{ intIdOrigenIn: " + idOrigen + ", strIdConcentradoVc: '" + idConcentrado + "', strIdOperadorVc: '" + idOperador
      + "', intIdMotivoRechazoIn: " + idMotivoRechazo + ", intIdEstatusViajeIn: " + idEstautsViaje + ", strIdDispositivo: '" + idDispositivo + "' }";

    return this.http.post(this.url + 'aceptaRechazaViaje', body, options)
      .map((res: Response) => {
        this.data = res.json();
        return this.data;
      });
  }

  actualizaViaje(idOrigen, idConcentrado, idOperador, idDocumento, idEstatusViaje, idDispositivo, fecha, coordenadas, km, noRemolque, evidencia): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let body = "{ intIdOrigenIn: " + idOrigen + ", strIdConcentradoVc: '" + idConcentrado + "', strIdOperadorVc: '" + idOperador
      + "', strIdDocumentoVc: " + idDocumento + ", intIdEstatusViajeIn: " + idEstatusViaje + ", strIdDispositivo: '" + idDispositivo
      + "', datFechaEventoDt: '" + fecha + "', strGeoLocalizacionEventoVc: '" + coordenadas + "', evidenciaFotograficaVc: '" + evidencia
      + "', decKilometrajeEventoDc: " + km + ", strIdNumeroEconomicoRemolqueVc: '" + noRemolque + "' }";

    return this.http.post(this.url + 'actualizaEstatusViaje', body, options)
      .map((res: Response) => {
        this.data = res.json();
        return this.data;
      });
  }

  RegistraParadaIncidente(idOperador, idLocalidad, idConcentrado, idTipoEvento, idEvento, evidencia, observacion, geolocalizacion, fecha, idDispositivo): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let body = "{ strIdOperadorVc: '" + idOperador + "', idLocalidadIn: " + idLocalidad + ", idConcentradoVc: '" + idConcentrado
      + "', idTipoEventoIn: " + idTipoEvento + ", idEventoIn: " + idEvento + ", evidenciaFotograficaBy: '" + evidencia
      + "', observacionVc: '" + observacion + "', geoLocalizacionEventoVc: '" + geolocalizacion + "', fechaEventoDt: '" + fecha
      + "', strIdDispositivo: '" + idDispositivo + "' }";

    // alert('WebApi');

    return this.http.post(this.url + 'recibeParadaOIncidente', body, options)
      .map((res: Response) => {
        this.data = res.json();
        return this.data;
      });
  }

  actualizaViajeEntrega(idOperador, idDispositivo, facturaXML, evidencia): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let body = "{ strIdOperadorVc: '" + idOperador + "', strIdDispositivo: '" + idDispositivo + "', strEvidenciaFotografica: '" + evidencia + "', lstDocumento: " + JSON.stringify(facturaXML) + " }";

    return this.http.post(this.url + 'actualizaEstatusViajeEntrega', body, options)
      .map((res: Response) => {
        this.data = res.json();
        return this.data;
      });
  }
}
