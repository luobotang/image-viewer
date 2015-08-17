var $ = require('jquery');
var jqueryMousewheel = require('jquery-mousewheel');

// 初始化 jQuery 插件
jqueryMousewheel($);

var cache = {};

// 依赖 mousewheel 插件提供的 jQuery 的鼠标滚轮事件
module.exports = function (img_src) {

	var img_size_origin = { width: 0, height: 0 },
		zoom = { last: 1.0, curr: 1.0 },
		ondrag = false,
		last_mouse_pos = { x: 0, y: 0 };

	var img = $('<img>', {
		"class": "viewable_image",
		src: img_src
	});

	img.bind({
		mousewheel: onWheel,
		mousedown: onMousedown,
		mousemove: onMousemove,
		mouseup: onMouseup,
		dragstart: cancelEvent,
		click: cancelEvent
	});

	// 缓存图片路径，对于已缓存图片直接按已加载进行处理
	if (!cache[img_src]) {
		cache[img_src] = true;
		img.on('load', onLoad);
	} else {
		setTimeout(onLoad, 0);
	}

	function setSize(width, height) {
		//console.log("in setSize. width: " + width + ", height: " + height);
		img.width(width).height(height);
	}

	// after changed zoom value, update img's size
	function updateSize() {
		setSize(
			img_size_origin.width * zoom.curr,
			img_size_origin.height * zoom.curr
		);
	}

	function getSize(size) {
		return {
			width: img.width(),
			height: img.height()
		};
	}

	function getWindowSize() {
		return {
			width: 	window.innerWidth,
			height: window.innerHeight
		};
	}

	function getPos() {
		return {
			left: parseInt(img.css("left")),
			top:  parseInt(img.css("top"))
		};
	}

	function setPos(left, top) {
		//console.log("in setPos. left: " + left + ", top: " + top);
		img.css({ left: left + "px", top: top + "px" });
	}

	function zoomImg(curr_x, curr_y, scale) {
		//console.log("in zoomImg. curr_x: %s, curr_y: %s", curr_x, curr_y);
		// when scroll with mouse's middle button scale the image
		// but fix the mouse pointer on the image
		zoom.last = zoom.curr;
		zoom.curr = scale;
		var img_pos = getPos();
		updateSize();
		setPos(
			curr_x - (zoom.curr / zoom.last) * (curr_x - img_pos.left),
			curr_y - (zoom.curr / zoom.last) * (curr_y - img_pos.top)
		);
	}

	function setPosCenter() {
		var img_size = getSize(),
			win_size = getWindowSize();
		setPos(
			(win_size.width - img_size.width) / 2,
			(win_size.height - img_size.height) / 2
		);
	}

	function onLoad() {
		img.addClass('img-loaded');
		// record the original image size
		img_size_origin = {
			width:  img.width(),
			height: img.height()
		};
		var win_size = getWindowSize(),
			h_ratio = win_size.height / img_size_origin.height,
			w_ratio = win_size.width / img_size_origin.width;
		// set zoom, make sure img not out of window
		zoom.curr = (h_ratio < w_ratio) ?
					(h_ratio < 1.0 ? h_ratio : 1.0) :
					(w_ratio < 1.0 ? w_ratio : 1.0);
		updateSize();
		setPosCenter();
	}
	// require: jquery.mousewheel plugin
	// 鼠标滚轮控制图像缩放
	function onWheel(e, delta) {
		zoomImg(e.clientX, e.clientY, zoom.curr * (delta < 0 ? 0.9 : 1.1));
		e.preventDefault();
		return false;
	}
	// drag image with mouse
	function onMousedown(e) {
		// on Firefox means left button
		if (e.button == 0) {
			e.preventDefault();
			ondrag = true;
			last_mouse_pos = { x: e.clientX, y: e.clientY };
			img.css("cursor", "move");
		}
	}
	function onMousemove(e) {
		if (ondrag) {
			var img_pos = getPos(),
				cur_x = e.clientX,
				cur_y = e.clientY;
			setPos(
				img_pos.left + cur_x - last_mouse_pos.x,
				img_pos.top  + cur_y - last_mouse_pos.y
			);
			last_mouse_pos = { x: cur_x, y: cur_y };
		}
	}
	function onMouseup(e) {
		if (ondrag) {
			ondrag = false;
			img.css("cursor", "default");
		}
	}
	function cancelEvent(e) {
		e.stopPropagation();
		return false;
	}

	// 将构建的 img 元素返回
	return img;
};