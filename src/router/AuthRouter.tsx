import {Navigate, Route, Routes} from 'react-router-dom';
import {ROUTE_PATH} from '@core/config/routePath';
import Login from '@features/auth/pages/login/login';
import SetPassword from '@features/auth/pages/setPassword';

export default function AuthRouter() {
  return (
    <Routes>
      <Route path={ROUTE_PATH.setPassword.path} element={<SetPassword />} />
      <Route path={ROUTE_PATH.login.path} element={<Login />} />
      <Route path="*" element={<Navigate to={ROUTE_PATH.login.path} replace />} />
    </Routes>
  );
}
