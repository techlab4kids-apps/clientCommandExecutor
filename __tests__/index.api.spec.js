const  {expect} = require ('@jest/globals');
const request = require('supertest');
const app = require("../app");
const supertest = require("supertest");

describe('POST /command', function() {
    test('should return appropriate message (command with wait true)', function(done) {
        let command = {
            scriptName: "dir",
            scriptParameters: "",
            scriptWait: true,
            scriptWorkingDirectory: "."
        };

        request(app)
            .post('/commands/dir')
            .send(command)
            .expect(200)
            .end(function(err, res) {
                expect(res.statusCode).toBe(200);
                expect(res.body.processExitStatus.status).toContain("OK")

                if (err) {
                    return done(err)
                };

                return done();
            });
    });

    test('should return appropriate message (command with wait false)', function(done) {
        let command = {
            scriptName: "dir",
            scriptParameters: "",
            scriptWait: false,
            scriptWorkingDirectory: "."
        };

        request(app)
            .post('/commands/dir')
            .send(command)
            .expect(200)
            .end(function(err, res) {
                expect(res.statusCode).toBe(200);
                expect(res.body.processExitStatus.status).toContain("OK")

                if (err) {
                    return done(err)
                };

                return done();
            });
    });
});