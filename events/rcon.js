const Rcon = require('rcon');
const { rconHost, rconPort, rconPassword } = require('../config.json');


let rconConnection = null;
let isConnected = false;
let pingInterval = null;
let missedPings = 0;
const MAX_MISSED_PINGS = 4;
const PING_INTERVAL_MS = 15000; // 10 секунд

function initializeRcon(client) {
    console.log('Инициализация RCON соединения...');

    function setupConnection() {
        rconConnection = new Rcon(rconHost, rconPort, rconPassword, {
            tcp: true,
            challenge: false
        });

        rconConnection.on('auth', () => {
            isConnected = true;
            missedPings = 0;
            console.log('RCON соединение установлено и авторизовано');
            startPingMonitor();
        });

        rconConnection.on('error', (err) => {
            isConnected = false;
            console.error('RCON ошибка соединения:', err);
            stopPingMonitor();
        });

        rconConnection.on('end', () => {
            isConnected = false;
            console.warn('RCON соединение разорвано, переподключение через 10 секунд...');
            stopPingMonitor();
            setTimeout(() => {
                if (rconConnection) {
                    console.log('Попытка переподключения к RCON...');
                    reconnect();
                }
            }, 10000);
        });

        rconConnection.connect();
        rconConnection.setMaxListeners(10);
    }

    function reconnect() {
        try {
            if (rconConnection) {
                rconConnection.removeAllListeners();
                rconConnection = null;
            }
        } catch (e) {}
        setupConnection();
    }

    function startPingMonitor() {
        stopPingMonitor();
        pingInterval = setInterval(async () => {
            if (!isConnected) return;
            try {
                await pingRcon();
                missedPings = 0;
            } catch (e) {
                missedPings++;
                console.warn(`RCON ping не ответил (${missedPings}/${MAX_MISSED_PINGS})`);
                if (missedPings >= MAX_MISSED_PINGS) {
                    console.error('RCON не отвечает, переподключение...');
                    isConnected = false;
                    stopPingMonitor();
                    reconnect();
                }
            }
        }, PING_INTERVAL_MS);
    }

    function stopPingMonitor() {
        if (pingInterval) {
            clearInterval(pingInterval);
            pingInterval = null;
        }
    }

    setupConnection();

    client.rcon = {
        send: sendCommand,
        getConnection: getConnection
    };
}

async function sendCommand(command) {
    return new Promise((resolve, reject) => {
        if (!isConnected) {
            reject(new Error('RCON соединение не активно'));
            return;
        }

        const responseHandler = (response) => {
            rconConnection.removeListener('response', responseHandler);
            resolve(response);
        };

        const errorHandler = (error) => {
            rconConnection.removeListener('error', errorHandler);
            rconConnection.removeListener('response', responseHandler);
            reject(error);
        };

        rconConnection.once('response', responseHandler);
        rconConnection.once('error', errorHandler);
        
        try {
            rconConnection.send(command);
        } catch (error) {
            rconConnection.removeListener('response', responseHandler);
            rconConnection.removeListener('error', errorHandler);
            reject(error);
        }
    });
}

async function pingRcon() {
    return new Promise((resolve, reject) => {
        if (!isConnected) {
            reject(new Error('RCON соединение не активно'));
            return;
        }

        const startTime = Date.now();
        const responseHandler = (response) => {
            const ping = Date.now() - startTime;
            rconConnection.removeListener('response', responseHandler);
            resolve(ping);
        };

        const errorHandler = (error) => {
            rconConnection.removeListener('error', errorHandler);
            rconConnection.removeListener('response', responseHandler);
            reject(error);
        };

        rconConnection.once('response', responseHandler);
        rconConnection.once('error', errorHandler);
        
        try {
            rconConnection.send('help');
        } catch (error) {
            rconConnection.removeListener('response', responseHandler);
            rconConnection.removeListener('error', errorHandler);
            reject(error);
        }
    });
}

function getConnection() {
    if (!rconConnection) {
        throw new Error('RCON соединение не инициализировано');
    }
    return rconConnection;
}

module.exports = {
    initializeRcon,
    sendCommand,
    pingRcon,
    getConnection
};
