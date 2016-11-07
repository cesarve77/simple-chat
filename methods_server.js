/**
 * Created by cesar on 23/2/16.
 */
import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import {Chats} from './collections'
import {Rooms} from './collections'
import {SimpleChat} from './config'

//todo improve security, for now any body con access to this methods and potentially change the data  (off messages recieved or room joins no a big deal but have to be fixed)
Meteor.methods({
    "SimpleChat.messageReceived": function (id, username) {

        check(id, String)
        check(id, username)

        this.unblock()
        if (!SimpleChat.options.showReceived) return false

        Meteor._sleepForMs(800 * Meteor.isDevelopment)
        const message = Chats.findOne(id, {fields: {roomId: 1, receivedBy: 1}})
        if (!message)
            throw Meteor.Error(403, "Message does not exist")
        const room = Rooms.findOne(message.roomId)
        if (!_.contains(message.receivedBy, username)) {
            return Chats.update(id, {
                $addToSet: {receivedBy: username},
                $set: {receivedAll: room.usernames.length - 2 <= message.receivedBy.length}
            })
        }
        SimpleChat.options.onReceiveMessage(id, message, room)
        return false
    },
    "SimpleChat.join": function (roomId, username, avatar, name) {
        check(roomId, String);
        check(username, String);
        check(avatar, Match.Maybe(String));
        check(name, Match.Maybe(String));
        this.unblock()
        if (!SimpleChat.options.showViewed) return false
        //todo remove
        Meteor._sleepForMs(800 * Meteor.isDevelopment)

        const date = new Date()
        if (SimpleChat.options.showJoined) {
            Chats.insert({
                roomId,
                username,
                name,
                avatar,
                date,
                join: true
            })
        }
        Rooms.upsert(roomId, {$addToSet: {usernames: username}})
        this.connection.onClose(function () {
            SimpleChat.Chats.insert({
                roomId,
                username,
                name,
                avatar,
                date: new Date(),
                join: false
            })
            Rooms.update(roomId, {$pull: {usernames: username}})
            SimpleChat.options.onLeft(roomId, username, name, date)
        })
        SimpleChat.options.onJoin(roomId, username, name, date)
    },
    "SimpleChat.messageViewed": function (id, username) {
        check(id, String);
        check(username, String);
        this.unblock()
        if (!SimpleChat.options.showViewed) return false
        //todo remove
        Meteor._sleepForMs(800 * Meteor.isDevelopment)

        const message = Chats.findOne(id, {fields: {roomId: 1, viewedBy: 1}})
        if (!message)
            throw Meteor.Error(403, "Message does not exist")
        const room = Rooms.findOne(message.roomId)
        if (!_.contains(message.viewedBy, username)) {
            return Chats.update(id, {
                $addToSet: {viewedBy: username},
                $set: {viewedAll: room.usernames.length - 2 <= message.viewedBy.length}
            })
        }
        return false
    },
})