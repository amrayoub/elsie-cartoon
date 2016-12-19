import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File, Entry, FileError } from 'ionic-native';

declare var cordova: any;

@Component({
  selector: 'page-about',
  templateUrl: 'cam.html'
})
export class CamPage {

  meta: any = {};
  fs2: any;
  areWeLocal: boolean;

  constructor(
    public navCtrl: NavController,
    public db: Storage
  ) {
    this.checkDb();
  }


  ionViewWillEnter() {
    this.checkDb();
    this.checkFs();
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
      console.log(`Home: Today's FS2 is: ${this.fs2}`);
    } //try
  }

  checkDb() {
    this.db.keys()
      .then((ret) => {
        this.meta.allkeys = ret;
        // console.log(`allkeys: ${JSON.stringify(this.meta.allkeys)}`);
        if (this.meta.allkeys.length == 0) {
          this.meta.showStart = true;
        } else {
          this.meta.showStart = false;
          this.db.get("dbglob")
            .then((res) => {
              console.log(`Cam,checkDb,dbglob ${JSON.stringify(res)}`);
              if (res == undefined) {
                // do nothing
              } else {
                this.meta.glob = res;
              }
            })
        }
      });
  }


} //CamPage

