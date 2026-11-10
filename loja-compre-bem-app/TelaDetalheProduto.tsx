import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { deleteProduto, editProduto, formatarPreco, getProduto } from './produto-service';
import type { Produto, RootStackParamList } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheProduto'>;

function TelaDetalheProduto({ route, navigation }: Props) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [editando, setEditando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [erroAcao, setErroAcao] = useState('');
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');

  useEffect(() => {
    getProduto(produtoId)
      .then(setProduto)
      .catch(() => setErro('Não foi possível carregar o produto.'))
      .finally(() => setCarregando(false));
  }, [produtoId]);

  function iniciarEdicao() {
    if (!produto) return;
    setNome(produto.nome);
    setPreco(String(produto.preco).replace('.', ','));
    setDescricao(produto.descricao ?? '');
    setQuantidade(String(produto.quantidade));
    setErroAcao('');
    setEditando(true);
  }

  async function salvarEdicao() {
    if (!produto) return;
    const precoNumerico = Number(preco.trim().replace(',', '.'));
    const quantidadeNumerica = Number(quantidade.trim());
    if (nome.trim() === '') {
      setErroAcao('O nome não pode ficar vazio.');
      return;
    }
    if (preco.trim() === '' || isNaN(precoNumerico) || precoNumerico <= 0) {
      setErroAcao('O preço precisa ser um número maior que zero (ex.: 89,90).');
      return;
    }
    if (quantidade.trim() === '' || !Number.isInteger(quantidadeNumerica) || quantidadeNumerica < 0) {
      setErroAcao('A quantidade precisa ser um número inteiro (ex.: 10).');
      return;
    }
    try {
      const atualizado = await editProduto(produto.produtoId, {
        ...produto,
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: precoNumerico,
        quantidade: quantidadeNumerica,
      });
      setProduto(atualizado);
      setEditando(false);
      setErroAcao('');
    } catch (e) {
      setErroAcao(
        e instanceof Error && e.message === 'Erro 404'
          ? 'Este produto não existe mais.'
          : 'Não foi possível salvar as alterações. Tente novamente.'
      );
    }
  }

  async function excluir() {
    if (!produto) return;
    try {
      await deleteProduto(produto.produtoId);
      navigation.goBack();
    } catch {
      setConfirmandoExclusao(false);
      setErroAcao('Não foi possível excluir o produto. Tente novamente.');
    }
  }

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

  if (editando) {
    return (
      <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput
          style={styles.input}
          placeholder="Preço (ex.: 89,90)"
          value={preco}
          onChangeText={setPreco}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="number-pad"
        />
        {erroAcao !== '' && <Text style={styles.erro}>{erroAcao}</Text>}
        <TouchableOpacity style={styles.botaoPrincipal} onPress={salvarEdicao}>
          <Text style={styles.botaoPrincipalTexto}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoSecundario} onPress={() => setEditando(false)}>
          <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.nome}>{produto.nome}</Text>
      <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>
      <Text style={styles.descricao}>{produto.descricao}</Text>
      <Text style={styles.preco}>Estoque: {produto.quantidade}</Text>

      {erroAcao !== '' && <Text style={styles.erro}>{erroAcao}</Text>}

      {confirmandoExclusao ? (
        <View style={styles.confirmacao}>
          <Text style={styles.aviso}>Deseja realmente excluir este produto?</Text>
          <TouchableOpacity style={styles.botaoExcluir} onPress={excluir}>
            <Text style={styles.botaoPrincipalTexto}>Sim, excluir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoSecundario} onPress={() => setConfirmandoExclusao(false)}>
            <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.botaoPrincipal} onPress={iniciarEdicao}>
            <Text style={styles.botaoPrincipalTexto}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoExcluir} onPress={() => setConfirmandoExclusao(true)}>
            <Text style={styles.botaoPrincipalTexto}>Excluir</Text>
          </TouchableOpacity>
        </>
      )}
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
  descricao: { color: '#000000', fontSize: 15, lineHeight: 22 },
  erro: { color: '#B00020' },
  input: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    color: '#000000',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  confirmacao: { gap: 12 },
  botaoPrincipal: {
    alignItems: 'center',
    backgroundColor: '#000000',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  botaoExcluir: {
    alignItems: 'center',
    backgroundColor: '#B00020',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  botaoPrincipalTexto: { color: '#FFFFFF', fontWeight: '600' },
  botaoSecundario: {
    alignItems: 'center',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  botaoSecundarioTexto: { color: '#000000', fontWeight: '600' },
});

export default TelaDetalheProduto;
