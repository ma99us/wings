import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {PlacesComponent} from "./places/places.component";
import {EventsComponent} from "./events/events.component";

const routes: Routes = [
  {path: 'places', component: PlacesComponent},
  {path: 'events', component: EventsComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
