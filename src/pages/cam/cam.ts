import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File, Entry, FileError } from 'ionic-native';
import { MediaCapture, MediaFile, CaptureImageOptions, CaptureError } from 'ionic-native';

import { Badger } from '../../models/badger';
declare var cordova: any;

@Component({
  selector: 'page-about',
  templateUrl: 'cam.html'
})
export class CamPage {

  meta: any = {};
  fs2: any;
  thg: Badger;
  dbId: string;
  areWeLocal: boolean;
  showCurBox: boolean = false;
  thePix: any[] = [];
  cats: string[];

  constructor(public navCtrl: NavController, public db: Storage) {
    this.checkDb();
    this.cats = ["food-1.jpg", "food-2.jpg", "food-3.jpg", "food-4.jpg", "food-5.jpg", "food-6.jpg", "food-7.jpg", "food-8.jpg", "food-9.jpg"];
    try {
      this.areWeLocal = false;
      this.fs2 = cordova.file.externalDataDirectory;
    } catch (e) {
      this.areWeLocal = true;
      this.fs2 = "assets/";
    } finally {
      // console.log(`Today's THG FS2 is: ${this.fs2}`);
    } //try
  }

  ionViewWillEnter() { this.checkDb(); this.checkFs(); }





  shuffleCats(arr) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
      index = Math.floor(i * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled;
  }












  addThing() {
    this.thePix = []; // Thing-based pix, we're talking about here.
    this.thg = new Badger();
    this.thg.action = "nuThg";
    this.dbId = new Date().valueOf().toString();
    this.multiPix();
  }

  /** the Multi returns tripe such as this:
   *  file:/storage/emulated/0/DCIM/Camera/<name>.jpg
   *  */
  multiPix() {
    if (this.areWeLocal == false) {
      let opt: CaptureImageOptions = { limit: 3 };
      MediaCapture.captureImage(opt)
        .then(
        (data: MediaFile[]) => {
          this.thePix = data;
          console.log(`${this.dbId} << thePix: ${JSON.stringify(this.thePix)}`);
          this.multiStep2();
        },
        (err: CaptureError) => { console.error(err) }
        );
    } else {
      this.areWeLocal = true; // a friendly reminder
      // let thisCat = "assets/" + this.cats[Math.floor(Math.random() * this.cats.length)];
      let theirNames: string[] = this.shuffleCats(this.cats);
      theirNames.forEach(element => {
        this.thePix.push(this.fs2 + element);
      });
      // console.log(`THING: ${JSON.stringify(theirNames)}`);

      this.multiStep2();
    } // areWeLocal?
  } // multiPix()


  multiStep2() {
    // TODO: Ought I be devising a db-based getter and setter for these two? I tink so...
    this.meta.glob.curThg = false;
    this.meta.glob.curThgBadge = false;
    if(this.areWeLocal == false) {

    } else {
      // yes, we are local.
    this.thePix.forEach(v => {
      let rawImage = this.slashName(v);
      // console.log(`ms2/rawimage: ${JSON.stringify(rawImage)}`);



    }) //thePix loop

      // File.moveFile(this.fromPath, shot.name, this.fs2, shot.name).then(
      //   (val: Entry) => {
      //     // console.log("** mPP Move apparently OK ", JSON.stringify(val));
      //   },
      //   (err: FileError) => { console.log("** mPP BAD MOVE ** " + err.message) }
      // );

    }



    // first image = curThg
    // let tmp = this.slashName(this.images[0].fullPath)






    // console.log('** multiPostProcessing - this.curThg, Path: ' + this.curThg + " | " + this.fromPath);

    // /** images is a MediaFile */
    // this.images.forEach((shot, index) => {
    //   /** filesystem */
    //   console.log("** mPP - filesystemFr: " + this.fromPath + shot.name);
    //   console.log("** mPP - filesystemTo: " + this.fs2 + shot.name);
    //   File.moveFile(this.fromPath, shot.name, this.fs2, shot.name).then(
    //     (val: Entry) => {
    //       // console.log("** mPP Move apparently OK ", JSON.stringify(val));
    //     },
    //     (err: FileError) => { console.log("** mPP BAD MOVE ** " + err.message) }
    //   );
    //   /** database */
    //   let signow: Date = new Date();
    //   let action: any = 'xxYyy';
    //   if (0 == index) { action = 'nuThg' } else { action = 'moThg' }
    //   console.log('** multiPostProcessing ' + index + ' let action: ' + action);
    //   //
    //   let copper = {
    //     'signetValue': signow.valueOf(),
    //     'action': action,
    //     'badge': shot.name,
    //     'thing': this.curThg,
    //     'box': this.curBox,
    //     'signetHuman': signow
    //   };

    //   console.log('copper ' + JSON.stringify(copper));
    //   //
    //   /** looks like the db key will (always?) be the badge name. Makes sense. So far... */
    //   this.db.set(shot.name, {
    //     'signetValue': signow.valueOf(),
    //     'action': action,
    //     'badge': shot.name,
    //     'thing': this.curThg,
    //     'box': this.curBox,
    //     'signetHuman': signow
    //   }).then((ret) => {
    //     console.log("** mPP - database.set() returned: " + JSON.stringify(ret));
    //   });
    // }); // images.forEach
    // /** I think this will asynch itself out of position, but... */
    // this.showThing(this.curThg);
  } // multiStep2()

  slashName(path) {
    let n = path.split('/').pop();
    let o = path.split('/').slice(0, -1).join('/') + '/';
    let p = o.replace(':', '://');
    return { 'name': n, 'path': p };
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
      // console.log(`Cam: Today's FS2 is: ${this.fs2}`);
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
              // console.log(`Cam,checkDb,dbglob ${JSON.stringify(res)}`);
              if (res == undefined) {
                // do nothing
              } else {
                this.meta.glob = res;
                if (this.meta.glob.curBoxBadge) {
                  this.showCurBox = true;
                }
              }
            })
        }
      });
  }


} //CamPage

