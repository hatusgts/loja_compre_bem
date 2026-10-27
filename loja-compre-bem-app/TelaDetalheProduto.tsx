import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { formatarPreco, getProduto } from './produto-service';
import type { Produto, RootStackParamList } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheProduto'>;

function TelaDetalheProduto({ route }: Props) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    getProduto(produtoId)
      .then(setProduto)
      .catch(() => setErro('Não foi possível carregar o produto.'))
      .finally(() => setCarregando(false));
  }, [produtoId]);

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.aviso}>{erro || 'Produto não encontrado.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.nome}>{produto.nome}</Text>
      <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>
      <Text style={styles.descricao}>{produto.descricao}</Text>
      <Text style={styles.preco}>Estoque: {produto.quantidade}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { backgroundColor: '#FFFFFF', flex: 1 },
  conteudo: { gap: 12, padding: 16 },
  centralizado: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
  },
  aviso: { color: '#666666', fontSize: 16 },
  nome: { color: '#000000', fontSize: 22, fontWeight: '700' },
  preco: { color: '#666666', fontSize: 18 },
  cor: { color: '#666666', fontSize: 18 },
  descricao: { color: '#000000', fontSize: 15, lineHeight: 22 },
});

export default TelaDetalheProduto;
