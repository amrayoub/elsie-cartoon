
import { Injectable } from '@angular/core';

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
    this.badge = jam.value + ".jpg";
  }

}

