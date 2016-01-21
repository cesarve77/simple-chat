SimpleChat.options = {
    title: "Chat",
    minimize: false,
    limit: 100,
    beep: true
}
SimpleChat.configure = function (options) {
    this.options = this.options || {};
    _.extend(this.options, options);
    return this;
}

SimpleChat.scrollToEnd = function () {
    Template.SimpleChatWindow.endScroll = true;
    Template.instance().$(".simple-chat-window .simple-chat-window-discussion .simple-chat-window-scroll").animate({scrollTop: Template.instance().$('.simple-chat-window .simple-chat-window-discussion ol').height()}, 300);
    Template.instance().$('.simple-chat-window .simple-chat-window-discussion .simple-chat-window-scroll').trigger('scroll')

}

Template.SimpleChatWindow.onCreated(function () {
    this.data.title=this.data.title||SimpleChat.options.title
    this.data.minimize=this.data.minimize||SimpleChat.options.minimize
    this.data.limit=this.data.limit||SimpleChat.options.limit
    this.data.beep=this.data.beep||SimpleChat.options.beep
    this.data.increment=this.data.limit
    Session.set('SimpleChat.limit',this.data.limit)
    var self = this
    this.autorun(function () {
        self.subscribe("simpleChats", self.data.roomId, Session.get('SimpleChat.limit'));
    })


});

Template.SimpleChatWindow.onRendered(function () {
    var self = this
    self.endScroll = true;
    this.$('.simple-chat-window .simple-chat-window-discussion .simple-chat-window-scroll').scroll(function (event) {
        if (event.target.scrollHeight - event.target.scrollTop < 350) {
            self.endScroll = true;
        } else {
            self.endScroll = false;
        }
    })
    this.autorun(function () {
        if ( self.subscriptionsReady()){
            /**
             * the setTimeOut is to be sure that dom already update, and make the real calc of scroñ
             */
            setTimeout(function(){
                console.log(self.data.scroll,self.$('.simple-chat-window-scroll')[0].scrollHeight,$('.simple-chat-window-scroll')[0].scrollHeight-self.data.scroll)
                self.$('.simple-chat-window-scroll').scrollTop(self.$('.simple-chat-window-scroll')[0].scrollHeight-self.data.scroll)
                self.data.scroll=self.$('.simple-chat-window-scroll')[0].scrollHeight

            },0)

        }else{
            console.log('xxxxx',self.data.scroll,self.$('.simple-chat-window-scroll')[0].scrollHeight)

        }

    })
    this.autorun(function (computation) {
        var msg = SimpleChat.Chats.findOne({},{sort: {date: -1}})

        console.log('last message ', msg)
        if (typeof msg === "object") {

            if (self.endScroll) {
                SimpleChat.scrollToEnd()
                if (window.visivility == 'hidden' && self.data.beep) {
                    console.log("beep111")
                    new Audio('/packages/cesarve_simple-chat/assets/bell.mp3').play()
                }
            } else {
                if (self.data.username != msg.username && self.data.beep) {
                    console.log("beep22")
                    new Audio('/packages/cesarve_simple-chat/assets/bell.mp3').play()
                }
            }

        }else{
            SimpleChat.scrollToEnd()
        }
    })
})


Template.SimpleChatWindow.helpers({

    simpleChats: function () {
        var chats = SimpleChat.Chats.find({roomId: this.roomId}, {sort: {date: 1}})

        return chats;
    },
    hasMore: function () {
        return SimpleChat.Chats.find({roomId: this.roomId}, {sort: {date: 1},limit:  Session.get('SimpleChat.limit') }).count() === Session.get('SimpleChat.limit')
    },
    other: function (username) {
        return !Template.instance().data.username == username
    }
    ,
    from: function (username) {
        return Template.instance().data.username == username ? 'me' : 'other'
    }
    ,
    formatDate: function (date) {
        return moment(date).format('hh:mm');
    }
})
;


Template.SimpleChatWindow.events({
    'click #simple-chat-load-more':function(){
        Session.set('SimpleChat.limit', Session.get('SimpleChat.limit')+this.increment)


    },
    'keydown #simple-chat-message': function (event) {
        if (event.which == 13) { // 13 is the enter key event
            var $message = $(event.target)
            event.preventDefault()
            if ($message.val() != '') {
                var text = $message.val()
                $message.val('');
                SimpleChat.scrollToEnd()
                Meteor.call('SimpleChat.newMessage', text, this.roomId, this.username, function (err) {
                    if (err) {
                        console.error(err)
                        $message.val(text);
                    }
                })
            }
        }
    }
});



