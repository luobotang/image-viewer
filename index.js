var $ = require('jquery');

var ViewImage = require('./lib/viewer-image');

var KEY_ESC = 27
var CLS_ON_IMAGE_VIEWING = 'on-image-viewing'

// 图片全屏预览组件

var box = $("<div>", {
	"class": "image-viewer-container",
	click: close
})

var view_img
var inited = false

function show(img_src) {
	if (!inited) {
		$(function () {
			show(img_src)
		})
		return
	}
	view_img = ViewImage(img_src);
	box.append(view_img);
	box.show();
	$('body').addClass(CLS_ON_IMAGE_VIEWING);
}

function close() {
	if (view_img) {
		view_img.remove()
		view_img = null
	}
	box.hide()
	$('body').removeClass(CLS_ON_IMAGE_VIEWING);
}

$(function () {
	inited = true
	$(document).keydown(function (e) {
		if (e.which == KEY_ESC) close()
	})
	box.hide().appendTo('body')
})

module.exports = {
	show: show,
	close: close
}
