<p align="center">
  <a href="https://qiankun.umijs.org">
    <img src="https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png" alt="qiankun" width="180" />
  </a>
</p>

# qiankun-rewrite

> 针对 qiankun 关于 Element, Document 原型链上部分方法打上补丁，从而满足元素隔离的需求。

## 🤔 Motivation

当使用 qiankun 中`loadMicroApp`方法加载两个相同子应用时，其中会产生`样式冲突`、`选择器冲突`，由于 sandbox 中开启`strictStyleIsolation`模式会导致兼容性问题，进而选择了`experimentalStyleIsolation`模式来解决`样式冲突`的问题。

> 而开启该模式会导致类似 antd 中 Modal 框样式[丢失的问题](https://github.com/umijs/qiankun/issues/1316)

因此萌发了代理 Document\Element 原型链上的的方法，使得子应用操作元素的范围在缩小在其容器内，以下该项目的修改点，可以让你清楚评估风险：

## 👀 Change Points

- 📍 基础版本：qiankun@2.8.2版本拓展。
- 新增：`<qiankun-body>{template}</qiankun-body>`容器。
- 新增：`appInstanceMap`用于存储 app 实例信息（最外层容器节点）。
- 注入：`document`, `document.body`, `document.head`打上标记（用于判断是否需要执行 patch）
- 补丁：Document\Element 原型链上的方法

| Document                   | Element                |
| -------------------------- | ---------------------- |
| getElementById             | querySelector          |
| getElementsByName          | querySelectorAll       |
| getElementsByClassName     | getElementsByClassName |
| getElementsByTagName       | getElementsByTagName   |
| querySelector              | appendChild            |
| querySelectorAll           | append                 |
| createElement              | prepend                |
| createElementNS            | insertBefore           |
| rawDocumentCreateElementNS | cloneNode              |
|                            | removeChild            |
|                            | replaceChild           |

After solving these common problems of micro frontends and lots of polishing and testing, we extracted the minimal viable framework of our solution, and named it `qiankun`, as it can contain and serve anything. Not long after, it became the cornerstone of hundreds of our web applications in production, and we decided to open-source it to save you the suffering.

## 📦 Installation

```shell
$ yarn add qiankun-rewrite  # or npm i qiankun-rewrite -S
```

## 📖 TODO

- [x] 元素隔离
- [ ] 路由响应隔离（doing）
- [ ] history 隔离

## 💿 SelfTest

Inside the `examples` folder, there is a sample Shell app and multiple mounted Micro FE apps. To get it running, first clone `qiankun`:

```shell
$ git clone https://github.com/umijs/qiankun.git
$ cd qiankun
```

Now install and run the example:

```shell
$ yarn install
$ yarn examples:install
$ yarn examples:start
```

Visit `http://localhost:3000`.

![](/examples/test.gif)

## 🎁 Acknowledgements

- [MicroApp](https://zeroing.jd.com/) inspired by DOM sandbox!
