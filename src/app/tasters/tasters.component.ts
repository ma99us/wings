import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Taster} from "./taster";
import {ConfirmDialogService} from "../components/confirmation-dialog/confirmation-dialog.service";
import {TastersService} from "./tasters.service";
import {AbstractTasterComponent} from "../components/abstract-components/abstract.taster.component";

@Component({
  selector: 'app-tasters',
  templateUrl: './tasters.component.html',
  styleUrls: ['./tasters.component.less']
})
export class TastersComponent extends AbstractTasterComponent implements OnInit {

  tasters!: Taster[] | null;

  constructor(private route: ActivatedRoute, private router: Router, tastersService: TastersService, private confirmation: ConfirmDialogService) {
    super(tastersService);
  }

  ngOnInit() {
    this.getAllTasters();
  }

  getAllTasters() {
    this.tastersService.getTasters()
      .subscribe((data: Taster[]) => {
        this.tasters = data;
      }, err => {
        this.tasters = null;
      });
  }

  onSelect = (taster?: Taster): void => {
    const url: string = "/tasters/" + (taster ? taster.id : '');
    this.router.navigateByUrl(url);
  };

  newTaster() {
    const url: string = "/tasters/0";
    this.router.navigateByUrl(url);
  }

  trackByFn(index: number, item: Taster) {
    return item.id  // or index
  }
}
