import Message from './Message';
import { MESSAGES_TRANSFER } from '../modules/actions';

const LERP = 500;

export default class Twitch_Observer {
    constructor (tv) {
        this.messages = [];
        this.initMO();
        this.initMessaging();
        this.twitch_viewport = tv;
    }

    initMessaging () {
        this.msgInterval = setInterval(this.sendMessages.bind(this), LERP);
    }

    sendMessages () {
        if(this.messages.length){
            this.twitch_viewport.receiveMessages(this.messages);

            this.messages = [];
        }
    }

    /**
     * Initializes the mutation observer
     */
    initMO () {
        const TARGET_NODE = document.querySelector('.chat-list .tw-full-height,.video-chat .video-chat__message-list-wrapper');

        if(!TARGET_NODE){
            setTimeout(this.initMO.bind(this), 1000);
            return;
        }

        const CONFIG = {
            childList: true
        };

        this.mo = new MutationObserver(this.checkMutations.bind(this));

        this.mo.observe(TARGET_NODE, CONFIG);
    }

    /**
     * Disconnects the mutation observer
     */
    disconnectMO () {
        this.mo.disconnect();
    }

    checkMutations (mutations) {
        let mutation;

        for(mutation of mutations){
            if(mutation.addedNodes.length > 0){
                this.getMessage(mutation.addedNodes[0]);
            }
        }
    }

    getMessage (node) {
        let img = node.querySelector('.chat-badge');
        let author_name = node.querySelector('[data-a-user]');
        let message = node.querySelector('[data-a-target="chat-message-text"]');
        let time = Date.now();

        this.messages.push(new Message({
            img: img ? img.getAttribute('src') : '',
            author_name: author_name.innerText,
            message: message.innerText,
            time: time
        }));
    }
}