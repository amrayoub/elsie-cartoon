import { Injectable } from '@angular/core';

/** 
 * @param value = machine-readable
 * @param human = your grandma
 */
export class DRing<Object> {
  public value: string;
  public human: string;
  constructor() {
    let when = new Date();
    // let s = when.valueOf().toString();
    // let h = when.toString();
    return ({ value: when.valueOf().toString(), human: when.toString() })
  }
}

@Injectable()
export class Jline {
  id: string;
  signetValue: string;
  action: string;
  badge: string;
  thing: string;
  box: string;
  signetHuman: string;

  constructor(
    id: string = 'z',
    signetValue: string = 'z',
    action: string = 'z',
    badge: string = 'z',
    thing: string = 'z',
    box: string = 'z',
    signetHuman: string = 'z'
  ) {
    let t1 = new Date();
    let t1val = t1.valueOf();
    let t1str = t1.valueOf().toString();
    let t2val = t1val + 1478;
    let t2str = t2val.toString();
    let t2 = new Date(t2val).toString();

    if (id == 'z') {
      this.id = t1str;
    } else {
      this.id = id;
    }
    if (signetValue == 'z') {
      this.signetValue = t2str;
    } else {
      this.signetValue = signetValue;
    }
    if (action == 'z') {
      this.action = 'xxAbc';
    } else {
      this.action = action;
    }
    if (badge == 'z') {
      this.badge = this.id + ".jpg";
    } else {
      this.badge = badge;
    }
    if (thing == 'z') {
      this.thing = '';
    } else {
      this.thing = thing;
    }
    if (box == 'z') {
      this.box = '';
    } else {
      this.box = box;
    }
    if (signetHuman == 'z') {
      this.signetHuman = t2;
    } else {
      this.signetHuman = signetHuman;
    }

  }


  // badge = box
  public setNuBox(action: string = 'nuBox') {
    let jam: DRing<Object> = new DRing();
    this.signetValue = jam.value;
    this.signetHuman = jam.human;
    this.box = this.badge;
    this.action = action;
    return this;
  }

  // badge = thg
  public setNuThg(box: string) {
    let jam: DRing<Object> = new DRing();
    this.signetValue = jam.value;
    this.signetHuman = jam.human;
    this.thing = this.badge;
    this.box = box;
    this.action = "nuThg";
    return this;
  }

  // badge = only badge
  public setMoThg(thg: string, box: string) {
    let jam: DRing<Object> = new DRing();
    this.signetValue = jam.value;
    this.signetHuman = jam.human;
    this.thing = thg;
    this.box = box;
    this.action = "moThg";
    return this;
  }

  public hello() {
    console.log("JLINE: Saying 'hi.'");
  }


  /** DO NOT USE - FOR SHAME PURPOSES ONLY - DUMBNESS */
  init(id: string = 'z', signetValue: string = 'z', action: string = 'z', badge: string = 'z', thing: string = 'z', box: string = 'z', signetHuman: string = 'z') {
    // begin here. 

    return Promise.resolve()
      .then(() => {
        // two dates: close but not exact 
        let base = new Date();
        setTimeout(() => {
          let alt = new Date();
          console.log("Jline constructor");
          if (id == 'z') {
            this.id = base.valueOf().toString();
          } else {
            this.id = id;
          }
          if (signetValue == 'z') {
            this.signetValue = alt.valueOf().toString();
          } else {
            this.signetValue = signetValue;
          }
          if (action == 'z') {
            this.action = 'xxAbc';
          } else {
            this.action = action;
          }
          if (badge == 'z') {
            this.badge = this.id;
          } else {
            this.badge = badge;
          }
          if (thing == 'z') {
            this.thing = '';
          } else {
            this.thing = thing;
          }
          if (box == 'z') {
            this.box = '';
          } else {
            this.box = box;
          }
          if (signetHuman == 'z') {
            this.signetHuman = alt.toString();
          } else {
            this.signetHuman = signetHuman;
          }
          console.log("Jline constructor.this: " + JSON.stringify(this));
          return this;
        }, 188);

      }); // Promise.resolve
  } // innit?

} // Jline



  // constructor1(
  //   id: string = 'z',
  //   signetValue: string = 'z',
  //   action: string = 'z',
  //   badge: string = 'z',
  //   thing: string = 'z',
  //   box: string = 'z',
  //   signetHuman: string = 'z'
  // ) {
  //   // two dates: close but not exact 
  //   let base = new Date();
  //   setTimeout(() => {
  //     let alt = new Date();
  //     console.log("Jline constructor");
  //     if (id == 'z') {
  //       this.id = base.valueOf().toString() + ".jpg"
  //     } else {
  //       this.id = id;
  //     }
  //     if (signetValue == 'z') {
  //       this.signetValue = alt.valueOf().toString();
  //     } else {
  //       this.signetValue = signetValue;
  //     }
  //     if (action == 'z') {
  //       this.action = 'xxAbc';
  //     } else {
  //       this.action = action;
  //     }
  //     if (badge == 'z') {
  //       this.badge = this.id;
  //     } else {
  //       this.badge = badge;
  //     }
  //     if (thing == 'z') {
  //       this.thing = '';
  //     } else {
  //       this.thing = thing;
  //     }
  //     if (box == 'z') {
  //       this.box = '';
  //     } else {
  //       this.box = box;
  //     }
  //     if (signetHuman == 'z') {
  //       this.signetHuman = alt.toString();
  //     } else {
  //       this.signetHuman = signetHuman;
  //     }
  //     console.log("Jline constructor.this: " + JSON.stringify(this));
  //   }, 188);
  // }


  //  asyncFunc() {
  //     return Promise.resolve()
  //     .then(() => {
  //         doSomethingSync();
  //         return doSomethingAsync();
  //     })
  //     .then(result => {
  //         //···
  //     });
  // }

  // function asyncFunc() {
  //   return New Promise((resolve, reject) => {
  //     doSomethingThatMightThrow();
  //     doSomethingAsync(err => (err ? reject(err) : resolve()))
  //   });
  // }

  // smelt(o) {
  //   return new Promise((resolve, reject) => {
  //     resolve(o),
  //       reject(o)
  //   });
  // }
