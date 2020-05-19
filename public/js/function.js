var ltJs={
	ltShow:function() {
		var self=$("[lt-repeat]");
			self.each(function(){
				a=$lt[$(this).attr("lt-repeat")];
				for(var i=0,j=a.length;i<j;i++){
				var clonedNode = self.clone(true); // 克隆节点 
				clonedNode.removeAttr("lt-repeat");
				var id=a[i].id;
				a[i].$index=i+1;
				clonedNode.children("[lt-model]").each(function(index){
					attr=a[i][$(this).attr("lt-model")];
					$(this).text(attr||"暂无");

				}); 
				clonedNode.find("[lt-click]").click(function() {
					basicFn=$(this).attr("lt-click");
					indexId=$(this).parents(".show-modle").index();
					//ltFn(indexId,basicFn);
				})
				self.parent().append(clonedNode); // 在父节点插入克隆的节点
			}
			self.remove();
			})
			
	}
}