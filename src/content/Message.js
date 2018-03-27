export default class Message {
    constructor (args) {
        this.img = args.img;
        this.author_name = args.author_name;
        this.message = args.message;
        this.time = args.time;
        this.getMessageDOM = this.getMessageDOM;
    }

    getMessageDOM () {
        let container = document.createElement('div');
        let author_name = document.createElement('span');
        let message = document.createElement('q');
        
        container.className = 'message-container auto-scroll';
        author_name.className = 'message-author';
        message.className = 'message-text';
        
        author_name.innerText = this.author_name;
        message.innerText = this.message;
        
        if(this.img){
            let img = document.createElement('img');
            img.className = 'message-image';
            img.src = this.img;
            container.appendChild(img);
        }
        
        container.appendChild(author_name);
        container.appendChild(message);
        container.style.top = Math.random()*100 + '%';
        container.style.color = this.getMessageColor();

        this.element = container;

        this.bindRemove();

        return container;
    }

    getMessageColor () {
        return `rgb(${this.getColorRandom()}, ${this.getColorRandom()}, ${this.getColorRandom()})`;
    }

    getColorRandom () {
        return parseInt(Math.random()*255);
    }

    bindRemove () {
        this.element.addEventListener('transitionend', () => {
            this.element.parentElement.removeChild(this.element);
        });

        this.element.addEventListener('animationend', () => {
            this.element.parentElement.removeChild(this.element);
        });
    }
}