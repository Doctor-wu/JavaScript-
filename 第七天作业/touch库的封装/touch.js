const defaultConfig ={
    scrollX : false,
    scrollY : true,
    factor : 0.3,
    animateMove : 'ease',
    animateTime : '0.5'
}

class Scroll extends Pipe{
    constructor(el,options){
        super();
        this._root = getRoot(el);
        this._container = this._root.children[0];
        this.config = Object.assign({},defaultConfig,options);
        this._position = {x:0,y:0}
        this._init();
        // console.log(this._root)
    }

    _init(){
        let startX,startY;
        let startPosition;
        this.__start = ev =>{
            ev.preventDefault();
            ev.cancelBubble;
            startX = ev.targetTouches[0].clientX;
            startY = ev.targetTouches[0].clientY;

            startPosition = {...this._position};
            this._doStart();
        }
        this.__move = ev =>{
            ev.cancelBubble;
            let disX = ev.targetTouches[0].clientX - startX;
            let disY = ev.targetTouches[0].clientY - startY;

            if(this.config.scrollX) this._position.x =startPosition.x + disX;
            if(this.config.scrollY) this._position.y =startPosition.y + disY;
            this._doMove();
            // console.log('move');
        }

        this.__end = ev =>{
            // console.log('end');
            this._doEnd();
        }

        this._root.addEventListener('touchstart',this.__start,false);
        this._root.addEventListener('touchmove',this.__move,false);
        this._root.addEventListener('touchend',this.__end,false);
    }

    destroy(){
        this._root.removeEventListener('touchstart',this.__start,false);
        this._root.removeEventListener('touchmove',this.__move,false);
        this._root.removeEventListener('touchend',this.__end,false);
    }

    _doStart(){
        this._container.style.transition = ''

        this.emit('start');
    }

    _doMove(){
        let {x,y} = this._position;
        let maxX = this._container.offsetWidth-this._root.offsetWidth>=0?this._container.offsetWidth-this._root.offsetWidth:0;
        let maxY = this._container.offsetHeight-this._root.offsetHeight>=0?this._container.offsetHeight-this._root.offsetHeight:0;
        console.log(maxX,maxY)
        if(x>0)  x*=this.config.factor;
        if(y>0) y*=this.config.factor;
        if(x<-maxX) x=-maxX+(y+maxX)*this.config.factor;
        if(y<-maxY) y=-maxY+(y+maxY)*this.config.factor;

        // if(x<-maxX) x*=this.config.factor;
        // if(y<-maxY) y*=this.config.factor;
        console.log(x,y)
        if(this.config.scrollX && this.config.scrollY){
            this._container.style.transform=`translate(${x}px,${y}px)`;
        }else if(this.config.scrollX&&!this.config.scrollY){
            this._container.style.transform=`translateX(${x}px)`;
        }else if(!this.config.scrollX&&this.config.scrollY){
            this._container.style.transform=`translateY(${y}px)`;
        }else{
            console.warn('scrollX and scrollY are both false')
        }
        
    }

    _doEnd(){
        let {x,y} = this._position;
        let maxX = this._container.offsetWidth-this._root.offsetWidth>=0?this._container.offsetWidth-this._root.offsetWidth:0;
        let maxY = this._container.offsetHeight-this._root.offsetHeight>=0?this._container.offsetHeight-this._root.offsetHeight:0;
        console.log(maxX,maxY)
        if(x>0) { x=0;this._position.x=0}
        if(y>0) { y=0;this._position.y=0}
        if(x<-maxX) {x=-maxX;this._position.x = -maxX}
        if(y<-maxY) {y=-maxY;this._position.y = -maxY}

        // if(x<-maxX) x*=this.config.factor;
        // if(y<-maxY) y*=this.config.factor;
        

        this._container.style.transition=`${this.config.animateMove} ${this.config.animateTime}s`
        console.log(x,y)
        if(this.config.scrollX && this.config.scrollY){
            this._container.style.transform=`translate(${x}px,${y}px)`;
        }else if(this.config.scrollX&&!this.config.scrollY){
            this._container.style.transform=`translateX(${x}px)`;
        }else if(!this.config.scrollX&&this.config.scrollY){
            this._container.style.transform=`translateY(${y}px)`;
        }else{
            console.warn('scrollX and scrollY are both false')
        }
    }
}