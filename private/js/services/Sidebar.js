
angular.module('ProjMngmnt')
	.service('Sidebar', function () {
		this.initClickListeners = function () {
			// In/Out-dent sidebar
			document.getElementById('outdent-icon').onclick = function () {
			    var body = document.body;
			    // TODO: polyfill for classList (from MDN?)
			    if (body.classList.contains('mini-sidebar')) {
			        body.classList.remove('mini-sidebar');
			    }
			    else {
			        body.className += " mini-sidebar";
			    }
			};

			// On sidebar expandable menu click
			var li_expandables = document.getElementsByClassName('collapsible-menu');
			for (var i = 0; i < li_expandables.length; i++) {
			    li_expandables[i].children[0].onclick = function () {
			        // TODO: polyfill for children[] property (IE8-)
			        var ul = this.parentElement.children[1];
			        var isExpanded = ul.clientHeight;

			        // TODO: replace with specific (.expanded?) class query
			        //  & replace li_expandables with css selector on all needed ul
			        for (var j = 0; j < li_expandables.length; j++) {
			            // select ul element
			            var ul_j = li_expandables[j].children[1];
			            if (ul_j.clientHeight) {
			                ul_j.style.height = 0;
			            }
			        }

			        if (!isExpanded) {
			            ul.style.height = ul.scrollHeight + "px";
			        }
			    }
			}

			// On sidebar submenu click
			var subLinks = document.querySelectorAll('#sidebar .tab-content .tab-pane > ul > li > ul > li > a');
			for (var i = 0; i < subLinks.length; i++) {
			    subLinks[i].onclick = function () {
			        // only one element should match, even across tabs
			        var li_active = document.querySelector('#sidebar .tab-content .tab-pane > ul > li.active');
			        if (li_active) {
			            li_active.classList.remove('active');
			        }
			        // only one element should match, even across tabs
			        var a_active = document.querySelector('#sidebar .tab-content .tab-pane > ul > li > ul > li > a.active');
			        if (a_active) {
			            a_active.classList.remove('active');
			        }
			        // activate clicked on a_link & parent menu entry
			        this.className += " active";
			        var menuEntry = this.parentElement.parentElement.parentElement;
			        menuEntry.className += " active";
			    }
			}

			// On sidebar simple menu click
			var li_simples = document.getElementsByClassName('simple-menu');
			for (var i = 0; i < li_simples.length; i++) {
			    li_simples[i].onclick = function () {
			        // TODO: replace with specific (.expanded?) class query
			        //  & replace li_expandables with css selector on all needed ul
			        for (var j = 0; j < li_expandables.length; j++) {
			            // select ul element
			            var ul_j = li_expandables[j].children[1];
			            if (ul_j.clientHeight) {
			                ul_j.style.height = 0;
			            }
			        }

			        // only one element should match, even across tabs
			        var li_active = document.querySelector('#sidebar .tab-content .tab-pane > ul > li.active');
			        if (li_active) {
			            li_active.classList.remove('active');
			        }
			        // only one element should match, even across tabs
			        var a_active = document.querySelector('#sidebar .tab-content .tab-pane > ul > li > ul > li > a.active');
			        if (a_active) {
			            a_active.classList.remove('active');
			        }

			        // activate clicked on a_link's parent menu entry
			        this.className += " active";
			    }
			}

		}
	});