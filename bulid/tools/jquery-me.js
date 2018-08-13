/**
 * 功能:获取下一个兄弟节点
 * @param ele
 * @returns {Element|*|Node}
 */
function next(ele) {
    var aaa = ele.nextElementSibling || ele.nextSibling;
    return aaa;
}

/**
 * 功能:获取上(前)一个兄弟节点
 * @param ele
 * @returns {Element|*|Node}
 */
function prev(ele) {
    return ele.previousElementSibling || ele.previousSibling;
}

/**
 * 功能:获取第一个子节点
 * @param ele
 * @returns {Element|*|Node}
 */
function first(ele) {
    return ele.firstElementChild || ele.firstChild;//缺点:ie678中容易获取注释节点
    //拓展
    //var aaa = ele.firstChild;
    //while(aaa.nodeType != 1){//元素节点:1;   属性节点:2;   文本节点:3;   注释节点:8;
    //    //如果不是元素节点,接着往下找!
    //    aaa = aaa.nextSibling;//为aaa覆盖下一个兄弟节点
    //}
    //return aaa;
}

/**
 * 功能:获取最后一个子节点
 * @param ele
 * @returns {Element|*|Node}
 */
function last(ele) {
    return ele.lastElementChild || ele.lastChild;//缺点:ie678中容易获取注释节点
    //拓展
    //var aaa = ele.lastChild;
    //while(aaa.nodeType != 1){//元素节点:1;   属性节点:2;   文本节点:3;   注释节点:8;
    //    //如果不是元素节点,接着往下找!
    //    aaa = aaa.previousSibling;//为aaa覆盖下一个兄弟节点
    //}
    //return aaa;
}


//拓展方法1:
/**
 * 功能:根据索引值找兄弟节点
 * @param ele
 * @param index
 * @returns {*|HTMLElement}
 */
function getSibEleOfIndex(ele, index) {
    return ele.parentNode.children[index];
}

//拓展方法2:
/**
 * 功能:查找所有兄弟节点(不包括自己)
 * @param ele
 * @returns {*|HTMLElement}
 */
function siblings(ele) {
    //先找父亲在找所有儿子,从中寻找不是自己的添加到新的数组中
    var newArr = [];
    var arr = ele.parentNode.children;//ie678中无法取出注释节点;
    for (var i = 0; i < arr.length; i++) {
        //判断:不是自己就添加
        if (arr[i].nodeType == 1 && arr[i] != ele) {
            newArr.push(arr[i]);
        }
    }
    //把新数组返回
    return newArr;
}

//1.传递元素之前的所有兄弟节点;//思考题:prevAll();
//2.传递元素之后的所有兄弟节点;//思考题:nextAll();
