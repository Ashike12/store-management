import {BrowserRouter} from 'react-router-dom';
import {getIsLogin} from '../core/utils/auth';
import AppRouter from 'router/AppRouter';
import AuthRouter from 'router/AuthRouter';

export default function App() {
  const isLogin = getIsLogin();

  return (
    <BrowserRouter>{isLogin ? <AppRouter /> : <AuthRouter />}</BrowserRouter>
  );
}
