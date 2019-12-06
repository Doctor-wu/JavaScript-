class VComponent extends VElement {
    constructor(options) {
        assert(options);
        assert(options.el);
        let el = null;
        if (typeof options.el == 'string') {
            el = document.querySelector(options.el);
        } else if (options.el instanceof HTMLElement) {
            el = options.el
        } else {
            assert(false, 'el is invailed');
        }
        assert(el, `${options.el} is not found`);
        super(el);
        let _this = this

        this._el = el;
        let proxy = new Proxy(options.data || {}, {
            get(data, name) {
                assert(name in data, `data ${name} is not defined`);

                return data[name];
            },
            set(data, name, val) {
                data[name] = val;
                _this.render();
                return true;
            }
        })
        this._data = proxy;
        this._methods = options.methods || {}
    }
    render() {
        console.log('render')//记得渲染子级
    }
}