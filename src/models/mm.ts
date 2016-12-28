import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


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

  mmWrite() {
    this.mmdb.set('mmKeys', this.allKeys); //deprecated by badgers
    this.mmdb.set('mmBadgers', this.badgers); //Jayson.txt source
    this.mmdb.set('mmBox', this.curBox);
    this.mmdb.set('mmBoxBadge', this.curBoxBadge);
    this.mmdb.set('mmThg', this.curThg);
    this.mmdb.set('mmThgBadge', this.curThgBadge);
    this.mmdb.set('mmJustBoxes', this.justBoxes)
      .then((res) => {
        // console.log(`mmWrite ${JSON.stringify(res)}`);
      });
  }

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

  async oneThing(tid) {
    let jef: any;
    let bil: any;
    await this.oT1(tid).then((res) => { jef = res; });
    // console.log(`oneThing.jef ${JSON.stringify('x')}`);

    await this.oT2(jef).then((ret) => { bil = ret; });
    // console.log(`oneThing.bil ${JSON.stringify('y')}`);

    bil.forEach((ans)=>{
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