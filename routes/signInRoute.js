const express = require('express');
const Agent = require('../controllers/agentController');
const router = express.Router();

router.get('/logout', function (req, res ){
    Agent.logoutAgent(req, res);
});

router.post('/login', function (req, res ){
    Agent.signInAgent(req, res);
});

module.exports = router;