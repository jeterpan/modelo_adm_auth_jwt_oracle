module.exports = {
    hrPool: {
        user: process.env.WS_ADM_JWT_ORA_USUARIO,
        password: process.env.WS_ADM_JWT_ORA_SENHA,
        connectionString: process.env.WS_ADM_JWT_ORA_CONN_STRING,
        poolMin: 10,
        poolMax: 10,
        poolIncrement: 0
    },
    jwtSecretKey: "HLNoadfr&@qvaaJ78xz=nv"
}