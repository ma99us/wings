import {Injectable} from '@angular/core';
import {MikeDbService} from "../services/mike-db.service";
import {Observable} from "rxjs/internal/Observable";
import {noop} from 'rxjs';
import {finalize, map} from "rxjs/operators";
import {Taster} from "./taster";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Router} from "@angular/router";
import {MikeSecurityService} from "../services/mike-security.service";
import {LoginDialog} from "./login/login-dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpEvent, HttpEventType} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TastersService {
  private tasterSubject: BehaviorSubject<Taster | undefined>;
  public taster: Observable<Taster | undefined>;

  constructor(private mikeDb: MikeDbService, private router: Router, private mikeSecurityService: MikeSecurityService,
              private modalService: NgbModal) {
    let item = localStorage.getItem('taster');
    this.tasterSubject = new BehaviorSubject<Taster | undefined>(item ? JSON.parse(item) : undefined);
    this.taster = this.tasterSubject.asObservable();
  }

  public get currentTaster(): Taster | undefined {
    return this.tasterSubject.value;
  }

  /**
   * Checks if given Taster is currently logged in.
   * @param {Taster} taster
   * @returns {boolean}
   */
  public isCurrentTaster(taster: Taster): boolean {
    return this.currentTaster !== undefined && taster.id == this.currentTaster.id;  // FIXME: '==' is intentional!
  }

  /**
   * Tries to login if needed. Returns promise.
   * @param {Taster} requiredTaster
   * @returns {any}
   */
  public validateTaster(requiredTaster?: Taster) {
    if (requiredTaster && this.currentTaster) {
      if (requiredTaster.id == this.currentTaster.id) { // FIXME: '==' is intentional!
        return Promise.resolve(this.currentTaster);
      } else {
        return Promise.reject('wrong user');
      }
    } else if (requiredTaster && !this.currentTaster) {
      const modalRef = this.modalService.open(LoginDialog);
      modalRef.componentInstance.usernameStr = requiredTaster.name;
      return modalRef.result;
    } else if (!requiredTaster && this.currentTaster) {
      return Promise.resolve(this.currentTaster);
    } else {
      const modalRef = this.modalService.open(LoginDialog);
      return modalRef.result
    }
  }

  public digestPassword(password: string) {
    return this.mikeSecurityService.dummyDigest(password, 'wings');
  }

  private loginTaster(taster: Taster) {
    // store user details in local storage to keep user logged in between page refreshes
    localStorage.setItem('taster', JSON.stringify(taster));
    this.tasterSubject.next(taster);
  }

  login(name: string, password: string): Observable<Taster | undefined> {
    let digestPass = this.digestPassword(password);

    return this.getTasters()
      .pipe(map(tasters => {
        // find user by name and password digest
        const taster = tasters.find(taster => taster.name && taster.name.toLowerCase() === name.toLowerCase() && taster.password === digestPass);
        if (taster) {
          this.loginTaster(taster);
        }
        return taster;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('taster');
    this.tasterSubject.next(undefined);
    // this.router.navigate(['/']);
  }

  getTasterById(id: number): Observable<Taster> {
    return this.mikeDb.get<Taster>("tasters/" + id)
      .pipe(
        map(data => new Taster(data))
      );
  }

  getTasters(firstResult = 0, maxResults = -1, fields: string | null = null): Observable<Taster[]> {
    return this.mikeDb.get<Taster[]>("tasters", firstResult, maxResults, fields)
      .pipe(
        map(data => data.map(value => new Taster(value)))
      );
  }

  addUpdateTaster(taster: Taster): Observable<Taster> {
    if (!taster.id) {
      // add new
      return this.mikeDb.add<Taster>("tasters", taster, 0)
        .pipe(
          map(data => new Taster(data))
        );
    } else {
      // update existing
      return this.mikeDb.update<Taster>("tasters", taster)
        .pipe(
          map(data => {
            const taster = new Taster(data);
            // update stored user if the logged in user updated their own record
            if (this.currentTaster && this.currentTaster.id == taster.id) { // FIXME: '==' is intentional!
              const data = {...this.currentTaster, ...taster};
              this.loginTaster(data);
            }
            return taster;
          })
        );
    }
  }

  deleteTaster(taster: Taster): Observable<Taster> {
    return this.mikeDb.delete<Taster>("tasters", taster)
      .pipe(map(data => {
        // auto logout if the logged in user deleted their own record
        if (this.currentTaster && this.currentTaster.id == taster.id) { // FIXME: '==' is intentional!
          this.logout();
        }
        return data;
      }));
  }

  uploadTasterPhoto(taster: Taster, value: FormData): Observable<HttpEvent<FormData>> {
    if (!taster.name) {
      throw 'Taster must have a Name!';
    }
    const key = taster.name.toLowerCase() + '-photo'; // http://gerdov.com/mike-db/api/wingsDB/mike-photo
    let observable = this.mikeDb.uploadFile(key, value);
    observable.subscribe(event => {
      if (event.type == HttpEventType.Response) {
        taster.photo = this.mikeDb.getHostApiUrl() + key + '?' + new Date().getTime();
        this.addUpdateTaster(taster)
          .subscribe(taster => {
            return taster;
          });
      }
    });

    return observable;
  }

  deleteTasterPhoto(taster: Taster) {
    if (!taster.photo) {
      throw 'Taster must have a Photo!';
    }
    // extract key from url
    let prefix = this.mikeDb.getHostApiUrl();
    if (!taster.photo.startsWith(prefix)) {
      throw 'Can not delete what we do not own: ' + taster.photo;
    }
    let key = taster.photo.substr(prefix.length);
    const indexOf = key.indexOf('?');
    if (indexOf > 0) {
      key = key.substr(0, indexOf);
    }

    const observable = this.mikeDb.delete(key, null);
    observable.subscribe(data => {
      if (taster.photo) {
        taster.photo = undefined;
        this.addUpdateTaster(taster)
          .subscribe(taster => {
            return taster;
          });
      }
    });
    return observable;
  }
}
