/**
 * Created by cesar on 25/2/16.
 */
export const SimpleChat = {
    options:  {
        texts: {
            loadMore: 'Load More',
            placeholder: 'Type message ...',
            button: 'send',
            join: 'Join to',
            left: 'Left the',
            room: 'room at'

        },
        limit: 50,
        beep: false,
        showViewed: false,
        showReceived: false,
        showJoined: false,
        publishChats: function (roomId, limi) {
            return true
        },
        allow: function (message, roomId, username, avatar, name) {
            return true
        },
        onNewMessage: function (msg) {
            console.log(msg)
        },
        onReceiveMessage: function () {

        }
    },
    configure: function (options) {
        this.options = this.options || {};
        _.extend(this.options, options);
        return this;
    }
}

