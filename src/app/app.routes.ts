import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Layout } from './layout/layout';
import { Dashboard } from './dashboard/dashboard';
import { Leadslist } from './leads/leadslist/leadslist';
import { Leadsadd } from './leads/leadsadd/leadsadd';
import { Leadsview } from './leads/leadsview/leadsview';
import { Customerslist } from './customers/customerslist/customerslist';
import { Customersadd } from './customers/customersadd/customersadd';
import { Customersview } from './customers/customersview/customersview';

export const routes: Routes = [
  { path: '', redirectTo: 'leads', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: '',
    component: Layout,
    children: [
      {path: 'dashboard', component: Dashboard },
      { path: 'leads', component: Leadslist },
      { path: 'leads/add/:id', component: Leadsadd },
      { path: 'leads/add', component: Leadsadd },
      { path: 'leads/view/:id', component: Leadsview },
      { path: 'customers', component: Customerslist },
      { path: 'customers/add', component: Customersadd },
      { path: 'customers/add/:id', component: Customersadd },
      { path: 'customers/view/:id', component: Customersview },
      
    ]
  },

  { path: '**', redirectTo: 'leads' },
  
  
];
