const CommandData = require('../command');

describe("Command execution tests", () => {
    beforeAll(done => {
        done()
    })

    afterAll(done => {
        done()
    })

    test("it should return status OK when all is gone right and wait is false", () => {
        const command = new CommandData({
            scriptName: "dir",
            scriptParameters: "",
            wait: false,
            scriptWorkingDirectory: "."
        });

        return command.execute().then(retValue => {
            expect(retValue.processExitStatus.status).toContain("OK")
            expect(retValue.processExitStatus.command).toContain("dir")
            expect(retValue.processExitStatus.parameters).toContain("")
            expect(retValue.processExitStatus.log).toBe("")
        })
    });

    test("it should return status OK when all is gone right and wait is true", () => {
        const command = new CommandData({
            scriptName: "dir",
            scriptParameters: "",
            wait: true,
            scriptWorkingDirectory: "."
        });

        return command.execute().then(retValue => {
            expect(retValue.processExitStatus.status).toContain("OK")
            expect(retValue.processExitStatus.command).toContain("dir")
            expect(retValue.processExitStatus.parameters).toContain("")
            expect(retValue.processExitStatus.log).toContain("")
        })
    });
});