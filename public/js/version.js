var app = angular.module('app', ['ngRoute', 'ngMessages', 'ngAnimate', "ui.bootstrap"]); //创建APP

app.run(function ($rootScope, $location, $interval, $filter, $http) { //APP通用方法
    $rootScope.cache = {};
    $rootScope.config = { //设置
        time: new Date(),
    };
    $rootScope.urlFn = function () { //URL换算
        if (!$location.$$path) { //
            $rootScope.active = "shops";
            return;
        }
        localurl = $location.$$path.split("/");
        if (localurl[1] == "") { //验证空
            localurl[1] = "shops";
        }
        $rootScope.active = localurl[1];
    };
    $rootScope.goto = function (url) { //转跳
        $location.path("/" + url);
        $rootScope.urlFn();
    }
    $rootScope.jsonToUrl = function (para) {
        var json = objSort(para);
        var str = "";
        for (var i in json) {
            str += i + "=" + json[i] + "&";
        }
        str = str.substr(0, str.length - 1);
        return str;
    }
})

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope.$parent, element[0].files[0]);
                });
            });
        }
    };
}]);

app.directive('backButton', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', goBack);

            function goBack() {
                history.back();
                scope.$apply();
            }
        }
    }
});
// 模板消息
app.factory('messageTemplateFactory', ['$http', function ($http) {
    var msgFac = {};
    msgFac.getCategory = function (cb) {
        $http.get(basic_url + '/templates/categories?' + sortUrl()).success(function (res) {
            cb(res);
        });
    }
    msgFac.query = function (cb) {
        $http.get(basic_url + '/templates?' + sortUrl()).success(function (res) {
            cb(res);
        });
    }

    msgFac.add = function (msg, cb) {
        $http.post(basic_url + '/templates?' + sortUrl(), msg).success(function (res) {
            cb(res);
        });
    }

    msgFac.del = function (msg, cb) {
        $http.delete(basic_url + '/templates/' + msg + '?' + sortUrl()).success(function (res) {
            cb(res);
        });
    }
    return msgFac;
}]);



//模板消息----end

app.factory('messageFactory', ['$http', function ($http) {
    var msgFac = {};

    msgFac.query = function (cb) {
        $http.get(basic_url + '/message?' + sortUrl()).success(function (res) {
            cb(res);
        });
    }

    msgFac.add = function (msg, cb) {
        $http.post(basic_url + '/message?' + sortUrl(), msg).success(function (res) {
            cb(res);
        });
    }

    msgFac.del = function (msg, cb) {
        $http.delete(basic_url + '/message/' + msg + '?' + sortUrl()).success(function (res) {
            cb(res);
        });
    }
    return msgFac;
}]);

app.factory('versionFactory', ['$http', function ($http) {
    var versionFac = {};

    versionFac.query = function (cb, str) {
        $http.get(basic_url + '/version?' + str).success(function (res) {
            cb(res);
        });
    };

    versionFac.uploadFileToUrl = function (file, posts, cb) {
        var fd = new FormData();
        if (file) {
            fd.append('file', file);
        }


        $http.post(basic_url + '/file?' + sortUrl(), fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(function (res) {
            if (res.code == 200) {
                posts.url = res.result.path;
                versionFac.version(posts, cb);
            } else {
                alert(res.message);
            }
        })
    };
    versionFac.version = function (posts, cb) {
        $http.post(basic_url + '/version?' + sortUrl(), posts).success(function (res) {
            cb(res);
        })
    };
    versionFac.add = function (file, posts, cb) {
        this.uploadFileToUrl(file, posts, cb);
    };

    versionFac.del = function (id, cb) {
        $http.delete(basic_url + '/version/' + id + "?" + sortUrl()).success(function (res) {
            cb(res);
        });
    }
    return versionFac;
}])

app.config(appRouteConfig);

function appRouteConfig($routeProvider) { //路由规则
    $routeProvider.when('/version', {
            templateUrl: "show.html",
            controller: "versionShowCtr"
        }).when('/version/add', {
            templateUrl: "add.html",
            controller: "versionAddCtr",
        }).when('/message', {
            templateUrl: "../message/show.html",
            controller: "messageShowCtr"
        }).when('/message/add', {
            templateUrl: "../message/add.html",
            controller: "messageAddCtr"
        })
        // 模板消息
        .when('/messageTemplate', {
            templateUrl: "../messageTemplate/show.html",
            controller: "messageTemplateShowCtr"
        }).when('/messagesTemplate/add', {
            templateUrl: "../messageTemplate/add.html",
            controller: "messageTemplateAddCtr"
        }).when('/messagesTemplate/add/:id', {
            templateUrl: "../messageTemplate/add.html",
            controller: "messageTemplateAddCtr"
        })

        // 模板消息---end


        .when('/medialMessage/add', {
            templateUrl: "../medialMessage/add.html",
            controller: "medialMessageAddCtr"
        }).when('/medialMessage', {
            templateUrl: "../medialMessage/show.html",
            controller: "medialMessageShowCtr"
        }).when('/cashiers', {
            templateUrl: "show.html",
            controller: "cashiersShowCtr"
        }).when('/cashiers/add', {
            templateUrl: "add.html",
            controller: "cashiersAddCtr"
        }).when('/casher/:id', {
            templateUrl: "/admin/user/casher.html",
            controller: "userCasherCtr"
        }).when('/user/activity/', { // 活动管理
            templateUrl: "/admin/user/activity.html",
            controller: "userActivityCtr"
        }).when('/user/shareList/', { // 分享金列表
            templateUrl: "/admin/chargeAcount.html",
            controller: "userShareListCtr"
        }).when('/user/share/:rebatesId', { // 分享金管理(修改)
            templateUrl: "/admin/user/share.html",
            controller: "userShareCtr"
        }).when('/user/chargeAcount/', { // 充值账户chargeAcountCtr
            templateUrl: "/admin/user/chargeAcount.html",
            controller: "chargeAcountCtr"
        }).when('/user/share', { // 分享金管理(添加)
            templateUrl: "/admin/user/share.html",
            controller: "userShareCtr"
        }).when('/placards', {
            templateUrl: "/admin/placards/index.html",
            controller: "adCtr"
        }).when('/placards/add', {
            templateUrl: "/admin/placards/add.html",
            controller: "adAddCtr"
        }).when('/placards/edit/:id', {
            templateUrl: "/admin/placards/add.html",
            controller: "adAddCtr"
        }).when('/city', {
            templateUrl: "/admin/city/index.html",
            controller: "cityCtr"
        }).when('/order/:id/:name', {
            templateUrl: "../order/show.html",
            controller: "orderCtr"
        }).when('/order/update/:id/:shop/:category', {
            templateUrl: "../order/update.html",
            controller: "orderEditCtr"
        }).when('/deal', {
            templateUrl: "../deal/show.html",
            controller: "dealCtr"
        })
        .when('/useracounts/:id/:name', {
            templateUrl: "../useracounts/show.html",
            controller: "userAcountsCtr" //分账列表
        })
        .when('/useracounts/rule/:id/:mchId', {
            templateUrl: "../useracounts/rule.html",
            controller: "userAcountsRuleCtr" //分账管理
        })
        .when('/allocate', {
            templateUrl: "../allocate/show.html",
            controller: "allocateCtr"
        }).when('/allocate/wallets', {
            templateUrl: "../allocate/wallets.html",
            controller: "allocateWalletsCtr"
        }).when('/accounts', { //分账管理
            templateUrl: "../accounts/show.html",
            controller: "accountsCtr"

        }).when('/brokerage/:id/:name', {
            templateUrl: "../brokerage/show.html",
            controller: "brokerageCtr"
        }).when('/spotter', {
            templateUrl: "../spotter/show.html",
            controller: "spotterCtr"
        }).when('/resources/:id/:name', {
            templateUrl: "../resources/show.html",
            controller: "resourcesCtr"
        }).when('/coins', {
            templateUrl: "../coins/show.html",
            controller: "coinsCtr"
        }).when('/promoters', {
            templateUrl: "../promoters/show.html",
            controller: "promotersCtr"
        });
};

app.controller('versionShowCtr', ['$scope', '$location', 'versionFactory', '$http', function ($scope, $location, versionFac, $http) { //
    $scope.view = {
        product: {
            "A01": "上宾",
            "A02": "捷帐宝",
        },
        platform: {
            "ios": "苹果",
            "android": "安卓",
            "winPhone": "微软",
        },
        channels: {
            '1000': '上宾官方',
            '1001': '商米',
            '1002': '联迪',
            '1003': '盛付通',
            '1005': '拉卡拉',
            '1006': '汇付天下',
            '1007': '富友'
        }
    };
    $scope.post = {};
    versionFac.query(function (res) {
        $scope.view.versions = res.result;
    }, getUrl());

    $scope.formatCtx = function (content) {
        return content.split(/\n/);
    }

    $scope.create = function () {
        $location.path("/version/add");
    }

    $scope.delete = function (id) {
        versionFac.del(id, function (res) {
            if (res.code == 200) {
                var arr = $scope.view.versions.items;
                for (var i = 0; arr && i < arr.length; i++) {
                    if (arr[i].id === id) {
                        arr.splice(i, 1);
                        break;
                    };
                };
            } else {
                alert("删除失败");
            }
        })
    }
    $scope.lowsestFn = function (id) {
        $http.post(basic_url + '/version/' + id + "/lowest?" + sortUrl()).success(function (res) {
            if (res.code == 200) {
                location.reload();
            } else {
                alert(res.message);
            }
        });
    }

    $scope.filterFn = function () {
        var json = {
            page: $scope.view.versions.page || 1,
            count: $scope.view.versions.count || 20
        };
        if ($scope.post.platform) {
            json.plateform = $scope.post.platform.toUpperCase();
        }
        if ($scope.post.channel) {
            json.channel = $scope.post.channel;
        }
        versionFac.query(function (res) {
            $scope.view.versions = res.result || {};
        }, getUrl(json));
    }

}]);

app.controller('versionAddCtr', ['$scope', '$location', 'versionFactory', function ($scope, $location, versionFac) { //
    $scope.view = {
        products: [{
                name: "上宾",
                key: "USER_APP"
            },
            {
                name: "捷账宝",
                key: "SHOP_APP"
            },
            {
                name: "上宾伙伴",
                key: "PARTNER_APP"
            },
        ],

        platforms: [{
                name: "苹果",
                key: "IOS"
            },
            {
                name: "安卓",
                key: "ANDROID"
            },
            {
                name: "微软",
                key: "WINPHONE"
            },
        ],
        channels: [{
            name: '富友',
            key: '1007'
        }, {
            name: '上宾官方',
            key: '1000'
        }, {
            name: '商米',
            key: '1001'
        }, {
            name: '联迪',
            key: '1002'
        }, {
            name: '盛付通',
            key: '1003'
        }, {
            name: '拉卡拉',
            key: '1005'
        }, {
            name: '汇付天下',
            key: '1006'
        }],
        methods: [{
                id: '1',
                name: "应用市场"
            },
            {
                id: '2',
                name: "上宾官网"
            },
        ],
    };


    $scope.postSend = function () {
        $scope.posts.name = $scope.name1 + "." + $scope.name2 + "." + $scope.name3 + ($scope.name4 ? ("." + $scope.name4) : '');
        if ($scope.view.downMethod == "2") {
            versionFac.add($scope.myFile, $scope.posts, function function_name(res) {
                if (res.code !== 200) {
                    alert("出错了");
                } else {
                    $location.path("/version");
                }
            });
        } else {
            versionFac.version($scope.posts, function function_name(res) {
                if (res.code !== 200) {
                    alert("出错了");
                } else {
                    $location.path("/version");
                }
            });
        }

    }

}]);
// 模板消息
app.controller('messageTemplateShowCtr', ['$scope', '$location', 'messageTemplateFactory', '$http', function ($scope, $location, msgFac, $http) {

    $scope.view = {};
    msgFac.query(function (res) {
        $scope.view.messagesTemplate = res.result;
    });
    $scope.create = function () {
        sessionStorage.setItem('editItem', null)
        $location.path("/messagesTemplate/add");
    }
    // 修改
    $scope.edit = function (index) {
        $location.path("/messagesTemplate/add/" + $scope.view.messagesTemplate[index].id);
        sessionStorage.setItem('editItem', JSON.stringify($scope.view.messagesTemplate[index]))

    }
    $scope.delete = function (index) {
        if (confirm("确定删除？")) {
            $http.delete(basic_url + '/templates/' + index + "?" + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    console.log(res);
                    msgFac.query(function (res) {
                        $scope.view.messagesTemplate = res.result;
                    });
                } else {
                    alert("删除失败");
                }
            });
        }
    };

    $scope.pageChange = function () {

        $http.get(basic_url + '/templates?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.messagesTemplate = res.result;
            }
        });
    };
}]);

app.controller('messageTemplateAddCtr', ['$scope', '$location', 'messageTemplateFactory', '$routeParams', '$http', function ($scope, $location, msgFac, $routeParams, $http) {
    $scope.view = {
        category: []
    }
    $scope.posts = {
        type: '',
        channel: 1,
        templateIdShort: "",
        industry: '',
        path: '',
        minAppId: '',
        pages: '',
        title: '',
        content: ''

    };
    $scope.editId = $routeParams.id;

    msgFac.getCategory(function (res) {
        // 把要修改的项目复制过来显示
        if (sessionStorage.getItem('editItem')) {
            $scope.posts = {
                ...JSON.parse(sessionStorage.getItem('editItem'))
            }
        }

        let arr = [];
        for (var i in res.result) {
            let obj = {};
            obj.key = i;
            obj.value = res.result[i];
            arr.push(obj)
        }
        $scope.view.category = arr;
    });
    $scope.add_form = {};
    // 当渠道选择了"公众号",且填写了小程序页面路径得时候
    $scope.typeMsg = '用户点击消息后将直接打开小程序，若此时，客户的公众号未与配置小程序进行关联，则不会推送此条模版消息';
    // 当渠道选择了"小程序",
    $scope.typeMsg1 = '';
    // 新增/修改
    $scope.postSend = function () {
        // 渠道选择了
        if ($scope.posts.channel == 1 && ($scope.posts.path.trim() == '' || $scope.posts.industry.trim() == '')) {
            alert('公众号模板,跳转页面和所属行业必填');
            return;
        }
        // 渠道选择了小程序
        if ($scope.posts.channel == 2 && ($scope.posts.minAppId.trim() == '' || $scope.posts.path.trim() == '')) {
            alert('小程序APPID以及小程序页面必填');
            return;
        }
        if (!$routeParams.id) {
            msgFac.add(angular.toJson($scope.posts), function (res) {
                if (res.code !== 200) {
                    alert("出错了");
                } else {
                    sessionStorage.setItem('editItem', null)
                    $location.path("/messageTemplate");
                }
            });
        } else {
            $http.put(basic_url + '/templates/' + $routeParams.id + '?' + getUrl(), $scope.posts).success(function (data) {
                if (data.code == 200) {
                    alert("操作成功！");
                    sessionStorage.setItem('editItem', null)
                    $location.path("/messageTemplate");
                } else {
                    alert(data.message);
                }
            });
        }

        console.log($scope.posts)
    }

}]);



// 模板消息---end

app.controller('messageShowCtr', ['$scope', '$location', 'messageFactory', '$http', function ($scope, $location, msgFac, $http) {

    $scope.view = {};
    msgFac.query(function (res) {
        $scope.view.messages = res.result;
    });
    $scope.create = function () {
        $location.path("/message/add");
    }
    $scope.delete = function (index) {
        if (confirm("确定删除？")) {
            $http.delete(basic_url + '/message/' + index + "?" + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    console.log(res);
                    msgFac.query(function (res) {
                        $scope.view.messages = res.result;
                    });
                } else {
                    alert("删除失败");
                }
            });
        }
    };
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.messages.page,
            count: $scope.view.messages.count
        };
        $http.get(basic_url + '/message?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.messages = res.result;
            }
        });
    };
}]);

app.controller('messageAddCtr', ['$scope', '$location', 'messageFactory', function ($scope, $location, msgFac) {

    $scope.posts = {
        type: '',
    };
    $scope.add_form = {};
    // $scope.textCheckJson = textCheckJson;
    // $scope.textCheckErrorJson = textCheckErrorJson;
    $scope.postSend = function () {
        if ($scope.posts.title.length > 30 || $scope.posts.title.length < 5) {
            alert("标题长度应为5-30个字符");
            return;
        }
        if ($scope.posts.content.length > 500 || $scope.posts.content.length < 10) {
            alert("内容长度应为10-500个字符");
            return;
        }
        msgFac.add(angular.toJson($scope.posts), function (res) {
            if (res.code !== 200) {
                alert("出错了");
            } else {
                $location.path("/message");
            }
        });
    }

}]);
app.controller('medialMessageShowCtr', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    $scope.view = {
        type: {
            "100": "关注回复",
            "101": "免费领卡微信提醒-小图",
            "102": "免费领卡微信提醒-大图",
            "103": "首次关注有礼",
            "200": "消费",
            "300": "凑单",
            "400": "砍价",
            "500": " 霸王餐-有红包，可助力",
            "501": "仅助力",
            "502": "仅红包",
            "503": "自己查看",
            "600": "抽奖",
            "601": "抽奖邀请"
        }
    };
    $http.get(basic_url + '/medias?' + sortUrl()).success(function (res) {
        $scope.view.messages = res.result;
    });

    $scope.editFn = function (index) {
        if (!$scope.view.urls) {
            $http.get(basic_url + '/materials?' + sortUrl()).success(function (res) {
                if (res.result) {
                    $scope.view.urls = res.result;
                }
            });
        }
        if ("number" == typeof index) {
            $scope.post = $scope.view.messages.items[index];
        } else {
            $scope.post = {}
        }
        $("#dialog_edit").modal("show");
    }
    $scope.sendJsons = function () {
        var url, type = 'POST';
        if ($scope.post.id) {
            url = basic_url + '/medias/' + $scope.post.id + '?' + sortUrl();
            type = "PUT";
        } else {
            url = basic_url + '/medias?' + sortUrl();
        }
        $http({
            method: type,
            url: url,
            data: $scope.post
        }).success(function (res) {
            if (res.code == 200) {
                $("#dialog_edit").modal("hide");
                $http.get(basic_url + '/medias?' + sortUrl()).success(function (res) {
                    $scope.view.messages = res.result;
                });
            } else {
                alert(res.message);
            }
        });
    };
    $scope.deleteFn = function (id, index) {
        var result = confirm("确定要删除吗？");
        if (result) {
            $http.delete(basic_url + '/medias/' + id + "?" + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    $scope.view.messages.items.splice(index, 1);
                } else {
                    alert(res.message);
                }
            });
        }
    }
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.urls.page,
            count: $scope.view.urls.count
        };
        $http.get(basic_url + '/materials?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.urls = res.result;
            }
        });
    };
}])
app.controller('cashiersShowCtr', ['$scope', '$location', '$http', function ($scope, $location, $http) { //
    $scope.view = {};
    $scope.post = {};
    $http.get(basic_url + '/cashiers?' + getUrl()).success(function (res) {
        $scope.view.cashiers = res.result || {};
    });
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.cashiers.page,
            count: $scope.view.cashiers.count
        };
        $http.get(basic_url + '/cashiers?' + $scope.jsonToUrl(json)).success(function (res) {
            $scope.view.cashiers = res.result;
        });
    };
    $scope.switch = function (id, state) {
        $http.post(basic_url + '/cashiers/' + id + "/" + state + "?" + sortUrl(), {}).success(function (res) {
            if (res.code == 200) {
                alert("操作成功");
                $scope.pageChange();
            } else {
                alert(data.messages);
            }
        })

    }
    $scope.delete = function (index) {
        if (confirm("确定删除？")) {
            $http.delete(basic_url + '/cashiers/' + $scope.view.cashiers.items[index].id + "?" + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    $scope.pageChange();
                } else {
                    alert("删除失败");
                }
            });
        }
    }

}]);
app.controller('cashiersAddCtr', ['$scope', '$location', '$http', function ($scope, $location, $http) { //
    $scope.view = {};
    $http.get(basic_url + '/cashiers/type?' + getUrl()).success(function (res) {
        $scope.view.type = res.result || {};
    });
    $scope.posts = {};
    $scope.postSend = function () {
        $http.post(basic_url + '/cashiers?' + sortUrl(), $scope.posts).success(function (res) {
            if (res.code == 200) {
                $location.path("/cashiers");
            } else {
                alert(data.messages);
            }
        })

    }

}]);
app.controller('userCasherCtr', ['$scope', '$location', '$http', '$routeParams', function ($scope, $location, $http, $routeParams) { //
    $scope.view = {
        state: {
            1001: "创建中",
            1002: "认证审核中",
            1003: "已认证",
            1004: "关闭审核",
            1005: "关闭"
        }
    };
    $scope.post = {};
    $scope.config.name = "客户管理";
    $scope.config.url = "/user/index.html";
    $http.get(basic_url + '/cashier/shop/' + $routeParams.id + '?' + getUrl()).success(function (res) {
        $scope.view.detail = res.result || {};
    });
    $http.get(basic_url + '/cashiers/type?' + getUrl()).success(function (res) {
        $scope.view.type = res.result || {};
    });

    $scope.selectFn = function () {
        if ($scope.post.cashierType) {
            $http.get(basic_url + '/cashier/' + $scope.post.cashierType + '?' + getUrl()).success(function (res) {
                $scope.view.shops = res.result || [];
            });
        } else {
            $scope.view.shops = [];
        }
    }
    $scope.sync = function () {
        if ($scope.post.cashierType) {
            $http.get(basic_url + '/cashier/' + $scope.post.cashierType + '/sync' + '?' + getUrl()).success(function (res) {
                // $scope.view.shops = res.result || [];
                if (res.code == 200) {
                    location.reload();
                }
            });
        }
    }
    $scope.unbind = function () {
        $http.delete(basic_url + '/cashier/' + $scope.view.detail.type + '/shop/' + $routeParams.id + '?' + getUrl()).success(function (data) {
            if (data.code == 200) {
                alert("解绑成功！");
                location.reload();
            } else {
                alert(data.message);
            }
        });
    }
    $scope.bind = function (index) {
        var json = {
            cashierType: $scope.post.cashierType,
            cashierId: $scope.view.shops.items[index].cashierShopId
        }

        $http.post(basic_url + '/cashier/shop/' + $routeParams.id + '?' + getUrl(), json).success(function (data) {
            if (data.code == 200) {
                alert("绑定成功！");
                location.reload();
            } else {
                alert(data.message);
            }
        });
    }
    $scope.submitFn = function () {
        zonValue = $("[name='zone-select']").val();
        if (zonValue && view.latitude && view.longitude) {
            var json = {
                area: $("[name=area1]").val(),
                latitude: view.latitude,
                longitude: view.longitude,
                zone: zonValue,
                settlementType: $("[name=ONLINE]").val(),
                guestId: bData.guestId
            };
            if ($scope.post.cashierType && $scope.post.cashierId) {
                json.cashierType = $scope.post.cashierType;
                json.cashierId = $scope.post.cashierId;
            }
            if (bData.state == 1002) {
                re = ajax_send(json, "/shop/" + bData.id, "POST", 1);
                if (re.code == 200) {
                    alert("审核通过");
                    location.reload()
                }
            } else if (bData.state == 1003) {
                re = ajax_send(json, "/shop/" + bData.id, "PUT", 1);
                if (re.code == 200) {
                    alert("修改成功");
                    location.reload()
                }
            }
        } else {
            alert("商圈及地图必须选择");
            return;
        }
    }


    $scope.pageChange = function () {
        var json = {
            page: $scope.view.cashiers.page,
            count: $scope.view.cashiers.count
        };
        $http.get(basic_url + '/cashiers?' + $scope.jsonToUrl(json)).success(function (res) {
            $scope.view.cashiers = res.result;
        });
    };
    $scope.switch = function (id, state) {
        $http.post(basic_url + '/cashiers/' + id + "/" + state + "?" + sortUrl(), {}).success(function (res) {
            if (res.code == 200) {
                alert("操作成功");
                $scope.pageChange();
            } else {
                alert(res.messages);
            }
        })

    }
    $scope.delete = function (index) {
        if (confirm("确定删除？")) {
            $http.delete(basic_url + '/cashiers/' + $scope.view.cashiers.items[index].id + "?" + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    $scope.pageChange();
                } else {
                    alert("删除失败");
                }
            });
        }
    }

}]);
// 充值账户
app.controller('chargeAcountCtr', ['$scope', '$location', '$http', '$routeParams', function ($scope, $location, $http, $routeParams) { //
    $scope.config.name = "充值账户";
    $scope.config.url = "/user/chargeAcount.html";
    $scope.view = {
        list: []
    };
    $scope.business = '';
    $scope.acount = '';
    $scope.targetObj = {

    }


    // 账户列表
    $http.get(basic_url + '/guest/' + $routeParams.id + '/accounts?' + getUrl()).success(function (res) {
        if (res.code == 200) {
            $scope.view.list = res.result;
        }
    });
    // 获取业务
    $http.get(basic_url + '/allocate/business?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.types = res.result;
            // 获取业务对应的文字
            $scope.filterfn = function (code) {
                for (var i = 0; i < $scope.types.length; i++) {
                    if ($scope.types[i].code == code) {
                        return $scope.types[i].text
                    }
                }
            }
        }
    });

    // 弹出新增弹窗
    $scope.addAcount = function () {
        $scope.targetObj={}
        $('#dialog').show()
    }
    $scope.closeAcount = function () {
        $('#dialog').hide()
    }
    // 提交弹窗内容
    $scope.submitFn = function () {
        if (!$scope.targetObj.business || !$scope.targetObj.amount) {
            alert('请填写完整信息');
            return;
        }
        $http.post(basic_url + '/guest/' + $routeParams.id + '/accounts?' + getUrl(), $scope.targetObj).success(function (res) {
            if (res.code == 200) {
                alert('添加成功');
                $('#dialog').hide()
                // 账户列表
                $http.get(basic_url + '/guest/' + $routeParams.id + '/accounts?' + getUrl()).success(function (res) {
                    if (res.code == 200) {
                        $scope.view.list = res.result;
                    }
                });
            } else {
                alert(res.message);
            }
        });
    }
    // 查看明细
    $scope.seeDetail = function (item) {
        $('#dialogDetail').show();
        // 获取明细
        // 获取明细
       
        $scope.detailId=item.id;
        $http.get(basic_url + '/guest/' + $routeParams.id + '/accounts/'+item.id+'/records?'+ getUrl()+'&count=10').success(function (res) {
            if (res.code == 200) {
                $scope.detailObj = res.result;
            }
        });

    }
    // 明细分账改变
    $scope.pageChange = function () {
        var json = {
            page: $scope.detailObj.page
        };
        $http.get(basic_url + '/guest/' + $routeParams.id + '/accounts/'+ $scope.detailId+'/records?'+ getUrl()+'&count=10&'+$scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.detailObj = res.result;
            }
        });
    };
    // 点击充值
    $scope.toCharge=function (item) {
        $('#dialog_charge').show();
        $scope.editObj=item;
    }
    // 关闭查看充值明细弹窗
    $scope.closeCharge= function () {
        $('#dialog_charge').hide();
    }
    // 充值确认
    $scope.submitChargeFn=function() {
        $http.put(basic_url + '/guest/' + $routeParams.id + '/accounts/'+$scope.editObj.id+'?' + getUrl(), {'amount':$scope.editObj.amount}).success(function (res) {
            if (res.code == 200) {
                alert('充值成功');
                $('#dialog_charge').hide();
                // 账户列表
                $http.get(basic_url + '/guest/' + $routeParams.id + '/accounts?' + getUrl()).success(function (res) {
                    if (res.code == 200) {
                        $scope.view.list = res.result;
                    }
                });
            } else {
                alert(res.messages);
            }
        });
    }
   
    // 关闭查看充值明细弹窗
    $scope.closeDetail= function () {
        $('#dialogDetail').hide();
    }
    

}]);

// 
// 分享金列表管理
app.controller('userShareListCtr', ['$scope', '$location', '$http', '$routeParams', function ($scope, $location, $http, $routeParams) { //
    $scope.config.name = "分享金管理";
    $scope.config.url = "/user/shareList.html";
    $scope.view = {
        list: []
    };

    // 获取现有红包活动
    // $http.get(basic_url + '/guest/' + $routeParams.id + '/activities?' + getUrl()).success(function (res) {
    //     if (res.code == 200) {
    //         console.log(res.result);
    //         $scope.view.activities = res.result;
    //     }
    // });

    $scope.getList = function () {
        // 查新当前分享金详情信息
        $http.get(basic_url + '/guest/' + $routeParams.id + '/rebates?' + getUrl()).success(function (data) {
            if (data.code == 200) {
                $scope.view.list = data.result;
            }
        });
    }
    $scope.getList();
    $scope.offFn = function (id) {
        var a = confirm("确认下线此活动？");
        if (a) {
            $http.post(basic_url + '/guest/' + $routeParams.id + '/rebates/' + id + "/off").success(function (data) {
                if (data.code == 200) {
                    $scope.getList()
                } else {
                    alert(data.message);
                }
            })
        }
    };
    $scope.removeFn = function (id) {
        var a = confirm("确认删除？");
        if (a) {
            $http.delete(basic_url + '/guest/' + $routeParams.id + '/rebates/' + id).success(function (data) {
                if (data.code == 200) {
                    $scope.getList()
                } else {
                    alert(data.message);
                }
            })
        };
    }
    $scope.onFn = function (id) {
        var a = confirm("确认上线此活动？");
        if (a) {
            $http.post(basic_url + '/guest/' + $routeParams.id + '/rebates/' + id + "/on").success(function (data) {
                if (data.code == 200) {
                    $scope.getList()
                } else {
                    alert(data.message);
                }
            })

        };
    }

}]);
// 分享金管理
app.controller('userShareCtr', ['$scope', '$location', '$http', '$routeParams', function ($scope, $location, $http, $routeParams) { //
    $scope.config.name = "分享金管理";
    $scope.config.url = "/user/share.html";
    $scope.view = {
        name: '',
        randomly: 'false', // 固定金额
        rebates: [{
            mode: '1',
            amount: '',
            count: '1'
        }],
        participants: [{
            min: '',
            max: '',
            count: '',
            probability: ''
        }]
    }
    $scope.username = $routeParams.name
    $scope.post = {

    };

    // 获取现有红包活动
    $http.get(basic_url + '/guest/' + $routeParams.id + '/activities?' + getUrl()).success(function (res) {
        if (res.code == 200) {
            $scope.view.activities = res.result;
        }
    });
    if ($routeParams.rebatesId) {
        // 查新当前分享金详情信息
        $http.get(basic_url + '/guest/' + $routeParams.id + '/rebates?' + getUrl()).success(function (data) {
            if (data.code == 200) {
                var arr = [];
                arr = data.result.items.filter(function (item, index) {
                    return item.id == $routeParams.rebatesId
                });
                if (arr.length > 0) {
                    $scope.view.name = arr[0].name;
                    $scope.view.amount = arr[0].amount;
                    $scope.view.randomly = arr[0].randomly + '';
                    $scope.view.activityId = arr[0].activityId;
                    $scope.view.countLimit = arr[0].countLimit;
                    $scope.view.id = $routeParams.rebatesId;
                    $scope.view.personDetail = arr[0].personDetail;
                    $scope.view.rebates = arr[0].rebates;
                    if (arr[0].participants) {
                        $scope.view.participants = arr[0].participants
                    }
                    if (arr[0].partAmount) {
                        $scope.view.partAmount = arr[0].partAmount
                    }
                }

            }
            console.log('$scope.view')
            console.log($scope.view)
        });
    }
    $scope.randomlyChange = function () {
        console.log($scope.view.randomly == 'true')
        console.log($scope.view.randomly == 'false')
        // if($scope.view.randomly=='true'){
        //     console.log('1')
        //     $('.norandomBox').css('display','block');//固定金额
        //     $('.randomBox').css('display','none');//随机金额
        // }else{
        //     console.log('2')
        //     $('.norandomBox').css('display','none');//固定金额
        //     $('.randomBox').css('display','block');//随机金额
        // }

    }
    // 添加规则
    $scope.addParticipants = function () {
        $scope.view.participants.push({
            min: 0,
            max: 0,
            count: 0,
            probability: 0
        })
    }
    $scope.removeParticipants = function (index) {
        $scope.view.participants.splice(index, 1)
    }

    // 点击确定
    $scope.submitFn = function () {
        delete $scope.view.activities
        var json = $scope.view;
        // json.randomly=Boolean(json.randomly);
        if (json.randomly == 'false') {
            delete json.participants
        }
        if ($routeParams.rebatesId) {
            $http({
                    method: 'PUT',
                    url: basic_url + '/guest/' + $routeParams.id + '/rebates/' + $routeParams.rebatesId + '?' + getUrl(),
                    data: json
                })
                // success(function (res) {
                // $http.put(basic_url + '/guest/' + $routeParams.id + '/rebates?' + getUrl(), json)
                .success(function (data) {
                    if (data.code == 200) {
                        alert("操作成功！");
                        $('.btn_back').click()
                    } else {
                        alert(data.message);
                    }
                });
        } else {
            $http.post(basic_url + '/guest/' + $routeParams.id + '/rebates?' + getUrl(), json).success(function (data) {
                if (data.code == 200) {
                    alert("操作成功！");
                    $('.btn_back').click()
                } else {
                    alert(data.message);
                }
            });
        }

    }
}]);


// 客户管理
app.controller('userActivityCtr', ['$scope', '$location', '$http', '$routeParams', function ($scope, $location, $http, $routeParams) { //
    $scope.config.name = "客户管理";
    $scope.config.url = "/user/index.html";
    $scope.view = {
        all: false,
        type: {}
        // '6001': '入会及升级',
        // '6002': '充值',
        // '6003': '积分兑换',
        // '6004': '送券',
        // '6005': '打折',
        // '6006': '特价',
        // '6007': '消费返券',
        // '6008': '消费积分',
        // '6009': '积分抵现',
        // '6011': '充值卡',
        // '6012': '抵扣',
        // '6013': '满赠',
        // '6014': '满减',
        // '6015': '套餐',
        // '6016': '代用币',
        // '6017': '充值免单',
        // '6020': '参与游戏获秒杀资格',
        // '6021': '参与游戏获免费资格',
        // '6030': '关注有礼',
        // '6031': '升级赠送',
        // '6040': '凑单',
        // '6041': '砍价',
        // '6050': '评赏',
        // '6051': '抽奖',
        // '6052': '打赏',
        // '6053': '商城',
        // '6054': '预定',
        // '6060': '排队',
        // '6061': '不定期权益',
        // '6032': '生日活动'

    }
    $scope.username = $routeParams.name
    $scope.post = {};
    // '6001': false,
    // '6002': false,
    // '6003': false,
    // '6004': false,
    // '6005': false,
    // '6006': false,
    // '6007': false,
    // '6008': false,
    // '6009': false,
    // '6011': false,
    // '6012': false,
    // '6013': false,
    // '6014': false,
    // '6015': false,
    // '6016': false,
    // '6017': false,
    // '6020': false,
    // '6021': false,
    // '6030': false,
    // '6031': false,
    // '6040': false,
    // '6041': false,
    // '6050': false,
    // '6051': false,
    // '6052': false,
    // '6053': false,
    // '6054': false
    // $scope.name = []
    $http.get(basic_url + '/activities/guest/' + $routeParams.id + '?' + getUrl()).success(function (res) {
        if (res.code == 200) {
            console.log(res.result);
            for (var i in res.result) {
                // $scope.post[res.result[i]] = true; //获取拥有的权限
                $scope.post[res.result[i].code] = res.result[i].enabled
                $scope.view.type[res.result[i].code] = res.result[i].name
            }
        }
        console.log($scope.post);
        console.log($scope.view.type);
    });
    $scope.$watch('view.all', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            if (newVal) {
                angular.forEach($scope.post, function (value, key) {
                    this[key] = true;
                }, $scope.post)
            } else {
                angular.forEach($scope.post, function (value, key) {
                    this[key] = false;
                }, $scope.post)
            }
        }
    });
    // 点击确定
    $scope.submitFn = function () {
        var json = [];
        for (var i in $scope.post) {
            if ($scope.post[i]) {
                json.push(i);
            }
        }
        $http.post(basic_url + '/activities/guest/' + $routeParams.id + '?' + getUrl(), json).success(function (data) {
            if (data.code == 200) {
                alert("绑定成功！");
            } else {
                alert(data.message);
            }
        });
    }
}]);
app.controller('adCtr', ['$scope', '$location', '$http', '$routeParams', function ($scope, $location, $http, $routeParams) { //
    $scope.config.name = "广告管理";
    $scope.config.url = "/user/index.html";
    $scope.view = {
        ads: {},
    }
    left_active = location.pathname.split("/");
    $("." + location.hash.split("/")[1] + "_index").addClass("active");
    $(".city_index").removeClass("active");
    $scope.post = {
        '6001': false,
        '6002': false,
        '6003': false,
        '6004': false,
        '6005': false,
        '6006': false,
        '6007': false,
        '6008': false,
        '6009': false,
        '6011': false,
        '6012': false,
        '6013': false,
        '6014': false,
        '6015': false,
        '6016': false,
        '6017': false,
        '6020': false,
        '6021': false,
        '6030': false,
        '6031': false,
        '6040': false,
        '6041': false,
        '6050': false,
        '6051': false,
        '6052': false,
        '6053': false,
        '6054': false
    };
    $http.get(basic_url + '/placards?' + getUrl()).success(function (res) {
        if (res.code == 200) {
            $scope.view.ads = res.result;
        }
    });
    $scope.create = function () {
        $location.path("/placards/add");
    }
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.ads.page,
            count: $scope.view.ads.count
        };
        $http.get(basic_url + '/placards?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.ads = res.result;
            }
        });
    };
    $scope.editFn = function (id) {
        $location.path("/placards/edit/" + id);
    }
    $scope.deleteFn = function (id, index) {
        var result = confirm("确定要删除吗？");
        if (result) {
            $http.delete(basic_url + '/placards/' + id + "?" + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    $scope.view.ads.items.splice(index, 1);
                } else {
                    alert(res.message);
                }
            });
        }
    }
}]);
app.controller('adAddCtr', ['$scope', '$location', '$http', '$routeParams', function ($scope, $location, $http, $routeParams) { //
    $scope.config.name = "广告管理";
    $scope.config.url = "/user/index.html";
    $scope.view = {
        all: false
    }
    $scope.post = {};
    if ($routeParams.id) {
        $http.get(basic_url + '/placards/' + $routeParams.id + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                $scope.post = res.result;
            }
        });
    }
    $http.get(basic_url + '/materials?' + sortUrl()).success(function (res) {
        if (res.result) {
            $scope.view.urls = res.result;
        }
    });
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.urls.page,
            count: $scope.view.urls.count
        };
        $http.get(basic_url + '/materials?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.urls = res.result;
            }
        });
    };
    $scope.openFn = function (type) {
        $scope.view.type = type;
        $scope.view.picUrl = "";
        $scope.view.urls.page = 1;
        $scope.pageChange();
        $("#pic").modal("show");
    }
    $scope.sendPicFn = function () {
        $scope.post[$scope.view.type] = $scope.view.picUrl;
        $("#pic").modal("hide");
    }
    $scope.submitFn = function () {
        if (!$scope.post.transversePicUrl) {
            alert("请先选择图片");
            return;
        }
        if ($routeParams.id) {
            $http.put(basic_url + '/placards/' + $routeParams.id + '?' + getUrl(), $scope.post).success(function (data) {
                if (data.code == 200) {
                    alert("操作成功！");
                    $location.path("/placards");
                } else {
                    alert(data.message);
                }
            });
        } else {
            $http.post(basic_url + '/placards?' + getUrl(), $scope.post).success(function (data) {
                if (data.code == 200) {
                    alert("操作成功！");
                    $location.path("/placards");
                } else {
                    alert(data.message);
                }
            });
        }
    }
}]);
app.controller('cityCtr', ['$scope', '$location', '$http', '$routeParams', function ($scope, $location, $http, $routeParams) { //
    $scope.config.name = "城市广告管理";
    $scope.config.url = "/user/index.html";
    $scope.view = {
        ad: new Array(5),
        index: 0
    };
    $scope.post = {};
    left_active = location.pathname.split("/");
    $("." + location.hash.split("/")[1] + "_index").addClass("active");
    $(".placards_index").removeClass("active");

    $http.get(basic_url + '/area/city/opened?' + sortUrl()).success(function (res) {
        if (res.result) {
            $scope.view.city = res.result;
            $scope.chooseFn(0);

        }
    });
    $http.get(basic_url + '/placards?' + sortUrl()).success(function (res) {
        if (res.result) {
            $scope.view.placards = res.result;
        }
    });
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.placards.page,
            count: $scope.view.placards.count
        };
        $http.get(basic_url + '/placards?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.placards = res.result;
            }
        });
    };
    $scope.chooseFn = function (index) {
        $scope.view.index = index; //哪个城市
        $http.get(basic_url + '/placards/city/' + $scope.view.city[index].code + '/front?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                $scope.view.ad = new Array(5);
                for (var i in res.result) {
                    $scope.view.ad[res.result[i].place - 1] = res.result[i];
                }
            } else {
                $scope.view.ad = new Array(5);
            }
        });
    }
    $scope.openFn = function (index) {
        $scope.post.place = index + 1; //第几条
        $("#dialog").modal("show");
    }
    $scope.deleteFn = function (index) {
        var result = confirm("确认删除？删除后不可恢复哟");
        if (!result) return;
        $scope.post.place = index + 1; //第几条
        $scope.post.adsId = '';
        $http.delete(basic_url + '/placards/front/' + $scope.view.ad[index].id + '?' + getUrl()).success(function (data) {
            if (data.code == 200) {
                $scope.view.ad[index] = "";
            } else {
                alert(data.message);
            }
        });
    }
    $scope.submitFn = function () {
        $http.post(basic_url + '/placards/city/' + $scope.view.city[$scope.view.index].code + '/front?' + getUrl(), $scope.post).success(function (data) {
            if (data.code == 200) {
                $http.get(basic_url + '/placards/city/' + $scope.view.city[$scope.view.index].code + '/front?' + sortUrl()).success(function (res) {
                    if (res.code == 200) {
                        $scope.chooseFn($scope.view.index);
                        $("#dialog").modal("hide");

                    } else {
                        $scope.view.ad = new Array(5);
                    }
                });
            } else {
                alert(data.message);
            }
        });

    }
}]);

app.controller('dealCtr', ['$scope', '$location', 'messageFactory', '$http', '$filter', function ($scope, $location, msgFac, $http, $filter) {

    $scope.view = {};
    $scope.posts = {};
    $scope.initTimeFn = function () {
        var date = new Date();
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        $scope.posts.endTime = date;
        var date1 = new Date();
        date1.setHours(0);
        date1.setMinutes(0);
        date1.setSeconds(0);
        date1.setDate(date.getDate() - 7);
        $scope.posts.startTime = date1;
        $scope.view.initTime = ($filter('date')(new Date(), "yyyy-MM-dd") + "T59:59");
    };
    $scope.initTimeFn();
    $scope.searchFn = function (id) {
        if (id) $scope.posts.selector = id;
        if (($scope.posts.endTime - $scope.posts.startTime) / (1000 * 60 * 60 * 24) > 31) {
            alert("起止时间不能超过31天");
            return;
        }
        $('#loadingDiv').show();
        var param = {};
        param.startTime = $filter('date')($scope.posts.startTime, "yyyy-MM-dd HH:mm:ss");
        param.endTime = $filter('date')($scope.posts.endTime, "yyyy-MM-dd HH:mm:ss");
        $http.get(basic_url + '/finance?' + getUrl(param)).success(function (res) {
            if (res.code == 200) {
                $scope.view.messages = res.result;
                $('#loadingDiv').hide();
            } else {
                $scope.view.messages = null;
                $('#loadingDiv').hide();
            }
        });
    };
    $scope.searchFn();
    $scope.pageChange = function () {
        if (($scope.posts.endTime - $scope.posts.startTime) / (1000 * 60 * 60 * 24) > 31) {
            alert("起止时间不能超过31天");
            return;
        }
        $('#loadingDiv').show();
        $('tbody').hide();
        var param = {};
        param.startTime = $filter('date')($scope.posts.startTime, "yyyy-MM-dd HH:mm:ss");
        param.endTime = $filter('date')($scope.posts.endTime, "yyyy-MM-dd HH:mm:ss");
        param.page = $scope.view.messages.page;
        param.count = $scope.view.messages.count;
        $http.get(basic_url + '/finance?' + $scope.jsonToUrl(param)).success(function (res) {
            if (res.code == 200) {
                $scope.view.messages = res.result;
                $('#loadingDiv').hide();
                $('tbody').show();
            } else {
                console.log(1111);
                $('#loadingDiv').hide();
            }
        });
    };

    $scope.delete = function (index) {
        if (confirm("确定删除？")) {
            $http.delete(basic_url + '/message/' + index + "?" + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    console.log(res);
                    msgFac.query(function (res) {
                        $scope.view.messages = res.result;
                    });
                } else {
                    alert("删除失败");
                }
            });
        }
    }
}]);

app.controller('allocateCtr', ['$scope', '$location', 'messageFactory', '$http', '$filter', function ($scope, $location, msgFac, $http, $filter) {

    $scope.view = {};
    $scope.type = '';
    $scope.posts = {};
    $scope.edit = {};
    $scope.posts.state = '';
    $http.get(basic_url + '/profits?' + sortUrl()).success(function (res) {
        if (res.code == 200) {
            $scope.posts.messages = res.result;
        }
    });
    $scope.change = function (type) {
        $scope.type = type;
        $scope.posts.state = type;
        if (type == '1111') { //划款
            var param = {};
            param.startTime = $filter('date')($scope.posts.startTime, "yyyy-MM-dd HH:mm:ss");
            param.endTime = $filter('date')($scope.posts.endTime, "yyyy-MM-dd HH:mm:ss");

            $http.get(basic_url + '/profits/transfer?' + $scope.jsonToUrl(param)).success(function (res) {
                if (res.code == 200) {
                    $scope.posts.messages = res.result;
                }
            });
            // } else if (type == '1000') { //申请中
            //     $http.get(basic_url + '/profits/extracts?' + sortUrl()).success(function (res) {
            //         if (res.code == 200) {
            //             $scope.posts.messages = res.result;
            //         } 
            //     });
        } else {
            $http.get(basic_url + '/profits?' + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    $scope.posts.messages = res.result;
                }
            });
        }
    };
    $scope.initTimeFn = function () {
        var date = new Date();
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        $scope.posts.endTime = date;
        var date1 = new Date();
        date1.setHours(0);
        date1.setMinutes(0);
        date1.setSeconds(0);
        date1.setDate(date.getDate() - 7);
        $scope.posts.startTime = date1;
        $scope.posts.initTime = ($filter('date')(new Date(), "yyyy-MM-dd") + "T59:59");;
    };
    $scope.initTimeFn();
    $scope.searchFn = function (id) {
        if (($scope.posts.endTime - $scope.posts.startTime) / (1000 * 60 * 60 * 24) > 31) {
            alert("起止时间不能超过31天");
            return;
        }
        var param = {};
        param.startTime = $filter('date')($scope.posts.startTime, "yyyy-MM-dd HH:mm:ss");
        param.endTime = $filter('date')($scope.posts.endTime, "yyyy-MM-dd HH:mm:ss");

        $http.get(basic_url + '/profits/extracts?' + $scope.jsonToUrl(param)).success(function (res) {
            if (res.code == 200) {
                $scope.posts.messages = res.result;
            }
        });
    };
    $scope.pageChange = function () {
        var json = {
            page: $scope.posts.messages.page,
            count: $scope.posts.messages.count
        };
        if ($scope.type == '1111') {
            var param = {
                page: $scope.posts.messages.page,
                count: $scope.posts.messages.count
            };
            param.startTime = $filter('date')($scope.posts.startTime, "yyyy-MM-dd HH:mm:ss");
            param.endTime = $filter('date')($scope.posts.endTime, "yyyy-MM-dd HH:mm:ss");
            $http.get(basic_url + '/profits/extracts?' + $scope.jsonToUrl(param)).success(function (res) {
                if (res.result) {
                    $scope.posts.messages = res.result;
                }
            });
        } else {
            $http.get(basic_url + '/profits?' + $scope.jsonToUrl(json)).success(function (res) {
                if (res.code == 200) {
                    $scope.posts.messages = res.result;
                }
            });
        }
    };
    $scope.audit = function (index) {
        $("#edit").modal("show");
        $http.get(basic_url + '/profits/extracts/' + index + "?" + sortUrl()).success(function (res) {
            if (res.code == 200) {
                $scope.edit.message = res.result;
            } else {
                alert(res.message);
            }
        });
        $http.get(basic_url + '/wallets?' + sortUrl()).success(function (res) {
            $scope.edit.wallets = res.result;
        });

    };
    $scope.affirm = function (index, state) {
        if (state == 1004) {
            if (!($('#wallet_des').val())) {
                alert('请填写驳回备注');
                return false;
            }
        }
        if ($('#wallet_des').val().length > 50) {
            alert('备注长度为50字以内');
            return false;
        }
        $http.post(basic_url + '/profits/wallet/' + index + "?" + getUrl(), {
            "state": state,
            "description": $('#wallet_des').val()
        }).success(function (res) {
            if (res.code == 200) {
                $scope.edit.message.wallet.state = '1111';
            } else {
                alert(res.message);
            }
        })
    };
    $("input[type=file]").change(function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            imgShow = $(this).parent().parent().find("img");
            imgShow.attr("src", objUrl);
            imgShow.width("100%");
        }
    });
    $scope.create = function () {
        $location.path("/allocate/wallets");
    }

    function pic_check(pic) {
        obj = $("." + pic + "Chose");
        input = $("." + pic + " input");
        if (!input.val() || input.val() !== "") {
            obj.text("已选择").addClass('btn-success').removeClass("btn-primary").removeClass("btn-error");

        } else {
            obj.text("请选择图片").addClass('btn-error').removeClass("btn-primary").removeClass("btn-success");
        }
    }
    $('#couponadd').submit(function () {
        if (!($("#file").val())) {
            alert("请先选择凭证图片");
            return false;
        }
        if ($scope.view.description && $scope.view.amount && $scope.view.fee && $scope.view.walletOutId) {

            POSTurl = basic_url + "/pics?" + sortUrl();
            options = {
                url: POSTurl,
                type: "POST",
                success: function (data) {
                    if (data.code == 200) {
                        if ($scope.edit.message.wallet.state == 1111) {
                            $scope.view.voucher = data.result.url;
                            $scope.view.extractId = $scope.edit.message.id;
                            console.log($scope.view);
                            $http.post(basic_url + '/profits/transfer?' + sortUrl(), $scope.view).success(function (res) {
                                if (res.code == 200) {
                                    // window.onload();
                                    // $location.path("/allocate/index.html#/allocate");
                                    location.reload();

                                } else {
                                    alert(res.message);
                                }
                            });
                        } else {
                            alert('请先确认申请信息');
                            return false;
                        }

                    } else {
                        alert(data.message);
                    }
                }
            };
            $(this).ajaxSubmit(options);
            return false;
        } else {
            alert('请将信息填写完整');
            return false;
        }

    });


}]);

app.controller('allocateWalletsCtr', ['$scope', '$location', 'messageFactory', '$http', '$filter', function ($scope, $location, msgFac, $http, $filter) {

    $scope.view = {};
    $scope.posts = {};
    $scope.addW = function () {
        $("#add").modal("show");
    }
    $http.get(basic_url + '/wallets?' + sortUrl()).success(function (res) {
        $scope.view.messages = res.result;
    });
    $scope.audit = function (index) {
        $("#edit").modal("show");
        $http.get(basic_url + '/wallets/' + index + "?" + sortUrl()).success(function (res) {
            $scope.posts = res.result;
        });
    };
    $scope.delete = function (index) {
        if (confirm("确定删除？")) {
            $http.delete(basic_url + '/wallets/' + index + "?" + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    console.log(res);
                    $http.get(basic_url + '/wallets?' + sortUrl()).success(function (res) {
                        $scope.view.messages = res.result;
                    });
                } else {
                    alert("删除失败");
                }
            });
        }
    };

    function checkCard(cardNo) {
        if (isNaN(cardNo)) return false;
        if (cardNo.length < 12) {
            return false;
        }
        var nums = cardNo.split("");
        var sum = 0;
        var index = 1;
        for (var i = 0; i < nums.length; i++) {
            if ((i + 1) % 2 == 0) {
                var tmp = Number(nums[nums.length - index]) * 2;
                if (tmp >= 10) {
                    var t = tmp + "".split("");
                    tmp = Number(t[0]) + Number(t[1]);
                }
                sum += tmp;
            } else {
                sum += Number(nums[nums.length - index]);
            }
            index++;
        }
        if (sum % 10 != 0) {
            return false;
        }
        return true;
    };
    $('#add form').submit(function () {
        /*text_check = new text_check_new();
        if (!text_check.pic_check()) {
        return false
        }*/
        if (!($("#identityPic").val())) {
            alert("请先选择图片");
            return false;
        }
        if (!($("#cardPic").val())) {
            alert("请先选择图片");
            return false;
        }
        if (!(/^1[3456789]\d{9}$/.test($scope.posts.phone))) {
            alert("手机号码有误，请重填");
            return false;
        }
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test($scope.posts.identityNo) === false) {
            alert("身份证输入不合法");
            return false;
        }
        if (!checkCard($scope.posts.cardNo)) {
            alert('银行卡输入错误,请核对后请重新提交');
            return false;
        }
        POSTurl = basic_url + "/wallets/pic?" + sortUrl();
        options = {
            url: POSTurl,
            type: "POST",
            success: function (data) {
                if (data.code == 200) {
                    $scope.posts.cardPicUrl = data.result.cardPicUrl;
                    $scope.posts.identityPicUrl = data.result.identityPicUrl;
                    $http.post(basic_url + '/wallets?' + sortUrl(), $scope.posts).success(function (res) {
                        console.log(res);
                        if (res.code == 200) {
                            $(".add").modal("hide");
                            alert("操作成功");
                            location.reload();
                        } else {
                            alert(res.message);
                        }
                        // $(this).resetForm();
                    });
                } else {
                    alert(data.message);
                }
            }
        };
        $(this).ajaxSubmit(options);
        return false;
    });
    $('#edit form').submit(function () {
        if (!(/^1[3456789]\d{9}$/.test($scope.posts.phone))) {
            alert("手机号码有误，请重填");
            return false;
        }
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test($scope.posts.identityNo) === false) {
            alert("身份证输入不合法");
            return false;
        };
        if (!checkCard($scope.posts.cardNo)) {
            alert('银行卡输入错误,请核对后请重新提交');
            return false;
        }
        if ($('.cardPicChose').text() == "已选择") {
            POSTurl = basic_url + "/wallets/pic?" + sortUrl();
            options = {
                url: POSTurl,
                type: "POST",
                success: function (data) {
                    if (data.code == 200) {
                        if ($('.identityPicChose').text() == "已选择") {
                            $scope.posts.cardPicUrl = data.result.cardPicUrl;
                            $scope.posts.identityPicUrl = data.result.identityPicUrl;
                        } else {
                            $scope.posts.cardPicUrl = data.result.cardPicUrl;
                        }
                        $http.post(basic_url + '/wallets?' + sortUrl(), $scope.posts).success(function (res) {
                            console.log(res);
                            $(".add").modal("hide");
                            alert("操作成功");
                            location.reload();
                        });
                    } else {
                        alert(data.message);
                    }
                }
            }
            $(this).ajaxSubmit(options);
            return false;
        } else {
            POSTurl = basic_url + "/wallets/pic?" + sortUrl();
            options = {
                url: POSTurl,
                type: "POST",
                success: function (data) {
                    if (data.code == 200) {
                        if ($('.identityPicChose').text() == "已选择") {
                            $scope.posts.identityPicUrl = data.result.identityPicUrl;
                        }
                        $http.post(basic_url + '/wallets?' + sortUrl(), $scope.posts).success(function (res) {
                            console.log(res);
                            $(".add").modal("hide");
                            alert("操作成功");
                            location.reload();
                        });
                    } else {
                        alert(data.message);
                    }
                }
            }
            $(this).ajaxSubmit(options);
            return false;
        }
    });

}]);

app.controller('orderCtr', ['$scope', '$location', 'messageFactory', '$http', '$filter', '$routeParams', function ($scope, $location, msgFac, $http, $filter, $routeParams, ) {
    $scope.view = {};
    $scope.posts = {};
    $scope.username = $routeParams.name
    // $scope.posts.shopId = $routeParams.id;
    $scope.initTimeFn = function () {
        var date1 = new Date();
        date1.setHours(0);
        date1.setMinutes(0);
        date1.setSeconds(0);
        // $scope.posts.date = date1.toLocaleDateString();
        $scope.posts.date = date1;
        $scope.posts.initTime = $filter('date')(new Date(), "yyyy-MM-dd");
    };
    $http.get(basic_url + '/balance/guest/' + $routeParams.id + '/shops?' + sortUrl()).success(function (res) {
        if (res.code == 200) {
            $scope.posts.shops = res.result;
        }
    });
    $scope.initTimeFn();
    $scope.searchFn = function () {
        if (($scope.posts.date - $scope.posts.initTime) / (1000 * 60 * 60 * 24) > 1) {
            alert("时间不能超过今天");
            return;
        }
        var param = {};
        param.date = $filter('date')($scope.posts.date, "yyyy-MM-dd HH:mm:ss");
        param.category = $scope.posts.category;
        param.amount = $scope.posts.amount;
        if (param.date && param.category && param.amount && $scope.posts.guestId) {
            // $http.get(basic_url + '/balance/shop/' + $routeParams.id + '?' + getUrl(), param).success(function (res) {
            $http.get(basic_url + '/balance/shop/' + $scope.posts.guestId + '?' + $scope.jsonToUrl(param)).success(function (res) {
                if (res.code == 200) {
                    $scope.posts.messages = res.result;
                } else {
                    $scope.posts.messages = ""
                }
            });
        } else {
            alert('请填写完整信息');
            return
        }
    };
    $scope.create = function (id) {
        var category = $scope.posts.category;
        // $location.path("/order/update/"+ id+"/"+ $routeParams.id+"/"+ category);
        $location.path("/order/update/" + id + "/" + $routeParams.id + "/" + category);
    }
}]);

app.controller('orderEditCtr', ['$scope', '$location', '$http', '$filter', '$routeParams', function ($scope, $location, $http, $filter, $routeParams, ) {
    $scope.view = {};
    $scope.posts = {};
    $scope.initTimeFn = function () {
        var date1 = new Date();
        date1.setHours(0);
        date1.setMinutes(0);
        date1.setSeconds(0);
        $scope.posts.tradeTime = date1;
        $scope.posts.initTime = ($filter('date')(new Date(), "yyyy-MM-dd") + "T59:59");;
    };
    $http.get(basic_url + '/balance/shop/' + $routeParams.shop + '/order/' + $routeParams.id + '/' + $routeParams.category + '?' + sortUrl()).success(function (res) {
        if (res.code == 200) {
            $scope.posts.message = res.result;
        }
    });
    $scope.initTimeFn();
    $scope.send = function () {
        var param = {};
        param.payMode = $scope.posts.payMode;
        param.tradeTime = $filter('date')($scope.posts.tradeTime, "yyyy-MM-dd HH:mm:ss");
        if ($scope.posts.payMode == '1000' && $scope.posts.referenceNo && $scope.posts.traceNo) { //刷卡
            param.referenceNo = $scope.posts.referenceNo;
            param.traceNo = $scope.posts.traceNo;
        } else if ($scope.posts.payMode != '1000' && $scope.posts.tradeNo && $scope.posts.tansNo && $scope.posts.channelNo) {
            param.tradeNo = $scope.posts.tradeNo;
            param.tansNo = $scope.posts.tansNo;
            param.channelNo = $scope.posts.channelNo;
        } else {
            alert('请填写完整信息');
            return;
        }
        $http.post(basic_url + '/balance/shop/' + $routeParams.shop + '/order/' + $routeParams.id + '/' + $routeParams.category + '?' + sortUrl(), param).success(function (res) {
            if (res.code == 200) {
                alert('提交成功');
                $location.path("/order/" + $routeParams.shop);
            } else {
                alert(res.message);
            }
        });
        console.log(param);
    }
}]);

app.controller('accountsCtr', ['$scope', '$location', 'messageFactory', '$http', '$filter', function ($scope, $location, msgFac, $http, $filter) {
    $scope.posts = {}
    // $scope.types = [{
    //     id: "8001",
    //     name: "费率分成"
    // }, {
    //     id: "8002",
    //     name: "打赏小红花"
    // }, {
    //     id: "8003",
    //     name: "用户分销赏金"
    // }, {
    //     id: "8004",
    //     name: "用户分销佣金"
    // }, {
    //     id: "8010",
    //     name: "充值提成"
    // }, {
    //     id: "8011",
    //     name: "入会提成"
    // }, {
    //     id: "8012",
    //     name: "月卡提成"
    // }, {
    //     id: "8020",
    //     name: "消费售券"
    // }, {
    //     id: "8021",
    //     name: "消费售卡"
    // }, {
    //     id: "8022",
    //     name: "储值卡"
    // }]
    $scope.showpop = false;
    $scope.view = {}
    $scope.closepop = function () {
        $scope.showpop = false;
        $scope.eaitpop = false;
        $scope.edit = {}
        $scope.posts = {}
    }
    $scope.addBtn = function () {
        $scope.showpop = true;
    }
    $scope.param = {
        page: 1,
        count: 10
    }
    // 获取业务
    $http.get(basic_url + '/allocate/business?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.types = res.result;

        }
    });
    $http.get(basic_url + '/allocate?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.view.messages = res.result;

        }
    });
    $scope.filterfn = function (code) {
        for (var i = 0; i < $scope.types.length; i++) {
            if ($scope.types[i].code == code) {
                return $scope.types[i].text
            }
        }
    }
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.messages.page,
            count: $scope.view.messages.count
        };
        $http.get(basic_url + '/allocate?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.messages = res.result;
            }
        });
    };
    $scope.submit = function () {
        console.log($scope.posts.type + '&&' + $scope.posts.accountIn + '&&' + $scope.posts.bankName + '&&' + $scope.posts.cardNo + '&&' + $scope.posts.name)
        if ($scope.posts.type && $scope.posts.accountIn && $scope.posts.bankName && $scope.posts.cardNo && $scope.posts.name) {
            $http.post(basic_url + '/allocate?' + sortUrl(), $scope.posts).success(function (res) {
                if (res.code == 200) {
                    alert("操作成功")
                    location.reload();

                } else {
                    alert(res.message);
                }
            });
        }
    }
    $scope.auditbtn = function (message) {
        $scope.eaitpop = true;
        $scope.edit = angular.copy(message)
    };
    $scope.audit = function () {
        var id = angular.copy($scope.edit.id)
        delete $scope.edit.id
        $http.put(basic_url + '/allocate/' + id + '?' + sortUrl(), $scope.edit).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    };
    $scope.del = function (id) {
        $http.delete(basic_url + '/allocate/' + id + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    };
}]);
// 分账管理
app.controller('userAcountsRuleCtr', ['$scope', '$location', 'messageFactory', '$http', '$filter', '$routeParams', function ($scope, $location, msgFac, $http, $filter, $routeParams, ) {
    $scope.view = {};
    $scope.post = {
        units: [],
        name: '',
        contractNo: '',
        contractSsn: '',
        reason: '',
        descriptor: '',

        mchId: $routeParams.mchId
    };
    $scope.showpop = false;
    $scope.param = {
        page: 1,
        count: 10
    }
    $scope.state = ''
    // 新增弹窗()
    $scope.addBtn = function () {
        $scope.showpop = true;
        $scope.state = 'add'
        $scope.post = {
            units: [],
            name: '',
            contractNo: '',
            contractSsn: '',
            reason: '',
            descriptor: '',

            mchId: $routeParams.mchId
        };
    }
    $scope.closepop = function () {
        $scope.showpop = false;
    }
    // 修改
    $scope.auditbtn = function (item) {
        $scope.showpop = true;
        $scope.post = item;
        console.log(item)
        console.log($scope.view.rules)
        $scope.state = 'edit'
        for (let i = 0, len = item.units.length; i < len; i++) { // 循环本行的unit
            for (let j = 0, length = $scope.view.rules.length; j < length; j++) {
                if (item.units[i] == $scope.view.rules[j].id) {
                    $scope.view.rules[j].checked = true
                }
            }
        }

    }
    $scope.line = function (state, id) {
        let url;
        if (state == 'on') {
            url = basic_url + '/guest/' + $routeParams.id + '/allocates/' + id + '/on?' + sortUrl()
        } else {
            url = basic_url + '/guest/' + $routeParams.id + '/allocates/' + id + '/off?' + sortUrl()
        }
        $http.post(url).success(function (res) {
            if (res.code == 200) {
                alert('操作成功')
                location.reload();
            }
        });

    }
    $scope.post = function (id) {
        let url = basic_url + '/guest/' + $routeParams.id + '/allocates/' + id + '/import?' + sortUrl()
        $http.post(url).success(function (res) {
            if (res.code == 200) {
                alert('发布成功')
                location.reload();
            }
        });

    }
    // 删除规则
    $scope.del = function (id) {
        if (confirm("确定删除？")) {
            $http.delete(basic_url + '/guest/' + $routeParams.id + '/allocates/' + id + '?' + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    alert("操作成功")
                    location.reload();

                } else {
                    alert(res.message);
                }
            });
        }
    }
    // 弹窗保存
    $scope.addsubmit = function () {

        let unitArr = [];
        if ($scope.view.rules[1]) {
            for (let i in $scope.view.rules[1]) {
                if ($scope.view.rules[1][i].checked) {
                    unitArr.push($scope.view.rules[1][i].id)
                }
            }
        }
        if ($scope.view.rules[3]) {
            for (let i in $scope.view.rules[3]) {
                if ($scope.view.rules[3][i].checked) {
                    unitArr.push($scope.view.rules[3][i].id)
                }
            }
        }

        $scope.post.units = unitArr;

        if ($scope.state == 'add') {
            $http.post(basic_url + '/guest/' + $routeParams.id + '/allocates?' + sortUrl(), $scope.post).success(function (res) {
                if (res.code == 200) {
                    alert('添加成功')
                    location.reload();
                } else {
                    alert(res.message);
                }
            });
        } else {
            $http.put(basic_url + '/guest/' + $routeParams.id + '/allocates/' + $scope.post.id + '?' + sortUrl(), $scope.post).success(function (res) {
                if (res.code == 200) {
                    alert('修改成功')
                    location.reload();
                } else {
                    alert(res.message);
                }
            });
        }

    }
    // 列表
    $http.get(basic_url + '/guest/' + $routeParams.id + '/allocates/mch/' + $routeParams.mchId + '?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.view.mchs = res.result;
        }
    });
    // 分账规则
    $http.get(basic_url + '/guest/' + $routeParams.id + '/allocates/units?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.view.rules = res.result;

        }
    });
}]);
// tianjia
app.controller('userAcountsCtr', ['$scope', '$location', 'messageFactory', '$http', '$filter', '$routeParams', function ($scope, $location, msgFac, $http, $filter, $routeParams, ) {
    $scope.posts = {}
    $scope.posts.actions = []
    $scope.posts.shops = {};
    $scope.types = [{
        id: "8001",
        name: "费率分成"
    }, {
        id: "8002",
        name: "打赏小红花"
    }, {
        id: "8003",
        name: "用户分销赏金"
    }, {
        id: "8004",
        name: "用户分销佣金"
    }, {
        id: "8010",
        name: "充值提成"
    }, {
        id: "8011",
        name: "入会提成"
    }, {
        id: "8012",
        name: "月卡提成"
    }, {
        id: "8020",
        name: "消费售券"
    }, {
        id: "8021",
        name: "消费售卡"
    }, {
        id: "8022",
        name: "储值卡"
    }]
    $scope.showpop = false;
    $scope.view = {}
    console.log($routeParams.name)
    $scope.username = $routeParams.name;
    $scope.guestId = $routeParams.id;
    $scope.set = {
        list: [],
        shops: [],
        actions: []
    }
    $scope.addtypes = []
    $scope.closepop = function () {
        $scope.showpop = false;
        $scope.eaitpop = false;
        $scope.edit = {}
        $scope.posts = {}
    }
    $scope.addBtn = function () {
        $scope.showpop = true;
    }
    $scope.param = {
        page: 1,
        count: 10
    }

    $http.get(basic_url + '/guest/' + $routeParams.id + '/allocates/units?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.view.messages = res.result;
        }
    });
    $http.get(basic_url + '/allocate/business?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.addtypes = res.result;
        }
    });
    $http.get(basic_url + '/guest/' + $routeParams.id + '/allocates/mchs?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.view.mchs = res.result;
        }
    });
    $http.get(basic_url + '/shop/guest/' + $routeParams.id + '/usable?' + sortUrl()).success(function (res) {
        if (res.code == 200) {
            $scope.set.list = res.result;
            console.log($scope.set.list)
        }
    });


    $scope.filterfn = function (id) {
        for (var i = 0; i < $scope.types.length; i++) {
            if ($scope.types[i].id == id) {
                return $scope.types[i].name
            }
        }
    }
    $scope.filShop = function (val) {
        let str = '';
        for (var i in val) {
            str += val[i] + '、'
        }
        // console.log(str)
        return str;

    }
    $scope.filteractivefn = function (val) {
        if (val == 'ONLINE') {
            return '线上'
        }
        if (val == 'OFFLINE') {
            return '线下'
        }
    }
    $scope.checkAllShops = function () { //
        if ($scope.set.allShop) { //
            var shops = [];
            for (var i = 0; i < $scope.set.list.length; i++) {
                shops.push($scope.set.list[i].id)
            }
            // $scope.set.shops= angular.copy($scope.set.list)
            $scope.set.shops = shops
            console.log($scope.set.shops)
        } else { //
            $scope.set.shops = [];
        }
    }
    $scope.checkShops = function (key) {
        if (key == false) {
            delete key
            $scope.set.allShop = false;
        }
        var arr = $scope.set.shops.filter(function (s) {
            return s && s.trim();
        });
        if (arr.length == $scope.set.list.length) {
            $scope.set.allShop = true
        } else {
            $scope.set.allShop = false;
        }
    }
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.messages.page,
            count: $scope.view.messages.count
        };
        $http.get(basic_url + '/allocate?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.messages = res.result;
            }
        });
    };
    // 提交新加的规则
    $scope.submit = function () {
        $scope.set.shops = $scope.set.shops.filter(function (s) {
            return s && s.trim();
        });
        $scope.posts.actions = $scope.set.actions.filter(function (s) {
            return s && s.trim();
        });
        for (var i = 0; i < $scope.set.shops.length; i++) {
            for (var k = 0; k < $scope.set.list.length; k++) {
                if ($scope.set.shops[i] == $scope.set.list[k].id) {
                    var id = $scope.set.shops[i]
                    var name = $scope.set.list[k].name
                    $scope.posts.shops[id] = name
                }

            }
        }

        if ($scope.posts.name && $scope.posts.business && $scope.posts.fixed && $scope.posts.scale && $scope.posts.limit && $scope.posts.actions && $scope.posts.contractVersion) {

            $http.post(basic_url + '/guest/' + $routeParams.id + '/allocates/units?' + sortUrl(), $scope.posts).success(function (res) {
                if (res.code == 200) {
                    alert("操作成功")
                    location.reload();

                } else {
                    alert(res.message);
                }
            });
        } else {
            alert("请填写完整")
        }
    }

    $scope.auditbtn = function (message) {
        $scope.eaitpop = true;
        console.log('修改')
        console.log(message)

        $scope.edit = angular.copy(message);

        for (var k = 0; k < $scope.set.list.length; k++) {
            var id = $scope.set.list[k].id
            if ($scope.edit.shops && $scope.edit.shops[id]) {
                $scope.set.shops[k] = id
            }
        }
        var arr = Object.keys(message)
        if (arr.length == $scope.set.list.length) {
            $scope.set.allShop = true
        }
        if (message.actions) {
            for (var i = 0; i < message.actions.length; i++) {
                if (message.actions[i] == 'ONLINE') {
                    $scope.set.actions[0] = 'ONLINE'
                }
                if (message.actions[i] == 'OFFLINE') {
                    $scope.set.actions[1] = 'OFFLINE'
                }
            }
            ss
        }



    };
    $scope.audit = function () {
        var id = angular.copy($scope.edit.id)
        delete $scope.edit.id
        var shops = $scope.set.shops.filter(function (s) {
            return s && s.trim();
        });
        $scope.edit.actions = $scope.set.actions.filter(function (s) {
            return s && s.trim();
        });
        $scope.edit.shops = {}
        for (var i = 0; i < shops.length; i++) {
            for (var k = 0; k < $scope.set.list.length; k++) {
                if (shops[i] == $scope.set.list[k].id) {
                    var key = shops[i]
                    var name = $scope.set.list[k].name
                    $scope.edit.shops[key] = name
                }

            }
        }
        $http.put(basic_url + '/guest/' + $routeParams.id + '/allocates/units/' + id + '?' + sortUrl(), $scope.edit).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    };
    $scope.del = function (id) {
        console.log(id)
        $http.delete(basic_url + '/guest/' + $routeParams.id + '/allocates/units/' + id + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    };
}]);

app.controller('brokerageCtr', ['$scope', '$location', 'messageFactory', '$http', '$filter', '$routeParams', function ($scope, $location, msgFac, $http, $filter, $routeParams, ) {
    $scope.posts = {}
    $scope.posts.shops = {}
    $scope.posts.paymentModes = []
    $scope.types = [{
        id: "8001",
        name: "费率分成"
    }, {
        id: "8002",
        name: "打赏小红花"
    }, {
        id: "8003",
        name: "用户分销赏金"
    }, {
        id: "8004",
        name: "用户分销佣金"
    }, , {
        id: "8010",
        name: "充值提成"
    }, {
        id: "8011",
        name: "入会提成"
    }, {
        id: "8012",
        name: "月卡提成"
    }, {
        id: "8020",
        name: "消费售券"
    }, {
        id: "8021",
        name: "消费售卡"
    }, {
        id: "8022",
        name: "储值卡"
    }]
    $scope.paymentModes = [{
            id: "1009",
            name: "富友微信"
        },
        {
            id: "1109",
            name: "富友支付宝"
        }
    ]
    $scope.showpop = false;
    $scope.view = {}
    console.log($routeParams.name)
    $scope.username = $routeParams.name
    $scope.set = {
        list: [],
        shops: [],
        unit: '',
        paymentModes: []
    }
    $scope.addtypes = []
    $scope.closepop = function () {
        $scope.showpop = false;
        $scope.eaitpop = false;
        $scope.edit = {}
        $scope.posts = {}
    }
    $scope.addBtn = function () {
        $scope.showpop = true;
        $scope.set.shops = [];
        $scope.set.allShop = false;
        $scope.set.startDate = '';
        $scope.set.endDate = '';
        $scope.set.paymentModes = [];
    }
    $scope.param = {
        page: 1,
        count: 10
    }
    $http.get(basic_url + '/guest/' + $routeParams.id + '/fee?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.view.messages = res.result;

        }
    });
    $http.get(basic_url + '/shop/guest/' + $routeParams.id + '/usable?' + sortUrl()).success(function (res) {
        if (res.code == 200) {
            $scope.set.list = res.result;
            console.log(res.result)
        }
    });
    $scope.filterfn = function (id) {
        for (var i = 0; i < $scope.types.length; i++) {
            if ($scope.types[i].id == id) {
                return $scope.types[i].name
            }
        }
    }
    $scope.paymentfilterfn = function (id) {
        for (var i = 0; i < $scope.paymentModes.length; i++) {
            if ($scope.paymentModes[i].id == id) {
                return $scope.paymentModes[i].name
            }
        }
    }
    $scope.checkAllShops = function () { //
        if ($scope.set.allShop) { //
            var shops = [];
            for (var i = 0; i < $scope.set.list.length; i++) {
                shops.push($scope.set.list[i].id)
            }
            // $scope.set.shops= angular.copy($scope.set.list)
            $scope.set.shops = shops
            console.log($scope.set.shops)
        } else { //
            $scope.set.shops = [];
        }
    }
    $scope.chanagebusiness = function () {
        if ($scope.posts.business == '8001' || $scope.edit.business == '8001') {
            $http.get(basic_url + '/guest/' + $routeParams.id + '/fee/units?' + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    console.log(res)
                    $scope.set.unit = res.result
                } else {
                    alert(res.message);
                }
            });
        } else {
            $scope.set.unit = ''
            if ($scope.posts.allocateUnitId) {
                delete $scope.posts.allocateUnitId
            }
            if ($scope.edit.allocateUnitId) {
                delete $scope.edit.allocateUnitId
            }
        }
    }
    $scope.checkShops = function (key) {
        if (key == false) {
            delete key
            $scope.set.allShop = false;
        }
        var arr = $scope.set.shops.filter(function (s) {
            return s && s.trim();
        });
        if (arr.length == $scope.set.list.length) {
            $scope.set.allShop = true
        } else {
            $scope.set.allShop = false;
        }
    }
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.messages.page,
            count: $scope.view.messages.count
        };
        $http.get(basic_url + '/guest/' + $routeParams.id + '/fee?' + sortUrl(json)).success(function (res) {
            if (res.code == 200) {
                $scope.view.messages = res.result;

            }
        });
    };
    $scope.timefilter = function timestampToTime(timestamp) {

        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

        var Y = date.getFullYear() + '-';

        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';

        var D = date.getDate() + ' ';

        var h = date.getHours() + ':';
        if (date.getHours() < 10) {
            h = '0' + date.getHours() + ':';
        }
        var m = date.getMinutes() + ':';
        if (date.getMinutes() < 10) {
            m = '0' + date.getMinutes() + ':';
        }
        var s = date.getSeconds();
        if (date.getSeconds() < 10) {
            s = '0' + date.getSeconds();
        }
        return Y + M + D + h + m + s;

    }
    $scope.submit = function () {

        $scope.set.shops = $scope.set.shops.filter(function (s) {
            return s && s.trim();
        });
        $scope.set.paymentModes = $scope.set.paymentModes.filter(function (s) {
            return s && s.trim();
        });
        var startDate = new Date($scope.set.startDate).getTime();
        var endDate = new Date($scope.set.endDate).getTime();
        $scope.posts.startDate = $scope.timefilter(startDate)
        $scope.posts.endDate = $scope.timefilter(endDate)
        $scope.posts.shops = $scope.set.shops
        $scope.posts.paymentModes = $scope.set.paymentModes
        console.log(endDate)
        if (true) {

            $http.post(basic_url + '/guest/' + $routeParams.id + '/fee?' + sortUrl(), $scope.posts).success(function (res) {
                if (res.code == 200) {
                    alert("操作成功")
                    location.reload();

                } else {
                    alert(res.message);
                }
            });

        } else {
            alert("请填写完整")
        }
    }

    $scope.auditbtn = function (message) {
        $scope.eaitpop = true;
        $scope.set.paymentModes = [];
        $scope.edit = angular.copy(message)
        $scope.chanagebusiness();
        if ($scope.edit.paymentModes) {
            console.log("进入")
            for (var k = 0; k < $scope.paymentModes.length; k++) {
                var id = $scope.paymentModes[k].id

                for (var j = 0; j < message.paymentModes.length; j++) {
                    if (message.paymentModes[j] == id) {
                        console.log("等于")
                        $scope.set.paymentModes[k] = id
                    }
                }

            }
        } else {
            $scope.edit.paymentModes = []
        }

        for (var k = 0; k < $scope.set.list.length; k++) {
            var id = $scope.set.list[k].id
            if ($scope.edit.shopNames[id]) {
                $scope.set.shops[k] = id
            }
        }
        var arr = Object.keys(message.shopNames)
        if (arr.length == $scope.set.list.length) {
            $scope.set.allShop = true
        }
        var startDate = $scope.edit.startDate.substring(0, 10) + "T" + $scope.edit.startDate.substring($scope.edit.startDate.length - 8, $scope.edit.startDate.length - 3);
        var endDate = $scope.edit.endDate.substring(0, 10) + "T" + $scope.edit.endDate.substring($scope.edit.endDate.length - 8, $scope.edit.endDate.length - 3);
        $scope.set.startDate = new Date(startDate)
        $scope.set.endDate = new Date(endDate)

    };
    $scope.audit = function () {
        var shops = $scope.set.shops.filter(function (s) {
            return s && s.trim();
        });
        $scope.set.paymentModes = $scope.set.paymentModes.filter(function (s) {
            return s && s.trim();
        });
        var startDate = new Date($scope.set.startDate).getTime();
        var endDate = new Date($scope.set.endDate).getTime();
        $scope.edit.startDate = $scope.timefilter(startDate)
        $scope.edit.endDate = $scope.timefilter(endDate)
        $scope.edit.shops = shops
        $scope.edit.paymentModes = $scope.set.paymentModes
        for (var i = 0; i < shops.length; i++) {
            for (var k = 0; k < $scope.set.list.length; k++) {
                if (shops[i] == $scope.set.list[k].id) {
                    var key = shops[i]
                    var name = $scope.set.list[k].name
                    $scope.edit.shops[key] = name
                }

            }
        }
        $http.put(basic_url + '/guest/' + $routeParams.id + '/fee/' + $scope.edit.id + '?' + sortUrl(), $scope.edit).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    };
    $scope.del = function (id) {
        $http.delete(basic_url + '/guest/' + $routeParams.id + '/fee/' + id + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    };
    $scope.online = function (id) {
        $http.post(basic_url + '/guest/' + $routeParams.id + '/fee/' + id + '/online' + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    };
    $scope.offline = function (id) {
        $http.post(basic_url + '/guest/' + $routeParams.id + '/fee/' + id + '/offline' + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    };
}]);

app.controller('spotterCtr', ['$scope', '$location', 'messageFactory', '$http', '$filter', function ($scope, $location, msgFac, $http, $filter, $event) {
    $scope.posts = {}
    $scope.types = [{
        id: 0,
        name: "0"
    }, {
        id: 1,
        name: "1"
    }, {
        id: 2,
        name: "2"
    }, {
        id: 3,
        name: "3"
    }, {
        id: 4,
        name: "4"
    }, {
        id: 5,
        name: "5"
    }]
    $scope.gradeRule = [

    ]
    $scope.showpop = false;
    $scope.view = {}
    $scope.closepop = function () {
        $scope.showpop = false;
        $scope.eaitpop = false;
        $scope.codepop = false;
        $scope.royaltypop = false;
        $scope.edit = {}
        $scope.posts = {}
        $scope.codes = {}
        $scope.id = '',
            $scope.codenumber = ''
    }
    $scope.addBtn = function () {
        $scope.showpop = true;
    }

    $scope.param = {
        page: 1,
        count: 10
    }
    $http.get(basic_url + '/spotters/grade?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.view.messages = res.result;

        }
    });
    //查询全部探员
    $http.get(basic_url + '/spotters?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.view.spotters = res.result;
        }
    });
    $scope.getAllSpotters = function (event, id) {
        if (id) {
            var spotters = '/spotters/grade/' + id + '?'
        } else {
            var spotters = '/spotters?'
        }
        var elem = document.querySelectorAll(".spotters")
        for (var i = 0; i < elem.length; i++) {
            angular.element(elem[i]).removeClass('spotActive')
        }
        // document.querySelectorAll(".spotters").removeClass('spotActive')
        $(event.target).addClass('spotActive')
        $http.get(basic_url + spotters + sortUrl($scope.param)).success(function (res) {
            if (res.code == 200) {
                $scope.view.spotters = res.result;
            } else {
                $scope.view.spotters = '';
            }
        })
    }
    $scope.filterfn = function (id) {
        for (var i = 0; i < $scope.types.length; i++) {
            if ($scope.types[i].id == id) {
                return $scope.types[i].name
            }
        }
    }
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.messages.page,
            count: $scope.view.messages.count
        };
        $http.get(basic_url + '/allocate?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.messages = res.result;
            }
        });
    };
    $scope.submit = function () {
        if ($scope.posts.grade && $scope.posts.name && $scope.posts.percentage && $scope.posts.primaryRoyalty && $scope.posts.secondaryRoyalty) {
            $http.post(basic_url + '/spotters/grade?' + sortUrl(), $scope.posts).success(function (res) {
                if (res.code == 200) {
                    alert("操作成功")
                    location.reload();

                } else {
                    alert(res.message);
                }
            });
        }
    }
    $scope.auditbtn = function (message) {
        $scope.eaitpop = true;
        console.log(message)
        $scope.edit = angular.copy(message)
        console.log($scope.edit)
    };
    $scope.audit = function () {
        var id = angular.copy($scope.edit.id)
        delete $scope.edit.id
        $http.put(basic_url + '/spotters/grade/' + id + '?' + sortUrl(), $scope.edit).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    };
    $scope.getCode = function (id) {
        $scope.id = id
        $scope.codepop = true;
        $http.get(basic_url + '/spotters/grade/' + id + '/invitation' + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                $scope.codes = res.result;
            }
        });
    };
    $scope.makecode = function (id) {
        console.log($scope.codenumber)
        if ($scope.codenumber > 100 || $scope.codenumber <= 0) {
            return;
        }
        var json = {
            'count': $scope.codenumber
        }
        $http.post(basic_url + '/spotters/grade/' + id + '/invitation' + '?' + sortUrl(), json).success(function (res) {
            if (res.code == 200) {
                $scope.getCode(id)
            } else {
                alert(res.message);
            }
        });
    };
    $scope.delCode = function (id) {
        $http.delete(basic_url + '/spotters/invitation/' + id + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                $scope.getCode($scope.id)
            } else {
                alert(res.message);
            }
        });
    };
    $scope.getroyalty = function (id) {
        $scope.id = id
        $scope.royaltypop = true
        $scope.royalty = []
        $http.get(basic_url + '/spotters/grade/' + id + '/royalty' + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                $scope.royalty = res.result
            }
        });
    };
    $scope.saveroyalty = function () {
        $http.post(basic_url + '/spotters/grade/' + $scope.id + '/royalty' + '?' + sortUrl(), $scope.royalty).success(function (res) {
            if (res.code == 200) {
                $scope.closepop()
                alert("操作成功")
            } else {
                alert(res.message);
            }
        });
    }
    $scope.addrow = function () {
        var obj = {
            'chain': '',
            'percentage': ''
        }
        $scope.royalty.push(obj)
    }
    $scope.delrow = function (index) {
        $scope.royalty.splice(index, 1)
        console.log($scope.royalty)
    }
    $scope.del = function (id) {
        $http.delete(basic_url + '/allocate/' + id + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    };
    $scope.getrule = function (id) {
        $http.get(basic_url + '/spotters/grade/' + id + '/upgrade' + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {

            }
        });
    }
}]);

app.controller('resourcesCtr', ['$scope', '$location', 'messageFactory', '$http', '$filter', '$routeParams', function ($scope, $location, msgFac, $http, $filter, $routeParams, ) {
    $scope.posts = {}
    $scope.addpop = false;
    $scope.view = {}

    $scope.closepop = function () {
        $scope.addpop = false;
        $scope.eaitpop = false;
        $scope.edit = {}
        $scope.posts = {}
    }
    $http.get(basic_url + '/guest/' + $routeParams.id + '/cards?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.resources = res.result;
        }
    });
    $http.get(basic_url + '/guest/' + $routeParams.id + '/videos?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.videos = res.result;
        }
    });
    $http.get(basic_url + '/guest/' + $routeParams.id + '/tasks?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.tasks = res.result;
        }
    });
    $http.get(basic_url + '/guest/' + $routeParams.id + '/allocates?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.allocates = res.result;
        }
    });
    $scope.addBtn = function () {
        $scope.posts.resources = [{
            'id': '',
            'category': 'STORECARD',
            "count": '',
            "cost": '',
            "price": '',
            "title": '',
            "allocateRuleUtilId": '',
            "celling": ''
        }]
        $scope.posts.tasks = [{
            'id': '',
            "count": '',
            "cost": ''
        }]
        $scope.addpop = true;
    }
    $scope.param = {
        page: 1,
        count: 10
    }
    $http.get(basic_url + '/guest/' + $routeParams.id + '/resources?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.view.messages = res.result;
        }
    });

    $scope.submit = function (id) {
        for (var i = 0; i < $scope.posts.tasks.length; i++) {
            if ($scope.posts.tasks[i] && $scope.posts.tasks[i].id == "") {
                $scope.posts.tasks.splice(i, 1)
            }
        }
        for (var i = 0; i < $scope.posts.resources.length; i++) {
            if ($scope.posts.resources[i] && $scope.posts.resources[i].id == "") {
                $scope.posts.resources.splice(i, 1)
            }
        }
        var json = angular.copy($scope.posts);
        if (id) {
            var url = '/resources/' + id + '?'
            $http.put(basic_url + '/guest/' + $routeParams.id + url + sortUrl(), json).success(function (res) {
                if (res.code == 200) {
                    alert("操作成功")
                    window.location.reload();

                } else {
                    alert(res.message);
                }
            });
        } else {
            var url = '/resources?'
            $http.post(basic_url + '/guest/' + $routeParams.id + url + sortUrl(), json).success(function (res) {
                if (res.code == 200) {
                    alert("操作成功")
                    window.location.reload();

                } else {
                    alert(res.message);
                }
            });
        }

    }
    $scope.delcardrow = function (index) {
        $scope.posts.resources.splice(index, 1)
        console.log($scope.posts)
    }
    $scope.deltaskrow = function (index) {
        $scope.posts.tasks.splice(index, 1)
        console.log($scope.posts)
    }
    $scope.addtaskrow = function () {
        var obj = {
            'id': '',
            "count": '',
            "cost": ''
        }
        $scope.posts.tasks.push(obj)
    }
    $scope.addcardrow = function () {
        var obj = {
            'id': '',
            'category': 'STORECARD',
            "count": '',
            "cost": '',
            "price": '',
            "title": '',
            "allocateRuleUtilId": '',
            "celling": ''
        }
        $scope.posts.resources.push(obj)
    }
    $scope.selectVid = function (item) {
        console.log(item)
        $scope.view.videos = item
        console.log($scope.view.videos)
    }
    $scope.auditbtn = function (message) {
        $scope.eaitpop = true;
        $scope.posts = message
    };
    $scope.del = function (id) {
        $http.delete(basic_url + '/guest/' + $routeParams.id + '/resources/' + id + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                window.location.reload();

            } else {
                alert(res.message);
            }
        });
    };
    $scope.picPageChange = function () {
        var json = {
            page: $scope.videos.page,
            count: $scope.videos.count
        };
        $http.get(basic_url + '/guest/' + $routeParams.id + '/videos?' + sortUrl($scope.param)).success(function (res) {
            if (res.code == 200) {
                $scope.videos = res.result;
            }
        });
    };
    $scope.openFn = function () {
        $scope.videos = "";
        $scope.videos.page = 1;
        $scope.picPageChange();
        $("#vid").modal("show");
    }
    $scope.sendPicFn = function () {
        console.log($scope.view.videos)
        $scope.posts.video = {
            "id": $scope.view.videos.id
        }
        $("#vid").modal("hide");
    }
    $scope.couponTurn = function (id, state) {
        if (state == 'on') {
            var url = '/on'
        } else {
            var url = '/off'
        }
        $http.post(basic_url + '/guest/' + $routeParams.id + '/resources/' + id + url + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                window.location.reload();

            } else {
                alert(res.message);
            }
        });
    }
}]);

app.controller('coinsCtr', ['$scope', '$location', 'messageFactory', '$http', '$filter', function ($scope, $location, msgFac, $http, $filter, $event) {
    $scope.posts = {}
    $scope.posts.goods = {
        "amount": 0,
        "value": 0
    }
    $scope.posts.detail = {}
    $scope.types = [{
        id: 0,
        name: "0"
    }, {
        id: 1,
        name: "1"
    }, {
        id: 2,
        name: "2"
    }, {
        id: 3,
        name: "3"
    }, {
        id: 4,
        name: "4"
    }, {
        id: 5,
        name: "5"
    }]
    $scope.gradeRule = [

    ]
    $scope.showpop = false;
    $scope.view = {}
    $scope.closepop = function () {
        $scope.addpop = false;
        $scope.eaitpop = false;
        $scope.codepop = false;
        $scope.royaltypop = false;
        $scope.edit = {}
        $scope.posts = {}
        $scope.codes = {}
        $scope.id = '',
            $scope.codenumber = ''
    }
    $scope.addBtn = function () {
        $scope.posts.detail = {}
        $scope.posts.goods = {
            "amount": 0,
            "value": 0
        }
        for (var i = 0; i < $scope.view.spotters.length; i++) {
            var id = $scope.view.spotters[i].id
            $scope.posts.detail[id] = ''
        }
        $scope.addpop = true;
    }

    $scope.param = {
        page: 1,
        count: 10
    }
    $http.get(basic_url + '/spotters/grade?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.view.spotters = res.result;
            for (var i = 0; i < $scope.view.spotters.length; i++) {
                var id = $scope.view.spotters[i].id
                $scope.posts.detail[id] = ''
            }
        }
    });

    $http.get(basic_url + '/coins?' + sortUrl($scope.param)).success(function (res) {
        if (res.code == 200) {
            $scope.view.messages = res.result;

            console.log($scope.posts)
            console.log($scope.view)
        }
    });
    $http.get(basic_url + '/materials?' + sortUrl()).success(function (res) {
        if (res.result) {
            $scope.view.urls = res.result;
        }
    });
    $scope.couponTurn = function (id, state) {
            if (state == 'on') {
                var url = '/on'
            } else {
                var url = '/off'
            }
            $http.post(basic_url + '/coins/' + id + url + '?' + sortUrl()).success(function (res) {
                if (res.code == 200) {
                    alert("操作成功")
                    $http.get(basic_url + '/coins?' + sortUrl($scope.param)).success(function (res) {
                        if (res.code == 200) {
                            $scope.view.messages = res.result;
                        }
                    });

                } else {
                    alert(res.message);
                }
            });
        },
        $scope.openFn = function () {
            $scope.view.picUrl = "";
            $scope.view.urls.page = 1;
            $scope.picPageChange();
            $("#pic").modal("show");
        }
    $scope.sendPicFn = function () {
        $scope.posts.picUrl = $scope.view.picUrl;
        $("#pic").modal("hide");
    }
    $scope.picPageChange = function () {
        var json = {
            page: $scope.view.urls.page,
            count: $scope.view.urls.count
        };
        $http.get(basic_url + '/materials?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.urls = res.result;
            }
        });
    };
    $scope.timefilter = function timestampToTime(timestamp) {

        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

        var Y = date.getFullYear() + '-';

        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';

        var D = date.getDate() + ' ';

        var h = date.getHours() + ':';
        if (date.getHours() < 10) {
            h = '0' + date.getHours() + ':';
        }
        var m = date.getMinutes() + ':';
        if (date.getMinutes() < 10) {
            m = '0' + date.getMinutes() + ':';
        }
        var s = date.getSeconds();
        if (date.getSeconds() < 10) {
            s = '0' + date.getSeconds();
        }
        return Y + M + D + h + m + s;

    }
    $scope.filterfn = function (id) {
        for (var i = 0; i < $scope.types.length; i++) {
            if ($scope.types[i].id == id) {
                return $scope.types[i].name
            }
        }
    }
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.messages.page,
            count: $scope.view.messages.count
        };
        $http.get(basic_url + '/allocate?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.messages = res.result;
            }
        });
    };
    $scope.submit = function () {
        var startDate = new Date($scope.view.startDate).getTime();
        var endDate = new Date($scope.view.endDate).getTime();
        $scope.posts.startDate = $scope.timefilter(startDate)
        $scope.posts.endDate = $scope.timefilter(endDate)
        $scope.posts.timesLimit = 0
        $http.post(basic_url + '/coins?' + sortUrl(), $scope.posts).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    }
    $scope.auditbtn = function (message) {
        $scope.eaitpop = true;
        console.log(message)
        $scope.edit = angular.copy(message)
        var startDate = $scope.edit.startDate.substring(0, 10) + "T" + $scope.edit.startDate.substring($scope.edit.startDate.length - 8, $scope.edit.startDate.length - 3);
        var endDate = $scope.edit.endDate.substring(0, 10) + "T" + $scope.edit.endDate.substring($scope.edit.endDate.length - 8, $scope.edit.endDate.length - 3);
        $scope.view.startDate = new Date(startDate)
        $scope.view.endDate = new Date(endDate)
        console.log($scope.edit)
    };
    $scope.audit = function () {
        console.log($scope.edit)
        var id = $scope.edit.id
        delete $scope.edit.id
        delete $scope.edit.on
        if ($scope.edit.onTime) {
            delete $scope.edit.onTime
        }
        var startDate = new Date($scope.view.startDate).getTime();
        var endDate = new Date($scope.view.endDate).getTime();
        $scope.edit.startDate = $scope.timefilter(startDate)
        $scope.edit.endDate = $scope.timefilter(endDate)
        $http.put(basic_url + '/coins/' + id + "?" + sortUrl(), $scope.edit).success(function (res) {
            if (res.code == 200) {
                alert("操作成功")
                location.reload();

            } else {
                alert(res.message);
            }
        });
    };

}]);

app.controller('promotersCtr', ['$scope', '$location', '$http', '$routeParams', function ($scope, $location, $http, $routeParams) { //
    $scope.config.name = "城市广告管理";
    $scope.config.url = "/user/index.html";
    $scope.view = {
        index: 0
    };
    $scope.types = [{
        "id": "1002",
        "name": "任务推广"
    }, {
        "id": "1003",
        "name": "消费卡推广"
    }]
    $scope.posts = {};
    left_active = location.pathname.split("/");
    $("." + location.hash.split("/")[1] + "_index").addClass("active");
    $(".placards_index").removeClass("active");

    $http.get(basic_url + '/area/city/opened?' + sortUrl()).success(function (res) {
        if (res.result) {
            $scope.view.city = res.result;
            $scope.chooseFn(0);

        }
    });
    $scope.closepop = function () {
        $scope.showpop = false
    }
    $scope.addBtn = function () {
        $scope.showpop = true
    }
    $scope.pageChange = function () {
        var json = {
            page: $scope.view.placards.page,
            count: $scope.view.placards.count
        };
        $http.get(basic_url + '/placards?' + $scope.jsonToUrl(json)).success(function (res) {
            if (res.result) {
                $scope.view.placards = res.result;
            }
        });
    };
    $scope.chooseFn = function (index) {
        $scope.view.index = index; //哪个城市
        $http.get(basic_url + '/promoters/city/' + $scope.view.city[index].code + '?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                $scope.view.messages = res.result;
            } else {
                $scope.view.messages = ""
            }
        });
        $http.get(basic_url + '/promoters/city/' + $scope.view.city[index].code + '/shops?' + sortUrl()).success(function (res) {
            if (res.code == 200) {
                $scope.view.shops = res.result.items;
            } else {
                $scope.view.shops = ""
            }
        });
    }
    $scope.openFn = function (index) {
        $scope.post.place = index + 1; //第几条
        $("#dialog").modal("show");
    }
    $scope.deleteFn = function (id) {
        $http.delete(basic_url + '/promoters/' + id + '?' + getUrl()).success(function (data) {
            if (data.code == 200) {
                alert("操作成功")
                location.reload();
            } else {
                alert(data.message);
            }
        });
    }
    $scope.submitFn = function () {
        $http.post(basic_url + '/promoters/city/' + $scope.view.city[$scope.view.index].code + '?' + getUrl(), $scope.posts).success(function (data) {
            if (data.code == 200) {
                alert("操作成功")
                location.reload();
            } else {
                alert(data.message);
            }
        });

    }
}]);