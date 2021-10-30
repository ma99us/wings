import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpParams} from '@angular/common/http';
import {Observable} from "rxjs/internal/Observable";
import {HOST_DB_API_KEY, HOST_DB_NAME, HOST_DB_LOCATION} from "../app-config";
import {DbType} from "./db-type";

@Injectable({
  providedIn: 'root'
})
export class MikeDbService {

  dbName: string;
  hostApiUrl: string;
  hostWebsocketUrl: string;

  constructor(private http: HttpClient) {
    this.dbName = HOST_DB_NAME;
    this.hostApiUrl = this.getHostApiUrl(this.dbName);
    this.hostWebsocketUrl = this.getHostWebsocketUrl(this.dbName);
  }

  public setDbName(dbName: string = HOST_DB_NAME) {
    this.dbName = dbName;
    this.hostApiUrl = this.getHostApiUrl(this.dbName);
    this.hostWebsocketUrl = this.getHostWebsocketUrl(this.dbName);
  };

  public getHostApiUrl(dbName: string | null = null): string {
    if (dbName === null) {
      return this.hostApiUrl;
    }
    let apiHost = HOST_DB_LOCATION ? 'http://' + HOST_DB_LOCATION : '';
    return apiHost + '/mike-db/api/' + dbName + '/';
  };

  private getHostWebsocketUrl(dbName: string | null): string {
    if (dbName === null) {
      return this.hostWebsocketUrl;
    }
    let socketHost = HOST_DB_LOCATION ? 'ws://' + HOST_DB_LOCATION : '';
    return socketHost + '/mike-db/subscribe' + '/' + dbName;
  };

  /**
   * Populates http headers for any mike-db API http request
   * @param value
   * @returns {any}
   */
  private prepareHeaders<Type>(value: Type): any {
    const headers: any = {
      'API_KEY': HOST_DB_API_KEY    // always send api key with every request header
    };
    if (typeof value === 'string' && value !== null) {
      headers['Content-Type'] = 'text/plain;charset=utf-8';
    } else if (!(value instanceof FormData)) {
      //headers['Content-Type'] = 'multipart/form-data';
      headers['Content-Type'] = 'application/json;charset=utf-8';
    }
    return headers;
  }

  /**
   * Validates HTTP result code, and resolves async request promise.
   * (not for public use)
   */
  private validateResponse(response: any): any {
    if (response && (response.status === 200 || response.status === 201)) {
      return response.data;  // resource exists or was created
    }
    else if (response && (response.status === 204)) {
      return null;   // resource is empty
    }
    else if (response && (response.status || response.statusText)) {
      let message = 'Http error:';
      if (response.status) {
        message += '(' + response.status + ')';
      }
      if (response.statusText) {
        message += ' ' + response.statusText;
      }
      throw message;
    }
    else if (response && response.message) {
      throw 'Error: ' + response.message;
    }
    else if (response) {
      throw response;
    }
    else {
      throw 'No response';
    }
  }

  /**
   * Retrieve an Object, Primitive or a Collection associated with the given Key
   * @param key
   * @param firstResult (optional) index of the first element in resulting collection to retrieve
   * @param maxResults (optional) number of elements from resulting collection to retrieve
   * @param fields  (optional) string of comma separated list of field names to populate in response
   * @param dbName
   * @returns {*} 200 if record retrieved or status code 204 when no such record
   */
  get<Type>(key: string, firstResult = 0, maxResults = -1, fields: string | null = null, dbName: string | null = null): Observable<Type> {
    const url = this.getHostApiUrl(dbName);
    if (!url) {
      throw "mike-db is not initialized";
    }

    let params = new HttpParams();
    params = params.set('firstResult', firstResult);
    params = params.set('maxResults', maxResults);
    if (fields != null) {
      params = params.set('fields', fields);
    }

    return this.http.get<Type>(url + key, {
      headers: this.prepareHeaders(null),
      params: params
    })
    // .then(response => {
    //   return validateResponse(response);
    // }
  }

  uploadFile(key: string, value: FormData, dbName: string | null = null): Observable<HttpEvent<FormData>> {
    const url = this.getHostApiUrl(dbName);
    if (!url) {
      throw "mike-db is not initialized";
    }

    if (value && !value.get('file')) {
      throw "'file' must be set in FormData";
    }

    return this.http.post<FormData>(url + key, value, {
      headers: this.prepareHeaders(value),
      reportProgress: true,
      observe: 'events'
    });
    // .then(response => {
    //   return validateResponse(response);
    // }
  }

  /**
   * Add a single item in a collection associated with the key
   */
  add<Type>(key: string, value: Type, index: number | null = null, dbName: string | null = null): Observable<Type> {
    const url = this.getHostApiUrl(dbName);
    if (!url) {
      throw "mike-db is not initialized";
    }

    let params = new HttpParams();
    if (index != null) {
      params = params.set('index', index);
    }

    return this.http.post<Type>(url + key, value, {
      headers: this.prepareHeaders(value),
      params: params
    });
    // .then(response => {
    //   return validateResponse(response);
    // }
  }

  /**
   * Modify a single item in a collection associated with the key
   */
  update<Type>(key: string, value: Type, index: number | null = null, dbName: string | null = null): Observable<Type> {
    const url = this.getHostApiUrl(dbName);
    if (!url) {
      throw "mike-db is not initialized";
    }

    let params = new HttpParams();
    if (index != null) {
      params = params.set('index', index);
    }

    return this.http.patch<Type>(url + key, value, {
      headers: this.prepareHeaders(value),
      params: params
    });
    // .then(response => {
    //   return validateResponse(response);
    // }
  }

  /**
   * Delete a single item in a collection associated with the key
   */
  delete<Type extends DbType>(key: string, value: Type | null, id: number | null = null, index: number | null = null, dbName: string | null = null): Observable<Type> {
    const url = this.getHostApiUrl(dbName);
    if (!url) {
      throw "mike-db is not initialized";
    }

    let params = new HttpParams();
    if (index != null) {
      params = params.set('index', index);
    }
    if (id != null) {
      params = params.set('id', id);
    } else if (value && value.id) {
      params = params.set('id', value.id);
    }

    return this.http.delete<Type>(url + key, {
      headers: this.prepareHeaders(value),
      params: params,
      body: value
    });
    // .then(response => {
    //   return validateResponse(response);
    // }
  }

  /**
   * Generates a random number in the range from "to" to "from" inclusive.
   */
  public static getRandomRange(from = 1, to = 999999) {
    return Math.floor(Math.random() * (to + 1 - from) + from);
  }
}
