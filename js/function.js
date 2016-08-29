function getURLQueringString() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    var i = url.indexOf("?");
    if (i != -1) {
        var j = url.indexOf("#");
        var str = url.substr(1);
        //存在'#',则获取?与#之间的内容
        if(i < j) {
            str = url.substr(1, j-1);
        }
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

// const commonUrl = "http://www.beyondwinlaw.com/bigbang/"; //正式环境
const commonUrl = "http://www.beyondwinlaw.com/test/wx/"; //测试环境

//服务器地址
// const ServerURL = "http://www.beyondwinlaw.com/api/bigbang/index.php/"; //正式环境
const ServerURL = "http://www.beyondwinlaw.com/api/test/wx_api/index.php/"; //测试环境

//微信appId
const WX_APP_ID = "wx5d1c542f8dc2bef7"; //正式环境

/**
 * 发送post请求
 * @param url 请求路径
 * @param param 参数
 * @param successCallback 成功回调
 * @param failCallback 失败回调
 */
function sendPostRequest(url, param, successCallback, failCallback) {
    $.ajax({
        type: "post",
        url: ServerURL + url,
        dataType: "json",
        data: param,
        success: function(data) {
            if(data.status) {
                successCallback(data);
            }
            else {
                failCallback(data);
            }
        },
        error: function(data) {
            failCallback(data);
        }
    });
}

/**
 * 发送get请求
 * @param url 请求路径
 * @param param 参数
 * @param successCallback 成功回调
 * @param failCallback 失败回调
 */
function sendGetRequest(url, param, successCallback, failCallback) {
    $.ajax({
        type: "get",
        url: ServerURL + url,
        dataType: "json",
        data: param,
        success: function(data) {
            if(data.status) {
                successCallback(data);
            }
            else {
                failCallback(data);
            }
        },
        error: function(data) {
            failCallback(data);
        }
    });
}