import {Component, Host, Inject, OnInit} from '@angular/core';
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(@Inject(AppComponent) private parent: AppComponent) { }

  ngOnInit(): void {
  }

  onLoginClick() {
    this.parent.login();
  }

}
