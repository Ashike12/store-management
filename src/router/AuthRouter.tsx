import {ROUTE_PATH} from '@core/config/routePath';
import Login from '@features/auth/pages/login/login';
import {Routes, Route, Navigate} from 'react-router-dom';

export default function AuthRouter() {
  return (
    <Routes>
      <Route key="sign-in" path={ROUTE_PATH.login.path} element={<Login />} />

      <Route
        path="*"
        element={<Navigate to={ROUTE_PATH.login.path} replace />}
      />
    </Routes>
  );
}