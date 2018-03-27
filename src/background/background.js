import { MESSAGES_TRANSFER } from '../modules/actions';

chrome.runtime.onMessage.addListener(function (request, sender) {
    if(request.type === MESSAGES_TRANSFER){
        console.log('Request Received', arguments);
        chrome.tabs.sendMessage(sender.tab.id, {
            type: MESSAGES_TRANSFER,
            payload: request.payload
        });
    }
});