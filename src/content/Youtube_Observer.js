import Message from './Message';
import { MESSAGES_TRANSFER } from '../modules/actions';

const LERP = 1000;

export default class Youtube_Observer {
    constructor () {
        console.log('Initializes Observer');
        this.messages = [];
        this.initMO();
        this.initMessaging();
    }

    initMessaging () {
        this.msgInterval = setInterval(this.sendMessages.bind(this), LERP);
    }

    sendMessages () {
        if(this.messages.length){
            chrome.runtime.sendMessage({
                type: MESSAGES_TRANSFER,
                payload: this.messages
            });

            this.messages = [];
        }
    }

    /**
     * Initializes the mutation observer
     */
    initMO () {
        const TARGET_NODE = document.querySelector('yt-live-chat-item-list-renderer #items');

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
        let img = node.querySelector('img');
        let author_name = node.querySelector('#author-name');
        let message = node.querySelector('#message');
        let time = Date.now();

        this.messages.push(new Message({
            img: img.getAttribute('src'),
            author_name: author_name.innerText,
            message: message.innerText,
            time: time
        }));
    }
}