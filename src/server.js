const app = require("./app");
const {
    startDatabase
} = require('./config/db');
const PORT = process.env.PORT || 3333;

app.listen(PORT, async () => {
  startDatabase()
  console.log(`Servidor rodando na porta ${PORT}`);
});
