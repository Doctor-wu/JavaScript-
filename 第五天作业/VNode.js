class VNode {
    constructor(dom) {
        assert(dom);
        assert(dom instanceof Node);
        this._dom=dom;
    }

    render() {
        assert(false, 'render is required')
    }
}