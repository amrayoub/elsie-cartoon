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

  constructor(public navCtrl: NavController, public db: Storage) {
    this.makeJline();
  }

  makeJline() {
    let max = new Date().valueOf().toString();
    // let bob = {i: "don't know"};
    // let bob = new Jline();
    // let bob = new Jline();
    // bob.init().then((ret) => {
    //   console.log("Now bob says, " + JSON.stringify(ret) + " :: " + max);
    // });
    let bob = new Jline();
    console.log("here's bob " + JSON.stringify(bob));
  }

}

// return new Promise((resolve) => resolve({ msg: "working on it...j" }));
