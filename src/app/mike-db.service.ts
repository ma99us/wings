import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from "rxjs/internal/Observable";
import {HOST_API_KEY, HOST_DB_NAME, HOST_LOCATION} from "./app-config";

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

  private getHostApiUrl(dbName: string | null): string {
    if (dbName === null) {
      return this.hostApiUrl;
    }
    let apiHost = HOST_LOCATION ? 'http://' + HOST_LOCATION : '';
    return apiHost + '/mike-db/api/' + dbName + '/';
  };

  private getHostWebsocketUrl(dbName: string | null): string {
    if (dbName === null) {
      return this.hostWebsocketUrl;
    }
    let socketHost = HOST_LOCATION ? 'ws://' + HOST_LOCATION : '';
    return socketHost + '/mike-db/subscribe' + '/' + dbName;
  };

  /**
   * Populates http headers for any mike-db API http request
   * @param value
   * @returns {any}
   */
  private prepareHeaders(value: any): any {
    const headers = {
      'API_KEY': HOST_API_KEY,    // always send api key with every request header
      'Content-Type': 'application/json;charset=utf-8'
    };
    if (typeof value === 'string' && value !== null) {
      headers['Content-Type'] = 'text/plain;charset=utf-8';
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
  get(key: string, firstResult = 0, maxResults = -1, fields: string | null = null, dbName: string | null = null): Observable<Object> {
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

    return this.http.get<Object>(url + key, {
      headers: this.prepareHeaders(null),
      params: params
    })
    // .then(response => {
    //   return validateResponse(response);
    // }
  }

  /**
   * Add a single item in a collection associated with the key
   */
  add(key: string, value: any, index: number | null = null, dbName: string | null = null): Observable<Object> {
    const url = this.getHostApiUrl(dbName);
    if (!url) {
      throw "mike-db is not initialized";
    }

    let params = new HttpParams();
    if (index != null) {
      params = params.set('index', index);
    }

    return this.http.post<Object>(url + key, value, {
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
  update(key: string, value: any, index: number | null = null, dbName: string | null = null): Observable<Object> {
    const url = this.getHostApiUrl(dbName);
    if (!url) {
      throw "mike-db is not initialized";
    }

    let params = new HttpParams();
    if (index != null) {
      params = params.set('index', index);
    }

    return this.http.patch<Object>(url + key, value, {
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
  delete(key: string, value: any, id: number | null = null, index: number | null = null, dbName: string | null = null): Observable<Object> {
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
    } else if (value != null) {
      params = params.set('id', value.id);
    }

    return this.http.delete<Object>(url + key, {
      headers: this.prepareHeaders(value),
      params: params,
      body: value
    });
    // .then(response => {
    //   return validateResponse(response);
    // }
  }
}
