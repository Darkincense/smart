### 1. 在全局环境中使用时候

在全局中使用，this就代表全局对象Global（在浏览器中为window，但是在严格模式下'use strict'，this的值为undefined）

````js
document.write(this);  //[object Window]
````

当您在全局上下文中定义的函数中使用这个函数时，它仍然绑定到全局对象，因为函数实际上是一种全局上下文的方法。

````
function f1()
{
   return this;
}
document.write(f1());  //[object Window]
````
上面的f1是一个全局对象的方法。因此，我们也可以在window上调用它，如下所示：
````js
function f()
{
    return this;
}

document.write(window.f()); //[object Window]
````
### 2.在对象方法中使用时

在对象方法中使用此关键字时，它将绑定到“立即”封闭对象。

````js
var obj = {
    name: "obj",
    f: function () {
        return this + ":" + this.name;
    }
};
document.write(obj.f());  //[object Object]:obj
````
上面经把这个词直接放在双引号中。要指出的是，如果将对象嵌套在另一个对象内，则该对象将绑定到直接父对象。
````js
var obj = {
    name: "obj1",
    nestedobj: {
        name:"nestedobj",
        f: function () {
            return this + ":" + this.name;
        }
    }            
}

document.write(obj.nestedobj.f()); //[object Object]:nestedobj
````
即使你将函数显式添加到对象作为方法，它仍然遵循上述规则，这仍然指向直接父对象。
````js
var obj1 = {
    name: "obj1",
}

function returnName() {
    return this + ":" + this.name;
}

obj1.f = returnName; //add method to object
document.write(obj1.f()); //[object Object]:obj1
````
### 3.调用无上下文的函数时
当你使用这个在没有任何上下文的情况下调用的函数（即不在任何对象上）时，它被绑定到全局对象（浏览器中的窗口）（即使函数是在对象内部定义的）。

````js
var context = "global";

var obj = {  
    context: "object",
    method: function () {                  
        function f() {
            var context = "function";
            return this + ":" +this.context; 
        };
        return f(); //invoked without context
    }
};

document.write(obj.method()); //[object Window]:global 
````
### 4.在构造函数内部使用时
当函数被用作构造函数时（即使用new关键字调用它时），此内部函数体指向正在构建的新对象。

````js
    var myname = "global context";
    function SimpleFun() {
      this.myname = "simple function";
    }

    var obj1 = new SimpleFun(); //adds myname to obj1
    document.write(obj1.myname); //simple function
````
### 5.当在原型链上定义的函数内部使用时

如果该方法位于对象的原型链上，则此方法内部引用方法被调用的对象，就好像方法在对象上定义一样。
````js
var ProtoObj = {
    fun: function () {
        return this.a;
    }
};
//Object.create() 使用ProtoObj创建对象
//原型并将其分配给obj3，从而使fun()成为其原型链上的方法 

var obj3 = Object.create(ProtoObj);
obj3.a = 999;
document.write(obj3.fun()); //999

//注意fun（）是在obj3的原型上定义的，但是fun()中的``this.a`获取obj3.a 
````
### 6.在call(),apply(),和bind()函数调用时

这里的this替换为对应方法传入的第一个参数.

````js
function add(inc1, inc2)
{
    return this.a + inc1 + inc2;
}

var o = { a : 4 };
document.write(add.call(o, 5, 6)+"<br />"); //15
           
document.write(add.apply(o, [5, 6]) + "<br />"); //15
     
var g = add.bind(o, 5, 6);       
document.write(g()+"<br />");    //15

var h = add.bind(o, 5);          //h: `o.a` i.e. 4 + 5 + ?
document.write(h(6) + "<br />"); //15
      // 4 + 5 + 6 = 15
document.write(h() + "<br />");  //NaN
      //no parameter is passed to h()
      //thus inc2 inside add() is `undefined`
      //4 + 5 + undefined = NaN</code>
````

### 6.在事件处理中
- 将函数直接分配给元素的事件处理函数时，直接在事件处理函数内使用该函数会引用相应的元素。这种直接的函数分配可以使用addeventListener方法或通过传统的事件注册方法（如onclick）来完成。
- 同样，当你直接在事件属性中使用这个元素（比如<button onclick =“... this ...”>）时，它指向元素。
- 但是，通过在事件处理函数或事件属性内部调用的其他函数间接使用这个函数，会解析为全局对象窗口。
- 当我们使用Microsoft的事件注册模型方法attachEvent将该函数附加到事件处理函数时，可以实现上述相同的行为。它不是将该函数分配给事件处理程序（并因此使该元素的函数方法），而是调用该事件上的函数（在全局上下文中有效地调用它）。

````html
<h3>在事件处理程序或事件属性中直接使用this</h3>

<button id="button1">click() 使用addEventListner注册</button><br />
<!-- [object HTMLButtonElement] : BUTTON : button1-->

<button id="button2">click() 使用onclick注册 </button><br />
<!-- [object HTMLButtonElement] : BUTTON : button2 -->

<button id="button3" onclick="alert(this+ ' : ' + this.tagName + ' : ' + this.id);">
使用点击事件的原型</button>
<!-- [object HTMLButtonElement] : BUTTON : button3 -->

<h3>在事件处理程序或事件属性中间接使用this</h3>

<button onclick="alert((function(){return this + ' : ' + this.tagName + ' : ' + this.id;})());">
在函数内部间接使用 <br />
定义并称为内部事件属性
</button>
<br />
<!-- [object Window] : undefined : undefined -->

<button id="button4" onclick="clickedMe()">
在函数内部间接使用 <br /> 
called inside event property</button> <br />
<!-- [object Window] : undefined : undefined -->

IE only: <button id="button5">click() "attached" using attachEvent() </button>
````
````js

    function clickedMe() {
      alert(this + " : " + this.tagName + " : " + this.id);
    }
    document.getElementById("button1").addEventListener("click", clickedMe, false);
    document.getElementById("button2").onclick = clickedMe;

    document.getElementById("button5").attachEvent('onclick', clickedMe);
````

- [在线jsfiddle](http://jsfiddle.net/Mahesha999/xKtzC/8/embedded/html%2Cjs%2Cresult/)

## some examples
### demo1
````js
if (true) {
    // What is `this` here?
}
````
### demo2
````js
var obj = {
    someData: "a string"
};

function myFun() {
    return this // What is `this` here?
}

obj.staticFunction = myFun;

console.log("this is window:", obj.staticFunction() == window);
console.log("this is obj:", obj.staticFunction() == obj);
  
````
### demo3
````js
var obj = {
    myMethod: function () {
        return this; // What is `this` here?
    }
};
var myFun = obj.myMethod;
console.log("this is window:", myFun() == window);
console.log("this is obj:", myFun() == obj);
````
### demo4
````js
function myFun() {
    return this; // What is `this` here?
}
var obj = {
    myMethod: function () {
        eval("myFun()");
    }
};
````
### demo5
````js
function myFun() {
    return this; // What is `this` here?
}
var obj = {
    someData: "a string"
};
console.log("this is window:", myFun.call(obj) == window);
console.log("this is obj:", myFun.call(obj) == obj);
````


###### 参考
- http://www.ruanyifeng.com/blog/2010/04/using_this_keyword_in_javascript.html
- https://codeburst.io/the-simple-rules-to-this-in-javascript-35d97f31bde3
- https://stackoverflow.com/a/3127440/1751946