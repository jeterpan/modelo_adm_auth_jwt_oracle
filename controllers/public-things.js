const coligadas = require('../db_api/coligadas.js')

async function get(req, res, next) {
    try {
        const context = {}

        context.coligada = req.params.coligada

        const rows = await coligadas.find(context)

        let meuRetorno = {}

        meuRetorno = { coligadas: rows }

        if (req.params.id) {
            if (rows.length > 0) {
                res.status(200).json(meuRetorno)
            } else {
                console.log('nao encontrou dados para o filtro informado')
                res.status(404).end()
            }
        } else {
            res.status(200).json(meuRetorno)
        }
    } catch (err) {
        next(err)
    }
}

module.exports.get = get


var oracledb = require('oracledb');
var config = require(__dirname + '../../config.js');

function get(req, res, next) {
    oracledb.getConnection(
        config.database,
        function(err, connection){
            if (err) {
                return next(err);
            }

            connection.execute(
                'select column1 as "column1" ' +
                'from jsao_public_things ',
                {},//no binds
                {
                    outFormat: oracledb.OBJECT
                },
                function(err, results){
                    if (err) {
                        connection.release(function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                        });

                        return next(err);
                    }

                    res.status(200).json(results.rows);

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                    });
                });
        }
    );
}

module.exports.get = get;