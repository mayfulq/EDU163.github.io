/**
 * [跨浏览器添加事件]
 * @param {*} obj 
 * @param {*} type 
 * @param {*} fn 
 */
function addEvent(obj, type, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(type, fn, true);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + type, fn);
    }
}


/**
 * [获取cookie]
 * [返回一个cookie的对象，以cookie[name]的形式访问]
 */
function getCookie() {
    var cookie = {};
    var all = document.cookie;
    var list = all.split('; ');//注意分号后面空格不能少
    if (all === '') return cookie;
    for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}

/**
 * [设置cookie]
 * @param {*} name 
 * @param {*} value 
 * @param {*} expires 
 * @param {*} path 
 * @param {*} domain 
 * @param {*} secure 
 */
function setCookie(name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}

/**
 * [判断是否有某个className]
 * @param {*} element 
 * @param {*} className 
 */
function hasClass(element, className) {
    var classNames = element.className;
    if (!classNames) {
        return false;
    } else {
        classNames = classNames.split(/\s+/);
        for (var i = 0, len = classNames.length; i < len; i++) {
            if (classNames[i] === className) {
                return true;
            }
        }
    }
}


/**
 * [添加className]
 * @param {*} element 
 * @param {*} className 
 */
function addClass(element, className) {
    var flag = hasClass(element, className);
    if (!flag) {
        element.className = [element.className, className].join(" ");
    }
}

/**
 * [删除元素className]
 * @param {*} element 
 * @param {*} className 
 */
function removeClass(element, className) {
    var flag = hasClass(element, className);
    if (className && flag) {
        var classNames = element.className.split(/\s+/);
        for (var i = 0, len = classNames.length; i < len; i++) {
            if (classNames[i] === className) {
                classNames.splice(i, 1);
                break;
            }
        }
        element.className = classNames.join(" ");
    }
}


/**
 * [get请求函数封装]
 * @param {*} url 
 * @param {*} options 
 * @param {*} callback 
 */
function get(url, options, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                callback(xhr.responseText);
            } else {
                console.error('请求失败: ' + xhr.status);
            }
        };
    }
    if (!!options) {
        var url = url + '?' + serialize(options);
    };
    xhr.open('get', url, true);
    xhr.send();
}
/**
 * [表单序列化封装]
 * @param {*} data 
 */
function serialize(data) {
    if (!data) {
        return '';
    }
    var arr = [];
    for (var name in data) {
        if (!data.hasOwnProperty(name)) {
            continue;
        };
        if (typeof data[name] === 'function') {
            continue;
        };
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        arr.push(name + '=' + value);
    };
    return arr.join('&');
}

/**
 * [page分页封装]
 * @param {*} opt 
 */
function page(opt) {
    if (!opt.id) return false;
    var obj = opt.id;
    var nowNum = opt.nowNum || 1;
    var allNum = opt.allNum;
    var callback = opt.callback || function () { };
    var pager = document.querySelector('.pager');
    var pageInit = function (i) {
        var oA = document.createElement('a');
        oA.setAttribute('index', i);
        oA.className = 'pg';
        oA.innerHTML = i;
        if (nowNum == i) {
            addClass(oA, 'selected');
        }
        return oA;
    }
     pager.innerHTML = '';
    //当前页不等于1时上一页可选
    var oA = document.createElement('a');
    oA.innerHTML = '上一页';
    oA.setAttribute('index', nowNum - 1);
    if (nowNum != 1) {
        oA.className = 'prv';
    } else {
        oA.className = 'prv disabled';
    }
    obj.appendChild(oA);
    //生成具体页数
    for (var i = 1; i <= allNum; i++) {
        var oA = pageInit(i);
        obj.appendChild(oA);
    }
    //当前页不是最后一页时显示下一页
    var oA = document.createElement('a');
    oA.innerHTML = '下一页';
    oA.setAttribute('index', nowNum + 1);
    if (nowNum != allNum) {
        oA.className = 'next';
    } else {
        oA.className = 'next disabled';
        oA.setAttribute('index', allNum);
    }
    obj.appendChild(oA);

    var oA = obj.getElementsByTagName('a');
    for (var i = 0; i < oA.length; i++) {
        oA[i].onclick = function () {
            if (nowNum != parseInt(this.getAttribute('index'))) {
                var nowNum = parseInt(this.getAttribute('index'));
                obj.innerHTML = '';
                page({
                    id: opt.id,
                    nowNum: nowNum,
                    allNum:allNum,
                    callback: callback
                });
                callback(nowNum, allNum);
            }
            return false;
        }
    }
}
    

/**
 * [多行省略显示]
 * @param {*} str 
 */
function ellipsis(str) {
    var len = str.length;
    if (len >= 55) {
        return str.slice(0, 55) + '...';
    } else {
        return str;
    }
}

/**
 * [setOpacity设置透明度]
 * @param {*} ele 
 * @param {*} opacity 
 */
 function setOpacity(ele, opacity) {
    if (ele.style.opacity != undefined) {
        ///兼容FF和GG和新版本IE
        ele.style.opacity = opacity / 100;

    } else {
        ///兼容老版本ie
        ele.style.filter = "alpha(opacity=" + opacity + ")";
    }
}

/**
 * [fadeIn淡入]
 * @param {*} ele 
 * @param {*} opacity 
 */
function fadeIn(ele, opacity) {
    if (ele) {
        var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity;
        v < 1 && (v = v * 100);
        var timer = null;
        timer = setInterval(function() {
            if (v < opacity) {
                v += 20;
                setOpacity(ele, v);
            } else {
                clearInterval(timer);
            }
        }, 100);
    }
}

