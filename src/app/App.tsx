import {BrowserRouter} from 'react-router-dom';
import AppRouter from 'router/AppRouter';
import AuthRouter from 'router/AuthRouter';
import {useAppSelector} from '@core/store/hooks';
import {selectAppIsLogin} from '@core/store/slices/auth.slice';

export default function App() {
  const isLogin = useAppSelector(selectAppIsLogin);

  return (
    <BrowserRouter>{isLogin ? <AppRouter /> : <AuthRouter />}</BrowserRouter>
  );
}
