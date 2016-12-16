import { Injectable } from '@angular/core';
import { Http } from '@angular/http'; 
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class Pako {
  data: any;

  constructor(public http: Http, public db: Storage) {
    console.log('Hello Pako Provider');
    this.data = [
      { name: 'Microsoft', code: 324, product: 'Windows 10' },
      { name: 'Apple', code: 678, product: 'iPhone 7' },
      { name: 'Google', code: 567, product: 'Pixel' },
      { name: 'Oracle', code: 89, product: 'RDBMS' },
      { name: 'IBM', code: 542, product: 'Computer Hardware and Software' }
    ];
    
  }

  loadAll() {
    return Promise.resolve(this.data)
      .catch((err) => { console.log('error in this.data ' + JSON.stringify(err)); });
  }

  public pakInsert(key, val): any {
    this.db.set(key, val)
      .then((val) => { return val })
      .catch((err) => { console.log('pakInsert error ' + err) })
  }

  pakRead(key): any {
    this.db.get(key)
      .then((val) => { return val })
      .catch((err) => { console.log('pakRead error ' + err) })
  }

  pakKeys(): any {
    this.db.keys()
      .then((val) => { return val })
      .catch((err) => { console.log('pakKeys error ' + err) })
  }

  // pakRead(key) {
  //   this.db.get(key)
  //     .then(function (val) {
  //       console.log(val);
  //       return Promise.resolve(val)
  //         .catch((err) => { console.log('error in pakREad ' + JSON.stringify(err)); });
  //     }).catch(function (err) { console.log(err); });
  // }

  // pakKeys() {
  //   this.db.keys().then(function (keys) {
  //     console.log(keys);
  //     return Promise.resolve(keys)
  //       .catch((err) => { console.log('error in pakKeys ' + JSON.stringify(err)); });
  //   }).catch(function (err) { console.log(err); });
  // }



} // Pako
