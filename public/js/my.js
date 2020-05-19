function ajax_send(j, u, h, l) { //json,url,http
    url = basic_url + u;
    var redata;
    $.ajax({
        url: url,
        data: j,
        type: h,
        dataType: "json",
        async: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("token", $.cookie("token"));
            if (!l) { //
                xhr.setRequestHeader("Content-Type", "application/json");
            }
        }, //这里设置header
        success: function(data) {
            if (data.code == 403000) {
                location.href = index_url;
            }
            if (data.code != 200) {

                alert(data.message);
            }
            redata = data;

        }
    });

    return redata;
}
role = {
    "1000": "超级管理员",
    "1001": "管理员",
    "1002": "运营"
};

function GuestListCtrl($scope) {
    $scope.ReSearch = function(json) { //
        ReResult = ajax_send(json, "/user/search", "GET");
        result = ReResult;
    }
    $scope.ReSearch();
    console.log(result);
    if (result.code == 200) { //
        $scope.list = result.result.items;
    }
    this.role = role;
    $scope.show_all = function() {
        var json = {};
        json.name = $scope.search_name;
        json.code = $scope.search_code;
        json.page = 1;
        $scope.ReSearch(json);
    }
}
