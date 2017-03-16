window.onload = function () {
    // 顶部通知条
    var tips_module = (function () {
        var tips = document.querySelector('.tips');
        var noTips = tips.querySelector('.close');
        var cookie = getCookie();
        addEvent(noTips, "click", function (event) {
            setCookie('noTips', 1, new Date(6666, 6));
            tips.style.display = 'none';
        });
        if (cookie.noTips) {
            tips.style.display = 'none';
        };
    })();

    // 轮播
    var slide_module = (function () {
        var oDiv = document.querySelector('.banner');
        var oUl = oDiv.querySelector('.list');
        var aLi = oUl.getElementsByTagName('li');
        var aA = oUl.getElementsByTagName('a');
        var aImg = oUl.getElementsByTagName('img');
        var oBtn = oDiv.querySelector('.nav');
        var aDot = oBtn.getElementsByTagName('i');
        var iNow = 0;
        var iLast = aLi.length - 1;
        var flag = true;


        for (var i = 0, len = aDot.length; i < len; i++) {
            aDot[i].index = i;
            aDot[i].onclick = function () {
                for (var i = 0, len = aDot.length; i < len; i++) {
                    aDot[i].parentNode.className = '';
                    aA[i].style.zIndex = '0';
                    // aImg[i].style.opacity = '0';
                    setOpacity(aImg[i], 0);
                };
                this.parentNode.className = 'selected';
                aA[this.index].style.zIndex = '1';
                fadeIn(aImg[this.index], 100);
                iNow = this.index;
            }
        };

        var timer = setInterval(autoRun, 5000);
        function autoRun() {
            if (iNow == iLast) {
                iNow = 0;
            } else {
                iNow++;
            }
            for (var i = 0, len = aDot.length; i < len; i++) {
                aDot[i].parentNode.className = '';
                aA[i].style.zIndex = '0';
                // aImg[i].style.opacity = '0';
                setOpacity(aImg[i], 0);
            };
            aDot[iNow].parentNode.className = 'selected';
            aA[iNow].style.zIndex = '1';
            fadeIn(aImg[iNow], 100);
        }

        oDiv.onmouseover = function () {
            if (flag) {
                clearInterval(timer);
                flag = false;
            }
        };

        oDiv.onmouseout = function () {
            if (!flag) {
                timer = setInterval(autoRun, 5000);
                flag = true;
            }
        };
    })();

    // 视频
    var video_module = (function () {
        var mask = document.querySelector('.v-mask');
        var play = document.querySelector('.playvideo');
        var closed = mask.querySelector('.closed');
        var video = mask.querySelector('video');

        addEvent(play, "click", function (event) {
            mask.style.display = 'block';
        });

        addEvent(closed, "click", function (event) {
            mask.style.display = 'none';
            video.pause();
            video.currentTime = 0;
        })
    })();

    // 关注和登录

    var follow_module = (function () {
        var follow = document.querySelector('.btn-1');
        var mask = document.querySelector('.l-mask');

        // 登录
        var login_module = (function () {
            var form = document.forms.loginForm;
            var account = form.querySelector('.itm1');
            var password = form.querySelector('.itm2');
            var closed = form.querySelector('.closed');
            var accountLab = account.querySelector('.lab');
            var passwordLab = password.querySelector('.lab');
            var suBtn = form.querySelector('.btn');

            function isfocus(event) {
                var event = event || window.event;
                var target = event.target || event.srcElement;
                var parentTarget = target.parentNode;
                var lab = parentTarget.querySelector('.lab');
                // if (lab) {
                lab.innerHTML = ' ';
                // }
                removeClass(parentTarget, "error");
            }

            function isblur(event) {
                var event = event || window.event;
                var target = event.target || event.srcElement;
                var parentTarget = target.parentNode;
                var aLab = parentTarget.querySelector('.a-lab');
                var pLab = parentTarget.querySelector('.p-lab');
                var targetValue = target.value;
                if (targetValue == "") {
                    addClass(suBtn, "disabled");
                    if (target.name == "userName") {
                        addClass(account, 'error');
                        aLab.innerHTML = '请输入账号';
                    } else if (target.name == "password") {
                        addClass(password, 'error');
                        pLab.innerHTML = '请输入密码';
                    }
                }
                else {
                    removeClass(suBtn, "disabled");
                }
            }

            // 兼容IE
            if (window.addEventListener) {
                addEvent(form, 'focus', isfocus);//非IE
            } else {
                addEvent(form, 'focusin', isfocus);//IE
            };

            if (window.addEventListener) {
                addEvent(form, 'blur', isblur)//非IE
            } else {
                addEvent(form, 'focusout', isblur)//IE
            };

            //提交按钮
            addEvent(form, 'submit', function (event) {
                var accountValue = document.getElementById('account').value;
                var passwordValue = document.getElementById('password').value;
                // console.log(accountValue);
                // console.log(passwordValue);
                if (accountValue == '' || passwordValue == '') {
                    addClass(suBtn, "disabled");
                } else {
                    var options = { userName: md5(accountValue), password: md5(passwordValue) };
                    var url = 'https://study.163.com/webDev/login.htm';
                    console.log(options);
                    function sub(response) {
                        if (response == 1) {
                            console.log('请求返回值为：' + response + ',登录成功！');
                            form.reset();
                            setCookie('loginSuc', 1, new Date(6666, 6));
                            followAPI();
                        } else {
                            alert('账号密码错误');
                            console.log('请求返回值为：' + response + ',登录失败！');
                            form.reset();

                        }
                    }
                    get(url, options, sub);
                    removeClass(suBtn, "disabled");
                }
            })
            //关闭按钮
            addEvent(closed, 'click', function (event) {
                if (hasClass(account, 'error') || hasClass(password, 'error')) {
                    removeClass(account, 'error');
                    removeClass(password, 'error');
                };
                removeClass(suBtn, "disabled");
                form.reset();
                mask.style.display = 'none';
            })
        })();

        function followAPI() {
            var url = 'https://study.163.com/webDev/attention.htm';
            get(url, null, function (response) {
                if (response == 1) {
                    setCookie('followSuc', 1, new Date(6666, 6));
                    setFollowBtn();
                }
            })
        }

        function setFollowBtn() {
            var cookie = getCookie();
            var followBtn = document.querySelector('.btn-1');
            var followedBtn = document.querySelector('.btn-2');
            console.log(cookie);
            if (cookie.followSuc == 1) {
                followBtn.style.display = 'none';
                followedBtn.style.display = 'inline';
                mask.style.display = 'none';
            }
            else {
                followBtn.style.display = 'inline';
                followedBtn.style.display = 'none';
            }
        }
        setFollowBtn();
        //关注按钮
        addEvent(follow, 'click', function (event) {
            var event = event || window.event;
            var cookie = getCookie();
            if (!cookie.loginSuc) {
                mask.style.display = 'block';
            } else {
                followAPI();
            }
        });
    })();


    //  右侧“最热排行”

    var top_module = (function () {
        var url = 'https://study.163.com/webDev/hotcouresByCategory.htm';
        var oUl = document.querySelector('.top');
        var aLi = oUl.getElementsByTagName('li');
        var topbox = document.querySelector('.topbox');
        var flag=true;

        get(url, null, getTopList);

        function getTopList(response, now) {
            var list = JSON.parse(response);
            var templete = document.querySelector('.t-templete');
            // console.log(list);
            // console.log(templete);
            for (var i = 0, len = list.length; i < len; i++) {
                var cloned = templete.cloneNode(true);
                var img = cloned.querySelector('.pic');
                var title = cloned.querySelector('h3');
                var num = cloned.querySelector('h5');
                removeClass(cloned, 't-templete');
                img.src = list[i].smallPhotoUrl;
                img.alt = list[i].name;
                title.innerHTML = list[i].name;
                num.innerHTML = list[i].learnerCount;
                templete.parentNode.appendChild(cloned);

            }
        }

        function scroll() {
            var oLi = aLi[20].cloneNode(true);
            oUl.insertBefore(oLi, aLi[1]);
            oUl.removeChild(aLi[21]);
        }

        var timer=setInterval(scroll, 5000);


        topbox.onmouseover = function () {
            if (flag) {
                clearInterval(timer);
                flag = false;
            }
        };

        topbox.onmouseout = function () {
            if (!flag) {
                timer = setInterval(scroll, 5000);
                flag = true;
            }
        };

    })();


    // 获取课程列表

    var course_module = (function () {
        var url = 'https://study.163.com/webDev/couresByCategory.htm';
        var pageSize = 20;
        var pageType = 10;
        var main = document.querySelector('.main');
        var nav = main.querySelector('.nav');
        var pager = main.querySelector('.pager');

        function toggleBtn(event) {
            var event = event || window.event;
            var target = event.target || event.srcElement;
            var parentTarget = target.parentNode;
            var btn1 = parentTarget.querySelector('#aitem-1');
            var btn2 = parentTarget.querySelector('#aitem-2');

            if (target.name == 'aitem-2') {
                addClass(btn2, 'selected');
                removeClass(btn1, 'selected');
            } else {
                addClass(btn1, 'selected');
                removeClass(btn2, 'selected');
            }
            console.log('筛选类型:' + pageType);
            pageType = target.getAttribute('data');
            pager.innerHTML = '';
            getPageNum(1);
            event.preventDefault();

        }

        addEvent(nav, 'click', toggleBtn);

        //获取分页器总页数以及课程列表第一页
        function getPageNum(now) {
            var options = { pageNo: now, psize: pageSize, type: pageType };
            console.log('getPageNum：' + pageSize);
            get(url, options, function (response) {
                initPage(response, now);
            });
        }
        getPageNum(1);

        //初始化分页和课程列表
        function initPage(response, now) {
            var obj = JSON.parse(response);
            var options = { id: pager, nowNum: now, allNum: obj.totalPage, callback: getCourse };
            page(options);
            initCourse(response);
        }
        //获取课程列表
        function getCourse(now, all) {
            var options = { pageNo: now, psize: pageSize, type: pageType };
            console.log('getCourse：' + pageType);
            get(url, options, initCourse);
            console.log('分页器：' + now);
        }
        //生成课程列表
        function initCourse(response) {
            var data = JSON.parse(response);
            var list = data.list;
            console.log(data);
            console.log('获取的页码：' + data.pagination.pageIndex);
            var item = document.querySelectorAll('.data-list-item');
            var templete = document.querySelector('.c-templete');
            for (var i = 1, len = item.length; i < len; i++) {
                item[i].parentNode.removeChild(item[i]);

            };
            for (var i = 0, len = list.length; i < len; i++) {
                var cloned = templete.cloneNode(true);
                var img = cloned.querySelector('.imgpic');
                var title = cloned.querySelector('.tt');
                var orgname = cloned.querySelector('.org-name');
                var num = cloned.querySelector('.learnerCount');
                var price = cloned.querySelector('.price');
                var kindname = cloned.querySelector('.kindname');
                var disc = cloned.querySelector('.disc');
                removeClass(cloned, 'c-templete');
                img.src = list[i].middlePhotoUrl;
                img.alt = list[i].name;
                title.innerHTML = list[i].name;
                orgname.innerHTML = list[i].provider;
                num.innerHTML = list[i].learnerCount;
                price.innerHTML = (list[i].price) ? '￥' + list[i].price + '.00' : '免费';
                kindname.innerHTML = (list[i].categoryName==null)?'无':list[i].categoryName;
                disc.innerHTML = ellipsis(list[i].description);
                templete.parentNode.appendChild(cloned);
            }
        }



    })();

    //自适应
    var autoFix_module = (function () {

        window.onresize = function () {
            var content = document.querySelector('.conttentbox .content');
            var main = document.querySelector('.main');
            var school=document.querySelector('.school');
            var commen=school.getElementsByTagName('div');
            var banner = document.querySelector('.banner');
            var banner_img = banner.getElementsByTagName('img');
            var tips = document.querySelector('.tips');
            var tips_content = document.querySelector('.tips-content');
            var navbar=document.querySelector('.navbar');
            
            
            var winWidth = document.body.clientWidth;
            tips.style.width = winWidth+'px';
            // if ((document.body) && (document.body.client)){
            //      winWidth = document.body.clientWidth;
            //      tips.style.width = winWidth+'px';
            // }
               
            if (winWidth < 1205) {
                 // 顶部tips自适应
                  tips_content.style.width = '960px';
                   // 头部navbar自适应
                  navbar.style.width = '960px';
                // 课程区自适应
                content.style.width = '960px';
                main.style.width = '735px';
                // 轮播图自适应
                for(var i=0,len=banner_img.length;i<len;i++){
                    banner_img[i].style.width = '1364px';
                    banner_img[i].style.marginLeft = '-682px';
                }
                // 轮播图下方三大课堂介绍自适应
                school.style.width = '960px';
                for(var i=0,len=commen.length;i<len;i++){
                    commen[i].style.width = '172px';
                }
                for(var i=0,len=commen.length;i<len-1;i++){
                    commen[i].style.marginRight = '72px';
                }
            }
            else if (winWidth >= 1205) {
                // 顶部tips自适应
                  tips_content.style.width = '1202px';
                   // 头部navbar自适应
                  navbar.style.width = '1202px';
                // 课程区自适应
                content.style.width = '1205px';
                main.style.width = '980px';
                 // 轮播图自适应
                for(var i=0,len=banner_img.length;i<len;i++){
                    banner_img[i].style.width = '1616px';
                    banner_img[i].style.marginLeft = '-808px';
                }
                // 轮播图下方三大课堂介绍自适应
                school.style.width = '1187px';
                 for(var i=0,len=commen.length;i<len;i++){
                    commen[i].style.width = '239px';
                }
                for(var i=0,len=commen.length;i<len-1;i++){
                    commen[i].style.marginRight = '84px';
                }
              

            }

        }
    })()




}