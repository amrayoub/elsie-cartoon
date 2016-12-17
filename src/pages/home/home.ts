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
  jay = new Jline();

  constructor(public navCtrl: NavController, public db: Storage) {
  }

   ex1() {
    console.log('b4 ' + JSON.stringify(this.jay));
    this.jay.setNuBox();
    console.log('f9 ' + JSON.stringify(this.jay));
  } // exercise

} // HomePage class

// return new Promise((resolve) => resolve({ msg: "working on it...j" }));
