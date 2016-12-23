'use strict';

const axios = require('axios');

const botId = process.env.BOT_ID;
const botName = process.env.BOT_NAME;

function receivedMessage(data) {
  var groupId = data.group_id;
  var senderName = data.name;
  var senderAvatar = data.avatar_url;
  var senderId = data.sender_id;
  var senderType = data.sender_type;
  var userId = data.user_id;
  var createdAt = data.created_at;

  var messageId = data.id;
  var messageText = data.text;
  var messageAttachments = data.attachments;

  // ignore the bots own messages, prevents infinite loop
  if (senderName !== botName && senderType !== 'bot') {
    if (messageText) {
      console.log('messageText', messageText);
      // If we receive a text message, check to see if it matches a keyword
      // and send back the example. Otherwise, just echo the text we received.
      switch (messageText) {
        case 'keyword':
          sendKeywordMessage();
          break;
        default:
          sendTextMessage(messageText);
      }
    } else if (messageAttachments && messageAttachments.length > 0) {
      sendTextMessage('Message with attachments received');
    }
  }
}

function sendKeywordMessage() {
  var messageData =   {
    bot_id: botId,
    text: 'Keyword was said.'
  };

  callSendAPI(messageData);
}

function sendTextMessage(messageText) {
  var messageData =   {
    bot_id: process.env.BOT_ID,
    text: messageText
  };

  // image
  // {
  //   "bot_id"  : "j5abcdefg",
  //   "text"    : "Hello world",
  //   "attachments" : [
  //     {
  //       "type"  : "image",
  //       "url"   : "https://i.groupme.com/somethingsomething.large"
  //     }
  //   ]
  // }

  // location
  // {
  //   "bot_id"  : "j5abcdefg",
  //   "text"    : "Hello world",
  //   "attachments" : [
  //     {
  //       "type"  : "location",
  //       "lng"   : "40.000",
  //       "lat"   : "70.000",
  //       "name"  : "GroupMe HQ"
  //     }
  //   ]
  // }

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  const url = 'https://api.groupme.com/v3/bots/post';

  console.log('Sending message...');

  axios.post(url, messageData).then((response) => {
    console.log('Successfully sent message.');
  }).catch((error) => {
    console.error('Unable to send message. Error: ', error);
  });
}

module.exports.chat = (event, context, callback) => {
  if (event.httpMethod === 'POST') {
    var data = JSON.parse(event.body);

    receivedMessage(data);

    callback(null, {statusCode: 200, body: 'Ok'});
  } else {
    callback('Received something other than a POST!');
  }
};
