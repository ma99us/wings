import {TastersService} from "../../tasters/tasters.service";
import {Taster} from "../../tasters/taster";

export class AbstractTasterComponent {
  currentTaster?: Taster;

  constructor(protected tastersService: TastersService) {
    this.tastersService.taster.subscribe(taster => {
      this.currentTaster = taster;
      // console.log('currentTaster', this.currentTaster);
    });
  }

  get isLoggedIn(): boolean {
    return this.currentTaster !== undefined;
  }

  get currentTasterName(): string {
    return this.currentTaster?.name || 'Anonymous';
  }

  isTasterLoggedIn(taster: Taster): boolean {
    return !taster.id || this.tastersService.isCurrentTaster(taster);
  }
}
