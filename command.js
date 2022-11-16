const execShPromise = require("exec-sh").promise;

class Command {
    constructor(command) {
        this.scriptName = command.scriptName;
        this.scriptParameters = command.scriptParameters;
        this.scriptWait = command.scriptWait;

        if (command.scriptWorkingDirectory) {
            this.scriptWorkingDirectory = "./";
        } else {
            this.scriptWorkingDirectory = "../";
        }
    }

    runAsync = async () => {
        let out;

        // Don't remove: required to verify async call
        // let promise = new Promise((resolve, reject) => {
        //     setTimeout(() => resolve({stderr: "", stdout: "", processExitStatus: {}}), 4000)
        // });

        try {
            // Don't remove: required to verify async call
            // out = await promise;
            out = await execShPromise(`${this.scriptName} ${this.scriptParameters}`, {cwd: this.scriptWorkingDirectory});
        } catch (e) {
            console.log('Error: ', e);
            console.log('Stderr: ', e.stderr);
            console.log('Stdout: ', e.stdout);

            let retValue = {"status": "KO", "log": "err: " + e + ";\nstdout: " + e.stdout + ";\nstderr: " + e.stderr};
            return retValue;
        }

        let returnObject = {
            "status": "OK",
            "command": this.scriptName,
            "parameters": this.scriptParameters,
            "log": "stdout: " + out.stdout + " \nstderr: " + out.stderr
        };
        out.processExitStatus = returnObject;
        return out;
    }

    execute() {
        let returnObject;
        if (!this.scriptWait) {
            this.runAsync();

            return new Promise((resolve, reject) => {
                returnObject = {
                    "status": "OK",
                    "command": this.scriptName,
                    "parameters": this.scriptParameters,
                    "log": ""
                };
                resolve({stderr: "", stdout: "", processExitStatus: returnObject});
            });
        } else {
            return this.runAsync().then(out => {
                returnObject = {
                    "status": "OK",
                    "command": this.scriptName,
                    "parameters": this.scriptParameters,
                    "log": "stdout: " + out.stdout + " \nstderr: " + out.stderr
                };
                out.processExitStatus = returnObject;
                return {stderr: "", stdout: "", processExitStatus: returnObject};
            });
        }
    }
}

module.exports = Command;