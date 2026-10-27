package com.senai.jonatas.comprebem.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProdutoRequestDTO(
        String nome,
        String descricao,
        BigDecimal preco,
        String categoria,
        String imagem,
        @NotNull Integer quantidade
) {
}
