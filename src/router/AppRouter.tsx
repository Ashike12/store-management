import {Suspense, useEffect} from 'react';
import {Navigate, Outlet, Route, Routes, useLocation} from 'react-router-dom';
import BASE_ROUTES from '@core/config/base-routes';
import BaseLayout from '@layout/BaseLayout';
import {LinearProgress, linearProgressClasses} from '@mui/material';
import {varAlpha} from 'theme/styles';
import {ROUTE_PATH} from '@core/config/routePath';
import NotFoundView from '@components/not-found/NotFoundView';

const renderFallback = (
  <div className="flex h-screen w-full flex-1 items-center justify-center">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: theme =>
          varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: {bgcolor: 'text.primary'},
      }}
    />
  </div>
);

export default function AppRouter() {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <BaseLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </BaseLayout>
        }>
        <Route
          index
          element={<Navigate to='/dashboard' replace />}
        />
        {BASE_ROUTES.map(({path, Component}) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>
      <Route path="404" element={<NotFoundView />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
