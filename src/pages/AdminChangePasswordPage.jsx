import React from 'react';
import AdminChangePassword from '../components/AdminChangePassword';

function AdminChangePasswordPage(props) {
  // You can get the token from props, context, or Redux as needed
  // For now, we'll assume it's passed as a prop
  const { token } = props;

  return <AdminChangePassword token={token} />;
}

export default AdminChangePasswordPage;