import {Component, Input} from "@angular/core";
import {Taster} from "../taster";

@Component({
  selector: 'taster-li',
  templateUrl: './taster.component.html',
  styleUrls: ['./taster.component.less']
})
export class TasterComponent {

  @Input() taster!: Taster;
  @Input() selectedTaster?: Taster;
  @Input() onSelect!: (taster?: Taster) => void;

  constructor() {
  }

  get isSelected(): boolean {
    return this.taster != undefined && this.selectedTaster != undefined && (this.taster === this.selectedTaster || this.taster.id == this.selectedTaster.id);
  }
}
