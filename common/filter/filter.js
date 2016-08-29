app.filter("filterMoney", function() {
    return function(data) {
        if(data >= 10000) {
            data = (data/10000).toFixed(1) + "万";
        }
        else {
            if(data != "") {
                data = data + "元";
            }
            else {
                data = data + "";
            }
        }
        return data;
    }
});