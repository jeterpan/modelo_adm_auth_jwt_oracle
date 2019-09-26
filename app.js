
const webServer = require('./services/web-server.js')
const dbConfig = require('./config/database.js')

const defaultThreadPoolSize = 4
process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize

async function startup(){
    console.log('Iniciando aplicacao...')

    try {
        console.log('Inicializando o modulo de banco de dados')

        await database.initialize()
    } catch (err) {
        console.error(err)

        process.exit(1)
    }

    try{
        console.log('Inicializando o modulo webServer...')

        await webServer.initialize()
    } catch (err) {
        console.error(err)

        process.exit(1)
    }
}

startup();

async function shutdown(e) {
    let err = e

    console.log('Desligando')

    try {
        console.log('Fechando o modulo webServer')

        await webServer.close()
    } catch (e) {
        console.log('Erro encontrado', e)

        err = err || e
    }

    console.log('Saindo do processo')

    if(err) {
        process.exit(1)
    } else {
        process.exit(0)
    }
}

process.on('SIGTERM', () => {
    console.log('Recebido SIGTERM')

    shutdown()
})

process.on('SIGINT', ()=> {
    console.log('Recebido SIGINT')

    shutdown()
})

process.on('uncaughtException', err => {
    console.log('Uncaught exception')
    console.error(err)

    shutdown(err)
})