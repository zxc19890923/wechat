// 定义app然后修改post请求后台数据问题
var loginApp = angular.module('loginApp', ['angular-md5'], function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});
loginApp.config(function ($httpProvider) {
    $httpProvider.defaults.transformRequest = function (data) {
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    }
});
// 定义控制器
loginApp.controller("loginCtrl", function ($scope, $http, md5) {
    // 初始化变量
    $scope.username = "";
    $scope.password = "";
    $scope.message = "";
    // 定义登陆提交函数
    $scope.submitLogin = function () {
        // 定义参数,这个是在登陆中使用ng-model绑定的变量
        var data = {username: $scope.username, pass: md5.createHash($scope.password)};
        $http.post(url + "login/login", data).success(function (data) {
            console.log(data);
            if (data.status == true) {
                $scope.message = data.data.message;
                sessionStorage.setItem("user_id", data.data.user_id);
                sessionStorage.setItem("name", data.data.name);
                sessionStorage.setItem("phone", data.data.phone);
                sessionStorage.setItem("sex", data.data.sex);
                sessionStorage.setItem("wx_headimgurl", data.data.wx_headimgurl);
                if (data.data.login_type == 0) {
                    window.location.href = "admin/index.html";
                }
                if (data.data.login_type == 1) {
                    window.location.href = "sales/index.html";
                }
                if(data.data.login_type == 9) {
                    alert("用户没有权限");
                }
            }
            else {
                $scope.message = data.message;
            }
        });
    };
    // 回车调用登陆事件
    document.onkeydown = function (e) {
        if (!e) e = window.event;//火狐中是 window.event
        if ((e.keyCode || e.which) == 13) {
            // 定义参数,这个是在登陆中使用ng-model绑定的变量
            var data = {username: $scope.username, pass: md5.createHash($scope.password)};
            console.log(data);
            $http.post(url + "login/login", data).success(function (data) {
                console.log(data);
                if (data.status == true) {
                    $scope.message = data.message;
                    sessionStorage.setItem("user_id", data.data.user_id);
                    sessionStorage.setItem("name", data.data.name);
                    sessionStorage.setItem("phone", data.data.phone);
                    sessionStorage.setItem("sex", data.data.sex);
                    sessionStorage.setItem("wx_headimgurl", data.data.wx_headimgurl);
                    if (data.data.login_type == 0) {
                        window.location.href = "admin/index.html";
                    }
                    if (data.data.login_type == 1) {
                        window.location.href = "sales/index.html";
                    }
                    if(data.data.login_type == 9) {
                        alert("用户没有权限");
                    }
                }
                else {
                    $scope.message = data.message;
                }
            });
        }
    };
});