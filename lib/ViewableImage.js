var $ = require('jquery')
var getWindowSize = require('get-window-size')
require('jquery-mousewheel')($) // 初始化

var cache = {}

var CLS_VIEWER_IMAGE = 'viewable_image'
var CLS_IMAGE_LOADED = 'img-loaded'
var STYLE_CURSOR_IMAGE_MOVE = 'move'
var STYLE_CURSOR_IMAGE_UNMOVE = 'default'

function ViewableImage(img_src) {

	var imageOriginWidth
	var imageOriginHeight
	var zoom = 1.0
	var ondrag = false

	var img = $('<img>', {
		"class": CLS_VIEWER_IMAGE,
		src: img_src
	})

	img.bind({
		mousewheel: onWheel,
		mousedown: onMousedown,
		mousemove: onMousemove,
		mouseup: onMouseup,
		dragstart: cancelEvent,
		click: cancelEvent
	})

	// 缓存图片路径，对于已缓存图片直接按已加载进行处理
	if (!cache[img_src]) {
		cache[img_src] = true
		img.on('load', onLoad)
	} else {
		setTimeout(onLoad, 0)
	}

	function resetImageSize() {
		img.width(imageOriginWidth * zoom)
		img.height(imageOriginHeight * zoom)
	}

	function setPos(left, top) {
		img.css({ left: left, top: top})
	}

	function zoomImg(curr_x, curr_y, scale) {
		// 以鼠标所在位置为中心缩放图像
		var lastZoom = zoom
		zoom = scale
		var position = img.position()
		resetImageSize()
		setPos(
			curr_x - (zoom / lastZoom) * (curr_x - position.left),
			curr_y - (zoom / lastZoom) * (curr_y - position.top)
		)
	}

	function setPosCenter() {
		var win_size = getWindowSize()
		setPos(
			(win_size.width - img.width()) / 2,
			(win_size.height - img.height()) / 2
		)
	}

	function onLoad() {
		img.addClass(CLS_IMAGE_LOADED)
		// record the original image size
		imageOriginWidth =  img.width()
		imageOriginHeight = img.height()
		var win_size = getWindowSize()
		var h_ratio = win_size.height / imageOriginHeight
		var w_ratio = win_size.width / imageOriginWidth
		// set zoom, make sure img not out of window
		zoom = (h_ratio < w_ratio) ?
					(h_ratio < 1.0 ? h_ratio : 1.0) :
					(w_ratio < 1.0 ? w_ratio : 1.0)
		resetImageSize();
		setPosCenter();
	}
	// 鼠标滚轮控制图像缩放
	function onWheel(e, delta) {
		zoomImg(e.clientX, e.clientY, zoom * (delta < 0 ? 0.9 : 1.1))
		e.preventDefault()
		return false
	}

	var lastMousePositonX = 0
	var lastMousePositonY = 0

	// var BUTTON_LEFT = 0

	function onMousedown(e) {
		// 不再检测是否鼠标左键按下
		// MouseEvent.button IE9+ support
		// e.button === BUTTON_LEFT
		e.preventDefault()
		ondrag = true
		lastMousePositonX = e.clientX
		lastMousePositonY = e.clientY
		img.css("cursor", STYLE_CURSOR_IMAGE_MOVE)
	}

	function onMousemove(e) {
		if (ondrag) {
			var img_pos = img.position()
			var cur_x = e.clientX
			var cur_y = e.clientY
			setPos(
				img_pos.left + cur_x - lastMousePositonX,
				img_pos.top  + cur_y - lastMousePositonY
			)
			lastMousePositonX = cur_x
			lastMousePositonY = cur_y
		}
	}

	function onMouseup() {
		if (ondrag) {
			ondrag = false
			img.css("cursor", STYLE_CURSOR_IMAGE_UNMOVE)
		}
	}

	function cancelEvent(e) {
		e.stopPropagation()
		return false
	}

	// 将构建的 img 元素返回
	return img
}

module.exports = ViewableImage