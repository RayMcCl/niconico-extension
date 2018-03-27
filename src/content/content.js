import Youtube_Observer from './Youtube_Observer';
import Youtube_Viewport from './Youtube_Viewport';
import Twitch_Observer from './Twitch_Observer';
import Twitch_Viewport from './Twitch_Viewport';
import './content.scss';

window.onload = function () {
    createViewportAndObserver();
}

window.onpopstate = function () {
    createViewportAndObserver();
}

function createViewportAndObserver () {
    if(window.location.hostname === 'www.youtube.com'){
        if(window.location.pathname === '/live_chat'){
            let YO = new Youtube_Observer();
        } else if(window.location.pathname === '/watch'){
            let YV = new Youtube_Viewport();
        }
    } else if(window.location.hostname === 'www.twitch.tv'){
        let TV = new Twitch_Viewport();
        let TO = new Twitch_Observer(TV);
    }
}