import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Pako provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Pako {
  data: any;

  constructor(public http: Http) {
    console.log('Hello Pako Provider');
    this.data = [
      { name: 'Microsoft', code: 324, product: 'Windows 10' },
      { name: 'Apple', code: 678, product: 'iPhone 7' },
      { name: 'Google', code: 567, product: 'Pixel' },
      { name: 'Oracle', code: 89, product: 'RDBMS' },
      { name: 'IBM', code: 542, product: 'Computer Hardware and Software' }
    ];
  }

  loadAll() {
    return Promise.resolve(this.data)
      .catch((err) => {
        console.log('error in this.data ' + JSON.stringify(err))
      });
  }


} // Pako
