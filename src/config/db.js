const mongoose = require('mongoose');
async function startDatabase() {
  try {
    await mongoose.connect('mongodb://localhost/repo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Db Connected');
  } catch (error) {
    console.log('Error ============');
    console.log(error);
    process.exit(1);
  }
}

module.exports = { startDatabase };