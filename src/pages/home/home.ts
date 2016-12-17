import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Jline } from '../../models/jline';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Jline]
})
export class HomePage {
  max: any;
  // jay = new Jline();

  constructor(public navCtrl: NavController, public db: Storage) {
  }

  ex1() {
    // console.log('b4 ' + JSON.stringify(this.jay));
    // this.jay.setNuBox();
    // console.log('f9 ' + JSON.stringify(this.jay));
    let jay = new Jline();
    console.log('b4 ' + JSON.stringify(jay));
    jay.setNuBox();
    console.log('f9 ' + JSON.stringify(jay));
  } // exercise

  harness() {
    let bob = new Jline();
    bob.setNuBox();
    let bobBox = bob.box;
    let thg1 = new Jline();
    thg1.setNuThg(bobBox);
    let thg2 = new Jline();
    thg2.setMoThg(thg1.thing, bob.box);
    console.log("bob " + JSON.stringify(bob));
    console.log("thg " + JSON.stringify(thg1));
    console.log("mot " + JSON.stringify(thg2));

  }

} // HomePage class

// return new Promise((resolve) => 
// resolve({ msg: "working on it...j" }));
