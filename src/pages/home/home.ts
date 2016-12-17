import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Badger } from '../../models/badger';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})

export class HomePage {
  // nubNotes:any = {};
  nubNotes:string;

  constructor(
    public navCtrl: NavController,
    public db: Storage) { }

  ex1() {
    let jay = new Badger();
    console.log('b4 ' + JSON.stringify(jay));
    jay.box = "jayBox"
    console.log('h4 ' + JSON.stringify(jay));
  } // ex1

  ex2() {
    console.log('wait for it...');

    setTimeout(function () {
      let bill = new Badger();
      console.log('b4 ' + JSON.stringify(bill));
      bill.box = "BillBox"
      console.log('h4 ' + JSON.stringify(bill));

    }, 5000);
  }

  nuBox() {
    // this.nubNotes = { msg: "1) new Badger, 2) 'nuBox', 3)start Camera, 3) move image to 'files/badge.jpg'" };
    // console.log(`HUH? ${this.nubNotes.msg}`);
    this.nubNotes = "1) new Badger, 2) 'nuBox', 3)start Camera, 3) move image to 'files/badge.jpg'";
    console.log(`HUH? ${this.nubNotes}`);

  }


} // HomePage class

