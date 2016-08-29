/**
 * Created by liuchungui on 16/8/9.
 */

/**
 * 检测是否微信登录
 */
function isWXLogin() {
    var user_id = localStorage.getItem("user_id");
    if(user_id <= 0) {
        return false;
    }
    return true;
}

/**
 * 跳转到微信授权页面
 */
function locationToWXAuthorize(url) {
    var rand = Math.floor(Math.random() * 900) + 100;
    var goUrl = encodeURIComponent(url);
    var wxUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+WX_APP_ID+"&redirect_uri=" + goUrl + "&response_type=code&scope=snsapi_userinfo&state=" + rand + "#wechat_redirect";
    //存rand
    localStorage.setItem("rand", rand);
    window.location.href = wxUrl;
}

/**
 * 发送插入分享的请求
 */
function sendInsertShareRequest(user_id, super_id, link_id, success) {
    var token = localStorage.getItem('token');
    //组装参数
    var insertShareParam = {
        user_id: user_id,
        token: token
    };

    if(super_id != undefined && link_id != undefined) {
        insertShareParam = {
            user_id: user_id,
            super_id: super_id,
            link_id: link_id,
            token: token
        };
    }

    // 插入一条分享记录
    sendPostRequest("user/insert_share", insertShareParam, function (data) {
        //保存分享环节
        localStorage.setItem("link_id", data.data.link_id);
        //成功回调
        success(data);
    }, function (error) {
        localStorage.clear();
        locationToWXAuthorize(window.location.href);
    });
}

/**
 * 获取微信用户信息
 */
function getWXUserInfo(param) {
    var rand = localStorage.getItem("rand");
    //state验证不通过
    if(param.state != rand) {
        locationToWXAuthorize(window.location.href);
        // window.location.href = commonUrl + location.search;
        return;
    }
    $.showLoading('加载中');
    sendPostRequest("user/wx_user", {code: param.code, super_id: param.super_id}, function (data) {
        //成功, 存入user_id和手机号
        localStorage.setItem("user_id", data.data.user_id);
        localStorage.setItem("phone", data.data.phone);
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userType", data.data.type);

        //插入分享, 配置微信
        sendInsertShareRequest(data.data.user_id, param.super_id, param.link_id, function (data) {
            wxShareConfig(function () {
                $.hideLoading();
            });
        });
    }, function (data) {
        //微信登录失败, 则重新授权
        locationToWXAuthorize(window.location.href);
        $.hideLoading();
    });
}

/**
 * 微信登录逻辑, 内部包括了跳转到授权页和获取微信用的逻辑
 */
function wxLogin() {
    //微信未登录, 则跳转到授权页面
    if(!isWXLogin()) {
        var param = getURLQueringString();

        //参数中包含code和state, 则说明是微信授权页回调过来
        if(param.code != undefined && param.state != undefined) {
            getWXUserInfo(param);
        }
        else {
            //跳转到微信授权
            locationToWXAuthorize(window.location.href);
        }
    }
}


/**
 * 微信分享配置
 */
function wxShareConfig(complete) {
    var url = window.location.href;
    //截取掉#后面的内容
    var index1 = url.indexOf("#");
    var index2 = url.indexOf("?");
    if(index1 > index2) {
        url = url.substr(0, index1);
    }

    //配置微信
    $.ajax({
        type: "GET",
        url: ServerURL + "wechat/config",
        data: {
            url: encodeURIComponent(url)
        },
        dataType: "json",
        success: function(data){
            wx.config({
                // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.data.appId, // 必填，公众号的唯一标识
                timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
                signature: data.data.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function() {
                //获取uid和link_id
                var userId = localStorage.getItem("user_id");
                var linkId = localStorage.getItem("link_id");
                var shareUrl = commonUrl + "partner/home.html";
                var imgUrl = commonUrl + "partner/images/share_img.jpg";
                var title = '你打官司我垫钱！帮瀛3000万现金寻事业合伙人';
                var desc = '转发就是帮朋友，还能得现金奖励，让法律该帮的人';
                //拼接userId
                shareUrl = shareUrl + "?super_id=" + userId;
                //存在linkId, 则分享带上link_id等参数
                if(linkId != undefined && linkId != "" && linkId != null) {
                    shareUrl = shareUrl + "&link_id=" + linkId;
                }

                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: shareUrl, // 分享链接
                    imgUrl: imgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        // alert("分享成功, 链接:" + shareUrl);
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        // alert("取消分享");
                    },
                    fail: function (res) {
                        // alert("分享失败:"+JSON.stringify(res));
                    }
                });

                wx.onMenuShareTimeline({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: shareUrl, // 分享链接
                    imgUrl: imgUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        // alert("分享成功, 链接:" + shareUrl);
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        // alert("取消分享");
                    }
                });

                //配置分享完
                complete(true);
            });
            wx.error(function() {
                // alert("分享验证失败");
                complete(false);
            });
        },
        error: function(data) {
            // alert('请求分享配置数据失败');
            complete(false);
        }
    });
}