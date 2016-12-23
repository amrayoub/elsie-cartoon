import { Component } from '@angular/core';
import { NavController, ToastController, Tabs } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Badger, DRing } from '../../models/badger';
import { MM } from '../../models/mm';
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
  cats: string[];
  thePhoto: any;
  rawImage: any;
  box: Badger;
  dbId: any;

  fs2: any;
  dbBoxes: any[];
  areWeLocal: boolean;
  mm: any; // the meta.glob replacement

  constructor(
    private tabs: Tabs,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public db: Storage
  ) {
    this.cats = ["cats-1.jpg", "cats-2.jpg", "cats-3.jpg", "cats-4.jpg", "cats-5.jpg", "cats-6.jpg", "cats-7.jpg", "cats-8.jpg"];
    try {
      this.areWeLocal = false;
      this.fs2 = cordova.file.externalDataDirectory;
    } catch (e) {
      this.areWeLocal = true;
      this.fs2 = "assets/";
    } finally {
      // console.log(`Today's FS2 is: ${this.fs2}`);
    } //try
  }

  ionViewWillEnter() {
    this.mm = MM.getInstance();
    this.mm.mmRead();
  }

  ionViewDidLoad() {
    if (this.mm && this.mm.justBoxes && this.mm.justBoxes.length === 0) {
      this.toastEmptyDatabase();
    }
  }

  /**
  12-22 22:25:20.481: D/FileUtils(18570): Unrecognized extra filesystem identifier: assets
  12-22 22:25:20.481: D/CordovaWebViewImpl(18570): >>> loadUrl(file:///android_asset/www/index.html)
   */

  ionViewWillLeave() {
    // console.log(`box.ts will leave`);
    this.mm.mmWrite();
  }

  addBox() {
    this.box = new Badger();
    this.box.action = "nuBox"
    this.dbId = new Date().valueOf().toString();
    // console.log(`made nuBox: ${JSON.stringify(this.box)}`);
    // this.multiPix();
    this.singlePix();
  }


  x() {
    let xt = "test3() BADGERS"
    let xmmBadgers = [
      { "id": "1482509880725", "signetValue": "1482509880725", "action": "nuBox", "badge": "1482509897006.jpg", "thing": "", "box": "1482509897006.jpg", "signetHuman": "Fri Dec 23 2016 10:18:00 GMT-0600 (CST)" },
      { "id": "1482509944984", "signetValue": "1482509944984", "action": "nuThg", "badge": "1482509937786.jpg", "thing": "1482509937786.jpg", "box": "1482509880725", "signetHuman": "Fri Dec 23 2016 10:19:04 GMT-0600 (CST)" },
      { "id": "1482509944997", "signetValue": "1482509944997", "action": "nuThg", "badge": "1482509944991.jpg", "thing": "1482509944991.jpg", "box": "1482509880725", "signetHuman": "Fri Dec 23 2016 10:19:04 GMT-0600 (CST)" },
      { "id": "1482509945010", "signetValue": "1482509945010", "action": "moThg", "badge": "1482509957212.jpg", "thing": "1482509944991.jpg", "box": "1482509880725", "signetHuman": "Fri Dec 23 2016 10:19:05 GMT-0600 (CST)" },
      { "id": "1482509945023", "signetValue": "1482509945023", "action": "moThg", "badge": "1482509966020.jpg", "thing": "1482509944991.jpg", "box": "1482509880725", "signetHuman": "Fri Dec 23 2016 10:19:05 GMT-0600 (CST)" }
    ]
  }



  /** not the same as campath. Nice one, Cordova gang */
  slashName(boxpath): Object {
    let n: string = '';
    let o: string = '';
    let p: string = '';
    if (this.areWeLocal == false) {
      console.log(`?boxpath? ${JSON.stringify(boxpath)}`);
      // n = boxpath.name;
      n = boxpath.split('/').pop();
      console.log(`boxpath n? ${JSON.stringify(n)}`);
      // p = boxpath.fullPath.split('/').slice(0, -1).join('/') + '/';
      p = boxpath.split('/').slice(0, -1).join('/') + '/';
      console.log(`boxpath p? ${JSON.stringify(p)}`);
    } else {
      // console.log(`?boxpath? ${JSON.stringify(boxpath)}`);
      n = boxpath.split('/').pop();
      // console.log(`boxpath n? ${JSON.stringify(n)}`);
      o = boxpath.split('/').slice(0, -1).join('/') + '/';
      // console.log(`boxpath o? ${JSON.stringify(o)}`);
      p = o.replace(':', '://');
      // console.log(`boxpath p? ${JSON.stringify(p)}`);
    }
    return { 'name': n, 'path': p };
  }

  singlePix() {
    if (this.areWeLocal == false) {
      let deviceFailureFlag = cordova.file.externalDataDirectory;
      Camera.getPicture({
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true
      }).then((result) => {
        console.log(`SINGLE PIX result ${JSON.stringify(result)}`);

        this.rawImage = this.slashName(result);
        console.log(`SINGLE PIX rawimage ${JSON.stringify(this.rawImage)}`);

        this.box.badge = this.rawImage.name;
        this.box.box = this.rawImage.name;
        this.mvImageToSafePlace();
      }, (err) => {
        console.log(err);
      });
    } else {
      // fake result is file:/storage/emulated/0/DCIM/Camera/<name>.jpg
      this.areWeLocal = true;
      let thisCat = "assets/" + this.cats[Math.floor(Math.random() * this.cats.length)];
      this.rawImage = this.slashName(thisCat);
      this.box.badge = this.rawImage.name;
      this.box.box = this.rawImage.name;
      this.mvImageToSafePlace();
    }
  } //singlePix()

  async mvImageToSafePlace() {
    console.log(` fs2 + box.badge  ${this.fs2} + ${this.box.badge}`);
    if (this.fs2 !== this.rawImage.path) {
      // console.log(`--Fr: ${this.rawImage.path} ${this.rawImage.name}`);
      // console.log(`--To: ${this.fs2} ${this.rawImage.name}`);
      await File.moveFile(this.rawImage.path, this.rawImage.name, this.fs2, this.rawImage.name).then(
        (val: Entry) => {
          // console.log("** File.moveFile OK " + JSON.stringify(val));
        },
        (err: FileError) => { console.log(`FileError ${JSON.stringify(err)}`); }
      );
    }
    // console.log(`Box: ${JSON.stringify(this.box)}`);
    this.saveBoxObject();
  }

  async saveBoxObject() {
    this.mm.curBox = this.dbId;
    this.mm.curBoxBadge = this.box.badge;
    this.mm.badgers.push(this.box);
    this.mm.justBoxes.push(this.box);
    await this.mm.mmWrite();
  }

  openBox(boxSignet) {
    console.log(`mm.curBox ${this.mm.curBox} --> ${boxSignet}`);
    this.db.get('mmJustBoxes')
      .then((res) => {
        try {
          let openee = res.find(x => x.signetValue === boxSignet);
          this.mm.curBox = openee.signetValue;
          this.mm.curBoxBadge = openee.badge;
        } catch (e) {
          console.log(`openee err ${e}`);
          console.log(`openee res ${res}`);
        }
      })
      .catch((err) => {
        console.log(`openBox.err ${JSON.stringify(err)}`);
      })
  }

  /** End of the Actions -------------------- */

  myTime(t: string): string {
    let slag = new Date(Number(t));
    return ("0" + slag.getHours()).slice(-2) + ":" + ("0" + slag.getMinutes()).slice(-2) + ":" + ("0" + slag.getSeconds()).slice(-2) + "." + ("00" + slag.getUTCMilliseconds()).slice(-3);
  }

  toastEmptyDatabase(): void {
    let toast = this.toastCtrl.create({
      message: 'Database Empty. U Make New Box.',
      duration: 2000,
      showCloseButton: true,
      position: 'middle'
    });
    toast.onDidDismiss(() => { /** console.log('Dismissed toast');*/ });
    toast.present();
  }


  /** file:///storage/emulated/0/Android/data/ <name> /cache/imagenumber.jpg  */

  /**
   * EVERYTIME
   * 1. get the keys of the database
   * 2. use keys to create Boxes array (why? for the box.html list of boxes)
   * 3. use keys to fetch Current/Status record, update in-memory Status
   */

  meta: any = {};


  formeropenBox(boxSignet) {
    this.db.keys()
      .then((res) => {
        let ak = res;
        res.forEach(oneKey => {
          this.db.get(oneKey)
            .then((ret) => {
              if (ret.signetValue == boxSignet) {
                this.meta.glob.curBox = oneKey;
                this.meta.glob.curBoxBadge = ret.badge;
              }
              this.db.set("dbglob", this.meta.glob); // set and forget?
            });
        });
      })
  }

  retiredcheckDb() {
    this.db.keys()
      .then((ret) => {
        this.meta.allkeys = ret;
        // console.log(`allkeys: ${JSON.stringify(this.meta.allkeys)}`);
        // console.log(`allkeys: ${JSON.stringify(this.meta.allkeys.length)}`);
        // if (this.meta.allkeys.length == 0) {
        //   this.meta.showStart = true;
        //   // this.tabs.select(2);
        //   this.toastEmptyDatabase);
        // } else {
        //   this.meta.showStart = false;
        //   this.db.get("dbglob")
        //     .then((res) => {
        //       console.log(`Home,checkDb,dbglob ${JSON.stringify(res)}`);
        //       if (res == undefined) {
        //         // do nothing
        //       } else {
        //         this.meta.glob = res;
        //       }
        //     })
        // }
      });
  }

  oldersaveBoxObject() {
    this.meta.glob.curBox = this.dbId;
    this.meta.glob.curBoxBadge = this.box.badge;
    this.db.set(this.dbId, this.box)
      .then((res) => {
        this.db.get(this.dbId)
          .then((res) => {
            if (this.areWeLocal) {
              // console.log(`save/db.get ${this.dbId} -=> ${JSON.stringify(res.signetHuman)}`);
            } else {
              // console.log(`save/db.get ${this.dbId} -=> ${JSON.stringify(res)}`);
            }

            this.oldcheckDb(); // refresh current data; I wish it really did...

            // this.db.get("dbglob")
            //   .then((res) => {
            //     // look at res.curBox, res.curThg

            //     asdfasdf
            //   })
            //   .then((x) => {
            //     this.db.set("dbglob", something);
            // })

          })
      });
  }

  retiredrayBoxes() {
    for (let i = this.meta.allkeys.length - 1; i >= 0; i--) {
      let rowNumber = this.meta.allkeys[i];
      this.db.get(rowNumber).then((record) => {
        // IS IT ONE OF OURS?
        if (record && record.hasOwnProperty('action')) {
          // console.log(`${i} : ${rowNumber} : ${record.action} : ${record.badge} : ${this.myTime(record.signetValue)}`);
          // IS IT A BOX?
          if (record.action == "nuBox" || record.action == "unBox") {
            this.dbBoxes.push(record);
          }
        } else {
          // console.log(`${rowNumber} might be our global constant...`);
          if (rowNumber == "dbglob") {
            // do something with dbglob, perhaps,
            // dbGlobLocated = true
            console.log(`rayBoxes > dbglob ${JSON.stringify(record)}`);
          }
        } // one of ours?
      });
    } // done with allkeys

  }

  oldcheckDb(): void {
    this.meta.allkeys = [];
    this.dbBoxes = [];
    let dbGlobLocated = false;
    this.db.keys()
      .then((ret) => {
        this.meta.allkeys = ret;
        if (this.meta.allkeys.length == 0) {
          this.meta.showStart = true;
          this.toastEmptyDatabase();
        } else {
          // console.log(`db has: ${JSON.stringify(this.meta.allkeys.length)} records.`);
          // console.log(`reminder, fs2 is ${this.fs2}`);
          // this.meta.glob.curBox;

          if (dbGlobLocated == false) {
            this.db.set("dbglob", this.meta.glob)
              .then((ret) => {
                this.db.get("dbglob")
                  .then((rec) => {
                    // console.log(` "dbglob: ${JSON.stringify(rec)}`);
                    // console.log(` "meta: ${JSON.stringify(this.meta)}`);
                  })
              });
          }
        }
      }); //this.db.keys()
  } //oldcheckDb

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



