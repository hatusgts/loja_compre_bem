import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { RootStackParamList } from './types';
import type { Produto } from './types';
import { criarProduto, formatarPreco, getProdutos } from './produto-service';

const CHAVE_FAVORITOS = '@compre_bem:favoritos';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaProdutos'>;

function TelaListaProdutos({ navigation }: Props) {
  const [busca, setBusca] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(0);
  const [ultimaPagina, setUltimaPagina] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroApi, setErroApi] = useState('');
  const [favoritos, setFavoritos] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_FAVORITOS).then((salvo) => {
      if (salvo) setFavoritos(JSON.parse(salvo));
    });
  }, []);

  function alternarFavorito(id: string) {
    setFavoritos((atual) => {
      const novo = atual.includes(id) ? atual.filter((favId) => favId !== id) : [...atual, id];
      AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novo));
      return novo;
    });
  }

  async function carregar(novaPagina: number, termo: string) {
    setCarregando(true);
    setErroApi('');
    try {
      const resposta = await getProdutos(novaPagina, termo);
      setProdutos((atual) => (novaPagina === 0 ? resposta.content : [...atual, ...resposta.content]));
      setPagina(novaPagina);
      setUltimaPagina(resposta.last);
    } catch {
      setErroApi('Não foi possível carregar os produtos.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar(0, busca);
  }, [busca]);

  function carregarMais() {
    if (!carregando && !ultimaPagina) carregar(pagina + 1, busca);
  }

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState('');
  const inputPrecoRef = useRef<TextInput>(null);
  const inputQuantidadeRef = useRef<TextInput>(null);

  // Layout responsivo: duas colunas em telas largas (tablet/web), uma em celulares.
  const { width } = useWindowDimensions();
  const numColumns = width >= 700 ? 2 : 1;

  async function validarESalvar() {
    if (nome.trim() === '') {
      setErro('O nome não pode ficar vazio.');
      return;
    }
    const precoNumerico = Number(preco.trim().replace(',', '.'));
    if (preco.trim() === '' || isNaN(precoNumerico) || precoNumerico <= 0) {
      setErro('O preço precisa ser um número maior que zero (ex.: 89,90).');
      return;
    }
    const quantidadeNumerica = Number(quantidade.trim());
    if (quantidade.trim() === '' || !Number.isInteger(quantidadeNumerica) || quantidadeNumerica < 0) {
      setErro('A quantidade precisa ser um número inteiro (ex.: 10).');
      return;
    }
    try {
      await criarProduto({
        nome: nome.trim(),
        descricao: 'Produto cadastrado pela equipe da loja.',
        preco: precoNumerico,
        quantidade: quantidadeNumerica,
      });
    } catch {
      setErro('Não foi possível cadastrar o produto.');
      return;
    }
    setNome('');
    setPreco('');
    setQuantidade('');
    setErro('');
    Keyboard.dismiss();
    setBusca('');
    carregar(0, '');
  }

  return (
    <SafeAreaView style={styles.tela} edges={['left', 'right', 'bottom']}>
      <View style={styles.cadastro}>
        <TextInput
          style={[styles.input, styles.campoCadastro]}
          placeholder="Nome do novo produto"
          placeholderTextColor="#999999"
          value={nome}
          onChangeText={setNome}
          returnKeyType="next"
          onSubmitEditing={() => inputPrecoRef.current?.focus()}
        />
        <TextInput
          ref={inputPrecoRef}
          style={[styles.input, styles.campoCadastro]}
          placeholder="Preço (ex.: 89,90)"
          placeholderTextColor="#999999"
          value={preco}
          onChangeText={setPreco}
          keyboardType="decimal-pad"
          returnKeyType="next"
          onSubmitEditing={() => inputQuantidadeRef.current?.focus()}
        />
        <TextInput
          ref={inputQuantidadeRef}
          style={[styles.input, styles.campoCadastro]}
          placeholder="Quantidade (ex.: 10)"
          placeholderTextColor="#999999"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={validarESalvar}
        />
        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
        <TouchableOpacity style={styles.botao} onPress={validarESalvar}>
          <Text style={styles.botaoTexto}>Cadastrar produto</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, styles.busca]}
        placeholder="Buscar produto pelo nome"
        placeholderTextColor="#999999"
        value={busca}
        onChangeText={setBusca}
        clearButtonMode="while-editing"
      />

      <FlatList
        key={`colunas-${numColumns}`}
        data={produtos}
        keyExtractor={(item) => item.produtoId}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.5}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.coluna : undefined}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          carregando ? null : (
            <Text style={styles.vazio}>
              {erroApi || `Nenhum produto encontrado para “${busca}”.`}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, numColumns > 1 && styles.cardColuna]}
            onPress={() => navigation.navigate('DetalheProduto', { produtoId: item.produtoId })}>
            <View style={styles.cardLinha}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardNome} numberOfLines={2}>
                  {item.nome}
                </Text>
                <Text style={styles.cardPreco}>{formatarPreco(item.preco)}</Text>
              </View>
              <TouchableOpacity
                style={styles.botaoFavorito}
                onPress={() => alternarFavorito(item.produtoId)}>
                <Text style={styles.favoritoTexto}>
                  {favoritos.includes(item.produtoId) ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#FFFFFF' },
  cadastro: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    margin: 16,
  },
  input: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    color: '#000000',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'center',
  },
  campoCadastro: { flexBasis: 220, flexGrow: 1 },
  busca: { marginHorizontal: 16, marginBottom: 8 },
  erro: { color: '#B00020', flexBasis: '100%' },
  botao: {
    alignItems: 'center',
    backgroundColor: '#000000',
    flexBasis: 220,
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  botaoTexto: { color: '#FFFFFF', fontWeight: '600' },
  lista: { gap: 12, paddingBottom: 32, paddingHorizontal: 16 },
  coluna: { gap: 12 },
  card: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
  cardColuna: { flex: 1 },
  cardLinha: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  cardInfo: { flex: 1, gap: 4 },
  cardNome: { color: '#000000', fontSize: 16, fontWeight: '600' },
  cardPreco: { color: '#666666' },
  botaoFavorito: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44 },
  favoritoTexto: { color: '#C62828', fontSize: 22 },
  vazio: { color: '#666666', paddingVertical: 24, textAlign: 'center' },
});

export default TelaListaProdutos;
