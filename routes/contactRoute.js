const express = require('express');
const Contact = require('../controllers/contactController');
const router = express.Router();

router.post('/add-contact', function (req, res){
    Contact.createContact(req, res);
});

router.get('/get-contact-by-id', function (req,res){
    Contact.getContactById(req, res);
});

router.get('/get-contacts', function (req, res){
    Contact.getContacts(req, res);
});

router.patch('/update-contact', function (req, res){
    Contact.updateContact(req, res);
});

router.delete('/delete-contact', function (req, res){
    Contact.removeContact(req, res);
});

module.exports = router;