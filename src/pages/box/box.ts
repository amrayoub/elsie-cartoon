import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Badger, DRing } from '../../models/badger';
import { MediaCapture, MediaFile, CaptureError } from 'ionic-native';
import { File, Entry, FileError, Camera } from 'ionic-native';

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
  curBox: any;
  fromPath: any;
  fs2: any;
  cats: string[];
  thePhoto: any;
  rawImageFullPath: any;
  box: Badger;
  dbBoxes: any[];

  constructor(
    public navCtrl: NavController,
    public db: Storage,
    public toastCtrl: ToastController
  ) {
    this.dbCheck();
    this.cats = ["cats-1.jpg", "cats-2.jpg", "cats-3.jpg", "cats-4.jpg", "cats-5.jpg", "cats-6.jpg", "cats-7.jpg", "cats-8.jpg"];
    try {
      this.fs2 = cordova.file.externalDataDirectory;
    } catch (e) {
      this.fs2 = "assets/";
    } finally {
      console.log(`Today's FS2 is: ${this.fs2}`);
    } //try
  }

  addBox() {
    this.box = new Badger();
    this.box.action = "nuBox"
    // console.log(`made nuBox: ${JSON.stringify(this.box)}`);
    // this.multiPix();
    this.singlePix();
  }

  singlePix() {
    try {
      let deviceFailureFlag = cordova.file.externalDataDirectory;
      Camera.getPicture({
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true
      }).then((result) => {
        // result is file:///storage/emulated/0/Android/data/com.whatever/cache/imagenumber.jpg
        this.rawImageFullPath = this.slashName(result);
      }, (err) => {
        console.log(err);
      });
    } catch (e) {
      // fake result is file:/storage/emulated/0/DCIM/Camera/<name>.jpg
      let thisCat = "assets/" + this.cats[Math.floor(Math.random() * this.cats.length)];
      this.rawImageFullPath = this.slashName(thisCat);
    } finally {
      this.curBox = this.rawImageFullPath.name;
      this.fromPath = this.rawImageFullPath.path;
      this.box.badge = this.curBox;
      this.box.box = this.curBox;
      this.mvImageToSafePlace();
    }
  } //singlePix()

  mvImageToSafePlace() {
    if (this.fs2 !== this.fromPath) {
      console.log(`--Fr: ${this.fromPath} ${this.curBox}`);
      console.log(`--To: ${this.fs2} ${this.curBox}`);
      File.moveFile(this.fromPath, this.curBox, this.fs2, this.curBox).then(
        (val: Entry) => {
          console.log("** File.moveFile OK " + JSON.stringify(val));
        },
        (err: FileError) => { console.log(`FileError ${JSON.stringify(err)}`); }
      );
    }
    // console.log(`Box: ${JSON.stringify(this.box)}`);
    this.saveBoxObject();
  }

  saveBoxObject() {
    this.db.set(this.box.badge, this.box)
      .then((res) => {
        this.db.get(this.box.badge)
          .then((res) => {
            console.log(`save/db.get ${this.box.badge} -=> ${JSON.stringify(res.signetHuman)}`);
          });
      });
    this.dbCheck(); // refresh current data;
  }

  slashName(path) {
    let n = path.split('/').pop();
    let o = path.split('/').slice(0, -1).join('/') + '/';
    let p = o.replace(':', '://');
    return { 'name': n, 'path': p };
  }

  dbCheck(): void {
    this.meta = {};
    this.db.keys().then((ret) => {
      this.meta.allkeys = ret;
      if (this.meta.allkeys.length == 0) {
        this.meta.showStart = true;
        this.freshDatabase();
      } else {
        console.log(`db has: ${JSON.stringify(this.meta.allkeys.length)} records.`);
        // Glob = this.db.length, then db.get (using allkeys) from end until first nuThg, nuBox
        this.dbBoxes = [];
        this.meta.allkeys.forEach((k) => {
          this.db.get(k).then((record) => {
            if (record.action == "nuBox" || record.action == "unBox") {
              this.dbBoxes.push(record);
              // console.log(`dbBoxes.push( ${JSON.stringify(record)}`);
            }
          }); //db.get
        }); //allkeys.foreach

        for (let i = this.meta.allkeys.length; i >= 0; i--) {
          let target = this.meta.allkeys[i];
          this.db.get(target).then((record) => {
            if (record && record.hasOwnProperty('action')) {
              console.log(`i ${i} t ${target} r ${record.action} `);
            } else {
              console.log(`might be a global constant...`);
            }
          });
          // more statements
        }

      }
    }); //dbkeys.then
  }

  freshDatabase(): void {
    let toast = this.toastCtrl.create({
      message: 'Database Empty. U Make New Box.',
      duration: 2000,
      showCloseButton: true,
      position: 'middle'
    });
    toast.onDidDismiss(() => { /** console.log('Dismissed toast');*/ });
    toast.present();
  } //freshDatabase()

} // BoxPage

        // config.xml
        // <preference name="AndroidPersistentFileLocation" value="Internal" />
        // <preference name="iosPersistentFileLocation" value="Library" />
        // console.log(cordova.file.dataDirectory);


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