import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import TelaDetalheProduto from './TelaDetalheProduto';
import TelaListaProdutos from './TelaListaProdutos';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="ListaProdutos">
        <Stack.Screen name="ListaProdutos" options={{ title: 'Produtos' }}>
          {(props) => <TelaListaProdutos {...props} />}
        </Stack.Screen>
        <Stack.Screen name="DetalheProduto" options={{ title: 'Detalhe do produto' }}>
          {(props) => <TelaDetalheProduto {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
