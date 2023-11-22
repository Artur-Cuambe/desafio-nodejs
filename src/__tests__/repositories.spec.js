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
  it('should be able to create a new repository', async () => {
      const response = await request(app)
          .post('/repositories')
          .send({
            url: "https://github.com/WhireLab/About",
            title: "About",
            techs: ["Node", "Express", "TypeScript"]
          });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe('About');
  }, 10000);

  it('should be able to list the repositories', async () => {
      await Repository.create({
        url: "https://github.com/WhireLab/About1",
        title: "About1",
        techs: ["Node", "Express", "TypeScript"]
      });
      await Repository.create({
        url: "https://github.com/WhireLab/About2",
        title: "About2",
        techs: ["Node", "Express", "TypeScript"]
      });

      const response = await request(app).get('/repositories');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('About1');
      expect(response.body[1].title).toBe('About2');
  }, 10000);

  it('should be able to update repository', async () => {
      const createdRepository = await Repository.create({
        url: "https://github.com/WhireLab/About",
        title: "About",
        techs: ["Node", "Express", "TypeScript"]
      });

      const response = await request(app)
          .put(`/repositories/${createdRepository._id}`)
          .send({
            url: "https://github.com/WhireLab/About_updated",
            title: "About updated",
            techs: ["Node", "Express", "TypeScript"]
          });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('About updated');
      expect(response.body.url).toBe("https://github.com/WhireLab/About_updated");

      const updatedRepository = await Repository.findById(createdRepository._id);
      expect(updatedRepository.title).toBe('About updated');
      expect(updatedRepository.url).toBe('https://github.com/WhireLab/About_updated');
  }, 10000);


  it('should be able to delete the repository', async () => {
      const createdRepository = await Repository.create({
        url: "https://github.com/WhireLab/About",
        title: "About",
        techs: ["Node", "Express", "TypeScript"]
      });

      const response = await request(app).delete(`/repositories/${createdRepository._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Repositorio excluído com sucesso');

      const deletedRepository= await Repository.findById(createdRepository._id);
      expect(deletedRepository).toBeNull();
  }, 10000);
});
