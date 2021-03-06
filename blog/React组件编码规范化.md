### 1.UI 组件和 container 组件

UI 组件是构成前端界面的基础单元，它们不涉及业务逻辑，无生命周期函数，只负责单纯的渲染，所有数据都通过 props 传入。

**UI 组件分为两种情况，有状态组件和无状态组件:**

- 如果是无状态组件，则使用纯函数，我们大部分的 UI 组件都是这种纯函数。

```js
// bad (relying on function name inference is discouraged)
const Listing = ({ hello }) => <div>{hello}</div>;

// good
function Listing({ hello }) {
  return <div>{hello}</div>;
}
```

- 如果模块有内部状态或者是 refs, 推荐使用 class extends React.Component

```js
// bad
const Listing = React.createClass({
  // ...
  render() {
    return <div>{this.state.hello}</div>;
  }
});

// good
class Listing extends React.Component {
  // ...
  render() {
    return <div>{this.state.hello}</div>;
  }
}
```

### 2. components 导出默认模块

```js
export { default as XScroll } from "./XScroll";
export { default as TypeList } from "./TypeList";
```

### 3.总是在 Refs 里使用回调函数

```js
// bad
<Foo
  ref="myRef"
/>

// good
<Foo
  ref={(ref) => { this.myRef = ref; }}
/>
```

### 4.this.props.children

```js
class NotesList extends React.Component {
  render() {
    return (
      <ol>
        {React.Children.map(this.props.children, function(child) {
          return <li>{child}</li>;
        })}
      </ol>
    );
  }
}

ReactDOM.render(
  <NotesList>
    <span>hello</span>
    <span>world</span>
  </NotesList>,
  document.getElementById("example")
);
```

- 使用 React.Children.map 来遍历组件子节点
  > 可以避免 this.props.children 的值不确定

| 组件状态   | this.props.children 获取结果 |
| ---------- | ---------------------------- |
| 没有子节点 | undefined                    |
| 一个子节点 | obj                          |
| 多个子节点 | array                        |

### 5.PropTypes

- 组件类的 PropTypes 属性，就是用来验证组件实例的属性是否符合要求

```
      var data = 123;
      class MyTitle extends React.Component {
        propTypes :{
          title: React.PropTypes.string.isRequired,
        }
        render() {
          return <h1> {this.props.title} </h1>;
        }
      }


      ReactDOM.render(
        <MyTitle title={data} />,
        document.getElementById('example')
      );
```

### 6.模块生命周期

- `class extends React.Component` 的生命周期函数:

1. 可选的 `static` 方法
1. `constructor` 构造函数
1. `getChildContext` 获取子元素内容
1. `componentWillMount` 模块渲染前
1. `componentDidMount` 模块渲染后
1. `componentWillReceiveProps` 模块将接受新的数据
1. `shouldComponentUpdate` 判断模块需不需要重新渲染
1. `componentWillUpdate` 上面的方法返回 `true`， 模块将重新渲染
1. `componentDidUpdate` 模块渲染结束
1. `componentWillUnmount` 模块将从 DOM 中清除, 做一些清理任务
1. _点击回调或者事件处理器_ 如 `onClickSubmit()` 或 `onChangeDescription()`
1. _`render` 里的 getter 方法_ 如 `getSelectReason()` 或 `getFooterContent()`
1. _可选的 render 方法_ 如 `renderNavigation()` 或 `renderProfilePicture()`
1. `render` render() 方法

- 如何定义 `propTypes`, `defaultProps`, `contextTypes`, 等等其他属性...

  ```jsx
  import React from "react";
  import PropTypes from "prop-types";

  const propTypes = {
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    text: PropTypes.string
  };

  const defaultProps = {
    text: "Hello World"
  };

  class Link extends React.Component {
    static methodsAreOk() {
      return true;
    }

    render() {
      return (
        <a href={this.props.url} data-id={this.props.id}>
          {this.props.text}
        </a>
      );
    }
  }

  Link.propTypes = propTypes;
  Link.defaultProps = defaultProps;

  export default Link;
  ```

#### 参考

- [Airbnb React/JSX 编码规范](https://github.com/JasonBoy/javascript/blob/master/react/README.md#ordering-react-%E6%A8%A1%E5%9D%97%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
- [【分享】关于 React 组件规范化的一些建议 ](https://github.com/minooo/React-Study/issues/6)
