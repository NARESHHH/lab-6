const restaurantsRoutes = require('./bands');
const reviewsRoutes = require('./albums');

const constructorMethod = (app) => {
  app.use('/bands', restaurantsRoutes);
  app.use('/albums', reviewsRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;
