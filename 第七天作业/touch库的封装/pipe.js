class Pipe {
    constructor() {
        this.quene = {}
    }

    on(type, fn) {
        // assert(fn,'on is need a function');
        this.quene[type] = this.quene[type] || [];
        if (this.quene[type].findIndex(func => func == fn) == -1)//在quene里的type事件下,没有fn这个方法，才添加一个
            this.quene[type].push(fn);
    }

    off(type, fn) {
        if (this.store[type]) {//这个事件必须存在于store内，才能进行下面的删除操作
            this.quene[type].filter(func => func != fn);
            if (this.quene[type].length == 0) delete this.quene[type];
        }
    }

    emit(type, ...args) {
        if (this.quene[type]) {//这个事件必须存在于store内，才能进行下面的派发操作
            this.quene[type].forEach(func => func(...args));
        }
    }
}