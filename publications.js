Meteor.publish("simpleChats", function (roomId, limit) {
    //console.log(Meteor._sleepForMs(2000))
    if (!roomId)
        return
    console.log('simpleChats limit to ', roomId, limit)
    check(roomId, String)
    var query = {
        roomId: roomId
    };
    var options = {sort: {date: -1}}
    if (limit)
        options.limit = limit

    return SimpleChat.Chats.find(query, options);
});

