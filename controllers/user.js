const oracledb = require('oracledb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

configAuth = require('../config/auth.js')
configBanco = require('../config/database')

const database = require('../services/database.js')

const secoes = require('../db_api/secoes.js')

async function get(req, res, next) {
    try {
        const context = {}

        context.email = req.body.email.toLowerCase()

        const rows = await user.find(context)

        let meuRetorno = {}

        meuRetorno = { rows }

        if (req.params.email) {
            if (rows.length > 0) {
                res.status(200).json(meuRetorno)
            } else {
                console.log('nao encontrou dados para o filtro informado')
                res.status(404).end()
            }
        } else {
            res.status(400).json({"mensagem": " Informe no body as chaves email e password"})
        }
    } catch (err) {
        next(err)
    }
}

module.exports.get = get

// Criar usuario

function post(req, res, next) {
    let usuario = {
        email: req.body.email
    }

    const senhaDesembaralhada = req.body.senha

        // Gera um "salzinho" para ser usado na geração da senha
        bcrypt.genSalt(10, function(erro, salt) {
            if (erro) {
                return next(erro)
            }
    
            // Gera a senha
            bcrypt.hash(senhaDesembaralhada, salt, function(erro, hash) {
                if (erro) {
                    return next(erro)
                }
                return(hash)
            })
        })

        usuario.senhaEmbaralhada = embaralhaSenha(senhaDesembaralhada)

        insereUsuario(usuario, function(err, usuario) {
            let payload

            if (err) {
                return next(err)
            }

            payload = {
                sub: usuario.email,
                papel: usuario.papel
            }

            res.status(200).json({
                usuario: usuario,
                token: jwt.sign(payload, configAuth.jwtSecretKey, {expiresInMinutes: 480})
            })

        }
    )
}

module.exports.post = post

// Insere usuario no banco de dados
function insereUsuario(usuario, cb) {
    oracledb.getConnection(
        configBanco.database,
        function (erro, conexao) {
            if (erro) {
                return cb (erro)
            }

            conexao.execute(
                `insert into usuarios 
                   (email, senha, papel)
                 values
                   (:email, :senha, \'BASICO\')
                 returning 
                   id,
                   email,
                   papel
                 into
                  :rid,
                  :remail,
                  :rpapel
                `,
                {
                    email: usuario.email.toLowerCase(),
                    senha: usuario.senhaEmbaralhada,
                    rid: {
                        type: oracledb.NUMBER,
                        dir: oracledb.BIND_OUT
                    },
                    remail: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    },
                    rpapel: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    }
                },
                {
                    autoCommit: true
                },
                function(erro, resultados){
                    if (erro) {
                        connection.release(function(err) {
                            if(err){
                                console.error(err.message)
                            }
                        })

                        return cb(err)
                    }

                    cb(null, {
                        id: resultados.outBinds.rid[0],
                        email: resultados.outBinds.remail[0],
                        papel: resultados.outBinds.rpapel[0]
                    })

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message)
                        }
                    })
                }
            )
        }
    )
}

