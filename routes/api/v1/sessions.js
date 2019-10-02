var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var User = require('../../../models').User;
