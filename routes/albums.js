const express = require('express');
const router = express.Router();
const data = require('../data');
const albums = data.albums;
const collections = require('../config/mongoCollection');
