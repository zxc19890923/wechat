app.directive("moneyDirective", function () {
    return {
        restrict: "AEC",
        scope: {
            money: "@"
        },
        link: function (scope, element, attrs) {
            if (scope.money > 10000) {
                scope.money = (scope.money / 10000).toFixed(1) + "万";
            }
        }
    }
});

app.directive("changedStatus", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            element.on("click", function() {
                $(".leftBar").find("a").removeClass("text-primary");
                element.addClass("text-primary");
            })
        }
    }
});