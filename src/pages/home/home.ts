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
  showStart: boolean;
  bytes_free: any;
  fs2: any;
  areWeLocal: boolean;
  mm: any;

  constructor(
    public navCtrl: NavController,
    public db: Storage,
    private tabs: Tabs) {
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

  ionViewWillEnter() {
    this.mm = MM.getInstance();
    this.mm.mmRead();
  }

  ionViewDidEnter() {

  }

  ionViewDidLoad() {
    if (this.mm && this.mm.justBoxes && this.mm.justBoxes.length === 0) {
      this.tabs.select(2);
    }
  }

  ionViewWillLeave() {
    // this.mm.mmWrite();
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

  test1() {
    console.log(`test1() CURRENTs`);
    console.log(`box ${this.mm.curBox}`);
    console.log(`box ${this.mm.curBoxBadge}`);
    console.log(`box ${this.mm.curThg}`);
    console.log(`box ${this.mm.curThgBadge}`);
  }

  test2() {
    console.log(`test2() doing nothin for now`);

  }

  test3() {
    console.log(`test3() BADGERS`);
    this.db.get('mmBadgers').then((res) => {
      console.log(`mmBadgers ${JSON.stringify(res)}`);
    })
  }

  test4() {
    console.log(`test4() `);
  }

  writeJayson() {
    let jay = [];
    this.db.get('mmBadgers').then((res) => {
      jay = JSON.parse(JSON.stringify(res));
      jay.map((line => {
        line.id = undefined;
      }))
      console.log(`JAY ${JSON.stringify(jay)}`);
    });
  }

  /** OLD CODE HOME --------------- */

  checkFs() {
    // File.getFreeDiskSpace().then((data: any) => {
    //   this.bytes_free = data;
    // });
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
                // this.meta.glob = res;
              }
            })
        }
      });
  }

  ex1() {
    let jay = new Badger();
    console.log('b4 ' + JSON.stringify(jay));
    jay.box = "jayBox"
    console.log('h4 ' + JSON.stringify(jay));
  } // ex1


} // HomePage class

