## 介绍
Redux 是 JavaScript 状态容器，提供可预测化的状态管理。

### 使用场景
- 用户的使用方式复杂
- 不同身份的用户有不同的使用方式（比如普通用户和管理员）
- 多个用户之间可以协作
- 与服务器大量交互，或者使用了WebSocket
- View要从多个来源获取数据

## 栗子

- [地址](https://github.com/xiaoyueyue165/Flux-demos/blob/master/native-js/count.html)

## state 单一数据源
###  单向数据流的流程

![image](https://xiaoyueyue165.github.io/static/blog/react/redux.png)

　　整个单向数据流是一个圈，从时间角度来讲，故事的起点是 UI 层先发生了一点什么，例如页面加载，例如按钮被点下。于是一个 action 就会被发出。Action 是一个对象，其中包含到底要做什么事情，以及必要的数据。数据到达 Redux 的管辖范围，reducer 会拿到 Action 和老的状态树，于是可以运算得到一个新的状态树。React-redux 这个库就会负责把新的数据送到 React 组件，让组件自动刷新，于是界面上就显示出新的数据了。

在一个业务逻辑当中，只有一个单一的数据对象，在初始化的时候为state进行做预处理操作（初始化）。

````js
    var initState = {
      "count": 0
    }
````
> 当应用变得复杂的时候，我们需要首先根据应用的所有state思考设计一下这个对象的结构

## reducer定制view层触发action的业务

action是一个普通的JavaScript对象，它用来描述发生了什么，但它并不描述发生的这个事情该怎么去修改state，如何根据action去修改state是Reducer的事情

Reducer是什么?它就是一个纯函数，接收旧的state以及action作为输入参数，返回新的state
````js
    function counter(state, action) {
      if (!state) {
        return initState
      }
      switch (action.type) {
        case "INCREMENT":
          return { "count": state.count + 1 }
        case "DECREMENT":
          return { "count": state.count - 1 }
        default:
          return state;
      }


````

#### 注意点
- 不要修改state，为action返回一个新的state
- 在遇到未知action时，默认情况下一定要返回旧的state

## store
store是一个对象，使用Redux提供的`createStore`方法来生成，我们需要将Reducer作为参数传进去，在本例中：
````js
 // reducer
 function counter(state, action) {
      if (!state) {
        return initCount
      }
      switch (action.type) {
        case "INCREMENT":
          return { "count": state.count + 1 }
        case "DECREMENT":
          return { "count": state.count - 1 }
        default:
          return state;
      }

    }

    var store = Redux.createStore(counter)
````
 **store拥有以下方法**
 - 通过`store.getState()`f方法 获取state;
 - 通过`store.dispatch(action)`方法来更新state；
 - 通过`store.subscribe(listener)`方法来注册监听器，state变化时自动执行该函数；
 
 通过store.getState()获取state，并根据state值来设置span的初始值
````js
    function renderValue() {
      document.querySelector("span").innerHTML = store.getState().count;
    }

    renderValue();
````
通过store.subscribe()来注册监听器，每当state发生变化时执行上面的函数
````js
store.subscribe(renderValue);
````
## 触发action改变state
最后通过store.dispatch(action)来触发修改state的操作，写在事件处理程序中，点击按钮时修改state:
````js

    document.querySelector('.increment').onclick = function () {
      store.dispatch({
        type: 'INCREMENT'
      })
    }
    document.querySelector('.decrement').onclick = function () {
      store.dispatch({
        type: 'DECREMENT'
      })
    }
````

应用中所有的state都以一个object tree的形式存储在唯一一个store中，想要改变state的唯一方式是触发一个action，action只用来描述发生了什么，通过编写reducer来根据action去改变应用的state。

## middleware

![image](https://xiaoyueyue165.github.io/static/blog/react/redux-middleware.png)

中间件，redux中`createStore`的第三个参数支持添加中间件。

````js
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

const error = store => next => action => {
  try {
    next(action)
  } catch (e) {
    console.log('error', e)
  }
}
const store = createStore(rootReducer, {}, applyMiddleware(logger, error));
````
上图中的`logger`中间件可以自己书写:
````js
const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const logger = function(store) {
  return function(next) {
    return function(action) {
      console.log("dispatching...",action);
      let result = next(action);
      console.log("next State",store.getState());
      return result;
    }
  }
}
````
### Userful links

- https://github.com/evgenyrodionov/redux-logger
- https://github.com/gaearon/redux-thunk
- https://github.com/pburtchaell/redux-promise-middleware
- https://github.com/zalmoxisus/redux-devtools-extension

## 热模块加载（HMR）
- https://github.com/facebook/create-react-app/issues/2317

## react-redux

react-redux的作用是将redux的的反应更好的流动(绑定到)reac应用上。

#### <Provider store>

作用在于将由redux创建的store传递到内部组件中，内部组件可以使用这个store并提供对state的更新。

所以说`Provider `可以只在react应用最外包裹层注入store就可以了。
````js
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="foo" component={Foo}/>
        <Route path="bar" component={Bar}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
````

#### connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

connect()一共有四个参数，常用的有两个`mapStateToProps`和`mapDispatchToProps`

- mapStateToProps：把状态绑定到组件的属性当中。我们定义的state对象有哪些属性，在我们组件的props都可以查阅和获取。
````js
const mapStateToProps = (state) => {
  return {
    counter: state.counter
  }
}
````

state相当于 store.getState() 通过connect绑定到组件的props上进行获取,返回的对象键可以自定义；

- mapDispatchToProps：在redux中介绍过，用store.dispatch(action)来发出操作，那么我们同样可以把这个方法封装起来，即绑定到我们的方法中。

````js
import { increment, decrement } from './actions'; // 少量action

const mapDispatchToProps = (dispatch) => {
  return {
    "increment": () => dispatch(increment()),
    "decrement": () => dispatch(decrement()),
  }
};
````
### 补充
单个声明式导出action方法和多个一块导出，这种props数据比较清晰
````js
import { increment, decrement } from './actions'; // 少量action
// import * as types from './actions'; // 多个action
````

另一种方法借用`bindActionCreators`api,这样会将所有的action一同绑定，适情况使用。
````js
import * as types from './actions'; // 多个action

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(types, dispatch);
};

````
最后connect()将state和dispatch都绑定到导出的组件上，redux数据就经过react-redux流动到了react组件上。
````js
export default connect(mapStateToProps, mapDispatchToProps)(App);
````

## Redux DevTools


#### 参考
- http://cn.redux.js.org/
- https://www.jianshu.com/p/1a2f3db4af61
- https://www.jianshu.com/p/3334467e4b32