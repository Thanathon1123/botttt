const verificationToken = process.env.APP_VERIFICATION_TOKEN;
const crypto = require("crypto");

async function execute(request) {
  let messages = await performLookup(request);
  return buildResult(messages);
}

/**
 *
 * Edit this function to perform a lookup and create a list of messages that will be returned to the user
 *
 * @param data
 * @returns {string|[]}
 */
async function performLookup(request) {
  // postcode is a variable in your flow, change it to match the variable name you have chosen
  let postcode = getFlowVariable("postcode", request);

  let messages = [];
  console.log(request);
  // replace this code
  if (postcode) {
    messages.push("Here's what I've found 😁");
    if (postcode.startsWith("pe")) {
      messages.push("Your next waste collection will be on Thursday");
      messages.push(
        "Your next recycling collection will be the following Thursday"
      );
    } else {
      messages.push("Your next waste collection will be on Wednesday");
      messages.push("Your next recycling collection will be on Friday");
    }
  } else {
    // this message will be displayed if the variable 'postcode' has not been supplied
    messages.push(
      "Unfortunately you didn't send me a postcode I can work with!"
    );
  }
  return messages;
}

function getFlowVariable(postcode, request) {
  return request.data[postcode];
}

function buildResult(messages) {
  let result = {
    flow: {
      messages: []
    }
  };

  for (let message of messages) {
    let messageObj = {
      type: "text",
      text: message
    };
    result.flow.messages.push(messageObj);
  }
  return result;
}

function verifySignature(signature, body) {
  let hash = crypto
    .createHmac("sha1", verificationToken)
    .update(JSON.stringify(body))
    .digest("hex");

  return signature === hash;
}

module.exports = {
  verifySignature,
  execute
};
