import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Statuscodes} from '../_helpers/statuscodes.enum';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {fromPromise} from 'rxjs/internal-compatibility';


@Injectable({
  providedIn: 'root'
})
export class ApidataService {

  apiRoot = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router,) {
  }

  /*****************************************************************\
   * Default API Methods
   \****************************************************************/


  /**
   * Method to generate HTTPHeaders
   * @returns {HttpHeaders}
   */
  httpApiHeader(): HttpHeaders {

    let httpOptions;

    httpOptions = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return httpOptions;
  }


  /**
   * Method to handle HTTP Errors
   * @param error
   * @param router
   */
  private handleError(error: HttpErrorResponse, router: Router) {
    if (error.error instanceof ErrorEvent) {
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,

      switch (error.status) {
        case Statuscodes.UNAUTHORIZED:
          // console.error('locked out because of "401 Unauthorized"');
          break;
        case Statuscodes.USER_LOCKED:
          // console.error('locked out because of "423 Locked"');
          break;
        case Statuscodes.WRONG_PASSWORD:
          // console.error('locked out because of "403 Wrong Password"');
          break;
        case Statuscodes.NO_USER_FOUND:
          // console.error('locked out because of "410 No User found"');
          break;
        case Statuscodes.TOKEN_DECLINED:
          // console.error('locked out because of "402 Token not valid or expired"');
          break;
      }
      this.router.navigate(['login']);
    }
    // return an ErrorObservable with a user-facing error message
    return throwError(new Error('ERROR: ' + error.message + ' Status: ' + error.status + ' '
      + error.statusText));
  }


  /**
   * Standard GET Method
   * @param ressource
   */
  private doGet(ressource: string) {
    const headers = this.httpApiHeader();
    const apiURL = `${this.apiRoot}${ressource}`;

    return this.http.get(apiURL, {headers: headers}).pipe(
      catchError(error => {
        return this.handleError(error, this.router);
      })
    );

  }

  /**
   * Standard POST Method
   * @param ressource
   * @param httpParams
   */
  private doPost(ressource: string, httpParams) {
    const headers = this.httpApiHeader();
    const apiURL = `${this.apiRoot}${ressource}`;

    return this.http.post(apiURL, httpParams, {headers: headers}).pipe(
      catchError(error => {
        return this.handleError(error, this.router);
      })
    );
  }


  /**
   * Standard PUT Method
   * @param ressource
   * @param httpParams
   */
  private doPut(ressource: string, httpParams) {
    const headers = this.httpApiHeader();
    const apiURL = `${this.apiRoot}${ressource}`;

    return this.http.put(apiURL, httpParams, {headers: headers}).pipe(
      catchError(error => {
        return this.handleError(error, this.router);
      })
    );
  }

  /**
   * Standard DELETE Method
   * @param ressource
   */
  private doDelete(ressource: string) {
    const headers = this.httpApiHeader();
    const apiURL = `${this.apiRoot}${ressource}`;


    return this.http.delete(apiURL, {headers: headers}).pipe(
      catchError(error => {
        return this.handleError(error, this.router);
      })
    );
  }


  /*****************************************************************\
   * Custom API Methods
   \****************************************************************/

  public getStart() {
    const ressource = this.apiRoot + `/`;


    // Create an Observable out of a promise
    const data = fromPromise(fetch(ressource));
    // Subscribe to begin listening for async result
    data.subscribe({
      next(response) {
        if (response['data']) {
          console.log(response['data']);
          return response['data'];
        } else {
          console.log(response);
          return [];
        }

      },
      error(err) {
        console.error('Error: ' + err);
      },
      complete() {
        console.log('Completed');
      }
    });
  }


  public getEvents() {
    const ressource = this.apiRoot + `/events`;

    this.doGet(ressource).subscribe(
      response => {
        if (response['data']) {
          return response['data'];
        } else {
          console.log(response);
          return [];
        }
      }, error => {
        console.error(error);
      });
  }


  getEventsJSON() {
    const ressource = this.apiRoot + `/events`;
    //return this.http.get('http://api.trombongos.ch' + ressource).pipe(map(
    return this.http.get(ressource).pipe(map(
      response => {
        if (response['data']) {
          return response['data'];
        } else {
          console.log('NoDataReceivedError');
          console.log(response);
          return [];
        }
      },
      err =>
        console.log(err)
    ));

  }

  getEventList() {

    const ressource = `/events`;

    environment;

    return this.http.get(environment.apiUrl + ressource);

  }


}
