const pino = require('pino')

const options = {
    translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
    ignore: "pid,hostname",
    colorize: true
}

const transport = pino.transport({
    targets:[
        {
            target: "pino-pretty",
            options:{
                destination: `logs/${new Date(Date.now()).getDate() < 10 ? "0" : ""}${new Date(Date.now()).getDate()}-${new Date(Date.now()).getMonth()+1 < 10 ? "0" : ""}${new Date(Date.now()).getMonth()+1}-${new Date(Date.now()).getFullYear()}.log`,
                mkdir: true,
                ...options,
                colorize: false
            }
        },
        {
            target: 'pino-pretty',
            options: options
        }
    ]
});

const Log = pino(transport)

module.exports = Log;