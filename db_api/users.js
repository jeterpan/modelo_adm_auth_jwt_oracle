function insertUser(user, cb) {
    oracledb.getConnection(
        config.database,
        function(err, connection){
            if (err) {
                return cb(err);
            }
 
            connection.execute(
                'insert into users ( ' +
                '   email, ' +
                '   password, ' +
                '   role ' +
                ') ' +
                'values (' +
                '    :email, ' +
                '    :password, ' +
                '    \'BASE\' ' +
                ') ' +
                'returning ' +
                '   id, ' +
                '   email, ' +
                '   role ' +
                'into ' +
                '   :rid, ' +
                '   :remail, ' +
                '   :rrole',
                {
                    email: user.email.toLowerCase(),
                    password: user.hashedPassword,
                    rid: {
                        type: oracledb.NUMBER,
                        dir: oracledb.BIND_OUT
                    },
                    remail: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    },
                    rrole: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    }
 
                },
                {
                    autoCommit: true
                },
                function(err, results){
                    if (err) {
                        connection.release(function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                        });
 
                        return cb(err);
                    }
 
                    cb(null, {
                        id: results.outBinds.rid[0],
                        email: results.outBinds.remail[0],
                        role: results.outBinds.rrole[0]
                    });
 
                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                    });
                });
        }
    );
}

