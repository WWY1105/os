$(function() {
	$.get(basic_url+"/guest").then(function(date){
		if(date.code==200){
			$lt.guest=date.result.items;
		}
		ltJs.ltShow();
	});
	/*
	data = new search_result({}, "/guest", "GET");
	data.guest_show();*/
})

function guest_search() {
	post_name = $(".search input[name=name]").val();
	post_code = $(".search input[name=code]").val();
	post_state = $(".search select[name=state]").val();
	data = new search_result({
		"name": post_name,
		"code": post_code,
		"state": post_state
	}, "/guest", "GET");
	data.guest_show();
}