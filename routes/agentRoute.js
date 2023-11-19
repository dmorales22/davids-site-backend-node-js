const express = require('express');
const Agent = require('../controllers/agentController');
const router = express.Router();

router.post('/register', function (req, res){
    Agent.createAgent(req, res);
});

router.get('/get-agent-by-id', function (req,res){
    Agent.getAgentById(req, res);
});
router.patch('/update-agent', function (req, res){
    Agent.updateAgent(req, res);
});

router.delete('/delete-agent', function (req, res){
    Agent.deleteAgent(req, res);
});

module.exports = router;