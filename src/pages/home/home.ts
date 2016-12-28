import { Component } from '@angular/core';
import { App, NavController, Tabs } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Badger } from '../../models/badger';
import { MM } from '../../models/mm';
import { File, Entry, FileError } from 'ionic-native';
import { CamPage } from '../cam/cam';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})

export class HomePage {

  message: string;
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
        else { console.log(`justBoxes ${JSON.stringify(ret.length)}`); }
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
    this.db.clear().then(() => {
      console.log('Database is now empty.');
      this.message = 'Database is now empty.';
    }).catch(function (err) {
      console.log(err);
    });
  }

  test1() {
    console.log(`test1() CURRENTs`);
    console.log(`box ${this.mm.curBox}`);
    console.log(`boxbad ${this.fs2} +++ ${this.mm.curBoxBadge}`);
    console.log(`thg ${this.mm.curThg}`);
    console.log(`thgbad ${this.fs2} +++ ${this.mm.curThgBadge}`);

    // var joe = new ("192.168.1.104", "matt", "this is fun");

    // console.log(`${JSON.stringify(joe)}`);


  }

  test2() {
    console.log(`ONE THING`);
    let bob = "1482871670509"; // <---------- change me
    this.mm.oneThing(bob)
      .then((zig) => {
        console.log(`asked for ${JSON.stringify(bob)},`);
        console.log(`  got ${JSON.stringify(zig)} items`);
      });
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

  //12-22 21:54:50.248: I/chromium(8764): [INFO:CONSOLE(49235)] "Error: Uncaught (in promise): [object Object]

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

