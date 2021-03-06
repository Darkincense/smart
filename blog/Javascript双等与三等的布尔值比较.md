## 说明

==是抽象相等运算符，而===是严格相等运算符。

==运算符是在进行必要的类型转换后，再比较。===运算符不会进行类型转换，所以如果两个值不是相同的类型，会直接返回 false。使用==时，可能发生一些特别的事情，例如：

```js
1 == "1"; // true
1 == [1]; // true
1 == true; // true
0 == ""; // true
0 == "0"; // true
0 == false; // true
```

## 双等比较

The comparison x == y, where x and y are values, produces true or false. Such a comparison is performed as follows:

1. If Type(x) is the same as Type(y), then Return the result of performing Strict Equality Comparison x === y.

```js
[] == []; // false
```

2. If x is null and y is undefined, or x is undefined and y is null, return true.

```js
null == undefined; // ture
```

3. If Type(x) is Number and Type(y) is String, return the result of the comparison x == ToNumber(y), vice versa (反之亦然).

```js
1 == "1"; // true
0 == ""; // true
0 == "0"; // true
```

> Number("") => 0

4. If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y, vice versa.

```js
0 == false; // true
1 == true; // true
```

5. If Type(x) is either String, Number, or Symbol and Type(y) is Object, then return the result of the comparison x == [ToPrimitive](http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive)(y), vice versa.

6. Return false.

## 三等比较

The comparison x === y, where x and y are values, produces true or false. Such a comparison is performed as follows:

1. If Type(x) is different from Type(y), return false.

```js
1 === "1"; // false
```

2. If Type(x) is Undefined, return true. (按顺序执行，x 与 y 须类型一致)
3. If Type(x) is Null, return true.
4. If Type(x) is Number, then

```bash
   a. If x is NaN, return false.
   b. If y is NaN, return false.
   c. If x is the same Number value as y, return true.
   d. If x is +0 and y is −0, return true.
   e.If x is −0 and y is +0, return true.
   f. Return false.
```

5. If Type(x) is String, then

```bash
  a. If x and y are exactly the same sequence of code units (same length and same code units at corresponding indices), return true.
  b. Else, return false.
```

6. If Type(x) is Boolean, then

```bash
  a. If x and y are both true or both false, return true.
  b. Else, return false.
```

7. If x and y are the same Symbol value, return true.
8. If x and y are the same Object value, return true.
9. Return false.

## 建议

建议是从不使用==运算符，除了方便与 null 或 undefined 比较时，a == null 如果 a 为 null 或 undefined 将返回 true。

```js
var a = null;
console.log(a == null); // true
console.log(a == undefined); // true
```

#### 参考

- [abstract-equality-comparison](http://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison)
- [strict-equality-comparison](http://www.ecma-international.org/ecma-262/6.0/#sec-strict-equality-comparison)
- [["0"]==["0"]为什么是 false？](https://www.zhihu.com/question/42328292)
