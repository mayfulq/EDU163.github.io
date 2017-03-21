1.`window.onload`与匿名自执行函数`(function(){})()`区别

  - `window.onload`

    - 必须等到页面内包括图片的所有元素加载完毕后才能执行，即是将页面加载完成以后再执行相应的函数。此时，页面的各个内容已经初始化完成;

    - 不能同时编写多个，如果有多个`window.onload`方法，只会执行一个

  - `(function(){})()`匿名自执行函数：

    - 只要解析到，就会执行，而不会管页面是否初始化完成;

    - 可以同时编写多个，并且都可以得到执行

2.`IE8`下兼容`opacity`

  ```css
    opacity: .75; /* Standards Compliant Browsers */
    filter: alpha(opacity=75); /* IE 7 and Earlier */
    /* Next 2 lines IE8 */
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=75)";
    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=75);
  ```

3.`IE8`下实现兼容`rgba`

  ```css
  background: rgb(0, 0, 0);    /*不支持rgba的浏览器*/
  background: rgba(0,0,0,.5);  /*支持rgba的浏览器*/
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#7f000000,endColorstr=#7f000000);    /*IE8支持*/
  ```
  - 第二句话的意思就是当上一行的透明度不起作用的时候执行。这句话的意思本来是用来做渐变的，但是这个地方不需要渐变。所以两个颜色都设置成了相同的颜色。

  - 解释下`#7f000000`，第一部分是#号后面的`7f`。是`rgba`透明度0.5的`IEfilter`值。计算方法`Math.floor(0.5*255).toString(16)`。后面的六位。这个是六进制的颜色值。要跟`rgb`函数中的取值相同。比如`rgb(0,0,0,)`对应`#000`；都是黑色。

4.`innerHTML`、`innerText`与`textContent`
 - `innerHTML`指的是从对象的起始位置到终止位置的全部内容,包括`Html`标签。

 - `innerText`指的是从起始位置到终止位置的内容,但它去除`Html`标签。

   - 同时，`innerHTML` 是所有浏览器都支持的，`innerText` 是IE浏览器和`chrome` 浏览器支持的，`Firefox`浏览器不支持。其实，`innerHTML` 是W3C 组织规定的属性；而`innerText` 属性是IE浏览器自己的属性，不过后来的浏览器部分实现这个属性罢了。 
- `textContent`获取一个节点及其内部节点的文本内容。

  - `innerText`会受样式的影响，它不返回隐藏元素的文本，但`textContent`返回；
`innerText`返回的文本，会过滤掉空格、换行和回车键，`textcontent`则不会。`IE9`以上支持

5.`focus` | `focusin` | `focusout` | `blur` 事件

- `focus`:当focusable元素获得焦点时，不支持冒泡；

- `focusin`:和focus一样，只是此事件支持冒泡；

- `blur`:当focusable元素失去焦点时，不支持冒泡；

- `focusout`:和blur一样，只是此事件支持冒泡；

  - 事件执行顺序：对于同时支持这4个事件的浏览器，事件执行顺序为`focusin` > `focus` > `focusout` > `blur`；

  - 兼容性：几乎所有的浏览器都支持`focus`和`blur`事件，`Firefox`中不支持`focusin`和`focusout`事件；`chrome`和`safari`中只有通过`addEventListener`方式绑定事件才能正常使用，其他方式绑定都不行；

  - `focus`和`blur`如何实现事件代理：`focus`和`blur`不支持冒泡，但其支持捕获，但 `IE `中事件模型没有捕获只有冒泡，所以在非`IE`浏览器中可以通过在捕获阶段进行事件绑定实现事件代理。对`IE`浏览器，通过支持冒泡的是`focusin`和`focusout`实现就可以了。

6.`href = "#"`当页面有滚动条时，点击后会返回到页面顶端的解决办法

```HTML 
//点击链接后不做任何事情
<a href="javascript:void(0);" >test</a> //IE里会造成gif动画停止播放的问题
<a href="javascript:;" >test</a> 
<a href="####" >test</a> //使用2个到4个#，见的大多是"####"，也有使用"#all"等其他的 
```
```js
e.preventDefault();
```
详情[w3cschool](http://www.w3cschool.cn/javascript/javascript-void.html)


7.取消图片换行时产生的默认间距
```css
.container{
  font-size:0;
}
```
>因为换行会产生一个空白节点，将字体设置为0即可取消此空白