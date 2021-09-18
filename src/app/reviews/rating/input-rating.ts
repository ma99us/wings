import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
  selector: 'input-rating',
  template: `
    <select class="form-control" [id]="vName" [name]="vName"
            [(ngModel)]="rating"
            #{{vName}}="ngModel">
      <option *ngFor="let rating of ratings" [value]="rating">{{rating}}</option>
    </select>
  `,
  styles: [`
    select {
      width: 5em;
      max-width: 5em;
    }
  `],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class InputRatingFormComponent {

  ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  @Input('name') vName!: string;

  set rating(val: number | undefined) {
    this.value = val !== undefined ? Number(val) : val;
    this.ratingChange.emit(this.value);
  }

  @Input()
  get rating(): number | undefined {
    return this.value;
  }

  @Output() ratingChange = new EventEmitter<number>();

  value?: number;

  constructor(private control : NgForm) { }
}
