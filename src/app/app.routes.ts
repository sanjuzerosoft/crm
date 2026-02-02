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

import { Activitylist } from './activity/activitylist/activitylist';
import { Activityadd } from './activity/activityadd/activityadd';
import { Activityview } from './activity/activityview/activityview';


//Masters
import { Leadassigneelist } from './masters/leadassignee/leadassigneelist/leadassigneelist';
import { Leadassigneeadd } from './masters/leadassignee/leadassigneeadd/leadassigneeadd';

import { Industrytypelist } from './masters/industrytype/industrytypelist/industrytypelist';
import { Industrytypeadd } from './masters/industrytype/industrytypeadd/industrytypeadd';

import { Projectlist } from './masters/project/projectlist/projectlist';
import { Projectadd } from './masters/project/projectadd/projectadd';





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

      {path: 'activity', component: Activitylist },
      {path: 'activity/add', component: Activityadd },
      {path: 'activity/add/:id', component: Activityadd },
      {path: 'activity/view/:id', component: Activityview },

      //Masters
      { path: 'leadassignee', component: Leadassigneelist },
      { path: 'leadassignee/add', component: Leadassigneeadd },
      { path: 'leadassignee/add/:id', component: Leadassigneeadd },

      { path: 'IndustryType', component: Industrytypelist },
      { path: 'IndustryType/add', component: Industrytypeadd },
      { path: 'IndustryType/add/:id', component: Industrytypeadd },

      { path: 'project', component: Projectlist },
      { path: 'project/add', component: Projectadd },
      { path: 'project/add/:id', component: Projectadd },

    ]
  },

  // { path: '**', redirectTo: 'login' },
  
  
];
