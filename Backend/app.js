const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// const cors = require('cors')
require('dotenv').config();
const helmet = require('helmet');
// const swaggerUi = require('swagger-ui-express')
// const yaml = require('yamljs')
// const swaggerDocs = yaml.load('swagger.yaml')
const app = express()
// app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.DB_LINK)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// app.use(express.urlencoded({ extended: true }))
app.use(helmet({
      crossOriginResourcePolicy: false,
    }));
app.use('/images', express.static(path.join(__dirname, 'images')))

// const db = require("./models");
// const userRoutes = require('./routes/user.routes');
// const categoriesRoutes = require('./routes/categories.routes');
// const worksRoutes = require('./routes/works.routes');
// db.sequelize.sync().then(()=> console.log('db is ready'));
// app.use('/api/users', userRoutes);
// app.use('/api/categories', categoriesRoutes);
// app.use('/api/works', worksRoutes);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

module.exports = app;
