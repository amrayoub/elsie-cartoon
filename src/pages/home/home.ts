import { Component } from '@angular/core';
import { App, NavController, Tabs } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Ute, Badger } from '../../models/badger';
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
  bytes_free: any;
  fs2: any;
  areWeLocal: boolean;

  constructor
    (
    public navCtrl: NavController,
    public db: Storage,
    private tabs: Tabs
    ) {
    this.checkDb();
    this.checkFs();
  }

  ionViewWillEnter() {
    this.checkDb();
  }

  jKeys(): Promise<string> {
    return new Promise((resolve) => {

      // let tool = new Ute();
      new Ute().dbKeys().then((res) => {
        resolve(res);
      });

    })
  }

  async makeJayson() {
    let joe = "b4";
    console.log(`what is Ute? ${JSON.stringify(joe)}`);
    await this.jKeys().then((res) => { joe = res; });
    console.log(`what is Ute? ${JSON.stringify(joe)}`);

    // await
    // console.log(`there are bob ${bob.length} keys ----------------`);
    // console.log(`${ret.id} : ${ret.action} : ${ret.badge}`);


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
          this.meta.showStart = true;
          this.tabs.select(2);
        } else {
          this.meta.showStart = false;
          this.db.get("dbglob")
            .then((res) => {
              // console.log(`Home,checkDb,dbglob ${JSON.stringify(res)}`);
              if (res == undefined) {
                // do nothing
              } else {
                this.meta.glob = res;
              }
            })
        }
      });
  }

  // ex1() {
  //   let jay = new Badger();
  //   console.log('b4 ' + JSON.stringify(jay));
  //   jay.box = "jayBox"
  //   console.log('h4 ' + JSON.stringify(jay));
  // } // ex1

  // ex2() {
  //   console.log('wait for it...');

  //   setTimeout(function () {
  //     let bill = new Badger();
  //     console.log('b4 ' + JSON.stringify(bill));
  //     bill.box = "BillBox"
  //     console.log('h4 ' + JSON.stringify(bill));

  //   }, 5000);
  // } // ex2

  // toNewBox() {
  //   // this.navCtrl.getByIndex(2);
  //   // this.navCtrl.push(2)
  //   // let nav = this.app.getRootNav();
  //   // nav.push(BoxPage);
  //   this.tabs.select(2);
  // }

  // nuBox() {
  //   this.nubNotes = "1) new Badger, 2) 'nuBox', 3)start Camera, 3) move image to 'files/badge.jpg'";

  // }


} // HomePage class

