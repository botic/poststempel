const objects = require("ringo/utils/objects");
const {request} = require("ringo/httpclient");

const log = require("ringo/logging").getLogger(module.id);

const prepareRequestOptions = function(client, path, data, method) {
    return {
        "method": method || "POST",
        "url": "https://api.postmarkapp.com" + (path.charAt(0) === "/" ? "" : "/") + path,
        "headers": {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Postmark-Server-Token": client.serverToken
        },
        "data": JSON.stringify(data, null, 0)
    };
};

const callPostmark = function(client, path, data, method) {
    const exchange = request(prepareRequestOptions(client, path, data, method));

    if (exchange.contentLength < 2) {
        log.error("Invalid response by Postmark API!");
        return {};
    }

    let apiResponse = {};
    try {
        apiResponse = JSON.parse(exchange.content);
    } catch (e) {
        log.error("Invalid JSON response by Postmark API!");
        return {};
    }

    if (exchange.status !== 200) {
        log.error("Postmark API Error: Code", apiResponse.ErrorCode, " - ", apiResponse.Message);
    }

    return apiResponse;
};

/**
 * The PostmarkClient.
 * @param {String} serverToken your unique Postmark server token.
 * @constructor
 */
const PostmarkClient = module.exports = function PostmarkClient(serverToken) {
    if (!(this instanceof PostmarkClient)) {
        return new PostmarkClient(serverToken);
    }

    if (typeof serverToken !== "string") {
        throw new Error("You must provide your Postmark API token!");
    }

    Object.defineProperties(this, {
        "version": {
            "value": require("../package.json").version,
            "enumerable": true
        },
        "serverToken": {
            "value": serverToken,
            "enumerable": true
        }
    });

    return this;
};

/**
 * Sends a mail via Postmark.
 * @param {Object} mail an object
 * @returns {Object} the API response object
 * @see <a href="http://developer.postmarkapp.com/developer-send-api.html">Postmark API <code>/email</code></a>
 */
PostmarkClient.prototype.sendEmail = function (mail) {
    return callPostmark(this, "/email", mail);
};
