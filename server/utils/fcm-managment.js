var admin = require('firebase-admin');

// Load FireBase Credentials
var userServiceAccount = require('../firebase/mallvirtual-595b8-firebase-adminsdk-krho9-0adb9c5d11.json');

// Declare FireBase Apps
var _userFCM = admin.initializeApp({
    credential: admin.credential.cert(userServiceAccount),
    databaseURL: 'https://mallvirtual-595b8.firebaseio.com'
}, 'userFCM');

/**
 * SEND NOTIFICATIONS TO USERS
 */
// SEND NOTIFICATION TO INDIVIDUAL USER
exports.userNotification = function(tokensList, title, body, data) {
    var payload = {
        notification: {
            title,
            body
        },
        data: data
    };
    return _userFCM.messaging().sendToDevice(tokensList, payload);
};

// BROADCAST NOTIFICATIONS SEND TO TOPIC
exports.userBroadcastNotification = function(topic, title, body, data) {
    var payload = {
        notification: {
            title,
            body
        },
        data: data
    };
    return _userFCM.messaging().sendToTopic(`/topics/${topic}`, payload);
};