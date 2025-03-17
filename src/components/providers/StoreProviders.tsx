import {Provider} from 'react-redux';
import {store, persistor} from '@core/store/store'; // Your store path
import {PersistGate} from 'redux-persist/integration/react';

export default function StoreProvider({children}: {children: React.ReactNode}) {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>{children}</Provider>
    </PersistGate>
  );
}
