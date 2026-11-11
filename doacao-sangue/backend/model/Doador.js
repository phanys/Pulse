class Doador {
  constructor(id, nome, email, carteirinha, tipoSanguineo, disponivel) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.carteirinha = carteirinha;
    this.tipoSanguineo = tipoSanguineo;
    this.disponivel = disponivel;
  }

  // transforma uma linha do banco em um Doador
  static deLinha(linha) {
    return new Doador(
      linha.id,
      linha.nome,
      linha.email,
      linha.carteirinha,
      linha.tipo_sanguineo,
      linha.disponivel
    );
  }
}

module.exports = Doador;
