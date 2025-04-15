import { ROUTE_PATH } from '@core/config/routePath';
import Login from '@features/auth/pages/login/login';
import SetPassword from '@features/auth/pages/setPassword';
import { Routes, Route, useLocation } from 'react-router-dom';

export default function AuthRouter() {
  const location = useLocation();
  const isSetPassword = location.pathname === ROUTE_PATH.setPassword.path;
  console.log('AuthRouter', isSetPassword);
  return (
    <Routes>
      <Route path={ROUTE_PATH.setPassword.path} element={<SetPassword />} />
      <Route path={ROUTE_PATH.login.path} element={<Login />} />
    </Routes>
  );
}
