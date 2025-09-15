const express = require('express');

const gameRoutes = require('./gameRoutes');

const router = express.Router();

router.use('/game', gameRoutes);


module.exports = router;