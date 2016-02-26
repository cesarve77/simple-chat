Meteor.publish("simpleChats", function (roomId, limit) {
    if (!SimpleChat.options.publishChats.call(this,roomId,limit)) return []

    if (!roomId)
        return
    check(roomId, String)
    var query = {
        roomId: roomId
    };
    if (!SimpleChat.options.showJoined)
        query.message= {$exists: 1}
    var options = {sort: {date: -1}}
    if (limit)
        options.limit = limit
    return SimpleChat.Chats.find(query, options);
});

