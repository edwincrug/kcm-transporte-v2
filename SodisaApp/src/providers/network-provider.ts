import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Network } from 'ionic-native';

import 'rxjs/add/operator/map';


@Injectable()
export class NetworkProvider {

  constructor(public http: Http) {
    console.log('Hello Red Provider');
  }

  noConnection() {
    return (Network.connection === 'none');
  }

}
