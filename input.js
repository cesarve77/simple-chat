import {Template} from 'meteor/templating'
import {Meteor} from 'meteor/meteor'
import {Chats} from './collections'
import {SimpleChat} from './config'
import moment from 'moment'
import './window.css'
import './window.html'
import './spinner.css'
import './spinner.html'
import './input.html'


Template.SimpleChatInput.helpers({
    placeholder: function () {
        return Template.instance().data.placeholder || SimpleChat.options.texts.placeholder
    },
    button: function () {
        return Template.instance().data.button || SimpleChat.options.texts.button
    }
});