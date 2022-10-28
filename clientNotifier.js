
function notifyClient() {
    let server = "localhost:5500"
    let client = {hostname: "pippo", ip: "192.168.10.1"}

    get(`http://${server}/api/`).then((result) => {
        console.log(`result: ${result.data.message}`);
    }).catch(function (error) {
        console.log(`Connection failed: ${error}`);
    })

    post(`http://${server}/api/clients`, client).then((result) => {
        console.log(`Client registered:  ${result.data.message}`);
    }).catch(function (error) {
        console.log(`Client registration to Client Manager failed ${error}`);
    })
}

module.exports = notifyClient;