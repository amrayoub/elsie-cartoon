import { Component } from '@angular/core';
import { App, NavController, Tabs } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Badger } from '../../models/badger';
import { MM } from '../../models/mm';
import { File, Entry, FileError } from 'ionic-native';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})

export class HomePage {

  nubNotes: string;
  meta: any = {};
  showStart:boolean;
  bytes_free: any;
  fs2: any;
  areWeLocal: boolean;
  mm: any;

  constructor(
    public navCtrl: NavController,
    public db: Storage,
    private tabs: Tabs) {
    this.checkFs();
  }

  ionViewWillEnter() {
    this.checkDb();
    this.mm = MM.getInstance();
    this.mm.mmRead();
  }

  ionViewWillLeave() {
    // this.mm.mmWrite();
  }

  checkFs() {
    // File.getFreeDiskSpace().then((data: any) => {
    //   this.bytes_free = data;
    // });
    try {
      this.areWeLocal = false;
      this.fs2 = cordova.file.externalDataDirectory;
    } catch (e) {
      this.areWeLocal = true;
      this.fs2 = "assets/";
    } finally {
      // console.log(`Home: Today's FS2 is: ${this.fs2}`);
    } //try
  }


  emptyDatabase() {
    this.db.clear().then(() => {
      // Run this code once the database has been entirely deleted.
      console.log('Database is now empty.');
    }).catch(function (err) {
      // This code runs if there were any errors
      console.log(err);
    });
  }

  checkDb() {
    this.db.keys()
      .then((ret) => {
        this.meta.allkeys = ret;
        // console.log(`allkeys: ${JSON.stringify(this.meta.allkeys)}`);
        if (this.meta.allkeys.length == 0) {
          this.showStart = true;
          this.tabs.select(2);
        } else {
          this.showStart = false;
          this.db.get("dbglob")
            .then((res) => {
              console.log(`Home,checkDb,dbglob ${JSON.stringify(res)}`);
              if (res == undefined) {
                // do nothing
              } else {
                this.meta.glob = res;
              }
            })
        }
      });
  }

  test() {
    console.log(`jsn ${JSON.stringify(this.mm.badgers)}`);
    console.log(`box ${this.mm.curBox}`);
    console.log(`box ${this.mm.curBoxBadge}`);
    console.log(`box ${this.mm.curThg}`);
    console.log(`box ${this.mm.curThgBadge}`);
  }

  testAllKeys() {
    this.db.get('mmJustBoxes').then((res) => {
      console.log(`mmJustBoxes ${JSON.stringify(res)}`);
      let findee = "1482435462163";
      let openee = res.find(x => x.signetValue === findee);
      console.log(`mmJustBoxes openee ${JSON.stringify(openee)}`);
    })
  }

  testBadgers() {
    this.db.get('mmBadgers').then((res) => {
      console.log(`mmBadgers ${JSON.stringify(res)}`);
    })
  }

  ex1() {
    let jay = new Badger();
    console.log('b4 ' + JSON.stringify(jay));
    jay.box = "jayBox"
    console.log('h4 ' + JSON.stringify(jay));
  } // ex1


} // HomePage class

