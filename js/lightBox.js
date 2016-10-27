;(function($) {
	var LightBox = function(option) {
		this.setting = $.extend(true,LightBox.DEFAULT,option || {});
		var self = this;
		this.current = null;
		var open = false;

		//创建遮罩和弹出框
		this._creatPopup();
		this.picBoxImg = $("#popupBox").find("img");
		this.picBoxTitle = $(".picTitle").eq(0);

		this.mask = $("#mask");
		this.popupBox = $(".popupBox_box").eq(0);

		$(document).on("click",function(e) {
			e.stopPropagation();
			open = false;
			clearInterval(self.auto);
			$("#mask").css("display","none");
			$("#popupBox").css("display","none");
		});
		$("#picBoxClose").on("click",function(e) {
			e.stopPropagation();
			open = false;
			clearInterval(self.auto);
			$("#mask").css("display","none");
			$("#popupBox").css("display","none");
		});

		this.imgsLi = $("." + this.setting.imgGroup).find("li");
		this.maxLength = $("." + this.setting.imgGroup+" li").length - 1;
		this.imgsLi.on("click",function(e) {
			e.stopPropagation();
			open = true;
			$("#mask").css("display","block");
			$("#popupBox").fadeIn();
			self._change($(this).find("img"));
			self.current = $(this);
			autoFun();
		});

		$("#popupPrev").on("click",function(e) {
			e.stopPropagation();
			var prev = self.current.prev();
			var img = prev.find("img");
			if(img.prevObject.length == 0) {
				alert("已经第一张了");
			}else {
				self._change(img);
				self.current = prev;
			}
		})
		$("#popupNext").on("click",function(e) {
			e.stopPropagation();
			var next = self.current.next();
			var img = next.find("img");
			if(img.prevObject.length == 0) {
				alert("已经最后一张了");
			}else {
				self._change(img);
				self.current = next;
			}
		});

		//键盘方向按钮控制播放
		$(window).keyup(function(e) {
			if(e.keyCode == 37 || e.keyCode == 38) {
				$("#popupPrev").click();
			}else if(e.keyCode == 39 || e.keyCode == 40) {
				$("#popupNext").click();
			}
		});

		var timer;
		//窗口调整大小，做了延迟
		$(window).resize(function(e) {			
			clearTimeout(timer);
				timer = setTimeout(function(){
						self.setting.maxHeight = $(window).height() * 0.8;
						self.setting.maxWidth = $(window).width() * 0.8;
						self._change(self.current.find("img"));
					},500);
		});

		//鼠标滚轮控制播放
		this.popupBox.on("mousewheel DOMMouseScroll",function(e) {
			e.preventDefault();
			var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
			delta > 0 ? $("#popupPrev").click() : $("#popupNext").click();
		});

		$("#popupPrev").hover(function() {
			if(self.current.index() !== 0) {
				$(this).css("opacity","1");
			}
		},function() {
			$(this).css("opacity","0");
		})
		$("#popupNext").hover(function() {
			if(self.current.index() !== self.maxLength) {
				$(this).css("opacity","1");
			}
		},function() {
			$(this).css("opacity","0");
		})

		//自动播放
		var autoFun = function() {
			if(self.setting.isAuto) {
				if(open) {
					clearInterval(self.auto);
					self.auto = setInterval(function(){
						if(self.current.index() === self.maxLength) {
							self._change(self.imgsLi.eq(0).find("img"));
							self.current = self.imgsLi.eq(0);
						}else {
							$("#popupNext").click();
						}
					},2000);
				}
			}
		}

		var cancelAuto = function() {
			if(self.setting.isAuto) {
				self.popupBox.on("mouseover",function(e) {
					e.stopPropagation();
					clearInterval(self.auto);
				})
				self.popupBox.on("mouseout",function() {
					autoFun();
				})
			}
		}
		cancelAuto();
	
	};

	LightBox.prototype = {

			_change: function(el) {			
			var src = el.attr("src");
			var img = new Image();
			img.src = src;
			var width = this._fit(img.width,img.height).width;
			var height = this._fit(img.width,img.height).height;
			this._changeSize(width,height);
			var title = el.attr("title");
			this.picBoxImg.attr("src",src);
			this.picBoxTitle.html(title);
		},

		_fit: function(width,height) {
			var w=width,h=height;
			if(w >= this.setting.maxWidth || h >= this.setting.maxHeight) {
				var ratio = Math.max(w/this.setting.maxWidth,h/this.setting.maxHeight);
				w = width / ratio;
				h = height / ratio;
			}
			return {
				width: w,
				height: h
			}
		},

		_changeSize: function(w,h) {
			this.popupBox.animate({
				width : w + "px",
				height: h + "px",
				marginTop: -h/2 + "px",
				marginLeft: -w/2 + "px"
			},this.setting.speed);
		},

		_creatPopup : function() {
			var mask = $("<div id='mask' class='mask'></div>");
			mask.css({"width":"100%", "height":"100%", "background":"rgba(0,0,0,0.5)", "position":"fixed", "display":"none"});
			var bodyNode = $(document.body);
			var popupBox = $("<div id='popupBox' class='popupBox' style='display:none;'></div>");
			var strDome = '<div class="popupBox_box" style="width:200px; height:400px; position:fixed; border:5px solid #fff; border-radius:3px; margin-top:-200px; margin-left:-100px; left:50%; top:50%;">'+
								'<span id="popupPrev" style="z-index:100; opacity:0; width:40%; height:100%; background:url(images/prev.png) left center no-repeat; position:absolute; cursor:pointer;"> </span>'+
								'<span id="popupNext" style="z-index:100; opacity:0; width:40%; height:100%; background:url(images/next.png) right center no-repeat; position:absolute; cursor:pointer; right:0;"> </span>'+
								'<img src="images/1-3.jpg" style="width:100%; height:100%"/>'+
								'<div class="detail" style="z-index:200;color:#fff; font-size:20px; background:rgba(0,0,0,0.5); position:absolute; bottom:0; height:38px; width:100%;">'+
									'<p class="picTitle" style="margin:5px 10px 0;">156465</p>'+
									'<a href="javascript:;" style="z-index:10000;color:#fff; float:right; font-size:27px; text-decoration:none; margin:-30px 15px 0 0;" id="picBoxClose">X</a>'+
								'</div>'+
							'</div>';
			popupBox.html(strDome);
			bodyNode.append(mask);
			bodyNode.append(popupBox);
		}
	};

	LightBox.DEFAULT = {
		imgGroup: "imgGroup",      //被点击图片的那一组class名字
		speed: 500,                //动画时间
		isAuto: true,              //是否自动播放
		maxWidth: $(window).width()*0.8,     //弹出框的最大宽度
		maxHeight: $(window).height()*0.8   //弹出框的最大高度
	}

	//注册到全局对象上
	window["LightBox"] = LightBox;

})(jQuery); 