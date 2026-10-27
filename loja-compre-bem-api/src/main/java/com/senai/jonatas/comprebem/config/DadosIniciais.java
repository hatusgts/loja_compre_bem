package com.senai.jonatas.comprebem.config;

import com.senai.jonatas.comprebem.entity.Produto;
import com.senai.jonatas.comprebem.repository.ProdutoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DadosIniciais {

    @Bean
    CommandLineRunner carregarProdutos(ProdutoRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }
            String[] nomes = {"Cadeira", "Mesa", "Sofá", "Estante", "Luminária", "Poltrona",
                    "Armário", "Cama", "Rack", "Escrivaninha", "Banqueta", "Criado-mudo"};
            for (int i = 0; i < 60; i++) {
                Produto produto = new Produto();
                produto.setNome(nomes[i % nomes.length] + " " + (i / nomes.length + 1));
                produto.setDescricao("Produto de exemplo");
                produto.setCategoria("Móveis");
                produto.setPreco(BigDecimal.valueOf(100 + i * 10));
                produto.setQuantidade(10);
                repository.save(produto);
            }
        };
    }
}
