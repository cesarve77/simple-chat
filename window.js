SimpleChat.options = {
    title: "Chat",
    minimize: false,
    limit: 5,
    beep: true
}
SimpleChat.configure = function (options) {
    this.options = this.options || {};
    _.extend(this.options, options);
    return this;
}

SimpleChat.scrollToEnd = function (template) {
    Template.SimpleChatWindow.endScroll = true;
    template.$(".direct-chat-messages").animate({scrollTop: template.$('.scroll-height').height()}, 300);
    template.$('.direct-chat-messages').trigger('scroll')

}

Template.SimpleChatWindow.onCreated(function () {
    console.log('created')
    this.data.initializing = true;
    this.data.subscribing = true;
    this.data.title = this.data.title || SimpleChat.options.title
    this.data.minimize = this.data.minimize || SimpleChat.options.minimize
    this.data.limit = new ReactiveVar(this.data.limit || SimpleChat.options.limit)
    console.log('on created', this.data.limit.get())
    this.data.beep = this.data.beep || SimpleChat.options.beep
    this.data.increment = this.data.limit.get()
    if (typeof this.data.roomId != "function")
        this.getRoomId = ()=> {
            return this.data.roomId + ""
        }
    else
        this.getRoomId = this.data.roomId

    if (typeof this.data.username != "function")
        this.getUsername = ()=> {
            return this.data.username + ""
        }
    else
        this.getUsername = this.data.username


    this.autorun(() => {
        this.subscribe("simpleChats", this.getRoomId(), this.data.limit.get());
    })


});

Template.SimpleChatWindow.onRendered(function () {
    this.autorun(() => {
        console.log('=======>========>=========>subs123', this.getRoomId())

    })
    console.log('rendered')
    var self = this
    self.endScroll = true;
    this.$('.direct-chat-messages').scroll(function (event) {
        if (event.currentTarget.scrollHeight - event.currentTarget.scrollTop < 350) {
            self.endScroll = true;
        } else {
            self.endScroll = false;
        }
    })
    this.autorun(() => {
        if (this.subscriptionsReady()) {

            this.data.subscribing = false;
            /**
             * the setTimeOut is to be sure that dom already update, and make the real calc of scroñ
             */
            console.log('SCROLLLLLL', this.data.scroll, this.$('.direct-chat-messages')[0].scrollHeight)
            this.$('.direct-chat-messages').scrollTop(this.$('.scroll-height')[0].scrollHeight - this.data.scroll)


        } else {
            this.data.subscribing = true;
            if (this.data.initializing)
                Meteor.setTimeout(()=>{
                    this.data.initializing=false
                    SimpleChat.scrollToEnd(this)
                })

        }


    })

    $(window).on('SimpleChat.newMessage', (e, doc)=> {
        console.log('**************nwe message', doc, this.endScroll)
        if (this.endScroll) {

            console.log('scrollToEnd', this)
            SimpleChat.scrollToEnd(this)
            if (window.visivility == 'hidden' && this.data.beep) {
                console.log("beep111")
                new Audio('/packages/cesarve_simple-chat/assets/bell.mp3').play()
            }
        } else {
            if (this.getUsername() != doc.username && this.data.beep) {
                console.log("beep22")
                new Audio('/packages/cesarve_simple-chat/assets/bell.mp3').play()
            }
        }
    })
})


Template.SimpleChatWindow.helpers({

    simpleChats: function () {

        console.log(1, this)
        console.log('this.roomId1', Template.instance().getRoomId())
        var chats = SimpleChat.Chats.find({roomId: Template.instance().getRoomId()}, {sort: {date: 1}})

        let handleChanges = chats.observeChanges({
            added: (id, doc) => {
                if (!this.subscribing) {
                    console.log('this.subscribing', this.subscribing)
                    $(window).trigger('SimpleChat.newMessage', [doc])
                }
            }
        });

        return chats;
    },
    hasMore: function () {
        console.log('this.limit.get()',  this.limit)
        return SimpleChat.Chats.find({roomId: Template.instance().getRoomId()}, {
                sort: {date: 1},
                limit: this.limit.get()
            }).count() === this.limit.get()
    },

    me: function () {
        console.log('me', this)
        return Template.instance().getUsername() == this.username
    }
    ,
    formatDate: function (date) {
        return moment(date).calendar(null, {
            sameDay: 'hh:mm a',
            lastDay: '[Yesterday at ]hh:mm a',
            lastWeek: '[Last] dddd[ at ]hh:mm a',
            sameElse: 'DD/MM/YYYY hh:mm a'
        });
    }
})
;


Template.SimpleChatWindow.events({
    'click #simple-chat-load-more': function () {
        console.log('event this', this)
        this.limit.set(this.limit.get() + this.increment)
        this.scroll = Template.instance().$('.scroll-height')[0].scrollHeight


    },
    'keydown #simple-chat-message': function (event) {
        var $message = $(event.currentTarget)
        if (event.which == 13 && $message.val() != '') { // 13 is the enter key event
            event.preventDefault()
            console.log('Template.instance().$(button)', Template.instance().$('button'))
            Template.instance().$('button').click()
        }
    },
    'click button': function () {
        var $message = Template.instance().$('#simple-chat-message')

        if ($message.val() != '') {
            var text = $message.val()
            $message.val('');
            SimpleChat.scrollToEnd(Template.instance())

            Meteor.call('SimpleChat.newMessage', text, Template.instance().getRoomId(), Template.instance().getUsername(), Template.instance().data.avatar, function (err) {
                if (err) {
                    console.error(err)
                    $message.val(text);
                }
            })
        }

    }
});



