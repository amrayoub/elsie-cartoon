import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/from';

export class MM {
  private static instance: MM;
  private mmdb: Storage;
  constructor(
    public allKeys: any[] = [],
    public badgers: any[] = [],
    public justBoxes: any[] = [],
    public curBox: string = "",
    public curBoxBadge: string = "",
    public curThg: string = "",
    public curThgBadge: string = "",
  ) {
    this.mmdb = new Storage;
  }

  static getInstance() {
    if (!MM.instance) {
      MM.instance = new MM();
    }
    return MM.instance;
  }

  async mmClear() {
    await this.mmdb.clear()
      .then(() => {
        this.allKeys = [];
        this.badgers = [];
        this.justBoxes = [];
        this.curBox = '';
        this.curBoxBadge = '';
        this.curThg = '';
        this.curThgBadge = '';
      })
      .catch((e) => { return 'db clear error ' + e })
  }

  async mmWrite() {
    await this.mmdb.set('mmKeys', this.allKeys); //deprecated by badgers
    await this.mmdb.set('mmBadgers', this.badgers); //Jayson.txt source
    await this.mmdb.set('mmBox', this.curBox);
    await this.mmdb.set('mmBoxBadge', this.curBoxBadge);
    await this.mmdb.set('mmThg', this.curThg);
    await this.mmdb.set('mmThgBadge', this.curThgBadge);
    await this.mmdb.set('mmJustBoxes', this.justBoxes);
    return 'db written'
  }

  /** pretty fragile, this one :/ */
  mmRead() {
    this.mmdb.get('mmKeys').then((ret) => {
      if (ret == null) { ret = []; }
      this.allKeys = ret;
    });
    this.mmdb.get('mmBadgers').then((ret) => {
      if (ret == null) { ret = []; }
      this.badgers = ret;
    });
    this.mmdb.get('mmBox').then((ret) => {
      this.curBox = ret;
    });
    this.mmdb.get('mmBoxBadge').then((ret) => {
      this.curBoxBadge = ret;
    });
    this.mmdb.get('mmThg').then((ret) => {
      this.curThg = ret;
    });
    this.mmdb.get('mmThgBadge').then((ret) => {
      this.curThgBadge = ret;
    });
    this.mmdb.get('mmJustBoxes').then((ret) => {
      if (ret == null) { ret = []; }
      this.justBoxes = ret;
    });
  }

  /** all the Badgers */
  mmAllBadgers(){
    return this.mmdb.get('mmBadgers')
  }



  /** given a Box ID, return it, the Things and all their moThgs */
  async oneBox(bid) {
    console.log(`oneBox 0: ${JSON.stringify(bid)}`);
    let baz: any;
    let qux: any;
    await this.oB1(bid).then((res) => { baz = res; })
    // console.log(`oneBox 1: ${JSON.stringify(baz)}`);
    await this.oB2(baz).then((ret) => { qux = ret; })
    // console.log(`oneBox 2: ${JSON.stringify(qux)}`);
    qux.forEach((ans) => {
      // processing?
    })
    return qux;
  }

  oB2(oneBox) {
    return new Promise((resolve, reject) => {
      let badgerland: any[] = [];
      this.mmdb.get('mmBadgers')
        .then((ret) => {
          if (ret && ret.length > 0) {
            ret.forEach((v, k) => {
              if (v.box === oneBox.box) {
                badgerland.push(v);
              }
            })//ret.each
          } else {
            reject("no mmBadgers")
          }
          if (badgerland && badgerland.length > 0) {
            resolve(badgerland);
          }
        })
        .catch((err) => { reject("no badgers at all") })
    })
  }

  oB1(bid) {
    console.log(`oB1 looking for ${JSON.stringify(bid)}`);
    return new Promise((resolve, reject) => {
      let tmp = {};
      this.mmdb.get('mmBadgers')
        .then((ret) => {
          console.log(`raw ret ${JSON.stringify(ret)}`);
          if (ret && ret.length > 0) {
            ret.map((reko) => {
              if (reko.signetValue === bid) {
                console.log(`reko hit ${JSON.stringify(reko)}`);
                tmp = Object.assign({}, reko);
              }
            })//ret.map
          }
          if (tmp.hasOwnProperty('action')) {
            resolve(tmp)
          } else {
            reject({ message: "404" })
          }
        })
        .catch((err) => {
          console.log(`oB1 err ${JSON.stringify(err)}`);
          reject('bad badgers in oB1')
        })
    })

  }

  /** given an ID, return the Thing, with all its moThgs */
  async oneThing(tid) {
    let jef: any;
    let bil: any;
    await this.oT1(tid).then((res) => { jef = res; });
    // console.log(`oneThing.jef ${JSON.stringify('x')}`);

    await this.oT2(jef).then((ret) => { bil = ret; });
    // console.log(`oneThing.bil ${JSON.stringify('y')}`);

    bil.forEach((ans) => {
      // console.log(`bil: ${ans.action} ${ans.thing} ${ans.badge}`);
    })
    return bil;
  }

  /** given a Thing Badger, return it and its moThings */
  oT2(oneThing) {
    return new Promise((resolve, reject) => {
      let badgerland: any[] = [];
      this.mmdb.get('mmBadgers')
        .then((ret) => {
          if (ret && ret.length > 0) {
            ret.forEach((v, k) => {
              // console.log(`oT2.ret: ${(v.thing)} vs oneThing: ${(oneThing.thing)}`);
              if (v.thing === oneThing.thing) {
                badgerland.push(v);
              }
            })//ret.each
          } else {
            reject("mmBadgers is empty")
          }
          if (badgerland && badgerland.length > 0) {
            resolve(badgerland)
          }
        })
        .catch((err) => {
          reject("no badgers??")
        })
    })
  }

  /** given an ID, return a Thing Badger */
  oT1(tid) {
    return new Promise((resolve, reject) => {
      console.log(`oT1 got ${tid}`);
      this.mmdb.get('mmBadgers')
        .then((ret) => {
          // console.log(`mmBadgers returned ${(JSON.stringify(ret))}`);
          let stanley = {};
          ret.map((reko) => {
            if (reko.signetValue == tid) {
              // console.log(`reko.tid found ${reko.signetHuman}`);
              stanley = Object.assign({}, reko);
            }
          })//ret.map
          if (stanley.hasOwnProperty('action')) {
            resolve(stanley)
          } else {
            reject("404")
          }
        })
    })
  }


} //mm

class Singleton {
  private static instance: Singleton;
  private constructor() {
    // do something construct...
  }
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
      // ... any one time initialization goes here ...
    }
    return Singleton.instance;
  }
  someMethod() { }
}

//let something = new Singleton() // Error: constructor of 'Singleton' is private.

let instance = Singleton.getInstance() // do something with the instance...