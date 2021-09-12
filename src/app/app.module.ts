import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';

import {PlacesComponent} from './places/places.component';
import {PlacesSearchComponent} from "./places/search/places.search.component";
import {PlacesDetailsComponent} from "./places/details/places.details.component";
import {MapAddressLink} from "./components/map-address-link/map-address-link";
import {PlaceComponent} from "./places/place/place.component";

import {EventsComponent} from './events/events.component';
import {EventsDetailsComponent} from "./events/details/events.details.component";
import {EventComponent} from "./events/event/event.component";
import {NotFoundComponent} from "./components/not-found/not-found-component";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlacesComponent,
    PlacesSearchComponent,
    PlacesDetailsComponent,
    PlaceComponent,
    MapAddressLink,
    EventsComponent,
    EventsDetailsComponent,
    EventComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
