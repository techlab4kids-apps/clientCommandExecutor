const os = require("os");

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const notifier = require('node-notifier');
const notifyClient = require("./clientNotifier");
const Command = require("./command");
// const {notifyClient} = require('clientNotifier')

const {io} = require("socket.io-client");
const IP = require("ip");
const server = process.env.SERVER_NAME
const serverPort = process.env.SERVER_PORT

let socket = io(`http://${server}:${serverPort}/client-namespace`);

const app = express();

app.use(cors({credentials: false, origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

// process.stdin.resume();//so the program will not close instantly
// function exitHandler(options, exitCode) {
//     // if (options.cleanup) console.log('App is closing: cleaning');
//     // if (exitCode || exitCode === 0) console.log(exitCode);
//     // if (options.exit) process.exit();
//
// }
//do something when app is closing
// process.on('exit', exitHandler.bind(null,{cleanup:true}));
//
// //catches ctrl+c event
// process.on('SIGINT', exitHandler.bind(null, {exit:true}));
//
// // catches "kill pid" (for example: nodemon restart)
// process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
// process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
//
// //catches uncaught exceptions
// process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

app.get("/", (req, res) => {
    return "Ecchime!"
})

app.register = () => {
    // socket.connect();

    socket.on("connect", () => {
        console.log("Current socket ID: " + socket.id);

        const localHostName = os.hostname();
        let client = {hostname: localHostName, ip: IP.address()}

        socket.emit("introduce", client)
    });

    socket.on("launchCommand", (command, fn) => {
        let cmd = new Command(command);
        console.log("Starting to execute command: " + JSON.stringify(cmd));
        let retValue = cmd.execute();
        retValue.then(data => {
                fn(data);
                console.log("command terminated with retValue: " + JSON.stringify(data));
            }
        )
    });

    socket.on("disconnect", () => {
        console.log("Disconnecting socket");
    });

    socket.on("server_not_ready", () => {
        socket.disconnect();
        setTimeout(() => {
            socket.connect();
        }, 1000);
    });
};

app.post("/commands/:scriptName", (req, res) => {
    const command = new Command({
        scriptName: req.body.scriptName,
        scriptParameters: req.body.scriptParameters,
        scriptWait: req.body.scriptWait,
        scriptWorkingDirectory: req.body.scriptWorkingDirectory
    });

    command.execute().then(returnObject => {

        notifier.notify({
            title: `Comando: ${returnObject.processExitStatus.command}`,
            message: `Parametri: ${returnObject.processExitStatus.parameters}\nLog: ${returnObject.processExitStatus.log}`
        });

        if (returnObject.processExitStatus.status == "OK") {
            res.status(200).send(returnObject);
        } else {
            res.status(500).send(returnObject);
        }
    });
})

module.exports = app;