import React from 'react';

const Organizations = React.lazy(() => import('./components/Organizations'));
const Organization = React.lazy(() => import('./components/Organization'));
const Repository = React.lazy(() => import('./components/Repository'));
const Dependency = React.lazy(() => import('./components/Dependency'));

const routes = [
  { path: '/org', exact: true, name: 'Organization List', component: Organizations },
  { path: '/org/:id', exact: true, name: 'Organization', component: Organization },
  { path: '/org/:orgid/repo/:repoid', exact: true, name: 'Repository', component: Repository },
  { path: '/org/:orgid/dep/:depid', exact: true, name: 'Dependency', component: Dependency }

];

export default routes;
