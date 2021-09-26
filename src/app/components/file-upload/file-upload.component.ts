import {Component, Input} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {Observable} from "rxjs/internal/Observable";
import {finalize} from "rxjs/operators";
import {HttpEventType} from "@angular/common/http";

@Component({
  selector: 'file-upload',
  template: `
    <input type="file" class="file-input" (change)="onFileSelected($event)" #fileUpload
           [accept]="requiredFileType ? requiredFileType : null"
           [multiple]="allowMultiple ? '': null"
    >
    <div class="file-upload">
      <span *ngIf="fileName" class="text-info">{{fileName || "No file(s) selected."}} </span>
      <ng-content *ngIf="!fileName"></ng-content>
      <button type="button" mat-mini-fab color="primary" class="upload-btn"
              (click)="fileUpload.click()">
        <mat-icon>attach_file</mat-icon>
      </button>
    </div>
    <div class="progress" *ngIf="uploadProgress">
      <mat-progress-bar class="progress-bar" mode="determinate" [value]="uploadProgress">
      </mat-progress-bar>
      <mat-icon class="cancel-upload" (click)="cancelUpload()">delete_forever
      </mat-icon>
    </div>
  `,
  styles: [`
    .file-input {
      display: none;
    }
  `]
})
export class FileUploadComponent {
  @Input() onFileUpload!: (formData: FormData, httpParams: any) => Observable<any>;
  @Input() requiredFileType?: string;
  @Input() allowMultiple?: boolean;

  fileName?: string;
  uploadProgress?: number;
  uploadSub?: Subscription;

  constructor() {
  }

  onFileSelected(event: any) {
    let files: File[] = Array.from(event.target.files);
    files = files.filter((f: File) => f);
    if (!files) {
      return;
    }
    this.fileName = files.map((f: File) => f.name).join();
    const formData = new FormData();
    files.forEach((file: File) => {
      formData.append("file", file);
      const httpParams = {
        reportProgress: true,
        observe: 'events'
      };
      const upload$ = this.onFileUpload(formData, httpParams)
        .pipe(
          finalize(() => this.reset())
        );

      this.uploadSub = upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      });
    });
  }

  cancelUpload() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
    this.reset();
  }

  reset() {
    this.uploadProgress = undefined;
    this.uploadSub = undefined;
  }
}
