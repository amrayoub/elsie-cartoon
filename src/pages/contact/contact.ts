import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Pako } from '../../providers/pako';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {
  record: any;
  rander: any[];
  keys: any[];

  constructor(public navCtrl: NavController, public pako: Pako) {
    
  }
  makeVal() {
    let rander = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p'];
    return rander[(Math.random() * rander.length) | 0]
  }
  makeKey() {
    return new Date().valueOf().toString();
  }

  pInsert(key, val) {
    val = this.makeVal(); // override fake dev data
    key = this.makeKey(); // override fake dev data
    this.pako.pakInsert(key, val)
      .then((val) => {
        console.log("Inserted " + val);
        this.record = val;
      });
  }

  pKeys() {
    this.pako.pakKeys()
      .then((val) => {
        this.keys = val;
      })
  }

  pRead(key, val) {
    this.pako.pakRead(key).then((val) => {
      this.record = val;
    });
  }

}
