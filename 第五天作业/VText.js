class VText extends VNode {
    constructor(dom, components) {
        super(dom);
        this._text = dom.data.trim();
        this._components = components;
        this.render()
    }

    render() {
        let start = 0;
        let end = 0;
        let found = false;
        let n = 0;
        let count = true;
        let count2 = true;
        let str = Array.from(this._text);
        // 提取表达式
        while (start < str.length) {
            for (let i = start; i < str.length; i++) {
                if (str[i] == "'"&&str[i-1]!='\\') {
                    count=!count;
                }
                if (str[i] == '"'&&str[i-1]!='\\') {
                    // console.log('"');
                    count2=!count2;
                }
                if (count && count2) {
                    if (str[i] == '[') {
                        if (n == 0) {
                            start = i;
                        }
                        found = true
                        n++;
                    }
                    else if (str[i] == ']') {
                        n--;
                        if (n == 0) {
                            end = i;
                            break;
                        }
                    }
                }
            }
            // console.log(n,start,end);
            assert(n == 0, `${this._text} is invailed`);
            if (!found) break;
            console.log(this._text.substring(start+2, end - 1))
            // else{break};
            start = end + 1;
        }
        // console.log('out')
    }
}