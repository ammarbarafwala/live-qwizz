const
    express = require('express'),
    path = require('path')

const
    app = express(),
    server = require('http').Server(app)

    const db = require('./db')
require('./sockets')(server, db)
server.listen(3000)