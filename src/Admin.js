import React from 'react';
import withRoot from './withRoot';
import { withAuthorization } from './components/session';
import AdminDashboard from './views/AdminDashboard';

function Admin() {
  return (
    <AdminDashboard />
  );
}

const condition = authUser => authUser && !!authUser.roles['admin'];

export default withAuthorization(condition)(withRoot(Admin));