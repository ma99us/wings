import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {PlacesComponent} from "./places/places.component";
import {EventsComponent} from "./events/events.component";
import {PlacesDetailsComponent} from "./places/details/places.details.component";
import {EventsDetailsComponent} from "./events/details/events.details.component";
import {ReviewDetailsComponent} from "./reviews/review.details.component";
import {TastersComponent} from "./tasters/tasters.component";
import {TastersDetailsComponent} from "./tasters/details/tasters.details.component";

const routes: Routes = [
  {path: 'places', component: PlacesComponent},
  {path: 'places/:id', component: PlacesDetailsComponent},
  {path: 'events', component: EventsComponent},
  {path: 'events/:id', component: EventsDetailsComponent},
  {path: 'reviews/:id', component: ReviewDetailsComponent},
  {path: 'tasters', component: TastersComponent},
  {path: 'tasters/:id', component: TastersDetailsComponent},
  {path: '**', component: HomeComponent}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
