const database = require('../services/database.js')

const baseQuery = 
`
SELECT codcoligada, nomefantasia 
  FROM gcoligada
`

async function find(context) {
    let query = baseQuery
    const binds = {}

    if (context.coligada) {

        binds.coligada = context.coligada.toString()
        
        query += ` WHERE codcoligada = :coligada`

    } else {
        query += ` WHERE codcoligada <> 0`
    }

    const result = await database.simpleExecute(query, binds)

    return result.rows
}

module.exports.find = find