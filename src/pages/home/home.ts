import { Component, ChangeDetectorRef } from '@angular/core';
import { App, NavController, Tabs } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Badger } from '../../models/badger';
import { MM } from '../../models/mm';
import { File, Entry, FileError, Transfer, FileUploadResult } from 'ionic-native';
import { CamPage } from '../cam/cam';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/concatMap';

declare var cordova: any;

export class FakeTransfer {
  upload(name, url, opts = {}) {
    let justname = name.split('/').pop();
    return new Promise((resolve) => {
      let sluggo = JSON.stringify({
        bytesSent: 0,
        responseCode: 9000,
        response: "Groovy, Babe",
        headers: { filename: justname }
      });
      resolve({ response: sluggo })
    })
  }
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})

export class HomePage {

  sinatraServer: string = "drcrook:/home/vagrant/sinatra";

  // dogTransfer: Transfer = new Transfer();
  tattler: any;
  atlasTransfer: any;
  message: string;
  nubNotes: string;
  meta: any = {};
  showStart: boolean;
  bytes_free: any;
  fs2: any;
  areWeLocal: boolean;
  mm: any;
  uploading: boolean = false;
  xferImage: string = '';
  testBoxes: any[] = [];
  moeSent: any[] = [];
  moeDone: any[] = [];

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    public navCtrl: NavController,
    public db: Storage,
    private tabs: Tabs
  ) {
    try {
      this.areWeLocal = false;
      this.fs2 = cordova.file.externalDataDirectory;
      this.atlasTransfer = new Transfer();
    } catch (e) {
      this.areWeLocal = true;
      this.fs2 = "assets/";
    } finally {
      console.log(`Home: Today's FS2 is: ${this.fs2}`);
    } //try

  } //constructor

  ionViewWillEnter() {
    // every time
    this.mm = MM.getInstance();
    this.mm.mmRead();
    this.message = '';
    if (this.areWeLocal == false) {
      this.checkDbFs();
    } else {
      // some other checkDb here?
    }
    this.db.get('mmJustBoxes')
      .then((ret) => {
        if (ret.length === 0) { this.tabs.select(2); }
        else {
          this.testBoxes = ret; // see test4() below
          console.log(`justBoxes ${JSON.stringify(ret.length)}`);
        }
      })
      .catch((e) => {
        console.log(`justBoxes fail ${JSON.stringify(e)}`);
        this.tabs.select(2);
      })
  }

  ionViewDidEnter() {
    // every time
  }

  ionViewDidLoad() {
    // init only

  }

  ionViewWillLeave() {
    // this.mm.mmWrite();
    this.uploading = false;
  }

  async checkForBrokenImages() {
    // alternative to checkDbFs
  }

  /** how many Badgers in db versus how many images in ~/files */
  async checkDbFs() {
    let lenDb: number = 0;
    let lenFs: number = 0;
    let pathToImages: string = '';
    pathToImages = this.fs2;
    await this.db.get('mmBadgers')
      .then((res) => {
        if (res.hasOwnProperty('length') && res.length > 0) {
          // halfway
          lenDb = res.length;
        }
      })
      .catch((e) => {
        console.log(`checkDbFs DB.err ${JSON.stringify(e)}`);
      })
    await File.listDir(pathToImages, '')
      .then((ret) => {
        console.log(`listdir ${JSON.stringify(ret)}`);
        console.log(`listdir ${JSON.stringify(ret)}`);

        if (ret.hasOwnProperty('length') && ret.length > 0) {
          // other half
          lenFs = ret.length;
        }
      })
      .catch((e) => {
        console.log(`checkDbFs FS.err ${pathToImages} e: ${JSON.stringify(e)}`);
      })
    console.log(`checkDbFs -- lenDb ${lenDb}, lenFs ${lenFs}`);

    if (lenFs == 0 && lenDb !== 0) {
      // problem
      this.message = "There are no pictures in " + pathToImages + ", yet there's stuff in the database. Perhaps it should be emptied?"
    }

  }

  // listDir(path, dirName)

  emptyDatabase() {
    this.uploading = false;
    this.mm.mmClear()
      .then(() => {
        console.log(`mmClear ok`);
        // options are useless. :/
        this.tabs.select(2, {
          animate: true,
          animation: 'fade',
          duration: 4000
        });
      }).catch(function (err) {
        console.log(`mmClear err ${err}`);
      });
  }

  test1() {
    console.log(`test1() CURRENTs`);
    console.log(`box ${this.mm.curBox}`);
    console.log(`boxbad ${this.fs2} +++ ${this.mm.curBoxBadge}`);
    console.log(`thg ${this.mm.curThg}`);
    console.log(`thgbad ${this.fs2} +++ ${this.mm.curThgBadge}`);
    if (this.areWeLocal) {
      console.log(`OUT OF DATE`);
    } else {
      let options = {
        fileKey: 'image',
        fileName: this.mm.curBoxBadge,
        headers: {}
      }
      let theFile = this.fs2 + this.mm.curBoxBadge;
      let urlSpot = "http://192.168.1.11/up";
      this.atlasTransfer.upload(theFile, urlSpot, options)
        .then((data) => {
          console.log(`fileTransfer got ${JSON.stringify(data)}`);
        }, (err) => {
          console.log(`fileTransferror ${JSON.stringify(err)}`);
        })
    }
  }//test1

  formertest2() {
    this.uploading = true;
    console.log(`ONE BOX`);
    let bob = this.mm.curBox;
    // this.tattler = this.mm.curBox;
    this.mm.oneBox(bob)
      .then((zag) => {
        console.log(`TEST 2 ASKS FOR ${JSON.stringify(bob)},`);
        console.log(`  GOT ${JSON.stringify(zag.length)} badges`);
        if (this.areWeLocal) {
          console.log(`NOT touching FILE TRANSFER`);

          // zag.forEach((v, k) => {
          //   setTimeout(() => {
          //     this.xferImage = this.fs2 + v.badge;
          //     console.log(`  ${v.action} i ${v.id} b ${v.box}`);
          //   }, 1000);
          // });

          for (let i = 0; i < zag.length; i++) {
            setTimeout(() => {
              this.xferImage = this.fs2 + zag[i].badge;
              console.log(`  ${zag[i].action} i ${zag[i].id} b ${zag[i].box}`);
            }, 1000);
          }


        } else {
          this.test2push(zag)
            .then((ret) => {
              console.log(`DONE UPLOADING ${JSON.stringify(ret)}`);
            });
        }
      })
      .catch((err) => {
        console.log(`mm.oneBox err ${JSON.stringify(err)}`);
      });
  }

  test2push(thebadgers) {
    return new Promise((resolve) => {
      let options = { fileKey: 'image', fileName: 'replacedInLoop', headers: {} }
      let theFile: string = '';
      let urlSpot = "http://192.168.1.11/up";
      thebadgers.forEach((v, k) => {
        options.fileName = v.badge;
        theFile = this.fs2 + v.badge;
        this.atlasTransfer.upload(theFile, urlSpot, options)
          .then((data) => {
            this.xferImage = theFile;
            console.log(`test2 ${JSON.stringify(data)}`);
          }), (err) => {
            console.log(`test2err ${JSON.stringify(err)}`);
          }
        if (k >= v.length) {
          resolve({ message: 'too soon?' })
        }
      })//zag.forEach
    })
  }

  plan10() {
    let p10 = "oneBox 0: \"1482985400961\"";
    p10 += "oB1 looking for \"1482985400961\"";
    p10 += "raw ret";
    let p11 = [
      { "id": "1482896371686", "signetValue": "1482896371686", "action": "nuBox", "badge": "1482896393804.jpg", "thing": "", "box": "1482896393804.jpg", "signetHuman": "Tue Dec 27 2016 21:39:31 GMT-0600 (CST)" }, { "id": "1482896400039", "signetValue": "1482896400039", "action": "nuBox", "badge": "1482896407097.jpg", "thing": "", "box": "1482896407097.jpg", "signetHuman": "Tue Dec 27 2016 21:40:00 GMT-0600 (CST)" }, { "id": "1482896423908", "signetValue": "1482896423908", "action": "nuBox", "badge": "1482896433287.jpg", "thing": "", "box": "1482896433287.jpg", "signetHuman": "Tue Dec 27 2016 21:40:23 GMT-0600 (CST)" }, { "id": "1482896444285", "signetValue": "1482896444285", "action": "nuThg", "badge": "1482896444315.jpg", "thing": "1482896444315.jpg", "box": "1482896433287.jpg", "signetHuman": "Tue Dec 27 2016 21:40:44 GMT-0600 (CST)" }, { "id": "1482896444298", "signetValue": "1482896444298", "action": "moThg", "badge": "1482896450272.jpg", "thing": "1482896444315.jpg", "box": "1482896433287.jpg", "signetHuman": "Tue Dec 27 2016 21:40:44 GMT-0600 (CST)" }, { "id": "1482896444311", "signetValue": "1482896444311", "action": "moThg", "badge": "1482896460306.jpg", "thing": "1482896444315.jpg", "box": "1482896433287.jpg", "signetHuman": "Tue Dec 27 2016 21:40:44 GMT-0600 (CST)" }, { "id": "1482911116343", "signetValue": "1482911116343", "action": "nuThg", "badge": "1482911116392.jpg", "thing": "1482911116392.jpg", "box": "1482896433287.jpg", "signetHuman": "Wed Dec 28 2016 01:45:16 GMT-0600 (CST)" }, { "id": "1482911116356", "signetValue": "1482911116356", "action": "moThg", "badge": "1482911166316.jpg", "thing": "1482911116392.jpg", "box": "1482896433287.jpg", "signetHuman": "Wed Dec 28 2016 01:45:16 GMT-0600 (CST)" }, { "id": "1482911116369", "signetValue": "1482911116369", "action": "moThg", "badge": "1482911175142.jpg", "thing": "1482911116392.jpg", "box": "1482896433287.jpg", "signetHuman": "Wed Dec 28 2016 01:45:16 GMT-0600 (CST)" }, { "id": "1482985400960", "signetValue": "1482985400960", "action": "nuBox", "badge": "1482985411108.jpg", "thing": "", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 22:23:20 GMT-0600 (CST)" }, { "id": "1482989076874", "signetValue": "1482989076874", "action": "nuThg", "badge": "1482989076927.jpg", "thing": "1482989076927.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:24:36 GMT-0600 (CST)" }, { "id": "1482989076887", "signetValue": "1482989076887", "action": "moThg", "badge": "1482989087766.jpg", "thing": "1482989076927.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:24:36 GMT-0600 (CST)" }, { "id": "1482989076900", "signetValue": "1482989076900", "action": "moThg", "badge": "1482989094325.jpg", "thing": "1482989076927.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:24:36 GMT-0600 (CST)" }, { "id": "1482989113003", "signetValue": "1482989113003", "action": "nuThg", "badge": "1482989113015.jpg", "thing": "1482989113015.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:25:13 GMT-0600 (CST)" }, { "id": "1482989113016", "signetValue": "1482989113016", "action": "moThg", "badge": "1482989119537.jpg", "thing": "1482989113015.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:25:13 GMT-0600 (CST)" }, { "id": "1482989113029", "signetValue": "1482989113029", "action": "moThg", "badge": "1482989125110.jpg", "thing": "1482989113015.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:25:13 GMT-0600 (CST)" }];
    let p12 = "EXCEPTION: Uncaught (in promise): [object Object]";
    let p13 = "ORIGINAL STACKTRACE:"
    let p14 = "Error: Uncaught (in promise): [object Object]"

  }

  plan9() {
    let oB1lookingfor = "1482985400961";

    let rawret = [
      { "id": "1482896371686", "signetValue": "1482896371686", "action": "nuBox", "badge": "1482896393804.jpg", "thing": "", "box": "1482896393804.jpg", "signetHuman": "Tue Dec 27 2016 21:39:31 GMT-0600 (CST)" }, { "id": "1482896400039", "signetValue": "1482896400039", "action": "nuBox", "badge": "1482896407097.jpg", "thing": "", "box": "1482896407097.jpg", "signetHuman": "Tue Dec 27 2016 21:40:00 GMT-0600 (CST)" },
      { "id": "1482896423908", "signetValue": "1482896423908", "action": "nuBox", "badge": "1482896433287.jpg", "thing": "", "box": "1482896433287.jpg", "signetHuman": "Tue Dec 27 2016 21:40:23 GMT-0600 (CST)" },
      { "id": "1482896444285", "signetValue": "1482896444285", "action": "nuThg", "badge": "1482896444315.jpg", "thing": "1482896444315.jpg", "box": "1482896433287.jpg", "signetHuman": "Tue Dec 27 2016 21:40:44 GMT-0600 (CST)" },
      { "id": "1482896444298", "signetValue": "1482896444298", "action": "moThg", "badge": "1482896450272.jpg", "thing": "1482896444315.jpg", "box": "1482896433287.jpg", "signetHuman": "Tue Dec 27 2016 21:40:44 GMT-0600 (CST)" },
      { "id": "1482896444311", "signetValue": "1482896444311", "action": "moThg", "badge": "1482896460306.jpg", "thing": "1482896444315.jpg", "box": "1482896433287.jpg", "signetHuman": "Tue Dec 27 2016 21:40:44 GMT-0600 (CST)" },
      { "id": "1482911116343", "signetValue": "1482911116343", "action": "nuThg", "badge": "1482911116392.jpg", "thing": "1482911116392.jpg", "box": "1482896433287.jpg", "signetHuman": "Wed Dec 28 2016 01:45:16 GMT-0600 (CST)" },
      { "id": "1482911116356", "signetValue": "1482911116356", "action": "moThg", "badge": "1482911166316.jpg", "thing": "1482911116392.jpg", "box": "1482896433287.jpg", "signetHuman": "Wed Dec 28 2016 01:45:16 GMT-0600 (CST)" },
      { "id": "1482911116369", "signetValue": "1482911116369", "action": "moThg", "badge": "1482911175142.jpg", "thing": "1482911116392.jpg", "box": "1482896433287.jpg", "signetHuman": "Wed Dec 28 2016 01:45:16 GMT-0600 (CST)" },
      { "id": "1482985400960", "signetValue": "1482985400960", "action": "nuBox", "badge": "1482985411108.jpg", "thing": "", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 22:23:20 GMT-0600 (CST)" },
      { "id": "1482989076874", "signetValue": "1482989076874", "action": "nuThg", "badge": "1482989076927.jpg", "thing": "1482989076927.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:24:36 GMT-0600 (CST)" },
      { "id": "1482989076887", "signetValue": "1482989076887", "action": "moThg", "badge": "1482989087766.jpg", "thing": "1482989076927.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:24:36 GMT-0600 (CST)" },
      { "id": "1482989076900", "signetValue": "1482989076900", "action": "moThg", "badge": "1482989094325.jpg", "thing": "1482989076927.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:24:36 GMT-0600 (CST)" },
      { "id": "1482989113003", "signetValue": "1482989113003", "action": "nuThg", "badge": "1482989113015.jpg", "thing": "1482989113015.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:25:13 GMT-0600 (CST)" },
      { "id": "1482989113016", "signetValue": "1482989113016", "action": "moThg", "badge": "1482989119537.jpg", "thing": "1482989113015.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:25:13 GMT-0600 (CST)" },
      { "id": "1482989113029", "signetValue": "1482989113029", "action": "moThg", "badge": "1482989125110.jpg", "thing": "1482989113015.jpg", "box": "1482985411108.jpg", "signetHuman": "Wed Dec 28 2016 23:25:13 GMT-0600 (CST)" }];

  }

  test3() {
    console.log(`ONE THING`);
    let bob = "1482871670509"; // <---------- change me
    this.mm.oneThing(bob)
      .then((zig) => {
        console.log(`asked for ${JSON.stringify(bob)},`);
        console.log(`  got ${JSON.stringify(zig)} badges`);
      });
  }

  moSpy() {
    let whatFileTransferSays = {
      "bytesSent": 0,
      "responseCode": 9000,
      "response": "Marvellous",
      "headers": { "filename": "1483042386148.jpg" }
    }

    let carterSpyPills = {
      "response": {
        "bytesSent": 0,
        "responseCode": 9000,
        "response": "Marvellous",
        "headers": { "filename": "1483042395125.jpg" }
      },
      "responseCode": 200,
      "objectId": "",
      "bytesSent": 2274452
    }
  }

  nukeOneMoe(fname) {
    let obj = this.moeSent.find(x => x.badge === fname);
    if (obj !== undefined) {
      let index = this.moeSent.indexOf(obj);
      if (index >= 0) {
        this.moeSent.splice(index, 1);
        console.log(`nuked ${fname}`);
      }
    }

  }

  test6a() {
    console.log(`TEST6(A) / UPSIX()`);
    // let locSw = false;
    // if (this.areWeLocal) { locSw = true }
    let locSw; this.areWeLocal ? locSw = true : locSw = false;

    this.moeSent.push({ p: this.fs2, badge: 'jayson.txt' })

    this.db.get('mmBadgers')
      .then((ret) => {
        this.uploading = true;
        ret.forEach((v) => {
          this.moeSent.push({ p: this.fs2, badge: v.badge });
        })
      });
  }

  test6b() {
    console.log(`TEST6(B) / UPSIX()`);
    // let locSw = false;
    // if (this.areWeLocal) { locSw = true }
    let locSw; this.areWeLocal ? locSw = true : locSw = false;

    // this.db.get('mmBadgers')
    // .then((res) => {
    // res.forEach((xyz, k) => {
    this.moeSent.forEach((xyz, k) => {
      // console.log(`[${k}] ${JSON.stringify(xyz.badge)}`);
      this.upSix(xyz.badge, locSw).subscribe(
        (n) => {
          console.log(`[${k}]]] ${JSON.stringify(n)}`)

          /** KNOW THIS: n is bullshit; n.response is JSON */

          // {"response":"{\"bytesSent\":0,\"responseCode\":9000,\"response\":\"Marvellous\",\"headers\":{\"filename\":\"1483042411443.jpg\"}}","responseCode":200,"objectId":"","bytesSent":3286562}"

          // {\"bytesSent\":0,\"responseCode\":9000,\"response\":\"Groovy, Babe\",\"headers\":{\"filename\":\"jayson.txt\"}}}"

          let rats = JSON.parse(n.response);
          let mice = '';
          if (rats.hasOwnProperty('headers')) {
            let cats = rats.headers;
            if (cats.hasOwnProperty('filename')) {
              mice = rats.headers.filename;
              console.log(`MICE ${mice}`);
            }
          }
          this.nukeOneMoe(mice);
        },
        (e) => { console.log(`e ${e}`) },
        () => { console.log(`DONE`) }
      );

    })//.forEach
    // })//.then(res)
  }

  test7() {

  }

  upSix(fname, locSw = true) {
    return Observable.create(function (observer) {
      let moeret: any;
      let locaXfer;
      if (locSw) {
        locaXfer = new FakeTransfer();
        this.fs2 = "assets/";
      } else {
        locaXfer = new Transfer();
        this.fs2 = cordova.file.externalDataDirectory;
      }
      let fullname = this.fs2 + fname;
      let urlSpot = "http://192.168.1.11/up";
      let options = { fileKey: 'image', fileName: fullname, headers: {} }
      console.log(`LOCAXFER... ${fullname}, ${urlSpot}, ${JSON.stringify(options)}`);
      locaXfer.upload(fullname, urlSpot, options)
        .then((data) => {
          // console.log(`   locaXfer ${JSON.stringify(data)}`);
          observer.next(data);
        })
    });
  }


  upYoursWorker(fname) {
    let realfname = fname;
    if (fname.hasOwnProperty('badge')) { realfname = fname.badge; }
    let urlSpot = "http://192.168.1.11/up";
    let options = { fileKey: 'image', fileName: realfname, headers: {} }
    let locaXfer = new Transfer();
    let moeret: any;
    locaXfer.upload(realfname, urlSpot, options)
      .then((data) => {
        // this.xferImage = theFile;
        // console.log(`DATA ${JSON.stringify(data)}`);
        // console.log(`data RESPONSE ${JSON.stringify(data.response)}`);
        moeret = Object.assign({}, JSON.parse(data.response));
        // let data_RESPONSE = { "bytesSent": 0, "responseCode": 9000, "response": "Marvellous", "headers": { "filename": "1483042386148.jpg" } }
        console.log(`MOERET ${JSON.stringify(moeret.headers.filename)}`);
        this.nukeOneMoe(moeret.headers.filename);
        // moe = data;
        // console.log(`moe HEADERS ${JSON.stringify(moe.headers)}`);
        // console.log(`bytes ${data.bytesSent}`);
      })
    // .catch((err) => {
    //   console.log(`data err ${JSON.stringify(err)}`);
    // })
  }

  upYours(fname) {
    let realfname = fname;
    if (fname.hasOwnProperty('badge')) { realfname = fname.badge; }
    // console.log(`FNAME ${JSON.stringify(fname)} REAL ${JSON.stringify(realfname)}`);
    let options = { fileKey: 'image', fileName: realfname, headers: {} }
    // console.log(`OPT ${JSON.stringify(options)}`);
    let theFile: string = this.fs2 + realfname;
    let urlSpot = "http://192.168.1.11/up";
    // let moe: FileUploadResult;
    // this.upYoursWorker(theFile, urlSpot, options) ;
  }
  /** Consider...
   * 1. fun1(){ }
   *      builds xfer[], gets Observable.from
   * 2. fun2(){ }
   *      observer of fun1, next/err/done
   *      done is significant
   * 3. fun3(){ } activated by #2/done. ?how?
   *      pops xfer[], gets Observable.from
   *      emits next when answer comes back from server
   *      emits done when xfer[] is empty
   * 4. fun4(){ }
   *      observer of fun3, next/err/done
   *      next is significant
   *      done will unsubscribe all
   */

  test4() {
    this.uploading = true;
    this.moeSent = [];
    this.moeDone = [];

    this.mm.badgers.map(x => {
      this.moeSent.push({ n: x.badge, p: this.fs2 })
    });
    // console.log(`ROSTER ${JSON.stringify(this.moeSent)}`);
    let moe$ = Observable.from(this.moeSent);
    let subb = moe$.subscribe(
      (x) => {
        console.log(`MOE gets ${JSON.stringify(x)}`);
        this.upYours(x.n); // can haz more obscur?
      },
      (e) => {
        console.log(`MOE FAIL ${e}`);
      },
      () => {
        console.log(`MOE DONE`);
        // subb.unsubscribe();
      }
    );


    // let source = Observable.from(this.mm.badgers);
    // let subscription = source.subscribe(
    //   (x) => {
    //     this.upYours(x)
    //   },
    //   (e) => {
    //     console.log(`test4 ERR ${JSON.stringify(e)}`);
    //   },
    //   () => {
    //     console.log(`test4 COMPLETE`);
    //   }
    // )
  }//test4

  test5MountainWestVideo() {
    // let keyups;
    // var searchResultsSets = keyups.map(function(key){
    //   return Observable.getJSON('/search?'+input.value);
    // })
  }

  oldasynctest4() {
    let miller = this;
    let array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let boo = [];
    // console.log(`${JSON.stringify(this.mm.mmAllBadgers)}`);
    this.mm.mmAllBadgers().then((ret) => {
      boo = ret;
      console.log(`boo ${JSON.stringify(boo.length)}`);
    })
    // let source = Observable.from(this.testBoxes);
    let source = Observable.from(boo);
    let subscription = source.subscribe(
      function (x) {
        miller.upYours(x.badge);
      },
      function (err) {
        console.log('Error: ' + err);
      },
      function () {
        console.log('Completed');

      });
  }


  async writeJayson() {
    let jay = [];

    await this.db.get('mmBadgers')
      .then((res) => {
        jay = JSON.parse(JSON.stringify(res));
        jay.map((line) => { line.id = undefined; });
        console.log(` (((1a))) ${JSON.stringify(jay.length)} records to write`);
        console.log(` (((1b))) prepare to remove file ${this.fs2}jayson.txt`);
      })
      .catch((err) => { console.log(`db.get mmBadgers err ${JSON.stringify(err)}`); })

    await File.removeFile(this.fs2, "jayson.txt")
      .then((res) => {
        console.log(` (((2))) File.remove says ${JSON.stringify(res)}`);
      })
      .catch((err) => { console.log(`File.remove err ${JSON.stringify(err)}`); })

    await File.writeFile(this.fs2, "jayson.txt", JSON.stringify(jay), true)
      .then((val: Entry) => {
        console.log(` (((3))) File.write says ${JSON.stringify(val)}`);
      })
      .catch((err: FileError) => { console.log(`File.write.err ${JSON.stringify(err)}`); });

    console.log(`did the writing work out okay?`);

  }

  fileParts() {
    /**
    checkFile(path, file) Returns: Promise<boolean|FileError>

    createFile(path, fileName, replace) Returns: Promise<FileEntry|FileError>

    removeFile(path, fileName) Returns: Promise<RemoveResult|FileError>

    writeFile(path, fileName, text, options) Returns: Promise<any> Returns a Promise that resolves to updated file entry or rejects with an error. replace file if 'options' is set to true.

    writeExistingFile(path, fileName, text) Returns: Promise<void> Returns a Promise that resolves or rejects with an error.

    readAsText(path, file) Returns: Promise<string|FileError>
   */
  }

  prehistoric() {
    /**
    console.log('*maroon* getting ready to write JSON file');
    var maroonToSave = ({
      signetValue: signetValue.toString(),
      action: 'nuThg',
      badge: maroonie,
      thing: maroonie,
      box: $scope.boxKey,
      signetHuman: sigEstimateHuman
    });
    //"signetHuman": "Sat May 02 2015 09:54:12 GMT-0500 (CDT)"
    dir.getFile("jayson.txt", { create: true },
      function (file) {
        file.createWriter(
          function (fileWriter) {
            fileWriter.seek(fileWriter.length); fileWriter.write(JSON.stringify(maroonToSave) + "\n");
          },
          function (err) { console.log("maroon fileWriter fail"); });
      }, function (err) { console.log("maroon dir.getfile fail"); });
       */
  }


  /** OLD CODE HOME --------------- */

  checkFs() {
    // File.getFreeDiskSpace().then((data: any) => {
    //   this.bytes_free = data;
    // });
  }

  oldcheckDb() {
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
              console.log(`Home,oldcheckDb,dbglob ${JSON.stringify(res)}`);
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

