
function getRoot(el){
    assert(el,'el is required');
    if(typeof el == "string"){
        let root = document.querySelector(el);
        assert(root,`${el} is not defined`);
        return root;
    }else if(el instanceof HTMLElement){
        return el;
    }else{
        assert(false,'el is invailed');
    }
}