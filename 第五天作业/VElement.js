(() => {
    function getAttrs(dom) {
        let attrs = dom.attributes;
        // console.log('enter')
        let _attrs = {}
        Array.from(attrs).forEach(attr => {
            // console.log(attr.name,attr.value);
            _attrs[attr.name] = attr.value
        })
        // console.log(_attrs,attrs)
        // console.log('out')
        return _attrs

    }
    function getDerectives(attrs) {
        let der = [];
        //指令类型-bind、if、for、...      name
        //指令参数-value、title            arg
        //指令值-12、a、...                value


        // console.log(Array.from(attrs))
        for (name in attrs) {
            if (name.startsWith('d-')) {
                der.push({
                    name: name.split(':')[0].substring(2),
                    arg: name.split(':')[1] || "",
                    value: attrs[name]
                })
            } else if (name.startsWith(':')) {
                der.push({
                    name: 'bind',
                    arg: name.split(':')[1],
                    value: attrs[name]
                })
            } else if (name.startsWith('+')) {
                der.push({
                    name: 'on',
                    arg: name.substring(1),
                    value: attrs[name]
                })
            }
        }
        return der;
    }
    function createListeners(der) {
        let listeners = [];
        der.forEach(derective => {
            if (derective.name == 'on') {
                listeners.push({
                    name: derective.arg,
                    value: derective.value
                })
            }
        })
        return listeners;
    }
    function createChildren(dom,components) {
        let children = dom.childNodes;
        let _children = [];
        Array.from(children).forEach(child => {
            // console.log(child)
            if (child.nodeType == document.ELEMENT_NODE) {
                _children.push(new VElement(child,components));
            } else if (child.nodeType == document.TEXT_NODE) {
                let val = child.data.trim()
                // console.log(val)
                if (val) {
                    _children.push(new VText(child,components));
                }
            } else {
                console.log('abort a node ', child)
            }
        })
        return _children;
    }
    window.VElement = class VElement extends VNode {
        constructor(dom,components) {
            super(dom);
            this._components = components||this
            assert(dom, 'dom are required')
            this._type = this._dom.tagName.toLowerCase();
            this._attrs = getAttrs(this._dom);
            this._derectives = getDerectives(this._attrs);
            this._listeners = createListeners(this._derectives);
            this._children = createChildren(dom,this._components);


        }
        render() {

        }
    }
})()