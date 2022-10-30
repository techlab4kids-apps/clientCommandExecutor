const {get, post} = require("axios");
const os = require("os");
const IP = require('ip');

function notifyClient() {
    const localHostName = os.hostname();
    let server = `${process.env.SERVER_NAME}:5500`
    let client = {hostname: localHostName, ip: IP.address()}

    get(`http://${server}/api/`).then((result) => {
        console.log(`result: ${result.data.message}`);
    }).catch(function (error) {
        console.log(`Connection failed: ${error}`);
    })

    post(`http://${server}/api/clients`, client).then((result) => {
        console.log(`${result.data.message}`);
    }).catch(function (error) {
        console.log(`Client registration to Client Manager failed ${error}`);
    })
}

module.exports = notifyClient;