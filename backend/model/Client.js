
export default class Client {
  constructor({ id, name, email, birthDate }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.birthDate = birthDate;
  }

  // Método responsável por validar os dados do cliente
  validate() {
    // Verifica se os campos obrigatórios (nome e e-mail) foram preenchidos
    if (!this.name || !this.email) {
      throw new Error('Nome e e-mail são obrigatórios.');
    }

    // Expressão regular para validar o formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Se o e-mail não corresponder ao padrão válido, lança um erro
    if (!emailRegex.test(this.email)) {
      throw new Error('E-mail inválido.');
    }
  }
}
