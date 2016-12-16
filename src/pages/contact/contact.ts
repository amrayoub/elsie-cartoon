import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Pako } from '../../providers/pako';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [ [Pako] ]
})

export class ContactPage {
  record: any;
  rander: any[];
  keys: any;

  constructor(public navCtrl: NavController, public pako: Pako) {

  }
  makeVal() {
    let rander = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p'];
    return rander[(Math.random() * rander.length) | 0]
  }
  makeKey() {
    return new Date().valueOf().toString();
  }

  public pInsert(key, val) {
    val = this.makeVal(); // override fake dev data
    key = this.makeKey(); // override fake dev data
    console.log("-- pInsert " + key + " && " + val );
    // this.pako.pakInsert(key, val)
    this.pako.db.set(key, val)
      .then((val) => {
        console.log("Inserted " + val);
        this.record = val;
      });
  }

  pKeys() {
    // this.pako.pakKeys()
    this.pako.db.keys()
      .then((val) => {
        this.keys = val;
        console.log("pako.keys " + JSON.stringify(val));
      })
  }

  pRead(key, val) {
    // this.pako.pakRead(key)
    this.pako.db.get(key)
    .then((val) => {
      this.record = val;
    });
  }

}
