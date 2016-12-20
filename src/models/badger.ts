
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export class Ute {
  db: any;
  constructor(
    public starter: Date = new Date()
  ) {
    console.log(`Ute is building new Storage facility`);

    this.db = new Storage;
  }

  /** Return the keys */

  dbKeys(): Promise<any> {
    return new Promise((resolve) => {
      this.db.keys().then((res) => {
        resolve(res);
      })
    })

  }

  iR(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => resolve("Hello world!"), 1000);
    });
  }

  /**
   * Returns an array of unique Date.valueOf strings.
   * Created by arithmetic so's they're unique.
   * @param starter: an optional Date value.
   */
  ids(): string[] {
    let stack = [];
    let base = this.starter.valueOf();
    for (let i = 0; i < 100; i++) {
      base = base + 13;
      stack.push(base.toString());
    }
    return stack;
  }

  /**
   * Receive the usual Camera-style date value.
   * Show Time with milliseconds
   * @param t: as in Date().valueOf().toString()
   */
  myTime(t: string): string {
    let slag = new Date(Number(t));
    return ("0" + slag.getHours()).slice(-2) + ":" + ("0" + slag.getMinutes()).slice(-2) + ":" + ("0" + slag.getSeconds()).slice(-2) + "." + ("00" + slag.getUTCMilliseconds()).slice(-3);
  }


}

export class DRing {
  public value: string;
  public human: string;
  constructor() {
    let when = new Date();
    // let s = when.valueOf().toString();
    // let h = when.toString();
    return ({ value: when.valueOf().toString(), human: when.toString() })
  }
} // DRing


@Injectable()
export class Badger {

  constructor(
    public id: string = '',
    public signetValue: string = '',
    public action: string = '',
    public badge: string = '',
    public thing: string = '',
    public box: string = '',
    public signetHuman: string = ''
  ) {
    let jam = new DRing();
    this.id = jam.value;
    this.signetValue = jam.value;
    this.signetHuman = jam.human;
    // this.badge = jam.value + ".jpg"; // No. Let Camera decide.
  }

  myTime(t: string): string {
    let slag = new Date(Number(t));
    return ("0" + slag.getHours()).slice(-2) + ":" + ("0" + slag.getMinutes()).slice(-2) + ":" + ("0" + slag.getSeconds()).slice(-2) + "." + ("00" + slag.getUTCMilliseconds()).slice(-3);
  }

}
