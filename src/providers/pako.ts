import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

// @Injectable()
// export class Jline {
//   id: string;
//   sigval: string;
//   action: string;
//   badge: string;
//   thing: string;
//   box: string;
//   sighuman: string;

//   constructor(id: string, sigval: string, action: string, badge: string, thing: string, box: string, sighuman: string) {
//     console.log("Hi there, J. Line! ----- ");
//     this.id = id;
//     this.sigval = sigval;
//     this.action = action;
//     this.badge = badge;
//     this.thing = thing;
//     this.box = box;
//     this.sighuman = sighuman;
//   }

//   public nuBox() {
//     let nd = new Date();
//     let sv = nd.valueOf().toString();
//     let sh = nd.toString();
//     let badid = new Date().valueOf().toString();
//     // return new Jline(badid, sv, "nuBox", badid, "", badid, sh);

//     return {
//       id: badid,
//       sigval: sv,
//       action: "nuBox",
//       badge: badid,
//       thing: "",
//       box: badid,
//       sighuman: sh
//     }

//   }
// }

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
