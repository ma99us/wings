import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'list-sorter',
  template: `
    <div>
      <span class="tags-span">
        <ng-content></ng-content>
      </span>
      <span *ngFor="let field of fieldsNames"
            class="clickable-container"
            [class.selected]="field === sortField"
            (click)="onSortClick(field)">
        <span class="fields-container">
          {{field}}
        </span>
        <span class="arrows-container">
          <img *ngIf="field === sortField && sortAsc"
               height="22"
               alt="asc"
               src="./assets/tri-arrow-up.png"
          />
          <img *ngIf="field === sortField && !sortAsc"
               height="22"
               alt="asc"
               src="./assets/tri-arrow-down.png"
          />
        </span>
        <span>
           | 
        </span>
      </span>
    </div>
  `,
  styles: [`
    div {
      /*padding: 0.5em;*/
    }
    
    img {
      vertical-align: middle;
      /*margin: 0 0.1em;*/
    }

    .clickable-container{
      cursor: pointer;
      user-select: none;
    }
    
    .clickable-container:hover {
      color: #1976d2;
      text-decoration: none;
    }    
    .fields-container {
      display: inline-block;
      width: 3.2em;
    }
    
    .arrows-container {
      display: inline-block;
      width: 24px;
    }

    .selected {
      font-weight: bolder;
    }

    .tags-span {
      margin-right: 1em;
    }
  `]
})

export class ListSorterComponent implements OnInit {

  @Input() fieldsNames: string[] = [];
  @Input() sortChanged!: (field: string, asc: boolean) => void;
  @Input() sortField: string | null = null;
  @Input() sortAsc: boolean = true;

  constructor() {
  }

  ngOnInit(): void {

  }

  onSortClick(field: string) {
    if (field === this.sortField) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.sortChanged(this.sortField, this.sortAsc);
  }

}
