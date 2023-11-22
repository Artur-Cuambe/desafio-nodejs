const Repository = require('../models/repositoryModel');

const repositoryController = {

  list: async (req, res) => {
    try {
      const repositories = await Repository.find();
      if(repositories.length){
        res.json(repositories);
      }else{
        res.status(404).json({ message: 'Repositorios não encontrados' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Erro ao obter repositorios' });
    }
  },

  update: async (req, res) => {
    const repoId = req.params.id;
    const { title, techs, url } = req.body;

    if (!title && !techs && !url) {
      return res.status(400).json({ message: 'Título, url e techs são obrigatórios' });
    }

    try {
      const repository = await Repository.findByIdAndUpdate(repoId, { title, techs, url}, { new: true });
      if (!repository) {
        return res.status(404).json({ message: 'repositorio não encontrado' });
      }
      res.json(repository);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao atualizar repositorio' });
    }
  },

  delete: async (req, res) => {
    const repoId = req.params.id;

    try {
      const repository = await Repository.findByIdAndDelete(repoId);
      if (!repository) {
        return res.status(404).json({ message: 'Repositorio não encontrado' });
      }
      res.json({ message: 'Repositorio excluído com sucesso' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao excluir repositorio' });
    }
  },

  create: async (req, res) => {
    const { title, techs, url } = req.body;
    if (!title && !techs && !url) {
      return res.status(400).json({ message: 'Título, url e techs são obrigatórios' });
    }
    try {
      const repository = new Repository({ title, techs, url });
      await repository.save();
      res.status(201).json(repository);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao criar repositorio',err });
    }
  },

  like: async (req, res) => {
    const repoId = req.params.id;
    try {
      const repositoryLike = await Repository.findById(repoId);
      const likes = repositoryLike.likes +1
      const repository = await Repository.findByIdAndUpdate(repoId, { likes }, { new: true });
      if (!repository) {
        return res.status(404).json({ message: 'repositorio não encontrado' });
      }
      res.json(repository);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao adicionar o like ao repositorio' });
    }
  }
}
module.exports = repositoryController;