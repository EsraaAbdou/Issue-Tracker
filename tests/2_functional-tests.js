const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const apiRoutes = require('../routes/api');
const Issue = apiRoutes.Issue;

chai.use(chaiHttp);

suite('Functional Tests', function() {

    Issue.remove({}, (err, data) => {});

    suite('Get Requests', function () {
        const issues = [new Issue({ 
            "issue_title": "Fix error in posting data(get)",
            "issue_text": "When we post data it has an error(get)",
            "created_on": new Date(),
            "updated_on": new Date(),
            "created_by": "yara",
            "assigned_to": "Joe(get)",
            "open": true,
            "status_text": ""
        }), new Issue({ 
            "issue_title": "Fix error in posting data(get)",
            "issue_text": "When we post data it has an error(get)",
            "created_on": new Date(),
            "updated_on": new Date(),
            "created_by": "yara",
            "assigned_to": "Joe(get)",
            "open": false,
            "status_text": ""
        }), new Issue({ 
            "issue_title": "Fix error in posting data(get)",
            "issue_text": "When we post data it has an error(get)",
            "created_on": new Date(),
            "updated_on": new Date(),
            "created_by": "Joe(get)",
            "assigned_to": "Joe(get)",
            "open": true,
            "status_text": ""
        })];
        Issue.create(issues, (err, save) => {});

        test('Get all issues on a project', function(done) {
            chai
            .request(server)
            .get("/api/issues/apitests")
            .end(function (err, res) {
            const response = JSON.parse(res.text);
            const firstObj = response[0];
            assert.equal(res.status, 200);
            assert.equal(response.length, 3);
            assert.isArray(response, "returned response should be an array");
            assert.isObject(firstObj, "returned Array should contain objects");
            assert.hasAllKeys(firstObj, ["_id", "issue_title", "issue_text", "created_on", "updated_on", "created_by", "assigned_to", "open", "status_text"], "returned objects should have all properties");
            done();
            });
        });
        test('Get issues on a project with one filter', function(done) {
            chai
            .request(server)
            .get("/api/issues/apitests?open=true")
            .end(function (err, res) {
            const response = JSON.parse(res.text);
            const firstObj = response[0];
            assert.equal(res.status, 200);
            assert.equal(response.length, 2);
            assert.isArray(response, "returned response should be an array");
            assert.isObject(firstObj, "returned Array should contain objects");
            assert.hasAllKeys(firstObj, ["_id", "issue_title", "issue_text", "created_on", "updated_on", "created_by", "assigned_to", "open", "status_text"], "returned objects should have all properties");
            done();
            });
        });
        test('Get issues on a project with multiple filters', function(done) {
            chai
            .request(server)
            .get("/api/issues/apitests?open=true&created_by=yara")
            .end(function (err, res) {
            const response = JSON.parse(res.text);
            const firstObj = response[0];
            assert.equal(res.status, 200);
            assert.equal(response.length, 1);
            assert.isArray(response, "returned response should be an array");
            assert.isObject(firstObj, "returned Array should contain objects");
            assert.hasAllKeys(firstObj, ["_id", "issue_title", "issue_text", "created_on", "updated_on", "created_by", "assigned_to", "open", "status_text"], "returned objects should have all properties");
            done();
            });
        });
    });

    suite('Post Requests', function () {
        test('Post an issue with every field', function(done) {
        chai
        .request(server)
        .post("/api/issues/apitests")
        .type('form')
        .send({
            "issue_title": "issue title",
            "issue_text": "issue text",
            "created_by": "admin",
            "assigned_to": "user",
            "status_text": "status"
        })
        .end(function (err, res) {
            const response = JSON.parse(res.text);
            const nowTime = new Date().getTime();
            const createdOnTime = Date.parse(response.created_on);
            const updatedOnTime = Date.parse(response.updated_on);

            assert.equal(res.status, 200);
            assert.isObject(response, "expected post return to be an object");
            assert.hasAllKeys(response, ["_id", "issue_title", "issue_text", "created_on", "updated_on", "created_by", "assigned_to", "open", "status_text"], "returned objects should have all properties");
            assert.strictEqual(response.issue_title, "issue title", "Expected property issue_title to equal (issue title)")
            assert.strictEqual(response.issue_text, "issue text", "Expected property issue_text to equal (issue text)")
            assert.strictEqual(response.created_by, "admin", "Expected property created_by to equal (admin)")
            assert.strictEqual(response.assigned_to, "user", "Expected property assigned_to to equal (user)")
            assert.strictEqual(response.status_text, "status", "Expected property status_text to equal (status)")
            assert.isTrue(response.open, "Expected property open to true");
            assert.isAtMost(createdOnTime - nowTime, 10, "Expected property created_on time to be around (in range of 10 seconds) the time when test ran");
            assert.isAtMost(updatedOnTime - nowTime, 10, "Expected property created_on time to be around (in range of 10 seconds) the time when test ran");
            done();
        });
        });
        test('Post an issue with only required fields', function(done) {
        chai
        .request(server)
        .post("/api/issues/apitests")
        .type('form')
        .send({
            "issue_title": "issue title",
            "issue_text": "issue text",
            "created_by": "admin",
            "assigned_to": "",
            "status_text": ""
        })
        .end(function (err, res) {
            const response = JSON.parse(res.text);
            const nowTime = new Date().getTime();
            const createdOnTime = Date.parse(response.created_on);
            const updatedOnTime = Date.parse(response.updated_on);

            assert.equal(res.status, 200);
            assert.isObject(response, "expected post return to be an object");
            assert.hasAllKeys(response, ["_id", "issue_title", "issue_text", "created_on", "updated_on", "created_by", "assigned_to", "open", "status_text"], "returned objects should have all properties");
            assert.strictEqual(response.issue_title, "issue title", "Expected property issue_title to equal (issue title)")
            assert.strictEqual(response.issue_text, "issue text", "Expected property issue_text to equal (issue text)")
            assert.strictEqual(response.created_by, "admin", "Expected property created_by to equal (admin)")
            assert.strictEqual(response.assigned_to, "", "Expected property assigned_to to be empty string")
            assert.strictEqual(response.status_text, "", "Expected property status_text to be empty string")
            assert.isTrue(response.open, "Expected property open to true")
            assert.isAtMost(createdOnTime - nowTime, 10, "Expected property created_on time to be around (in range of 10 seconds) the time when test ran");
            assert.isAtMost(updatedOnTime - nowTime, 10, "Expected property created_on time to be around (in range of 10 seconds) the time when test ran");
            done();
        });
        });
        test('Post an issue with missing required fields', function(done) {
        chai
        .request(server)
        .post("/api/issues/apitests")
        .type('form')
        .send({
            "issue_title": "issue title",
            "issue_text": "issue text",
            "created_by": "",
            "assigned_to": "",
            "status_text": ""
        })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(JSON.parse(res.text), { error: 'required field(s) missing' }, "Expected request to return error");
            done();
        });
        });
    });

    suite('Put Requests', function () {

        test('Update one field on an issue', function(done) {
        const issue = new Issue({ 
            "issue_title": "Fix error in posting data(put)",
            "issue_text": "When we post data it has an error(put)",
            "created_on": new Date(),
            "updated_on": new Date(),
            "created_by": "Joe(put)",
            "assigned_to": "Joe(put)",
            "open": true,
            "status_text": ""
        });
        issue.save((err, data) => {
            if(data) {
            const id = issue._id.toString();
            chai
            .request(server)
            .put("/api/issues/apitests")
            .type('form')
            .send({
                "_id": id,
                "issue_title": "new title",
                "issue_text": "",
                "created_by": "",
                "assigned_to": "",
                "status_text": ""
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(JSON.parse(res.text), {
                    result: 'successfully updated',
                    '_id': id
                });
                done();
            });
            }
        });
        });

        test('Update multiple fields on an issue', function(done) {
            const issue = new Issue({ 
                "issue_title": "Fix error in posting data(put)",
                "issue_text": "When we post data it has an error(put)",
                "created_on": new Date(),
                "updated_on": new Date(),
                "created_by": "Joe(put)",
                "assigned_to": "Joe(put)",
                "open": true,
                "status_text": ""
            });
            issue.save((err, data) => {
                if(data) {
                    const id = issue._id.toString();    
                    chai
                    .request(server)
                    .put("/api/issues/apitests")
                    .type('form')
                    .send({
                        "_id": id,
                        "issue_title": "new title",
                        "issue_text": "new text",
                        "created_by": "new admin",
                        "assigned_to": "",
                        "status_text": ""
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(JSON.parse(res.text), {
                            result: 'successfully updated',
                            '_id': id
                        });
                        done();
                    });
                }
            });
        });

        test('Update an issue with missing _id', function(done) {
        const id = "";
        chai
        .request(server)
        .put("/api/issues/apitests")
        .type('form')
        .send({
            "_id": id,
            "issue_title": "new title",
            "issue_text": "new text",
            "created_by": "new admin",
            "assigned_to": "",
            "status_text": ""
        })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(JSON.parse(res.text), {
                error: 'missing _id'
            });
            done();
        });
        });

        test('Update an issue with no fields to update', function(done) {
        const issue = new Issue({
            "issue_title": "Fix error in posting data(put)",
            "issue_text": "When we post data it has an error(put)",
            "created_on": new Date(),
            "updated_on": new Date(),
            "created_by": "Joe(put)",
            "assigned_to": "",
            "open": true,
            "status_text": ""
        });
        const id = issue._id.toString();
        chai
        .request(server)
        .put("/api/issues/apitests")
        .type('form')
        .send({
            "_id": id,
            "issue_title": "",
            "issue_text": "",
            "created_by": "",
            "assigned_to": "",
            "status_text": "",
        })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(JSON.parse(res.text), {
                error: 'no update field(s) sent',
                '_id': id
            });
            done();
        });
        });

        test('Update an issue with an invalid _id', function(done) {
            const id = "this_is_an_invalid_id";
            chai
            .request(server)
            .put("/api/issues/apitests")
            .type('form')
            .send({
              "_id": id,
              "issue_title": "new title",
              "issue_text": "",
              "created_by": "",
              "assigned_to": "",
              "status_text": ""
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.deepEqual(JSON.parse(res.text), {
                  error: 'could not update',
                  '_id': id
              });
              done();
            });
        });

    });

    suite('Delete Requests', function () {
        test('Delete an issue', function(done) {
        const issue = new Issue({ 
            "issue_title": "Fix error in posting data(delete)",
            "issue_text": "When we post data it has an error(delete)",
            "created_on": new Date(),
            "updated_on": new Date(),
            "created_by": "Joe(delete)",
            "assigned_to": "Joe(delete)",
            "open": true,
            "status_text": ""
        });
        issue.save((err, data) => {
            if(data) {
            const id = issue._id.toString();
            chai
            .request(server)
            .delete("/api/issues/apitests")
            .type('form')
            .send({
                "_id": id
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(JSON.parse(res.text), {
                result: 'successfully deleted',
                '_id': id
                });
                done();
            });
            }
        });
        });
        test('Delete an issue with an invalid _id', function(done) {
        const id = "this_is_an_invalid_id";
        chai
        .request(server)
        .delete("/api/issues/apitests")
        .type('form')
        .send({
            "_id": id
        })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(JSON.parse(res.text), {
            error: 'could not delete',
            '_id': id
            });
            done();
        });
        });
        test('Delete an issue with a missing _id', function(done) {
        chai
        .request(server)
        .delete("/api/issues/apitests")
        .type('form')
        .send({
            "_id": ""
        })
        .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.deepEqual(JSON.parse(res.text), {error: 'missing _id'});
            done();
        });
        });
    });
});
