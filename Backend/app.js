const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const helmet = require('helmet');
const app = express()
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

app.use(helmet({
      crossOriginResourcePolicy: false,
    }));
app.use('/images', express.static(path.join(__dirname, 'images')))

const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes = require('./routes/works.routes');
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);

module.exports = app;
