const app = require("./app");
const {get, post} = require("axios");

app.listen(3031, function() {
    console.log("Server started on port 3031");

    setInterval(notifyClient, 5 * 1000);
});

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('App is closing: cleaning');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

function notifyClient() {
    let server = "localhost:5500"
    let client = {hostname: "ciccio", ip: "192.168.10.1"}

    get(`http://${server}/`).then((result) => {
        console.log(`result: ${result.data.message}`);
    }).catch(function (error) {
        console.log(`Connection failed: ${error}`);
    })

    post(`http://${server}/clients`, client).then((result) => {
        console.log(`${result.data.message}`);
    }).catch(function (error) {
        console.log(`Client registration to Client Manager failed ${error}`);
    })
}