import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class Pako {

  constructor(public http: Http, public db: Storage) {
    console.log('Hello Pako Provider');
    this.db = new Storage();
  }


  // public pakInsert(key, val) {
  //   this.db.set(key, val).subscribe(
  //     data => {
  //       console.log('heh. subscribe. who knew?');
  //     },
  //     err => { },
  //     () => console.log()
  //   );;
  // }

  // public pakInsert(key, val): any {
  //   this.db.set(key, val)
  //     .then((val) => { return val })
  //     .catch((err) => { console.log('pakInsert error ' + err) })
  // }

  // public pakRead(key): any {
  //   this.db.get(key)
  //     .then((val) => { return val })
  //     .catch((err) => { console.log('pakRead error ' + err) })
  // }

  // public pakKeys(): any {
  //   this.db.keys()
  //     .then((val) => { return val })
  //     .catch((err) => { console.log('pakKeys error ' + err) })
  // }

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
