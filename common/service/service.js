/* ui-route 路由器, 文件上传依赖 ngFileUpload */
var app = angular.module("app", ['ui.router', "ui.bootstrap", "angular-md5"]);
/* 创建获取数据的服务factory模式, $q, deferd, resolve, reject, then使用 开始 */
app.factory("queryData", function ($http, $q) {
    var resultData = {};
    /* get方法获取数据 */
    resultData.getData = function (urlParams, params, state) {
        var deferred = $q.defer();
        /* get方法获取数据 */
        $http.get(url + urlParams, {params: params}, {cache: state}).success(function (data) {
            deferred.resolve(data);
        }).error(function (data, status) {
            deferred.reject(data);
            if(status == 401 || status == -1) {
                window.location.href="../index.html"
            }
            else {
                alert(status + " 错误");
            }
            return false;
        });
        return deferred.promise;
    };
    /* post方法获取数据 */
    resultData.postData = function (urlParams, data) {
        var deferred = $q.defer();
        /* post方法获取数据 */
        $http.post(url + urlParams, data).success(function (data) {
            deferred.resolve(data);
        }).error(function (data, status) {
            deferred.reject(data);
            if(status == 401 || status == -1) {
                window.location.href="../index.html"
            }
            else {
                alert(status + " 错误");
            }
            return false;
        });
        return deferred.promise;
    };
    return resultData;
});
/* 创建获取数据的服务 结束 */

/* 退出登录的服务 */
app.factory("loginOut", function ($http, queryData) {
    var loginOutResult = {};
    // 2. 退出删除session, 依赖自定义服务,获取数据
    loginOutResult.out = function () {
        queryData.getData("login/logout").then(function (data) {
            if (data.status == true) {
                sessionStorage.clear();
                window.location.href = "../login.html";
            }
            return data;
        })
    };
    return loginOutResult;
});
