const express = require('express');
const repositoryController = require('../controllers/repositoryController');

const router = express.Router();

router.get('/repositories', repositoryController.list);
router.post('/repositories', repositoryController.create);
router.put('/repositories/:id', repositoryController.update);
router.post('/repositories/:id/like', repositoryController.like);
router.delete('/repositories/:id', repositoryController.delete);

module.exports = router;
