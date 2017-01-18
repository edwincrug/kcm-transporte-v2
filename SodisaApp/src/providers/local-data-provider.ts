import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

import 'rxjs';
import 'rxjs/add/operator/map';


@Injectable()
export class LocalDataProvider {
  db: SQLite = null;
  hayViajes: any[] = [];
  sqlQuery: string;

  constructor() {
    this.db = new SQLite();
  }

  openDatabase() {
    return this.db.openDatabase({
      name: 'sodisa.db',
      location: 'default' // the location field is required      
    });
  }

  createTableUsuario() {
    let sql = 'CREATE TABLE IF NOT EXISTS Usuario(idUsuario INTEGER PRIMARY KEY AUTOINCREMENT, nombreCompleto TEXT, imei TEXT, userName TEXT, password TEXT, estatus INTEGER, tracto TEXT); ';
    return this.db.executeSql(sql, []);
  }

  createTableViaje() {
    let sql = 'CREATE TABLE IF NOT EXISTS Viaje(idViaje INTEGER PRIMARY KEY AUTOINCREMENT, idOrigen INTEGER, origenNombre TEXT, idConcentrado TEXT, tipoViaje INTEGER, economico TEXT, odometro INTEGER, idEstatus INTEGER, idUsuario INTEGER, idRechazo INTEGER, geolocalizacion TEXT, destino TEXT, horasDistancia INTEGER, kilometrosDistancia INTEGER); ';
    return this.db.executeSql(sql, []);
  }

  createTableViajeDetalle() {
    let sql = 'CREATE TABLE IF NOT EXISTS ViajeDetalle(idViajeDetalle INTEGER PRIMARY KEY AUTOINCREMENT, idViaje INTEGER, idDestino TEXT, destinoNombre TEXT, idEstatus INTEGER, idDocumento TEXT, fechaDocumento TEXT, geolocalizacion TEXT); ';
    return this.db.executeSql(sql, []);
  }

  createTableViajeSync() {
    let sql = 'CREATE TABLE IF NOT EXISTS ViajeSync(idViajeSync INTEGER PRIMARY KEY AUTOINCREMENT, idViaje INTEGER, idOrigen INTEGER, idConcentrado TEXT, idOperador TEXT,  idMotivoRechazo INTEGER,  odometro INTEGER, idEstatus INTEGER, idDispositivo TEXT, geolocalizacion TEXT, idDocumento TEXT, fecha TEXT); ';
    return this.db.executeSql(sql, []);
  }

  getAll() {
    let sql = 'SELECT * FROM Usuario';
    return this.db.executeSql(sql, [])
      .then(response => {
        let tasks = [];
        for (let index = 0; index < response.rows.length; index++) {
          tasks.push(response.rows.item(index));
        }
        return Promise.resolve(tasks);
      })
  }

  create(task: any) {
    let sql = 'INSERT INTO tasks(title, completed) VALUES(?,?)';
    return this.db.executeSql(sql, [task.title, task.completed]);
  }

  checkUsuario(usuario, pwd, imei) {
    let sql = 'SELECT nombreCompleto AS Nombre, tracto FROM Usuario WHERE userName = ? AND password = ? AND imei = ?';
    return this.db.executeSql(sql, [usuario, pwd, imei])
      .then(response => {
        if (response.rows.length > 0) {
          return Promise.resolve(response.rows.item(0));
        }
        else {
          return Promise.resolve('KO');
        }
      }).catch(error => {
        return Promise.resolve('KO');
      });
  }

  checkViajesAsignados() {
    let sql = 'SELECT * FROM Viaje WHERE Viaje.idEstatus IN (2, 3, 5)';
    return this.db.executeSql(sql, [])
      .then(response => {
        let hayViajes = [];
        for (let index = 0; index < response.rows.length; index++) {
          hayViajes.push(response.rows.item(index));
        }
        return Promise.resolve(hayViajes);
      });
  }

  insertaViajesAsignados(travels) {
    for (let x = 0; x < travels.length; x++) {
      let evitaDuplicadosQuery = "SELECT COUNT(*) AS Existe FROM Viaje WHERE idOrigen = ? AND idConcentrado = ?";
      this.db.executeSql(evitaDuplicadosQuery, [travels[x].pIdOrigen, travels[x].pIdConcentradoVc]).then(respuesta => {
        let existe = respuesta.rows.item(0).Existe;
        if (existe == 0) {
          this.sqlQuery = "INSERT INTO Viaje (idOrigen, origenNombre, idConcentrado, tipoViaje, economico, odometro, idEstatus, idUsuario, idRechazo, geolocalizacion, horasDistancia, kilometrosDistancia) VALUES (" +
            travels[x].pIdOrigen + ", '" +
            travels[x].pOrigenNombre + "', '" +
            travels[x].pIdConcentradoVc + "', " +
            travels[x].pIdTipoViaje + ", '" +
            travels[x].pNumeroEconomicoRemolque + "', " +
            travels[x].pOdometro + ", " +
            travels[x].pIdEstatus + ", 1, 0, '" +
            travels[x].pGeoLocalizacionOrigen + "', " +
            travels[x].pHorasDistanciaIn + ", " +
            travels[x].pKilometrosDistanciaIn + ");";

          this.db.executeSql(this.sqlQuery, []);

          //Recupero el identity
          this.sqlQuery = "SELECT MAX(idViaje) As Identificador FROM viaje";
          this.db.executeSql(this.sqlQuery, []).then(rowIdentity => {
            let identity = rowIdentity.rows.item(0).Identificador;

            for (let y = 0; y < travels[x].pViajeMovilDetalle.length; y++) {

              let date = new Date(parseInt(travels[x].pViajeMovilDetalle[y].pFechaDocumentoDt.substr(6)));
              let dia: string = date.getDate().toString();
              if (dia.length == 1) {
                dia = '0' + date.getDate();
              }

              let fechaDoc = dia + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();

              this.sqlQuery = "INSERT INTO ViajeDetalle(idViaje, idDestino, destinoNombre, idEstatus, idDocumento, fechaDocumento, geolocalizacion) VALUES (" +
                identity + ", '" +
                travels[x].pViajeMovilDetalle[y].pIdDestino + "', '" +
                travels[x].pViajeMovilDetalle[y].pDestinoNombre + "', " +
                travels[x].pViajeMovilDetalle[y].pIdEstatus + ", '" +
                travels[x].pViajeMovilDetalle[y].pIdDocumentoVc + "', '" +
                fechaDoc + "', '" +
                travels[x].pViajeMovilDetalle[y].pGeoLocalizacionDestino + "'); ";

              this.db.executeSql(this.sqlQuery, []);
            }

            //Recupero los distintos destinos
            let idDestinos: any[] = [];
            let destinos: string = "";

            this.sqlQuery = "SELECT idDestino, destinoNombre FROM ViajeDetalle WHERE idViaje = ? ";
            this.db.executeSql(this.sqlQuery, [identity]).then(res => {
              if (res.rows.length > 0) {
                for (let y = 0; y < res.rows.length; y++) {
                  if (y == 0) {
                    idDestinos.push(res.rows.item(y).idDestino);
                    destinos += res.rows.item(y).idDestino + "-" + res.rows.item(y).destinoNombre + ", ";
                  }
                  else {
                    let encontrado = idDestinos.indexOf(res.rows.item(y).idDestino);
                    if (encontrado == -1) {
                      idDestinos.push(res.rows.item(y).idDestino);
                      destinos += res.rows.item(y).idDestino + "-" + res.rows.item(y).destinoNombre + ", ";
                    }
                  }
                }

                destinos = destinos.substring(0, destinos.length - 2);

                let sqlUpdate = "UPDATE Viaje SET destino = '" + destinos + "' WHERE idViaje = ? ";
                this.db.executeSql(sqlUpdate, [identity]);
              }
            });

          });
        }
      });
    }
    return Promise.resolve('OK');
  }

  actualizaViajeLocal(idEstatus, idRechazo, idViaje) {
    let sql = "UPDATE Viaje SET idEstatus = " + idEstatus + ", idRechazo = " + idRechazo + " WHERE idViaje = ?";
    return this.db.executeSql(sql, [idViaje]);
  }

  insertaUsuario(userName, password, noTracto, nombreCompleto, imei) {
    let usuarioQuery = "SELECT COUNT(*) AS Existe FROM Usuario WHERE userName = ? AND password = ? AND imei = ?";
    this.db.executeSql(usuarioQuery, [userName, password, imei]).then(respuesta => {
      let existe = respuesta.rows.item(0).Existe;
      if (existe == 0) {
        usuarioQuery = "INSERT INTO Usuario (nombreCompleto, imei, userName, password, estatus, tracto) VALUES ('" +
          nombreCompleto + "', '" +
          imei + "', '" +
          userName + "', '" +
          password + "', 1, '" +
          noTracto + "'); ";

        this.db.executeSql(usuarioQuery, []);
      }
    });
  }

  eliminaViajeLocal(idViaje) {
    let sql = "DELETE FROM Viaje WHERE idViaje = ?";
    return this.db.executeSql(sql, [idViaje]);
  }

  eliminaViajeSync(idViajeSync) {
    let sql = "DELETE FROM ViajeSync WHERE idViajeSync = ?";
    return this.db.executeSql(sql, [idViajeSync]);
  }

  viajesPorSincronizar() {
    let viajeSyncQuery = "SELECT * FROM ViajeSync";
    return this.db.executeSql(viajeSyncQuery, []).then(response => {
      let hayViajes = [];
      for (let index = 0; index < response.rows.length; index++) {
        hayViajes.push(response.rows.item(index));
      }
      return Promise.resolve(hayViajes);
    });
  }

  insertaAceptaRechazaViajeSync(idViaje, idOrigen, idConcentrado, idOperador, idMotivoRechazo, idEstatus, idDispositivo) {
    let viajeQuery = "INSERT INTO ViajeSync (idViaje, idOrigen, idConcentrado, idOperador, idMotivoRechazo, idEstatus, idDispositivo) VALUES (" +
      idViaje + ", " +
      idOrigen + ", '" +
      idConcentrado + "', '" +
      idOperador + "', " +
      idMotivoRechazo + ", " +
      idEstatus + ", '" +
      idDispositivo + "'); ";

    return this.db.executeSql(viajeQuery, []);
  }

  insertaIniciaTerminaViajeSync(idViaje, idOrigen, idConcentrado, idOperador, idMotivoRechazo, idEstatus, idDispositivo, coordenadas, fecha) {
    let viajeQuery = "INSERT INTO ViajeSync (idViaje, idOrigen, idConcentrado, idOperador, idMotivoRechazo, idEstatus, idDispositivo, geolocalizacion, fecha) VALUES (" +
      idViaje + ", " +
      idOrigen + ", '" +
      idConcentrado + "', '" +
      idOperador + "', " +
      idMotivoRechazo + ", " +
      idEstatus + ", '" +
      idDispositivo + "', '" +
      coordenadas + "', '" +
      fecha + "'); ";

    return this.db.executeSql(viajeQuery, []);
  }

}
