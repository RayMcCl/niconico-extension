import Message from './Message';
import { MESSAGES_TRANSFER } from '../modules/actions';

export default class Youtube_Viewport {
    constructor () {
        console.log('Initializes Viewport');
        this.getViewport();
        chrome.runtime.onMessage.addListener((request) => {
            if(request.type === MESSAGES_TRANSFER){
                this.receiveMessages(request.payload);
            }
        });
    }

    getViewport () {
        const VIEWPORT = document.querySelector('.html5-video-player');
        const VIEWPORT_RECT = VIEWPORT.getBoundingClientRect();

        this.viewport = {
            el: VIEWPORT,
            width: VIEWPORT_RECT.width,
            height: VIEWPORT_RECT.height,
            x: VIEWPORT_RECT.x,
            y: VIEWPORT_RECT.y
        };

        this.createOverlay();
    }

    createOverlay () {
        const PARENT = this.viewport.el.parentElement;
        const OVERLAY = document.createElement('div');

        OVERLAY.id = 'nn-overlay';
        OVERLAY.className = 'nn-overlay';
        
        PARENT.appendChild(OVERLAY);

        this.overlay = OVERLAY;
    }

    displayMessage (messages) {
        for(var i = 0; i < messages.length; i++){
            let message = new Message(messages[i]);
            let dom = message.getMessageDOM();
            this.overlay.appendChild(dom);
        }
    }

    receiveMessages (messages) {
        this.displayMessage(messages);
    }
}