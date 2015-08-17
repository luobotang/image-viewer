var $ = require('jquery');

var ViewImage = require('./lib/viewer-image');

var KEY_ESC = 27;

// 图片全屏预览组件

var box = $("<div>", {
	"class": "image-viewer-container",
	click: close
});

var view_img;

function show(img_src) {
	view_img = new ViewImage(img_src);
	box.append(view_img);
	box.show();
	$('body').addClass('on-image-viewing');
};

function close() {
	if (view_img) { // clear img
		$(view_img).remove();
		view_img = null;
	}
	box.hide();
	$('body').removeClass('on-image-viewing');
};

// add handler on box no use, don't know why
$('body').keydown(function (e) {
	if (e.keyCode == KEY_ESC) close();
});

box.hide().appendTo(document.body);

module.exports = {
	show: show,
	close: close
};
