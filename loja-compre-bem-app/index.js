import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent chama AppRegistry.registerComponent('main', () => App)
// e garante que o app funcione tanto no Expo Go quanto em uma build nativa.
registerRootComponent(App);
