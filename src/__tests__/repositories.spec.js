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
// describe("Repositories", () => {
//   it("should be able to create a new repository", async () => {
//     const response = await request(app)
//       .post("/repositories")
//       .send({
//         url: "https://github.com/WhireLab/About",
//         title: "About",
//         techs: ["Node", "Express", "TypeScript"],
//       });

//     expect(isUuid(response.body.id)).toBe(true);

//     expect(response.body).toMatchObject({
//       url: "https://github.com/WhireLab/About",
//       title: "About",
//       techs: ["Node", "Express", "TypeScript"],
//       likes: 0,
//     });
//   });

//   it("should be able to list the repositories", async () => {
//     const repository = await request(app)
//       .post("/repositories")
//       .send({
//         url: "https://github.com/WhireLab/About",
//         title: "About",
//         techs: ["Node", "Express", "TypeScript"],
//       });

//     const response = await request(app).get("/repositories");

//     expect(response.body).toEqual(
//       expect.arrayContaining([
//         {
//           id: repository.body.id,
//           url: "https://github.com/WhireLab/About",
//           title: "About",
//           techs: ["Node", "Express", "TypeScript"],
//           likes: 0,
//         },
//       ])
//     );
//   });

//   it("should be able to update repository", async () => {
//     const repository = await request(app)
//       .post("/repositories")
//       .send({
//         url: "https://github.com/WhireLab/About",
//         title: "About",
//         techs: ["Node", "Express", "TypeScript"],
//       });

//     const response = await request(app)
//       .put(`/repositories/${repository.body.id}`)
//       .send({
//         url: "https://github.com/Rocketseat/unform",
//         title: "Unform",
//         techs: ["React", "ReactNative", "TypeScript", "ContextApi"],
//       });

//     expect(isUuid(response.body.id)).toBe(true);

//     expect(response.body).toMatchObject({
//       url: "https://github.com/Rocketseat/unform",
//       title: "Unform",
//       techs: ["React", "ReactNative", "TypeScript", "ContextApi"],
//     });
//   });

//   it("should not be able to update a repository that does not exist", async () => {
//     await request(app).put(`/repositories/123`).expect(400);
//   });

//   it("should not be able to update repository likes manually", async () => {
//     const repository = await request(app)
//       .post("/repositories")
//       .send({
//         url: "https://github.com/WhireLab/About",
//         title: "About",
//         techs: ["React", "ReactNative", "TypeScript", "ContextApi"],
//       });

//     await request(app).post(`/repositories/${repository.body.id}/like`);

//     const response = await request(app)
//       .put(`/repositories/${repository.body.id}`)
//       .send({
//         likes: 15,
//       });

//     expect(response.body).toMatchObject({
//       likes: 1,
//     });
//   });

//   it("should be able to delete the repository", async () => {
//     const response = await request(app)
//       .post("/repositories")
//       .send({
//         url: "https://github.com/WhireLab/About",
//         title: "About",
//         techs: ["Node", "Express", "TypeScript"],
//       });

//     await request(app).delete(`/repositories/${response.body.id}`).expect(204);

//     const repositories = await request(app).get("/repositories");

//     const repository = repositories.body.find((r) => r.id === response.body.id);

//     expect(repository).toBe(undefined);
//   });

//   it("should not be able to delete a repository that does not exist", async () => {
//     await request(app).delete(`/repositories/123`).expect(400);
//   });
// });
