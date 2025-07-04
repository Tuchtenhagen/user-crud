
export default class Client {
  constructor({ id, name, email, birthDate }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.birthDate = birthDate;
  }

  validate() {
    if (!this.name || !this.email) {
      throw new Error('Nome e e-mail são obrigatórios.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('E-mail inválido.');
    }
  }
}
