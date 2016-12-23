import { Component } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File, Entry, FileError } from 'ionic-native';
import { MediaCapture, MediaFile, CaptureImageOptions, CaptureError } from 'ionic-native';

import { Ute, Badger, DRing } from '../../models/badger';
import { MM } from '../../models/mm';

declare var cordova: any;

@Component({
  selector: 'page-about',
  templateUrl: 'cam.html'
})

export class CamPage {

  foods: string[];
  thePix: any[] = [];
  memBadgers: Badger[] = [];
  freshIds: string[] = [];
  fs2: any;
  dbBoxes: any[];
  areWeLocal: boolean;
  mm: any;

  constructor(public navCtrl: NavController, public db: Storage, private tabs: Tabs) {
    this.foods = ["food-1.jpg", "food-2.jpg", "food-3.jpg", "food-4.jpg", "food-5.jpg", "food-6.jpg", "food-7.jpg", "food-8.jpg", "food-9.jpg"];
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

  ionViewWillEnter() {
    this.mm = MM.getInstance();
    this.mm.mmRead();
  }

  ionViewDidLoad() {
    if (this.mm && this.mm.justBoxes && this.mm.justBoxes.length === 0) {
      this.tabs.select(2);
    }
  }

  ionViewWillLeave() {
    // console.log(`box.ts will leave`);
    this.mm.mmWrite();
  }

  shuffleFoods(arr) {
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
    this.thePix = [];
    this.freshIds = new Ute().ids(); // use slice(0,1)
    this.multiPix();
  }

  sMeF() {
    // *** MediaFile[]:
    let mf = [{ "name": "1482515754815.jpg", "localURL": "cdvfile://localhost/sdcard/DCIM/Camera/1482515754815.jpg", "type": "image/jpeg", "lastModified": null, "lastModifiedDate": 1482515760000, "size": 2828750, "start": 0, "end": 0, "fullPath": "file:///storage/emulated/0/DCIM/Camera/1482515754815.jpg" }, { "name": "1482515764269.jpg", "localURL": "cdvfile://localhost/sdcard/DCIM/Camera/1482515764269.jpg", "type": "image/jpeg", "lastModified": null, "lastModifiedDate": 1482515767000, "size": 2767202, "start": 0, "end": 0, "fullPath": "file:///storage/emulated/0/DCIM/Camera/1482515764269.jpg" }, { "name": "1482515769877.jpg", "localURL": "cdvfile://localhost/sdcard/DCIM/Camera/1482515769877.jpg", "type": "image/jpeg", "lastModified": null, "lastModifiedDate": 1482515773000, "size": 1858776, "start": 0, "end": 0, "fullPath": "file:///storage/emulated/0/DCIM/Camera/1482515769877.jpg" }]
    // *** thePix:
    let tp = [{ "name": "1482515754815.jpg", "localURL": "cdvfile://localhost/sdcard/DCIM/Camera/1482515754815.jpg", "type": "image/jpeg", "lastModified": null, "lastModifiedDate": 1482515760000, "size": 2828750, "start": 0, "end": 0, "fullPath": "file:///storage/emulated/0/DCIM/Camera/1482515754815.jpg" }, { "name": "1482515764269.jpg", "localURL": "cdvfile://localhost/sdcard/DCIM/Camera/1482515764269.jpg", "type": "image/jpeg", "lastModified": null, "lastModifiedDate": 1482515767000, "size": 2767202, "start": 0, "end": 0, "fullPath": "file:///storage/emulated/0/DCIM/Camera/1482515764269.jpg" }, { "name": "1482515769877.jpg", "localURL": "cdvfile://localhost/sdcard/DCIM/Camera/1482515769877.jpg", "type": "image/jpeg", "lastModified": null, "lastModifiedDate": 1482515773000, "size": 1858776, "start": 0, "end": 0, "fullPath": "file:///storage/emulated/0/DCIM/Camera/1482515769877.jpg" }]
  }

  async  multiPix() {
    if (this.areWeLocal == false) {
      let opt: CaptureImageOptions = { limit: 3 };

      await MediaCapture.captureImage(opt)
        .then((data: MediaFile[]) => {
          console.log(`*** MediaFile[]: ${JSON.stringify(data)}`);
          this.thePix = data;
          console.log(`*** thePix: ${JSON.stringify(this.thePix)}`);
        },
        (err: CaptureError) => { console.error(err) }
        )
        .catch((e) => {
          console.log(`some other multiPix error ${JSON.stringify(e)}`)
        });

    } else {
      this.areWeLocal = true; // a friendly reminder
      let theirNames: string[] = this.shuffleFoods(this.foods);
      theirNames.forEach(element => {
        this.thePix.push(this.fs2 + element);
      });
      // console.log(`THING: ${JSON.stringify(theirNames)}`);
    } // areWeLocal?
    this.multiStep2();
  } // multiPix()


  /** do the database dance */
  async multiStep2() {
    this.memBadgers = [];
    this.mm.curThg = '';
    this.mm.curThgBadge = '';
    let thingFirstImage: string = '';
    let rawImage: any;
    this.thePix.forEach((v, i) => {
      let rawImage = this.slashName(v);
      let xxThg: Badger = new Badger();
      xxThg.id = this.freshIds.splice(0, 1).pop();
      xxThg.signetValue = xxThg.id;
      xxThg.signetHuman = new Date(Number(xxThg.id)).toString();
      xxThg.box = this.mm.curBoxBadge;
      xxThg.badge = rawImage.name;
      this.mm.curThg = xxThg.signetValue;
      this.mm.curThgBadge = xxThg.badge;
      this.mm.badgers.push(xxThg);
      this.memBadgers.push(xxThg);
      if (i === 0) {
        xxThg.action = "nuThg";
        thingFirstImage = rawImage.name;
        xxThg.thing = rawImage.name;
      } else {
        xxThg.action = "moThg";
        xxThg.thing = thingFirstImage;
      }
    }) //thePix loop
    await this.mm.mmWrite();
    console.log(`memBadgers: ${JSON.stringify(this.memBadgers.length)} entries`);
    this.multiStep3();
  } // end.multiStep2()

  multiStep3() {
    this.multiStep4();
  }

  multiStep4() {
    if (this.areWeLocal == false) {
      this.thePix.forEach((v, i) => {
        let rawImage = this.slashName(v);
        File.moveFile(rawImage.path, rawImage.name, this.fs2, rawImage.name)
          .then(
          (val: Entry) => {
            console.log(`cam.multiStep3 moveFile: ${JSON.stringify(val)}`);

            this.writeJayson();

          },
          (err: FileError) => { console.log(`cam.multiStep3 moveFile: ${JSON.stringify(err)}`) }
          );
      });
    } else {
      // yes, we are local. Ionic will move the files.
    } // are we local?
  }

  async writeJayson() {
    let jay = [];

    await this.db.get('mmBadgers')
      .then((res) => {
        jay = JSON.parse(JSON.stringify(res));
        jay.map((line) => { line.id = undefined; });
        console.log(` cam(((1a))) ${JSON.stringify(jay.length)} records to write`);
        console.log(` cam(((1b))) prepare to remove file ${this.fs2}jayson.txt`);
      })
      .catch((err) => { console.log(`db.get mmBadgers err ${JSON.stringify(err)}`); })

    await File.removeFile(this.fs2, "jayson.txt")
      .then((res) => {
        console.log(` cam(((2))) File.remove says ${JSON.stringify(res)}`);
      })
      .catch((err) => { console.log(`File.remove err ${JSON.stringify(err)}`); })

    await File.writeFile(this.fs2, "jayson.txt", JSON.stringify(jay), true)
      .then((val: Entry) => {
        console.log(` cam(((3))) File.write says ${JSON.stringify(val)}`);
      })
      .catch((err: FileError) => { console.log(`File.write.err ${JSON.stringify(err)}`); });

    console.log(`did the writing work out okay?`);

  }






  actualCampath() {
    let jef = {
      "name": "1482460786456.jpg",
      "localURL": "cdvfile://localhost/sdcard/DCIM/Camera/1482460786456.jpg",
      "type": "image/jpeg",
      "lastModified": null,
      "lastModifiedDate": 1482460792000,
      "size": 2588071,
      "start": 0,
      "end": 0,
      "fullPath": "file:///storage/emulated/0/DCIM/Camera/1482460786456.jpg"
    }
  }

  slashName(campath): any {
    let n: string = '';
    let o: string = '';
    let p: string = '';
    if (this.areWeLocal == false) {
      console.log(`?campath? ${JSON.stringify(campath)}`);
      n = campath.name;
      console.log(`campath n? ${JSON.stringify(n)}`);
      p = campath.fullPath.split('/').slice(0, -1).join('/') + '/';
      console.log(`campath p? ${JSON.stringify(p)}`);
    } else {
      // console.log(`?campath? ${JSON.stringify(campath)}`);
      n = campath.split('/').pop();
      // console.log(`campath n? ${JSON.stringify(n)}`);
      o = campath.split('/').slice(0, -1).join('/') + '/';
      // console.log(`campath o? ${JSON.stringify(o)}`);
      p = o.replace(':', '://');
      // console.log(`campath p? ${JSON.stringify(p)}`);
    }
    return { 'name': n, 'path': p };
  }

  test() {
    console.log(`test() is doing nothing right now.`);

  }


  /** * OLD CODES HOME */

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

  meta: any = {};

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
              // console.log(`Cam,checkDb,get(dbglob) ${JSON.stringify(res)}`);
              if (res == undefined) {
                // do nothing
              } else {
                this.meta.glob = res;
                if (this.meta.glob.curBoxBadge) {
                  // this.showCurBox = true;
                }
              }
            })
        }
      });
  }


} //CamPage

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
