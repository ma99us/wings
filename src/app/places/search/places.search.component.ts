import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";

@Component({
  selector: 'places-search',
  templateUrl: './places.search.component.html',
  styleUrls: ['./places.search.component.less']
})
export class PlacesSearchComponent implements OnInit{
  @ViewChild('search', {static: true}) searchCtrl!: ElementRef;
  @Input() onSearchChange!: (title: string) => void;
  @Input() autofocus: boolean = false;
  searchByTitle!: string;

  constructor() {
  }

  onSearchChangeEvent(event: any) {
    if (event && event.target && event.target.value) {
      this.onSearchChange(event.target.value);
    } else {
      this.searchByTitle = '';
      this.onSearchChange(this.searchByTitle);
    }
  }

  ngOnInit(): void {
    if (this.searchCtrl && this.autofocus) {
      this.searchCtrl.nativeElement.focus();
    }
  }
}
