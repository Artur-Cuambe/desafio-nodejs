const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    techs: [{
        type: String,
        required: true
    }],
    likes: {
        type: Number,
        default: 0
    },
});

const repository = mongoose.model('repository', repositorySchema);

module.exports = repository;