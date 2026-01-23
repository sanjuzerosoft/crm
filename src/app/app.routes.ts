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

//Masters
import { Leadassigneelist } from './masters/leadassignee/leadassigneelist/leadassigneelist';
import { Leadassigneeadd } from './masters/leadassignee/leadassigneeadd/leadassigneeadd';
import { Leadassigneeview } from './masters/leadassignee/leadassigneeview/leadassigneeview';

import { Leadsourceadd } from './masters/leadsource/leadsourceadd/leadsourceadd';
import { Leadsourceview } from './masters/leadsource/leadsourceview/leadsourceview';
import { Leadsourcelist } from './masters/leadsource/leadsourcelist/leadsourcelist';

import { Leadstatusadd } from './masters/leadstatus/leadstatusadd/leadstatusadd';
import { Leadstatusview } from './masters/leadstatus/leadstatusview/leadstatusview';
import { Leadstatuslist } from './masters/leadstatus/leadstatuslist/leadstatuslist';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
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

      //Masters
      { path: 'leadassignee', component: Leadassigneelist },
      { path: 'leadassignee/add', component: Leadassigneeadd },
      { path: 'leadassignee/add/:id', component: Leadassigneeadd },
      { path: 'leadassignee/view/:id', component: Leadassigneeview },
      
      { path: 'leadsource', component: Leadsourcelist },
      { path: 'leadsource/add', component: Leadsourceadd },
      { path: 'leadsource/add/:id', component: Leadsourceadd },
      { path: 'leadsource/view/:id', component: Leadsourceview },

      { path: 'leadstatus', component: Leadstatuslist },
      { path: 'leadstatus/add', component: Leadstatusadd },
      { path: 'leadstatus/add/:id', component: Leadstatusadd },
      { path: 'leadstatus/view/:id', component: Leadstatusview },
      
    ]
  },

  { path: '**', redirectTo: 'login' },
  
  
];
