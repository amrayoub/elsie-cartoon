import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Pako } from '../../providers/pako';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [ Pako ]
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

  pakoTest() {
    console.log("Ali hasn't been chosen, again. :(");
    // let bob = this.jline.nuBox();
    // console.log("Jline's nuBox " + JSON.stringify(bob));
  }

  public pakoSet(key, val) {
    val = this.makeVal(); // override fake dev data
    key = this.makeKey(); // override fake dev data
    console.log("-- pakoSet " + key + " && " + val );
    // this.pako.pakInsert(key, val) <- always fails
    this.pako.db.set(key, val)
      .then((val) => {
        console.log("Inserted " + val);
        this.record = val;
      });
  }

  pakoKeys() {
    // this.pako.pakKeys()
    this.pako.db.keys()
      .then((val) => {
        this.keys = val;
        console.log("pako.keys " + JSON.stringify(val));
      })
  }

  pakoGet(key, val) {
    // this.pako.pakRead(key)
    this.pako.db.get(key)
    .then((val) => {
      this.record = val;
    });
  }

}
