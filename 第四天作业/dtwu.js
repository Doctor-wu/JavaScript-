function assert(exp, msg) {
    if (!exp) {
        throw new Error(msg);
    }
}

class Dtwu {
    constructor(options) {
        this._root = this._getRoot(options.root);
        this._timer = 0;
        // console.log(this._root);
        this._update();
        let _this = this;
        let proxy = new Proxy(options.data(), {
            get(data, name) {
                assert(name in data, `data ${name} is not defined`);

                return data[name];
            },
            set(data, name, val) {
                data[name] = val;
                // console.log(name,val)
                _this._update();
                return true;
            }
        });


        // this._data = options.data(); 错误写法，这样写获取数据的时候无法监听到
        this._data = proxy;
        //验证数据暂时忽略
        this._template = this._root.cloneNode(true);
        this._methods = options.methods;
        return proxy;
    }

    _getRoot(root) {
        assert(root, 'root is required');

        if (typeof root == 'string') {
            let _root = document.querySelector(root);
            assert(_root, `${root} is not found`);
            return _root;
        } else if (root instanceof HTMLElement) {
            return root;
        } else {
            assert(false, `root is invailed`);
        }
    }

    _update() {
        clearTimeout(this._timer);
        this.timer = setTimeout(() => {
            this.render();
        }, 0)
    }

    render() {
        let root = this._template.cloneNode(true);
        //1.获取表达式的值并替换
        Array.from(root.childNodes).forEach(child => {
            if (child.nodeType == document.TEXT_NODE) {
                // console.log(child.data);
                //这一步忘记把换好的字符串返回给child.data了，切记
                child.data = child.data.replace(/\{\{[^\{]+\}\}/g, (str) => {
                    str = str.substring(2, str.length - 2);
                    let arr = [];
                    for (let key in this._data) {
                        arr.push(`let ${key} = ${JSON.stringify(this._data[key])};`);
                    }
                    arr.push(str);
                    arr = arr.join('');
                    //    console.log(arr);
                    return eval(arr);
                })
            }
        })
        //2.事件的处理
        Array.from(root.children).forEach(child => {
            Array.from(child.attributes).forEach(attr => {
                // console.log(attr);
                if (attr.name.startsWith('@')) {
                    // console.log(attr.name,attr.value);
                    let evname = attr.name.substring(1);
                    child.addEventListener(evname, () => {
                        eval(`this._methods[${JSON.stringify(attr.value)}].call(this._data)`)
                    }, false)
                }
                if (attr.name.startsWith(':')) {
                    let attrname = attr.name.substring(1);
                    child.setAttribute(attrname, this._data[attr.value]);
                    child.addEventListener('input', () => {
                        if (parseInt(child.value) == child.value) {
                            eval(`this._data['${attr.value}'] = parseInt(child.value);`)
                        } else {
                            eval(`this._data['${attr.value}'] = child.value;`)
                        }
                    }, false)
                }
            })
        })
        this._root.parentNode.replaceChild(root, this._root);
        this._root = root;

        // console.log('render', this._template);
    }
}

let dtwu = new Dtwu({
    root: '#root',
    data() {
        return {
            name: 'dtwu',
            age: 18,
            a: 12,
            b: 5
        }
    },
    methods: {
        add() {
            // console.log('a加了7')
            this.a += 7;
        }
    }
})