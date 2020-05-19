/**
 * sharejoy osweb
 * @version   0.0.5
 *make by tianyuan Lee
 */
function loginError(o){$(".form-error").text("*"+o)}; var api_key = "5d85a0398cb74c66a46affbb98efaf41";
$.cookie("apikey", api_key, {expire: 30, path: "/"});$(function(){$("form").submit(function(){var o=$("#login_form input[name=name]").val(),r=$("#login_form input[name=password]").val();return o&&r?(url=basic_url+"/user/login",$.post(url + "?" + sortUrl(),JSON.stringify({name:o,password:hex_md5(r)}),function(o){200==o.code&&($.cookie("token",o.result.token),location.href="/user/index.html"),403000==o.code?($.cookie("token",null),call()):200!=o.code&&loginError(o.message)}),!1):(loginError("账号及密码不能为空"),!1)})});