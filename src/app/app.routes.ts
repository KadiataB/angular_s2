import { Routes } from '@angular/router';
import { CreerApprovisionnementComponent } from './components/creer-approvisionnement/creer-approvisionnement.component';
import { ListeApprovisionnementComponent } from './components/liste-approvisionnement/liste-approvisionnement.component';

export const routes: Routes = [
  {
    path: 'add',
    component: CreerApprovisionnementComponent
  },
  {
    path: '',
    component: ListeApprovisionnementComponent
  },
  {
    path:'',
    redirectTo:'/approvisionnements',
    pathMatch:'full'
  },
];
