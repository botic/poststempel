const SERVER_TOKEN = "POSTMARK_API_TEST";

const assert = require("assert");
const Client = require("../lib/poststempel");

exports.testSendEmail = function() {
    const postmarkClient = new Client(SERVER_TOKEN);
    let response = postmarkClient.sendEmail({
        "From": "sender@example.com",
        "To": "receiver@example.com",
        "Cc": "copied@example.com",
        "Bcc": "blank-copied@example.com",
        "Subject": "Test",
        "Tag": "Invitation",
        "HtmlBody": "<b>Hello</b>",
        "TextBody": "Hello",
        "ReplyTo": "reply@example.com",
        "Headers": [
            {
                "Name": "CUSTOM-HEADER",
                "Value": "value"
            }
        ],
        "TrackOpens": true
    });

    assert.equal(response["ErrorCode"], 0);
    assert.isNotUndefined(response["To"]);
    assert.isNotUndefined(response["SubmittedAt"]);
    assert.isNotUndefined(response["MessageID"]);
    assert.isNotUndefined(response["Message"]);
};

if (require.main === module) {
    require("test").run(module.exports);
}
