import {ROUTE_PATH} from '@core/config/routePath';
import Login from '@features/auth/pages/login/login';
import {Routes, Route} from 'react-router-dom';

export default function AuthRouter() {
  return (
    <Routes>
      <Route path={ROUTE_PATH.login.path} element={<Login />} />
    </Routes>
  );
}
