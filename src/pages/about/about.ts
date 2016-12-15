import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Pako } from '../../providers/pako';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  dogs: any;
  constructor(public navCtrl: NavController, public db: Pako) {
    this.db.loadAll().then((res) => {
      this.dogs = res;
    });
  }

}

