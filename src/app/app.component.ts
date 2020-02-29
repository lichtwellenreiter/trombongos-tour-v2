import {Component, OnInit} from '@angular/core';
import {ApidataService} from './_services/apidata.service';
import {environment} from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  auftritte;
  dataLoaded: Promise<boolean>;
  environment;

  constructor(private apidata: ApidataService) {
    this.environment = environment;
    this.auftritte = '';
  }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.apidata.getEventList().subscribe((data: Array<object>) => {
      this.auftritte = data['data'];
      console.log(this.auftritte);
      this.dataLoaded = Promise.resolve(true);
    });
  }

  filterEvents() {

    const startDate = new Date(environment.startSaison);
    const endDate = new Date(environment.endSaison);

    const resultProductData = this.auftritte.filter(function (a) {
      let hitDates = a.ProductHits || {};
      // extract all date strings
      hitDates = Object.keys(hitDates);
      // convert strings to Date objcts
      hitDates = hitDates.map(function (date) {
        return new Date(date);
      });
      // filter this dates by startDate and endDate
      const hitDateMatches = hitDates.filter(function (date) {
        return date >= startDate && date <= endDate;
      });
      // if there is more than 0 results keep it. if 0 then filter it away
      return hitDateMatches.length > 0;
    });
    console.log(resultProductData);

  }

}


