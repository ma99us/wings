import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {PlacesComponent} from "./places/places.component";
import {EventsComponent} from "./events/events.component";
import {PlacesDetailsComponent} from "./places/details/places.details.component";
import {EventsDetailsComponent} from "./events/details/events.details.component";

const routes: Routes = [
  {path: 'places', component: PlacesComponent},
  {path: 'places/:id', component: PlacesDetailsComponent},
  {path: 'events', component: EventsComponent},
  {path: 'events/:id', component: EventsDetailsComponent},
  {path: '**', component: HomeComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
