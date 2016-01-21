Meteor.publish("simpleChats", function (roomId,limit) {
    Meteor._sleepForMs(1000);
    if (!roomId)
        return
    console.log('simpleChats limit to ',limit)
    check(roomId,String)
    var query = {
        roomId: roomId
    };
    var options={sort: {date: -1}}
    if (limit)
        options.limit=limit

    return SimpleChat.Chats.find(query, options);
});

