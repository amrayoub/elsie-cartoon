import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Badger, DRing } from '../../models/badger';
import { MediaCapture, MediaFile, CaptureError } from 'ionic-native';
import { File, Entry, FileError } from 'ionic-native';

declare var cordova: any;

@Component({
  selector: 'page-box',
  templateUrl: 'box.html',
  providers: []
})

/**
 * the Multi- returns tripe such as this:
 * file:/storage/emulated/0/DCIM/Camera/<name>.jpg */
export class BoxPage {
  meta: any;
  images: any[];
  curThg: any;
  curBox: any;
  fromPath: any;
  fs2: any;
  cats: string[];
  constructor(
    public navCtrl: NavController,
    public db: Storage,
    public toastCtrl: ToastController
  ) {
    this.dbCheck();
    this.cats = ["assets/cats-1.jpg", "assets/cats-2.jpg", "assets/cats-3.jpg", "assets/cats-4.jpg", "assets/cats-5.jpg", "assets/cats-6.jpg", "assets/cats-7.jpg", "assets/cats-8.jpg"]
  }

  // 0 new Box object w/action
  // 2 camera
  // 4 update Box object and/or camera image
  // 6 new record in db
  addBox() {
    let box = new Badger();
    box.action = "nuBox"
    try {
      this.fs2 = cordova.file.externalDataDirectory;
    } catch (e) {
      this.fs2 = "assets/";
      console.log('not on the device, mate');
    }
    console.log(`made nuBox: ${JSON.stringify(box)}`);
  }

  multiPix() {
    try {
      // let goodoptions: CaptureImageOptions = {limit: 7};
      console.log('** starting a media-capture escapade');
      MediaCapture.captureImage({ limit: 3 })
        .then(
        (data: MediaFile[]) => {
          this.images = data;
          console.log('WTF? camera this.images?');
        },
        (err: CaptureError) => { console.error(err) }
        );
    } catch (e) {
      console.log('not on the device, mate');
      // file:/storage/emulated/0/DCIM/Camera/<name>.jpg
      this.cats.forEach(element => {
        this.images.push( this.fs2 + element )
      });
    }
    this.multiPostProcessing();
  }

  slashName(path) {
    let n = path.split('/').pop();
    let o = path.split('/').slice(0, -1).join('/') + '/';
    let p = o.replace(':', '://');
    return { 'name': n, 'path': p };
  }
  fakeMulti() {
    console.log(`images: ${JSON.stringify(this.images)}`);
  }
  multiPostProcessing() {

    let tmp = this.slashName(this.images[0].fullPath)
    this.curThg = tmp.name;
    this.fromPath = tmp.path;
    console.log('** multiPostProcessing - this.curThg, Path: ' + this.curThg + " | " + this.fromPath);

    /** images is a MediaFile */
    this.images.forEach((shot, index) => {
      /** filesystem */
      console.log("** mPP - filesystemFr: " + this.fromPath + shot.name);
      console.log("** mPP - filesystemTo: " + this.fs2 + shot.name);
      File.moveFile(this.fromPath, shot.name, this.fs2, shot.name).then(
        (val: Entry) => {
          // console.log("** mPP Move apparently OK ", JSON.stringify(val));
        },
        (err: FileError) => { console.log("** mPP BAD MOVE ** " + err.message) }
      );
      /** database */
      let signow: Date = new Date();
      let action: any = 'xxYyy';
      if (0 == index) { action = 'nuThg' } else { action = 'moThg' }
      console.log('** multiPostProcessing ' + index + ' let action: ' + action);
      //
      let copper = {
        'signetValue': signow.valueOf(),
        'action': action,
        'badge': shot.name,
        'thing': this.curThg,
        'box': this.curBox,
        'signetHuman': signow
      };

      console.log('copper ' + JSON.stringify(copper));
      //
      /** looks like the db key will (always?) be the badge name. Makes sense. So far... */
      this.db.set(shot.name, {
        'signetValue': signow.valueOf(),
        'action': action,
        'badge': shot.name,
        'thing': this.curThg,
        'box': this.curBox,
        'signetHuman': signow
      }).then((ret) => {
        console.log("** mPP - database.set() returned: " + JSON.stringify(ret));
      });
    }); // images.forEach
    /** I think this will asynch itself out of position, but... */
    this.showThing(this.curThg);
  } // multiPostProcessing


  showThing(thg) {

  }


  dbCheck(): void {
    this.meta = {};
    this.db.keys().then((ret) => {
      this.meta.allkeys = ret;
      if (this.meta.allkeys.length == 0) {
        this.meta.showStart = true;
        this.freshDatabase();
      }
      console.log(`allkeys: ${JSON.stringify(this.meta.allkeys)}`);
    })
  }

  freshDatabase(): void {
    let toast = this.toastCtrl.create({
      message: 'Database empty. Make New Box. NOW.',
      duration: 3000,
      showCloseButton: true,
      position: 'middle'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  } //freshDatabase()

} // BoxPage

/** from CLACKULATOR
cordova-plugin-camera 2.3.0 "Camera"
cordova-plugin-compat 1.1.0 "Compat"
cordova-plugin-console 1.0.4 "Console"
cordova-plugin-crosswalk-webview 2.2.0 "Crosswalk WebView Engine"
cordova-plugin-device 1.1.3 "Device"
cordova-plugin-file 4.3.0 "File"
cordova-plugin-media-capture 1.4.0 "Capture"
cordova-plugin-splashscreen 4.0.0 "Splashscreen"
cordova-plugin-sqlite 1.0.3 "Cordova Sqllite Plugine"
cordova-plugin-statusbar 2.2.0 "StatusBar"
cordova-plugin-whitelist 1.3.0 "Whitelist"
ionic-plugin-keyboard 2.2.1 "Keyboard" */
