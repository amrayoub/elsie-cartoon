import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Pako } from '../../providers/pako';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController) { }

}

