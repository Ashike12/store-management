import {HashRouter, Navigate, useLocation} from 'react-router-dom';
import AppRouter from 'router/AppRouter';
import AuthRouter from 'router/AuthRouter';
import {selectAppIsLogin} from '@core/store/slices/auth.slice';
import {useAppSelector} from '@core/store/hooks';
import {ROUTE_PATH} from '@core/config/routePath';

export default function App() {
  const isLogin = useAppSelector(selectAppIsLogin);

  return (
    <HashRouter>
      <AuthGuard isLogin={isLogin} />
    </HashRouter>
  );
}

function AuthGuard({isLogin}: {isLogin: boolean}) {
  const location = useLocation();
  const isPublicAuthRoute =
    location.pathname === ROUTE_PATH.login.path ||
    location.pathname === ROUTE_PATH.setPassword.path;

  if (isLogin) {
    return <AppRouter />;
  }

  if (isPublicAuthRoute) {
    return <AuthRouter />;
  }

  return <Navigate to={ROUTE_PATH.login.path} replace />;
}
