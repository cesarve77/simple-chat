import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Chats} from './collections'
import {SimpleChat} from './config'


Meteor.publish("simpleChats", function (roomId, limit) {
    check(roomId, String)
    check(limit, Number)
    if (!roomId)
        return
    if (!SimpleChat.options.publishChats.call(this, roomId, limit)) return []

    var query = {
        roomId: roomId
    };
    if (!SimpleChat.options.showJoined)
        query.message = {$exists: 1}
    var options = {sort: {date: -1}}
    if (limit)
        options.limit = limit
    return Chats.find(query, options);
});

