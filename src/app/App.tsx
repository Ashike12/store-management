import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import AppRouter from 'router/AppRouter';
import AuthRouter from 'router/AuthRouter';
import { selectAppIsLogin } from '@core/store/slices/auth.slice';
import { useAppSelector } from '@core/store/hooks';
import { useEffect } from 'react';
import { ROUTE_PATH } from '@core/config/routePath';

export default function App() {
  const isLogin = useAppSelector(selectAppIsLogin);
  console.log('isLogin', isLogin);
  return (
    <BrowserRouter>
      <AuthGuard isLogin={isLogin}>
        {isLogin ? <AppRouter /> : <AuthRouter />}
      </AuthGuard>
    </BrowserRouter>
  );
}

// 🔹 Redirect to /login if not authenticated
function AuthGuard({ isLogin, children }: { isLogin: boolean; children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isSetPassword = location.pathname === ROUTE_PATH.setPassword.path;
  useEffect(() => {
    if (isSetPassword) {
      navigate(`/set-password${location.search}`, { replace: true, });
    }
    else if (!isLogin) {
      navigate('/login', { replace: true });
    }
  }, [isLogin, navigate]);

  return <>{children}</>;
}
