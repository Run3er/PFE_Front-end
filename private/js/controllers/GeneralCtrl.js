
angular.module('ProjMngmnt')
	.controller('GeneralCtrl', function (Sidebar, Header) {
		Sidebar.setContent("general");
		Header.removeUpdateTime();
	});