
function assert(exp,msg){
    if(!exp){
        throw new Error(msg||'Assert Error');
    }
}