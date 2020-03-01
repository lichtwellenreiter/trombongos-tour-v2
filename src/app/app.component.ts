import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ApidataService} from './_services/apidata.service';
import {environment} from '../environments/environment';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  @ViewChild('exampleModal') modal: ElementRef;
  auftritte;
  environment;


  constructor(private apidata: ApidataService) {
    this.environment = environment;
    this.auftritte = '';
  }

  ngOnInit(): void {
    $('#exampleModal').show();
    this.getEvents();
  }

  reloadEvents() {
    $('#exampleModal').show();
    this.getEvents();
  }

  getEvents() {
    this.apidata.getEventList().subscribe((data: Array<object>) => {
      this.auftritte = data['data'];
      // console.log(this.auftritte);
      $('#exampleModal').hide();
    });
  }

  filterEvents() {

    const startDate = new Date(environment.startSaison);
    const endDate = new Date(environment.endSaison);

    const resultProductData = this.auftritte.filter((a) => {
      let hitDates = a.ProductHits || {};
      // extract all date strings
      hitDates = Object.keys(hitDates);
      // convert strings to Date objcts
      hitDates = hitDates.map((date) => {
        return new Date(date);
      });
      // filter this dates by startDate and endDate
      const hitDateMatches = hitDates.filter((date) => {
        return date >= startDate && date <= endDate;
      });
      // if there is more than 0 results keep it. if 0 then filter it away
      return hitDateMatches.length > 0;
    });
    // console.log(resultProductData);

  }

}


