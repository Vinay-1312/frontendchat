import logo from './logo.svg';
import './App.css';
import Body from './components/Body';
import { Provider } from 'react-redux';
import {store,persistor} from './utils/appStore';

import { PersistGate } from 'redux-persist/integration/react';
function App() {
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
     
     <Body />
    </PersistGate>
 </Provider>
    
  );
}

export default App;
