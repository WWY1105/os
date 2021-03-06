﻿//var basic_url = "https://sharejoy.stage.ishangbin.com"; //ajax首页
//var index_url = "https://sharejoy.stage.ishangbin.com"; //登录界面即主页

// var basic_url = "http://192.168.0.10:90/os"; //ajax首页
// var index_url = "http://192.168.0.10:90"; //登录界面即主页
var basic_url = "", index_url = "";
var role = {
    "M": "超级管理员",
    "K": "管理员",
    "S": "运营"
}; //之后要修改
var role_type = {
    "M": {
        "K": role["K"],
        "S": role["S"]
    },
    "K": {
        "S": role["S"]
    }
};
var config = {};
var error_code = {
    '200': '成功',
    '400': '客户端错误',
    '500': '服务端错误',
    '201': '用户已经绑定过该类型的sns账号',
    '202': '该sns账号已经被别的用户绑定了',
    '403': '字典项已经存在',
    '402': '字典名称已经存在',
    '404': '字典项code已经存在',
    '401': '字典助记符已经存在',
    '405': '没有查询到',
    '4500': '数据非法',
    '4544': '缺少必需参数',
    '4545': '不支持该请求方式',
    '4546': '不支持该类型的content-type',
    '4200': '未关注',
    '4201': '重复关注',
    '4211': ' 会员不存在',
    '4212': ' 已经是会员身份',
    '4220': ' 非法卡',
    '4221': ' 卡已被绑定',
    '4222': ' 卡已被注销',
    '4223': ' 卡不存在',
    '4224': ' 卡未激活',
    '4225': ' 卡已被停用',
    '4226': ' 卡已被锁定',
    '4230': ' 积分已被锁定',
    '4240': ' 与预留信息不一致',
    '4101': ' 用户名与密码不匹配',
    '4102': ' 旧密码不匹配',
    '4103': ' 账号已被占用',
    '4104': ' 账号已被修改',
    '4105': ' 手机号被占用',
    '4106': ' 手机号不存在',
    '4107': ' 手机号码不匹配',
    '4121': ' 验证码不匹配',
    '4122': ' 验证码已过期',
    '4130': ' 用户未登录',
    '4131': ' 用户被锁定',
    '4132': ' 非法用户',
    '4133': ' 用户权限不足',
    '4140': ' 非法Token',
    '4141': ' Token超时'
};
var $lt = {};
$(function () {
    var role = ajax_send({}, "/user", "GET");
    config.role = role.result;

    $("header").load("/header.html", function () {
        $(".header_user_name").text(role.result.nickname);
    }); // 导航引入
    $(".left_menu").load("/left_menu.html", function () {
        //M:超级管理员；K：管理员；S:运营，只能看到客户
        if (role.result.type == "S") {
            $(".nav-stacked li").hide();
            $(".user_index").show();
            $(".deal_index").show();
        }
        if (role.result.type == "K") {
            $(".nav-stacked li").hide();
            $(".user_index,.zone_index,.customer_index,.material_index").show();
        }
    }); // 左侧引入
    loading_css(); //导入页面及左侧的CSS内容

});

function ajax_send(j, u, h, l) { //json,url,http
    var url = basic_url + u;
    var data = {};
    var redata;
    delete j.timestamp;
    if (h == "GET") {
        data = objSort(j);
    } else {
        url += "?" + sortUrl();
        if (h == "POST" || h == "PUT") {
            l = 1;
            data = typeof(j) == "object" ? j : JSON.stringify(j);

        }
        data = typeof(j) == "object" ? JSON.stringify(j) : j;
    }

    $.ajax({
        url: url,
        data: data,
        type: h,
        dataType: "json",
        async: false,
        beforeSend: function (xhr) {
            if (l) { //
                xhr.setRequestHeader("Content-Type", "application/json");
            }
        }, //这里设置header
        success: function (data) {
            if (data.code == 403000||data.code == 403) {
                location.href = location.origin;
                return;
            }
            redata = data;
        }
    });
    return redata;
}

function search_result(j, u, h) {
    //json,url,http,type,type为需要显示的数据模式，如USER,等
    var page_data = ajax_send(j, u, h);
    this.total = (page_data.result && page_data.result.total) || 0;
    this.items = (page_data.result && page_data.result.items) || [];
    var json = j;
    this.page_data = page_data;
    this.guest_show = function () {
        page = (this.page_data.result && this.page_data.result.page) || 1;
        $(".result td").parent().remove();
        if (this.total == 0) {
            append_tem("guest");
            return;
        }
        for (var i in this.items) {
            append = new return_append(this.items[i]);
            append_text = append.guest_append();
            $(".result").append(append_text);
        }
        this.page_add("guest");
        table_id();
        button = new button_click();
        button.guest_click();
    }
    this.key_show = function () {
        page = (this.page_data.result && this.page_data.result.page) || 1;
        $(".result td").parent().remove();
        if (this.total == 0) {
            append_tem("guest");
            return;
        }
        for (var i in this.items) {
            append = new return_append(this.items[i]);
            append_text = append.key_append();
            $(".result").append(append_text);
        }
        this.page_add("guest");
        table_id();
        button = new button_click();
        button.guest_click();
    }
    this.user_show = function () {
        if (this.page_data.result) {
            page = this.page_data.result.page;
        }
        ;

        $(".result td").parent().remove();
        if (!this.items || this.items.length == 0) {
            append_tem("user");
            return;
        }
        for (var i in this.items) {
            append = new return_append(this.items[i]);
            append_text = append.user_append();
            $(".result").append(append_text);
        }
        this.page_add("user");
        button = new button_click();
        button.user_click();
    }
    this.game_show = function () {
        if (this.page_data.result) {
            page = this.page_data.result.page;
        }

        $(".result td").parent().remove();
        if (!this.items || this.items.length == 0) {
            append_tem("game");
            return;
        }
        for (var i in this.items) {
            append = new return_append(this.items[i]);
            append_text = append.game_append();
            $(".result").append(append_text);
        }
        this.page_add("game");
        button = new button_click();
        button.game_click();
    };
    this.material_show = function () {
        if (this.page_data.result) {
            page = this.page_data.result.page;
        }
        $(".result td").parent().remove();
        if (!this.items || this.items.length == 0) {
            append_tem("dict");
            return;
        }
        for (var i in this.items) {
            append = new return_append(this.items[i]);
            append_text = append.material_append();
            $(".result").append(append_text);
        }
        this.page_add("material");
        button = new button_click();
        button.material_click();

    };
    this.sms_show = function () {
        if (this.page_data.result) {
            page = this.page_data.result.page;
        }
        $(".result td").parent().remove();
        if (!this.items || this.items.length == 0) {
            append_tem("author");
            return;
        }
        for (var i in this.items) {
            append = new return_append(this.items[i]);
            append_text = append.sms_append();
            $(".result").append(append_text);
        }
        this.page_add("sms");
    };
    this.author_show = function () {
        //if (this.page_data.result) {
        //    page = this.page_data.result.page;
        //}

        button = new button_click();
        button.author_click();
        $(".result td").parent().remove();
        if (!this || this.length == 0) {
            append_tem("author");
            return;
        }
        for (var i in this.page_data.result) {
            append = new return_append(this.page_data.result[i]);
            append_text = append.author_append();
            $(".result").append(append_text);
        }
    }
    this.customer_show = function () {
        if (this.page_data.result) {
            page = this.page_data.result.page;
        }
        $(".result td").parent().remove();
        if (!this.items || this.items.length == 0) {
            append_tem("customer");
            return;
        }
        for (var i in this.items) {
            append = new return_append(this.items[i]);
            append_text = append.customer_append();
            $(".result").append(append_text);
        }
        this.page_add("customer");
        button = new button_click();
        button.customer_click();
        table_id();

    }
    this.dict_show = function () {
        this.items = this.page_data.result.items;
        $(".result td").parent().remove();
        if (!this.items || this.items.length == 0) {
            append_tem("dict");
            return;
        }
        for (var i in this.items) {
            append = new return_append(this.items[i]);
            append_text = append.dict_append();
            $(".result").append(append_text);
        }
        this.page_add("dict");
        button = new button_click();
        button.dict_click();
        table_id();
    }
    this.shop_show = function () {
        this.items = this.page_data.result;
        if (!this.items || this.items.length == 0) {
            append_tem("shop");
            return;
        }
        for (var i in this.items) {
            append = new return_append(this.items[i]);
            append_text = append.shop_append();
            $(".result").append(append_text);
        }
        button = new button_click();
        button.shop_click();
        table_id();
    };
    this.shop1_show = function (t) {
        this.items = this.page_data.result;
        if (!this.items || this.items.length == 0) {
            append_tem("shop");
            return;
        }
        function ltShowFn(a) {
            var state = {
                1001: "创建中",
                1002: "认证审核中",
                1003: "已认证",
                1004: "关闭审核",
                1005: "关闭"
            }
            var self = $("[lt-repeat]");
            if(!a) return ;
            for (var i = 0, j = a.length; i < j; i++) {
                var clonedNode = self.clone(true); // 克隆节点
                clonedNode.removeAttr("lt-repeat");
                var id = a[i].id;
                a[i].$index = i + 1;
                guets = a[i];
                clonedNode.children("[lt-model]").each(function (index) {
                    $(this).text(eval($(this).attr("lt-model")) || "暂无");
                });
                if (guets.state != 1002 && guets.state != 1003 && guets.state != 1004) {
                    clonedNode.find(".zone").parent().html("");
                } else if (guets.state == 1002) {
                    clonedNode.find("#update").hide();
                    clonedNode.find("#closestore").hide();
                }  else if (guets.state == 1004) {
                    clonedNode.find("#update").hide();
                    clonedNode.find("#check").hide();
                    clonedNode.find("#cash").hide();
                } else {
                    clonedNode.find("#check").hide();
                    clonedNode.find("#closestore").hide();
    
                }
                clonedNode.find("[click]").click(function () {
                    basicFn = $(this).attr("click");
                    indexId = $(this).parents(".show-modle").index();
                    ltFn(indexId, basicFn);
                });
                self.parent().append(clonedNode); // 在父节点插入克隆的节点
            }
            self.remove();
        }
        // var items = this.items;
        if(json.page) {
            console.log(111);
            // console.log(data.result.items);
            // console.log(this.items.items);
            data.result.items = this.items.items
            $('.show-modle').remove();
            var str = `
            <tr class="show-modle" lt-repeat>
                <td lt-model="guets.$index"></td>
                <td lt-model="guets.name"></td>
                <td lt-model="guets.address"></td>
                <td lt-model="guets.cashier"></td>
                <td lt-model="guets.cashierId"></td>
                <td lt-model="state[guets.state]"></td>
                <td>
                <a class="click zone" id="check" click="zone()"> <i class="glyphicon glyphicon-ok"></i> 审核
                </a>
                <a class="click zone" id="update" click="zone()"> <i class="glyphicon glyphicon-ok"></i> 修改
                </a><br>
                <a class="click" id="cash" click="cash()"> <i class="glyphicon glyphicon-ok"></i> 绑定收银系统门店
                </a><br>
                <a class="click" id="closestore" click="closestore()"> <i class="glyphicon glyphicon-ok"></i> 关闭门店
                </a>
                </td>
            </tr>
            `;
            $('.table').append(str)
            ltShowFn(this.items.items);
            // console.log(this.items.items);
        }
        // for (var i in this.items) {
        //     append = new return_append(this.items[i]);
        //     append_text = append.shop1_append();
        //     $(".result").append(append_text);
        // }
        this.page_add("shop");
    };
    this.dict_son_show = function () {
        if (this.page_data.result) {
            page = this.page_data.result.page;
        }
        this.items = this.page_data.result ? this.page_data.result.items : [];

        $(".result td").parent().remove();
        if (!this.items || this.items.length == 0) {
            append_tem("dict_son");
            return;
        }
        for (var i in this.items) {
            append = new return_append(this.items[i]);
            append_text = append.dict_son_append();
            $(".result").append(append_text);
        }
        button = new button_click();
        this.page_add("dict_son");
        button.dict_son_click();
        table_id();
    }
    this.page_add = function (t) { //添加页码,t为数据内容
        j = this.page_data.result;
        $(".pagesize").text("搜索结果共计" + j.total + "条");
        $(".page").html("");
        pre = "<li class='page_pre'><a class='click'>&laquo;</a></li>";
        next = "<li class='page_next'><a class='click'>&raquo;</a></li>";
        pre2 = "";
        next2 = "";
        if (j.pageSize < 2) {
            return;
        } else if (j.pageSize < 11) {
            start_page = 1;
            end_page = j.pageSize + 1;
            pre = pre2;
            next = next2;
            num = j.pageSize;
        } else if (j.pageSize > 10) {
            if (j.page < 6) {
                start_page = 1;
                pre = pre2;
            } else if (j.page > 5) {
                if (j.pageSize - j.page < 10) {
                    next = next2;
                    start_page = j.pageSize - 9;
                } else {
                    start_page = j.page - 5;
                }
            }
            end_page = start_page + 10;
        }
        $(".page").append(pre);
        for (var i = start_page; i < end_page; i++) {
            $(".page").append("<li class='page_id_" + i + "'><a class='click'>" + i + "</a></li>");
        }
        $(".page" + " .page_id_" + j.page).addClass("active");
        $(".page").append(next);
        delete j;
        $(".page").off().on("click", "a", function () {
            c = $(this).parent().attr("class");
            if (c == "page_pre") {
                p = page - 1;
            } else if (c == "page_next") {
                p = page + 1;
            } else if (c == "disabled") {
                return false;
            } else {
                cs = c.split("page_id_");
                p = cs[1];
            }
            json.page = p;
            page_data2 = new search_result(json, u, h);
            switch (t) {
                case "user":
                    page_data2.user_show();
                    break;
                case "dict":
                    page_data2.dict_show();
                    break;
                case "guest":
                    page_data2.guest_show();
                    break;
                case "game":
                    page_data2.game_show();
                    break;
                case "customer":
                    page_data2.customer_show();
                    break;
                case "sms":
                    page_data2.sms_show();
                    break;
                case "dict_son":
                    page_data2.dict_son_show();
                    break;
                case "material":
                    page_data2.material_show();
                    break;
                case "shop":
                    page_data2.shop1_show();
                    break;
               
            }
        })
    }
}

function button_click() { //弹出窗口
    $(".result").off();
    this.user_click = function () {
        $(".result").on("click", ".resetpassword", function () { //重置密码
            id = $(this).attr("data-id");
            $("#dialog_password_edit input[name=password]").val("");
            data = ajax_send({}, "/user/" + id, "GET");
            $("#dialog_password_edit .reset_paassword_nickname").text(data.result.nickname);
            $("#dialog_password_edit .reset_paassword_name").text(data.result.name);
            dict_code = new text_clear("user_passord").show();
            $("#dialog_password_edit").off().on("click", ".submit", function () {
                obj = $("#dialog_password_edit input[name=password]");
                password = obj.val();
                check = new text_check(password);
                check_result = check.pw_check();
                if (check_result.code == 400) {
                    check.text_error(obj, 1);
                    return;
                }
                data = ajax_send({password: hex_md5(password)}, "/user/password/" + id, "PUT");
                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("修改成功");
                $("#dialog_password_edit").modal("hide");
            });
            $("#dialog_password_edit").modal();

        })
        $(".result").on("click", ".edit", function () { //修改信息
            id = $(this).attr("data-id");
            data = ajax_send({}, "/user/" + id, "GET");
            if (data.code != 200) {
                alert(data.message);
                return;
            }
            $("#dialog_user_edit input[name=nickname]").val(data.result.nickname);
            $("#dialog_user_edit .edit_user_name").text(data.result.name);

            $("#dialog_user_edit").off().on("click", ".submit", function () {
                obj = $("#dialog_user_edit input[name=nickname]");
                type = $("#dialog_user_edit select[name=type]").val();

                nickname = obj.val();
                check = new text_check(nickname);
                check_result = check.nk_check();
                if (check_result.code == 400) {
                    check.text_error(obj);
                    return;
                }
                data = ajax_send({}, "/user/" + id + "?nickname=" + nickname + "&type=" + type, "PUT");
                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("修改成功");
                data2 = ajax_send({}, "/user/" + id, "GET");
                move_text = new return_append(data2.result);
                edit_move_text = move_text.user_append(1);
                $("#result_id_" + id).html(edit_move_text);
                $("#dialog_user_edit").modal("hide");
            });
            $("#dialog_user_edit").modal();

        })
        $(".result").on("click", ".del", function () { //删除用户
            if (confirm("删除将不可恢复，请慎重！")) {
                id = $(this).attr("data-id");
                data = ajax_send({}, "/user/" + id, "DELETE");

                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("成功删除");
                $("#result_id_" + id).remove();
            }

        })
    }
    this.game_click = function () {
        $(".result").on("click", ".resetpassword", function () { //重置密码
            id = $(this).attr("data-id");
            $("#dialog_password_edit input[name=password]").val("");
            data = ajax_send({}, "/user/" + id, "GET");
            $("#dialog_password_edit .reset_paassword_nickname").text(data.result.nickname);
            $("#dialog_password_edit .reset_paassword_name").text(data.result.name);
            dict_code = new text_clear("user_passord").show();
            $("#dialog_password_edit").off().on("click", ".submit", function () {
                obj = $("#dialog_password_edit input[name=password]");
                password = obj.val();
                check = new text_check(password);
                check_result = check.pw_check();
                if (check_result.code == 400) {
                    check.text_error(obj, 1);
                    return;
                }
                data = ajax_send({password: hex_md5(password)}, "/user/password/" + id, "PUT");
                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("修改成功");
                $("#dialog_password_edit").modal("hide");
            });
            $("#dialog_password_edit").modal();

        })
        $(".result").on("click", ".on", function () { //修改信息
            id = $(this).attr("data-id");
            data = ajax_send("", "/game/" + id + "/off", "POST");
            if (data.code != 200) {
                alert(data.message);
                return;
            } else {
                $(this).addClass("off").removeClass("on").text("上线");
            }
            //$("#dialog_user_edit input[name=nickname]").val(data.result.nickname);
            //$("#dialog_user_edit .edit_user_name").text(data.result.name);
            //
            //$("#dialog_user_edit").off().on("click", ".submit", function () {
            //    obj = $("#dialog_user_edit input[name=nickname]");
            //    type = $("#dialog_user_edit select[name=type]").val();
            //
            //    nickname = obj.val();
            //    check = new text_check(nickname);
            //    check_result = check.nk_check();
            //    if (check_result.code == 400) {
            //        check.text_error(obj);
            //        return;
            //    }
            //    data = ajax_send("", "/user/" + id + "?nickname=" + nickname + "&type=" + type, "PUT");
            //    if (data.code != 200) {
            //        alert(data.message);
            //        return;
            //    }
            //    alert("修改成功");
            //    data2 = ajax_send("", "/user/" + id, "GET");
            //    move_text = new return_append(data2.result);
            //    edit_move_text = move_text.user_append(1);
            //    $("#result_id_" + id).html(edit_move_text);
            //    $("#dialog_user_edit").modal("hide");
            //});
            //$("#dialog_user_edit").modal();

        })
        $(".result").on("click", ".off", function () { //修改信息
            id = $(this).attr("data-id");
            data = ajax_send("", "/game/" + id + "/on", "POST");
            if (data.code != 200) {
                alert(data.message);
                return;
            } else {
                $(this).addClass("on").removeClass("off").text("下线");
            }
            //$("#dialog_user_edit input[name=nickname]").val(data.result.nickname);
            //$("#dialog_user_edit .edit_user_name").text(data.result.name);
            //
            //$("#dialog_user_edit").off().on("click", ".submit", function () {
            //    obj = $("#dialog_user_edit input[name=nickname]");
            //    type = $("#dialog_user_edit select[name=type]").val();
            //
            //    nickname = obj.val();
            //    check = new text_check(nickname);
            //    check_result = check.nk_check();
            //    if (check_result.code == 400) {
            //        check.text_error(obj);
            //        return;
            //    }
            //    data = ajax_send("", "/user/" + id + "?nickname=" + nickname + "&type=" + type, "PUT");
            //    if (data.code != 200) {
            //        alert(data.message);
            //        return;
            //    }
            //    alert("修改成功");
            //    data2 = ajax_send("", "/user/" + id, "GET");
            //    move_text = new return_append(data2.result);
            //    edit_move_text = move_text.user_append(1);
            //    $("#result_id_" + id).html(edit_move_text);
            //    $("#dialog_user_edit").modal("hide");
            //});
            //$("#dialog_user_edit").modal();

        })
        $(".result").on("click", ".del", function () { //删除用户
            if (confirm("删除将不可恢复，请慎重！")) {
                id = $(this).attr("data-id");
                data = ajax_send("", "/game/" + id, "DELETE");

                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("成功删除");
                $("#result_id_" + id).remove();
            }
        })
    }
    this.author_click = function () {
        var get_url = url2get();
        //添加授权
        $(".results").on("click", ".add", function () { //重置密码
            id = $(this).attr("data-id");
            //$("#dialog_author input[name=author_id[]]").val("");
            data = ajax_send({}, "/game/online", "GET");
            if (data.code == 200) {
                $(".form-group").html("");
                for (var i = 0; i < data.result.length; i++) {
                    $(".form-group").append("<input name='author_id[]' type='checkbox' value='" + data.result[i].id + "'/>" + data.result[i].name);
                }
            } else {
                alert("请先添加游戏地址");
                return;
            }
            $("#dialog_author").off().on("click", ".submit", function () {
                var re = new Array();
                $(".form-group input[name='author_id[]']").each(function () {
                    if ($(this).prop('checked') == true) re.push($(this).val());
                });

                if (re.length > 0) {
                    //res = re.join(",");
                    data = ajax_send({ids: re}, "/guest/" + get_url.id + "/game/auth", "POST");
                    if (data.code == 200) {
                        alert("添加成功");
                        location.reload();
                    } else {
                        alert(data.message);
                    }
                }
                $("#dialog_author").modal("hide");
            });
            $("#dialog_author").modal();
        })
        //取消授权
        $(".result").on("click", ".cancel", function () { //修改信息
            if (confirm("确定取消授权吗！")) {
                id = $(this).attr("data-id");
                data = ajax_send("", "/guest/" + get_url.id + "/game/" + id, "DELETE");
                if (data.code != 200) {
                    alert(data.message);
                    return;
                } else {
                    $(this).parent().parent().remove();
                }
            }
        });
        $(".result").on("click", ".del", function () { //删除用户
            if (confirm("删除将不可恢复，请慎重！")) {
                id = $(this).attr("data-id");
                data = ajax_send("", "/game/" + id, "DELETE");

                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("成功删除");
                $("#result_id_" + id).remove();
            }
        })
    };
    this.material_click = function () {
        var get_url = url2get();
        $(".result").on("click", ".del", function () { //删除用户
            if (confirm("删除将不可恢复，请慎重！")) {
                id = $(this).attr("data-id");
                data = ajax_send("", "/materials/" + id, "DELETE");
                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("成功删除");
                $(this).parent().parent().remove();
            }
        })
    }
    this.dict_click = function () {
        $(".result").on("click", ".edit", function () { //修改信息
            id = $(this).attr("data-id");
            data = ajax_send({}, "/dict/" + id, "GET");

            if (data.code != 200) {
                alert(data.message);
                return;
            }
            $("#dialog_edit .reset_mnemonic").addClass("form-control-static").html(data.result.mnemonic);
            $("#dialog_edit input[name=reset_name]").val(data.result.name);
            $("#dialog_edit [name=reset_remark]").val(data.result.remark);

            $("#dialog_edit").off().on("click", ".submit", function () {
                var name = $("#dialog_edit input[name=reset_name]").val();
                remark = $("#dialog_edit [name=reset_remark]").val();
                json = {
                    "name": name,
                    "remark": remark
                };
                jsons = JSON.stringify(json);
                data = ajax_send(jsons, "/dict/" + id, "PUT");
                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("修改成功");
                data2 = ajax_send({}, "/dict/" + id, "GET");
                move_text = new return_append(data2.result);
                edit_move_text = move_text.dict_append(1);
                $("#result_id_" + id).html(edit_move_text);
                table_id();
                $("#dialog_edit").modal("hide");

            });
            $("#dialog_edit").modal();

        })

        $(".result").on("click", ".del", function () { //删除用户
            if (confirm("删除将不可恢复，请慎重！")) {
                id = $(this).attr("data-id");
                data = ajax_send({}, "/dict/" + id, "DELETE");
                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("成功删除");
                $("#result_id_" + id).remove();
            }

        })
    }
    this.dict_son_click = function () {
        $(".result").on("click", ".del", function () { //删除用户
            if (confirm("删除将不可恢复，请慎重！")) {
                id = $(this).attr("data-id");
                data = ajax_send({}, "/dict/item/" + id, "DELETE");
                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("成功删除");
                $("#result_id_" + id).remove();
            }

        })
        $(".result").on("click", ".edit", function () {
            id = $(this).attr("data-id");
            data = ajax_send({}, "/dict/item/" + id, "GET");
            $("#dialog_edit *[name=code]").val(data.result.code).attr("disabled", "disabled");
            $("#dialog_edit *[name=remark]").val(data.result.remark);
            $("#dialog_edit *[name=text]").val(data.result.text);
            dict_code = new text_clear("dict_code").show();
            dict_text = new text_clear("dict_text").show();
            $("#dialog_edit").off().on("click", ".submit", function () {
                obj_text = $("#dialog_edit input[name=text]");
                check_new = new text_check_new();
                text = check_new.dict_text_check(obj_text);
                if (!text) {
                    return;
                }
                remark = $("#dialog_edit [name=remark]").val();
                json = {
                    "remark": remark,
                    "text": text
                };
                jsons = JSON.stringify(json);
                data3 = ajax_send(jsons, "/dict/item/" + data.result.id, "PUT");
                if (data3.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("修改成功");
                $("#result_id_" + data.result.id + " .result_text").text(text);
                $("#result_id_" + data.result.id + " .result_remark").text(remark);
                $("#dialog_edit").modal("hide");

            });
            $("#dialog_edit").modal();
        });
    }
    this.guest_click = function () {
        $(".result ").on('click', '.on,.off', function () {
            if (!$(this).hasClass("active")) { //
                post_id = $(this).parents("tr").attr("id");
                post_id = post_id.replace(/[ ]/g, "");
                input_val = $(this).find("input").val();
                //jsonStr = {
                //    1001: "OPENED",
                //    1002: "CLOSED"
                //};
                json = {
                    "state": input_val
                };
                post_result = ajax_send(json, "/guest/" + post_id + "/state", "POST", 1);
                if (post_result.code && post_result.code != 200) {
                    return false;
                }
            }
        });

    }
    this.remove = function () {
        $(this).remove();
    }
    this.shop_click = function () {
        $(".result").on("click", ".zone", function () { //修改信息
            id = $(this).attr("data-id");
            data = ajax_send({}, "/shop/" + id, "GET");
            if (data.code != 200) {
                alert(data.message);
                return;
            }
            $("#dialog_edit .edit_address").text(data.result.area + data.result.address);
            var temArray = ["avgprice", "name", "openingDay", "style", "tel"];
            for (var i = 0, j = temArray.length; i < j; i++) {
                $("#dialog_edit .edit_" + temArray[i]).text(data.result[temArray[i]]);
                console.log(temArray[i])
            }
            $("#dialog_edit").off().on("click", ".zone", function () {

            });
            $("#dialog_edit").modal();

        })

        $(".result").on("click", ".del", function () { //删除用户
            if (confirm("删除将不可恢复，请慎重！")) {
                id = $(this).attr("data-id");
                data = ajax_send({}, "/dict/" + id, "DELETE");
                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("成功删除");
                $("#result_id_" + id).remove();
            }
        })
    }
    this.customer_click = function () {
        $(".result").on("click", ".del", function () { //删除用户
            if (confirm("删除将不可恢复，请慎重！")) {
                id = $(this).attr("data-id");
                data = ajax_send({}, "/customers/" + id, "DELETE");
                if (data.code != 200) {
                    alert(data.message);
                    return;
                }
                alert("成功删除");
                $("#result_id_" + id).remove();
                search_customer()
            }

        })
    }
}

function logout() {
    data = ajax_send({}, "/user/logout", "POST");
    if (data.code == 200) {
        $.cookie("token", null, {
            path: '/'
        });
        alert("退出成功");
    }
    location.href = index_url;
}

function table_id() {
    $(".result tr").each(function () {
        row = $(this).closest("tr").index();
        if (row > 0) {
            dd = $(".result tr:eq(" + row + ")").children(":first").text(row);
        }
    });
}

function check_all() { //全选按钮
    ss = $(".result input");
    text = $(".check_all").text();
    a = "全选";
    b = "取消";
    if (text == a) {
        ss.attr("checked", true);
        $(".check_all").text(b);
    } else if (text == "取消") {
        ss.attr("checked", false);
        $(".check_all").text(a);
    }
}

function loading_css() {
    if ($.cookie("token") == null || !$.cookie("token")) {
        location.href = index_url;
    }
    $.each($("a"), function (i, link) {
        if (!link.href) {
            return;
        }
        host_tem = location.host;
        if (link.href.indexOf(host_tem)) {
            link_tem = link.href.split(host_tem);
            link.href = index_url + link_tem[1];
            console.log(link.href);
        } else {
            link.href = index_url + link.href;
        }
    })
}

function text_check(str, text) { //将被废弃
    this.str = str;
    this.btext = "输入正确"; //原始提示
    this.user_check = function () {
        text1 = "长度需在6位以上"; //原始提示
        text2 = "长度需在16位以内"; //原始提示
        text3 = "必须为字母开头,不能含有特殊字符"; //原始提示
        if (str.length > 16) text3 = text2;
        else if (str.length < 6) text3 = text1;
        var re = /^[a-zA-z]{1}[a-zA-Z0-9\S]{5,15}$/;
        var result = this.check_result(re);
        return result;
    }
    this.pw_check = function () {
        text1 = "长度需在8位以上"; //原始提示
        text2 = "长度需在20位以内"; //原始提示
        text3 = "不允许出现空格"; //原始提示
        if (str.length > 20) {
            text3 = text2;
        }
        if (str.length < 8) {
            text3 = text1;
        }
        /*验证密码
         @长度为8-20
         @不可为中文*/
        re = /^\w{8,20}/;
        result = this.check_result(re);
        return result;
    }
    this.nk_check = function () {
        text1 = "长度需在6位以上"; //原始提示
        text2 = "长度需在20位以内"; //原始提示
        text3 = "不允许出现空格"; //原始提示
        /*验证昵称
         @长度为8-20
         @不限制*/
        if (str.length > 20) {
            text3 = text2;
        }
        if (str.length < 2) {
            text3 = text1;
        }
        re = /^[\u4e00-\u9fa5\w\S]{2,20}$/;
        result = this.check_result(re);
        return result;
    }
    this.dict_name_check = function () {
        text1 = "长度需在2位以上"; //原始提示
        text2 = "长度需在10位以内"; //原始提示
        text3 = "只允许中文"; //原始提示
        /*验证昵称
         @长度为8-20
         @不限制*/
        if (str.length > 10) {
            text3 = text2;
        }
        if (str.length < 2) {
            text3 = text1;
        }
        re = /^[\u4e00-\u9fa5]{2,10}$/;
        result = this.check_result(re);
        return result;
    }
    this.dict_mnemonic_check = function () {

        text1 = "长度需在2位以上"; //原始提示
        text2 = "长度需在20位以内"; //原始提示
        text3 = "只允许字母和下划线"; //原始提示
        /*验证昵称
         @长度为8-20
         @不限制*/
        if (str.length > 20) {
            text3 = text2;
        }
        if (str.length < 2) {
            text3 = text1;
        }
        re = /^\w{2,20}$/;
        result = this.check_result(re);
        return result;
    }
    this.dict_code_check = function () {
        text1 = "1-8位数字"; //原始提示
        text2 = "长度需在1-8位之间"; //原始提示
        text3 = "只允许数字"; //原始提示
        /*验证昵称
         @长度为8-20
         @不限制*/
        if (str.length > 10 || str.length < 2) {
            text3 = text2;
        }
        re = /^[0-9]{2,10}$/;
        result = this.check_result(re);
        return result;
    }
    this.dict_text_check = function () {

        text1 = "1-20位字母数字或汉字"; //原始提示
        text2 = "长度需在1-20位之间"; //原始提示
        text3 = "不允许出现特殊字符"; //原始提示
        /*验证昵称
         @长度为8-20
         @不限制*/
        if (str.length > 20 || str.length < 2) {
            text3 = text2;
        }
        re = /^[\u4e00-\u9fa5\w]{1,20}$/;
        result = this.check_result(re);
        return result;
    }
    this.dict_licenceNo_check = function () {

        text1 = "1-30英文或数字，不允许空格"; //原始提示
        text2 = "长度需在1-30位之间"; //原始提示
        text3 = "30英文或数字，不允许空格"; //原始提示
        /*验证昵称
         @长度为8-20
         @不限制*/
        if (str.length > 30 || str.length < 2) {
            text3 = text2;
        }
        re = /^[0-9a-zA-Z-]{1,30}$/;
        result = this.check_result(re);
        return result;
    }

    this.check_result = function (re) {
        if (re.test(str)) {
            result = {
                "code": 200,
                "result": this.btext
            };
        } else {
            result = {
                "code": 400,
                "result": text3
            };
        }
        return result;

    }
    this.text_error = function (obj, t) {
        if (t == 1) {
            obj = obj.parent();
        }
        obj.parent().addClass("has-error");
        obj.parent().next(".error_text").addClass("text-danger").text(text3);
    }
}

function url2get() {
    try {
        var d = new Array();
        a = window.location.search;
        b = a.split("?");
        c = b[1].split("&");
        for (i = 0; i < c.length; i++) {
            j = c[i].split("=");
            d[j[0]] = j[1];
        }
        return d;
    } catch (e) {
        return false;
    }
}

function append_tem(t) {
    var r;
    switch (t) {
        case "dict_son":
            r = 7;
            break;
        case "dict":
            r = 5;
            break;
        case "user":
            r = 5;
            break;
        case "guest":
            r = 8;
            break;
        case "game":
            r = 10;
            break;
        case "author":
            r = 3;
            break;
        case "customer":
            r = 7;
            break;
    }
    $(".result").append("<tr><td class='error' colspan=" + r + ">抱歉没有查询结果</td></tr>");
}

function text_check_new() { //新版检测，传入为json
    btext = "输入正确";
    this.user_name_check = function (obj) { //用户名
        str = obj.val();
        if (!str) { //
            str = "";
        }
        text2 = "长度需在6-16位之间"; //原始提示
        text3 = "首位必须为字母"; //原始提示
        if (str.length > 16 || str.length < 6) {
            text3 = text2;
        }

        var re = /^[a-zA-z]{1}[a-zA-Z0-9]{5,15}$/;
        result = this.check_result(str, re);
        if (result.code == 400) {
            this.text_error(obj);
            return false;
        }
        this.obj = obj;
        return this.right(str);
    }

    this.user_password_check = function (obj) {
        str = obj.val();
        text2 = "长度需在8-20位之间"; //原始提示
        text3 = "不允许出现空格"; //原始提示
        if (str.length > 20 || str.length < 8) {
            text3 = text2;
        }
        var re = /^\w{8,20}/;
        result = this.check_result(str, re);
        if (result.code == 400) {
            this.text_error(obj, 1);
            return false;
        }
        this.obj = obj;
        return this.right(str);
    }
    this.user_password_check2 = function (obj, cla) { //多密码判断
        str = obj.val();
        text2 = "长度需在8-20位之间"; //原始提示
        text3 = "不允许出现空格"; //原始提示
        if (str.length > 20 || str.length < 8) {
            text3 = text2;
        }
        var re = /^\w{8,20}/;
        result = this.check_result(str, re);
        if (result.code == 400) {
            this.text_error(obj, 1);
            return false;
        }
        this.obj = obj;
        return this.right(str);
    }
    this.telphone_check = function (obj) {
        str = obj.val();
        text3 = "联系方式错误"; //原始提示
        var re = /^0[1-9]{2,3}-?[2-9][0-9]{6,7}(-?[0-9]{1,4})?|1[0-9]{10}$/;
        result = this.check_result(str, re);
        console.log(result);
        if (result.code == 400) {
            this.text_error(obj);
            return false;
        }
        this.obj = obj;
        return this.right(str);
    }
    this.phone_check = function (obj) {
        str = obj.val();
        text3 = "固定电话号码错误"; //原始提示
        var re = /^1\d{10}$/;
        result = this.check_result(str, re);
        console.log(result);
        if (result.code == 400) {
            this.text_error(obj);
            return false;
        }
        this.obj = obj;
        return this.right(str);
    }
    this.tel_check = function (obj) {
        str = obj.val();
        text3 = "固定电话号码错误"; //原始提示
        var re = /^0[1-9]{2,3}-?[2-9][0-9]{6,7}(-?[0-9]{1,4})?$/;
        result = this.check_result(str, re);
        console.log(result);
        if (result.code == 400) {
            this.text_error(obj);
            return false;
        }
        this.obj = obj;
        return this.right(str);
    }
    this.address_check = function (obj) {
        str = obj.val();
        text2 = "地址不能为空或全部为空格";
        text3 = "地址不能超过200位字符";
        replace = str.replace(/[ ]/g, "");
        if (str.length < 1 || replace.length < 1) {
            text3 = text2;
            this.text_error(obj);
            return false;
        } else if (str.length > 200) {
            this.text_error(obj);
            return false;
        }
        $(".address .has-error").removeClass("has-error");
        $(".address .text-danger").removeClass("text-danger").text(btext);
        return str;
    }
    this.user_nickname_check = function (obj) { //昵称
        str = obj.val();
        text2 = "长度需在2-20位之间"; //原始提示
        text3 = "不允许出现空格和特殊字符"; //原始提示
        if (str.length > 20 || str.length < 2) {
            text3 = text2;
            this.text_error(obj);
            return false;
        }
        var re = /^[\u4e00-\u9fa5A-Za-z0-9]+$/;
        result = this.check_result(str, re);
        console.log(result)
        if (result.code == 400) {
            this.text_error(obj);
            return false;
        }
        this.obj = obj;
        return this.right(str);
    }

    this.dict_code_check = function (obj) { //字典code检查
        str = obj.val();
        text2 = "长度需在1-8位之间"; //原始提示
        text3 = "只允许数字"; //原始提示
        /*验证昵称
         @长度为8-20
         @不限制*/
        if (str.length > 10 || str.length < 2) {
            text3 = text2;
        }

        re = /^[0-9]{2,10}$/;
        result = this.check_result(str, re);
        if (result.code == 400) {
            this.text_error(obj);
            return false;
        }
        $("#dialog_edit .code .has-error").removeClass("has-error");
        return str;
    }
    this.dict_text_check = function (obj) {
        str = obj.val();
        text2 = "长度需在1-20位之间"; //原始提示
        text3 = "不允许出现字符"; //原始提示
        /*验证昵称
         @长度为8-20
         @不限制*/
        if (str.length > 20 || str.length < 2) {
            text3 = text2;
        }
        re = /^[\u4e00-\u9fa5\w]{1,20}$/;
        result = this.check_result(str, re);

        if (result.code == 400) {
            this.text_error(obj);
            return false;
        }
        $("#dialog_edit .text .has-error").removeClass("has-error");
        return str;
    }
    this.dict_name_check = function (obj) {
        str = obj.val();
        text2 = "长度需在1-10位之间"; //原始提示
        text3 = "只允许中文"; //原始提示
        /*验证昵称
         @长度为8-20
         @不限制*/
        if (str.length > 10 || str.length < 2) {
            text3 = text2;
        }
        re = /^[\u4e00-\u9fa5]{2,10}$/;
        result = this.check_result(str, re);
        console.log(result);
        if (result.code == 400) {
            this.text_error(obj);
            return false;
        }
        $("#dialog_edit .name .has-error").removeClass("has-error");
        return str;
    }
    this.dict_mnemonic_check = function (obj) {
        str = obj.val();
        text2 = "长度需在2-20位之间"; //原始提示
        text3 = "只允许字母和下划线"; //原始提示
        /*验证昵称
         @长度为8-20
         @不限制*/
        if (str.length > 20 || str.length < 2) {
            text3 = text2;
        }
        re = /^[a-zA-Z_]{2,20}$/;
        result = this.check_result(str, re);
        if (result.code == 400) {
            this.text_error(obj);
            return false;
        }
        $("#dialog_edit .mnemonic .has-error").removeClass("has-error");
        return str;
    }

    this.check_result = function (str, re) {
        if (re.test(str)) {
            result = {
                "code": 200
            };
        } else {
            result = {
                "code": 400,
                "result": text3
            };
        }
        return result;
    }
    this.text_error = function (obj, t) {
        if (t == 1) {
            obj = obj.parent();
        }
        obj.parent().addClass("has-error");
        obj.parent().next(".error_text").addClass("text-danger").text(text3);

    }
    this.text_error2 = function (obj, t, text4) {
        if (t == 1) {
            obj = obj.parent();
        }
        console.log(text4);
        obj.parent().addClass("has-error");
        obj.parent().next(".error_text").text(text4).addClass("text-danger");
    }
    this.right = function (str) {
        objParent = this.obj.parent().parent().parent();
        console.log(objParent)
        objParent.find(".has-error").removeClass("has-error");
        objParent.find(".text-danger").removeClass("text-danger").text('输入正确');
        return str;
    }
    this.file_request = function (obj) {
        if (obj.val() == "") {
            var text = "请选择文件";
            var text1 = "文件已选择";
            obj.parent().text(text).addClass("text-danger");
            return false;
        }
        obj.parent().text(text1).addClass("text-danger");
        return true;
    }

}

function text_clear(t) {
    switch (t) {
        case "user_passord":
            text = {
                "cla": "passwrod",
                "text": "8-20位"
            };
            break;

        case "dict_text":
            text = {
                "cla": "text",
                "text": "1-20位字母数字或汉字"
            };
            break;

        case "dict_code":
            text = {
                "cla": "code",
                "text": "1-8位数字"
            };
            break;

        case "dict_remark":
            break;

        case "dict_mnemonic":
            text = {
                "cla": "mnemonic",
                "text": "2-20位的字母和下划线"
            };
            break;

        case "dict_name":
            text = {
                "cla": "name",
                "text": "1-10位中文"
            };
            break;
    }
    $(".has-error").removeClass("has-error");
    $(".error_text").removeClass("text-danger");
    this.show = function () {
        $("#dialog_edit ." + text.cla + " .error_text").text(text.text);
    }
}

function clear_input() {
    $("input").val("");
}

function open_eye() {
    $(".open_eye").parent().hover(function () {
        $(this).find(".eye").text($(".eye_in").val());
        $(this).find(".eye").height(26);
    }, function () {
        $(this).find(".eye").text("");
        $(this).find(".eye").height(0);
    });
}

function add_option() {
    this.industry = function (j) {
        item = {
            "url": "/guest/industry",
            "class": "industry",
            "json": j
        };
        this.result(item, "text");
    };
    this.area_son = function (j, cla, s) {
        j.code = s;
        item = {
            "url": "/area/city",
            "class": cla,
            "json": j
        };
        $("[name=" + cla + "]").html("");
        this.result(item);
    };
    this.zone = function (j, cla, s) {
        j.code = s;
        item = {
            "url": "/area/zone",
            "class": cla,
            "json": j
        };
        $("[name=" + cla + "]").html("");
        this.result(item, "name");
    };
    this.tag = function (j,cla, s) {
        // j.code = s;
        item = {
            "url": "/dict/tag",
            "class": cla,
            "json": j
        };
        $("[name=" + cla + "]").html("");
        this.result(item, "text");
    };
    this.area = function (j, cla) {
        item = {
            "url": "/area/city",
            "class": cla,
            "json": j
        };
        this.result(item);
    };
    this.result = function (item, text) {
        if (!text) text = "name";
        get_result = ajax_send(item.json, item.url, "GET").result || {};
        if (!get_result) get_result = [{
            0: '查询结果为空'
        }];
        for (var x in get_result) {
            option = "<option value='" + get_result[x].code + "'>" + get_result[x][text] + "</option>";
            $("[name=" + item.class + "]").append(option);
        }
        return true;
    }
}

function return_append(e, t) {
    this.user_append = function (t) { //列出所有user
        type = role[e.type];
        if (e.type == 1000) {
            type = "超级管理员";
        }
        append_text1 = "<td><input type='checkbox' name='result_id[]' value='" + e.id + "' /></td><td class='result_name'>" + e.name + "</td><td class='result_nickname'>" + e.nickname + "</td><td class='result_type'>" + type + "</td><td class='click_list'>	<A  class='click resetpassword' data-id='" + e.id + "' ><i class='glyphicon glyphicon-repeat'></i>重置密码</A>";
        append_text2 = "<A class='click del' data-id='" + e.id + "' ><i class='glyphicon glyphicon-remove'></i>删除</A></td>";
        if (t != 1) {
            append_text1 = "<tr id='result_id_" + e.id + "'>" + append_text1;
            append_text2 = append_text2 + "</tr>";
        }
        if ($.cookie("type") == 1000) {
            append_text3 = "<A  class='click edit' data-id='" + e.id + "' ><i class='glyphicon glyphicon-edit'></i>修改</A>";
            append_text = append_text1 + append_text3 + append_text2;
        } else {
            append_text = append_text1 + append_text2;
        }
        return append_text;
    }
    this.dict_append = function (t) { //列出所有字典
        append_text = "<td></td><td class='result_mnemonic'>" + e.mnemonic + "</td><td class='result_name'>" + e.name + "</td><td class='result_remark'>" + e.remark + "</td><td class='click_list'><A  class='click edit' data-id='" + e.id + "' ><i class='glyphicon glyphicon-edit'></i>修改</A><A  class='click' href='/system/workbook_son.html?id=" + e.id + "'><i class='glyphicon glyphicon-repeat'></i>字典项管理</A><A class='click del' data-id='" + e.id + "' ><i class='glyphicon glyphicon-remove'></i>删除</A></td>";
        if (t == 1) {

        } else {
            append_text = "<tr id='result_id_" + e.id + "'>" + append_text + "</tr>";
        }
        return append_text;
    }
    this.dict_son_append = function (t) { //列出所有字典项
        append_text = "<td></td><td class='result_mnemonic'></td><td class='result_name'></td><td class='result_code'>" + e.code + "</td><td class='result_text'>" + e.text + "</td><td class='result_remark'>" + (e.remark || '') + "</td><td class='click_list'><a  class='click edit' data-id='" + e.id + "' ><i class='glyphicon glyphicon-edit'></i>修改</a><A class='click del' data-id='" + e.id + "' ><i class='glyphicon glyphicon-remove'></i>删除</A></td>";
        if (t == 1) {
        } else {
            append_text = "<tr id='result_id_" + e.id + "'>" + append_text + "</tr>";
        }
        return append_text;
    }
    this.shop_append = function (t) { //列出所有guest
        var stateText;
        if (e.state == 1002) stateText = 'error';
        state = {
            "1003": "通过审核",
            "1002": "未审核"
        };
        append_text = '<tr  id=" ' + e.id + '"><td></td><td>' + (e.code || '编号暂无') + '</td><td>' + e.name + '</td><td>' + e.address + '</td><td class="state ' + stateText + '">' + state[e.state] +
            '</td><td>' + (e.createTime || '没有') + '</td><td>' + (e.updateTime || '没有') + '</td>' +
            '<td><a class="click zone" data-id="' + e.id + '"><i class="glyphicon glyphicon-ok"></i>审核</a></td></tr>';
        return append_text;
    }
    this.guest_append = function (t) { //列出所有guest
        state = {
            "1001": "开启",
            "1002": "关闭"
        };
        if (e.state == 1001) {
            state.on = "active";
            state.off = "";
        } else {
            state.on = "";
            state.off = "active";
        }
        state_click = '<div class="btn-group col-sm-12" data-toggle="buttons"><label class="btn on ' + state.on + ' col-sm-6 btn-xs"><input type="radio" class="col-sm-6" name="gender" id="gender1" value="1001" >开启</label><label class="btn off ' + state.off + ' btn-xs col-sm-6"><input type="radio" class="col-sm-4 " name="gender" id="gender3"  value="1002">关闭</label></div>';
        append_text = '<tr  id=" ' + e.id + '"><td></td><td>' + e.code + '</td><td>' + e.name + '</td><td>' + e.address + '</td><td class="state">' + state_click +
            '</td><td>' + e.smsCount + '</td><td>' + ((e.createTime && e.createTime.split(" ")[0]) || "暂未开通") + '</td><td>' + ((e.openingDay && e.openingDay.split(" ")[0]) || "暂未开通") + '</td><td class="click_list"><a class="click edit" href="/user/view-1.html?id=' + e.id +'&name='+e.name+
            '"><i class="glyphicon glyphicon-list-alt"></i>查看</a><a href="/user/edit-1.html?id=' + e.id +'&name='+e.name+ '"><i class="glyphicon glyphicon-edit"></i>修改</a><a href="/user/shop.html?id=' + e.id +'&name='+e.name+ '"><i class="glyphicon glyphicon-edit"></i>查看门店</a>' +
            // '<a href="/user/author.html?id=' + e.id + '"><i class="glyphicon glyphicon-edit"></i>游戏授权</a>' +
            '<a href="/useracounts/index.html#/useracounts/'+ e.id +'/'+e.name+ '"><i class="glyphicon glyphicon-edit"></i>分帐管理</a>' +
            '<a href="/brokerage/index.html#/brokerage/'+ e.id +'/'+e.name+ '"><i class="glyphicon glyphicon-edit"></i>手续费管理</a>' +
            '<a href="/order/index.html#/order/'+ e.id +'/'+e.name+ '"><i class="glyphicon glyphicon-edit"></i>坏帐管理</a>' + '<a href="/resources/index.html#/resources/'+ e.id +'/'+e.name+ '"><i class="glyphicon glyphicon-edit"></i>资源管理</a>' +
            '<a href="/shortmessage/index.html?id=' + e.id +'&name='+e.name+ '"><i class="glyphicon glyphicon-edit"></i>短信管理</a><a href="/admin/index.html#/user/activity?id=' + e.id +'&name='+e.name+ '"><i class="glyphicon glyphicon-edit"></i>活动管理</a>'+
            '<a href="/admin/index.html#/user/shareList?id=' + e.id +'&name='+e.name+ '"><i class="glyphicon glyphicon-edit"></i>分享金管理</a>'
            +
            '<a href="/admin/index.html#/user/chargeAcount?id=' + e.id +'&name='+e.name+ '"><i class="glyphicon glyphicon-edit"></i>充值帐户</a>'
            +'</td></tr>';
        return append_text;
    }
    this.key_append = function (t) { //列出所有key
        append_text = '<tr id="' + e.id + '"><td></td><td>' + e.name + '</td><td>' + e.apiKey + '</td><td>' + e.plateform + '</td><td class="click_list"><a class="reset" ><i class="glyphicon glyphicon-repeat"></i>重置</a><a class="delete"><i class="glyphicon glyphicon-remove"></i>删除</a></td></tr>';
        return append_text;
    }

    this.game_append = function (t) { //列出所有游戏项
        append_text = "<td><input type='checkbox' name='result_id[]'  value='" + e.id + "'/></td><td>" + e.name + "</td><td class='result_name'>" + e.type + "</td><td class='result_code'>" + e.price + "</td><td class='result_text'>" + e.chance + "</td><td class='result_remark'>" + e.time + "</td><td>" + e.probability + "</td><td>" + e.url + "</td><td>" + (e.description || "") + "</td><td class='click_list'>";
        if (e.online) {
            append_text += "<a class='click on' data-id='" + e.id + "'><i class='glyphicon glyphicon-edit'></i>下线</a>"
        } else {
            append_text += "<a class='click off' data-id='" + e.id + "'><i class='glyphicon glyphicon-edit'></i>上线</a>"
        }

        append_text += "<a class='click del' data-id='" + e.id + "' ><i class='glyphicon glyphicon-remove'></i>删除</a></td>";
        append_text1 = "<tr id='result_id_" + e.id + "'>" + append_text + "</tr>";
        return append_text1;
    };
    this.author_append = function (t) { //列出所有游戏授权项
        append_text = "<tr><td class='result_name'>" + e.name + "</td><td class='result_text'>" + e.chance + "</td><td class='result_remark'>" + e.time + "</td><td>" + e.probability + "</td><td>" + e.createTime + "</td><td class='click_list'><a class='click cancel' data-id='" + e.id + "'><i class='glyphicon glyphicon-edit'></i>取消授权</a></td></tr>";
        return append_text;
    };
    this.material_append = function (t) { //列出所有游戏授权项
        append_text = "<tr><td class='result_name'>" + e.name + "</td><td class='result_text'>" + e.type + "</td><td class='result_remark'><img class='bg-img' src='" + e.url + "'</td><td>" + e.url + "</td><td class='click_list'><a class='click del' data-id='" + e.id + "'>删除</a></td></tr>";
        return append_text;
    };
    this.customer_append = function (t) { //列出所有顾客
        // append_text = "<tr><td></td><td><img src='" + e.avatarUrl + "'/></td><td>" + (e.phone || "") + "</td><td>" + e.nickname + "</td><td>" + (e.gender == "M" ? "男" : e.gender == "F" ? "女" : "保密") + "</td><td>" + e.createTime + "</td></tr>";
        append_text = "<tr><td></td><td><img src='" + e.avatarUrl + "'/></td><td>" + (e.phone || "") + "</td><td>" + e.nickname + "</td><td>" + (e.gender == "M" ? "男" : e.gender == "F" ? "女" : "保密") + "</td><td>" + e.createTime + "</td><td class='click_list'><a class='click del' data-id='" + e.id + "'>删除用户数据</a></td></tr>";
        return append_text;
    };
    this.sms_append = function (t) { //列出所有短信
        append_text = "<tr><td>" + e.price + "</td><td>" + e.count + "</td><td>" + e.createTime + "</td></tr>";
        return append_text;
    };
}

function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
