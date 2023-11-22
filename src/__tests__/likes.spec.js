const request = require("supertest");
const app = require("../app");
const { validate: isUuid } = require("uuid");

const mongoose = require('mongoose');
const Repository = require('../models/repositoryModel');
const {
    startDatabase
} = require('../config/db'); //Função de inicialização do base de dados

beforeAll(async () => {
    // Inicializacao da base de dados em memória antes de executar os testes
    await startDatabase();
    
}, 10000); //Tempo limite para 10000ms (10 segundos)

afterAll(async () => {
    // Encerrar a conexão e parar o servidor de base de dados em memória após os testes
    await mongoose.disconnect();
});

beforeEach(async () => {
    // Limpar todos os registros da base de dados antes de cada teste
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
describe('Testes de unidade - Controladores', () => {
  it('should be able to give a like to the repository', async () => {
      const createdRepository = await Repository.create({
        url: "https://github.com/WhireLab/About",
        title: "About",
        techs: ["Node", "Express", "TypeScript"]
      });

      const response = await request(app)
          .post(`/repositories/${createdRepository._id}/like`)
          .send();

      expect(response.status).toBe(200);
      expect(response.body.likes).toBe(1);
  }, 10000);
});
