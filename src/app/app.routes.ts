import { Routes } from '@angular/router';
import { SccsPage } from './pages/sccs-page/sccs-page';
import { FscrsPage } from './pages/fscrs-page/fscrs-page';
import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'sccs-questionnaire',
    component: SccsPage,
  },

  {
    path: 'fscrs-questionnaire',
    component: FscrsPage,
  },
];
