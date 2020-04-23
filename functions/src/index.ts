import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

/**
 * @description To listen for new logs create event and send notification to the respective device.
 */
exports.onNewLogAdded = functions.database.ref("logs/{userId}/{objectId}").onCreate(async (event, context) => {
  //UID of respective user for this write event.
  const userId = context.params.userId;
  //Content of the write event.
  const logData = event.val()

  //Push Notification content.
  const payload = {
    notification: {
      title: "Activity detected in the area of surveillance on: " + logData.incedentDateAndtime,
      body: "List of object identified: " + logData.detectedObjects
    }
  }

  var tokens: string[] = [] //List of tokens to send notification to

  //Retrieves device token for the given userId
  await admin.database().ref('devices').child(userId).once('value', (snapshot) => {
    if (snapshot.val().token != "") {
      tokens.push(snapshot.val().token); /**There is ever going to be one entry with the matching query*/
    }
  })
  
  //Sends notification.
  return admin.messaging().sendToDevice(tokens, payload);
})