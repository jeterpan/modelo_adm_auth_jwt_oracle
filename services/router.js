const express = require('express')
const router = new express.Router()
const coligadas = require('../controllers/coligadas.js')
const secoes = require('../controllers/secoes.js')
const funcionario = require('../controllers/funcionario.js')
    
router.route('/coligadas/:coligada?')
    .get(coligadas.get)

router.route('/secoes/:coligada?')
    .get(secoes.get)

router.route('/funcionario/:coligada?/:matricula?')
    .get(funcionario.get)
   
module.exports = router