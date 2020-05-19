get_url = url2get();
var sendFn = "POST";
var resultDb = {};
$(function() {
    addFn = new add_option;
    addFn.industry({});
    $(".area-2,.area-3").hide();
    addFn.area({}, "area-1");
    if (get_url.id) {
        get_guest = ajax_send({}, "/guest/" + get_url.id, "GET");
        sendFn = "PUT";
        if (!get_guest.result) { //
            alert("服务器繁忙");
            location.href = index_url + "/user /index.html";
        } else { resultDb = get_guest.result; }

        get_input_json = {
            "input": {
                "name": get_guest.result.name,
                "description": get_guest.result.description,
                "tel": get_guest.result.tel,
                "address": get_guest.result.address,
                "businessScope": get_guest.result.businessScope
            },
            "select": {
                "area": get_guest.result.area,
                "industry": get_guest.result.industry
            }
        };
        for (var x in get_input_json.input) {
            str = get_input_json.input[x];
            $("input[name=" + x + "]").val(str);
        };
        area_str = get_input_json.select.area;
        get_url_area1 = area_str.substr(0, 2);
        get_url_area2 = area_str.substr(0, 4);
        $("[name=area-1]").val(get_url_area1 + "0000");
        area_2();
        $("[name=area-2]").val(get_url_area2 + "00");
        $("[name=area-3]").val(area_str);
        $("[name=industry]").val(get_input_json.select.industry);
    }
})

function area_2() {
    area_1 = $("[name=area-1]").val();
    if (area_1 == 0) {
        $(".area-2,.area-3").hide();
        $("[name=area-2],[name=area-3]").html("");
        return;
    }
    addFn.area_son({}, "area-2", area_1);
    area_3();
    $(".area-2").show();
}

function area_3() {
    area_1 = $("[name=area-2]").val();
    get_industry = addFn.area_son({}, "area-3", area_1);
    $(".area-3").show();


}

function pic_check(pic) {
    obj = $(".PicChose");
    input = $("." + pic + " input");
    if (!input.val() | input.val() !== "") {
        obj.text("已选择").addClass('btn-success').removeClass("btn-primary").removeClass("btn-error");

    } else {
        obj.text("请选择图片").addClass('btn-error').removeClass("btn-primary").removeClass("btn-success");
    }
}
$("input[type=file]").change(function() {
    var objUrl = getObjectURL(this.files[0]);
    if (objUrl) {
        imgShow = $(this).parent().parent().find("img");
        imgShow.attr("src", objUrl);
        imgShow.width("100%");
    }
});

function post_guest() {
    $(".has-error").removeClass("has-error");
    post_name_obj = $("[name=name]");
    check = new text_check_new();
    post_name = check.user_nickname_check(post_name_obj);
    post_tel_obj = $("[name=tel]");
    post_tel = check.tel_check(post_tel_obj);
    post_industry = $("[name=industry]").val() == 0 ? false : $("[name=industry]").val();
    post_address_obj = $("[name=address]");
    post_address = check.address_check(post_address_obj);
    if (post_industry) {
        $(".industry .has-error").removeClass("has-error");
        $(".industry .text-danger").removeClass("text-danger").text("输入正确");
    } else {
        obj = $("[name=industry]");
        obj.parent().addClass("has-error");
        obj.parent().next(".error_text").addClass("text-danger").text("您没有选择行业");
    }

    post_area1 = $("[name=area-1]").val();
    post_area2 = $("[name=area-2]").val();
    post_area3 = $("[name=area-3]").val();
    post_area = post_area3 ? post_area3 : post_area2 ? post_area2 : post_area1;
    /*
    if (!post_area || post_area == null) {
    	$(".area .row").addClass("has-error");
    	$(".area .error_text").addClass("text-danger").text("请选择地区");
    } else {
    	$(".area .error_text").removeClass("text-danger").text("");
    }
    */
    if (!post_area || !post_name || !post_industry || !post_tel || !post_address) {
        return;
    }

    json = {
        "name": post_name,
        "area": post_area,
        "industry": post_industry,
        "tel": post_tel,
        "address": post_address,
    };
    if (sendFn == "PUT") {
        var temI = 0;
        for (x in json) {
            if (resultDb[x] == json[x]) continue;
            temI++;
        }
        if (!temI) location.href = index_url + "/user/add-2.html?id=" + get_url.id;

    }
    for (var x in json) {
        if (json[x] == "") {
            delete json[x];
        }
    }
    if (sendFn == "POST") {
        jsons = JSON.stringify(json);
        data = ajax_send(jsons, "/guest", "POST",1);
        if (data.code == 200) {
            location.href = index_url + "/user/add-2.html?id=" + data.result.id;
        }
    } else if (sendFn == "PUT") {
        json.id = get_url.id;
        jsons = JSON.stringify(json);
        data = ajax_send(jsons, "/guest", "PUT",1);
        if (data.code == 200) location.href = index_url + "/user/add-2.html?id=" + get_url.id;
        else alert("wrong");
    }
}
