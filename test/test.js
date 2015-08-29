var $ = require('jquery')
var ImageViewer = require('../index')

$(function () {
	$('#sample').click(function () {
		ImageViewer.show(this.src)
	})
})