
angular.module('ProjMngmnt')
    .service('Sidebar', function (CommonConstants, API, UI) {
        var sidebarContent = {};

        // Get title
        function getTitle(parentEntryProps) {
            var urlParts = parentEntryProps.urlPrefix.split("/");
            var uriPrefix = urlParts[urlParts.length - 2] + "/" + urlParts[urlParts.length - 1];

            return API.getSingleResrcByUri(uriPrefix)
                .then(function (entry) {
                    return entry.name;
                });
        }

        function prependUrlPrefix(urlSuffix, urlPrefix) {
            // Avoid prefixing for collapsible entry links [javascript:void(0)]
            if (urlSuffix === CommonConstants.EMPTY_HREF_URL) {
                return urlSuffix;
            }
            return "./" + (urlPrefix ? urlPrefix + "/" : "") + urlSuffix;
        }



        this.getEntryByUrl = function (entryUrl) {
            for (var i = 0; i < sidebarContent.entries.length; i++) {
                if (sidebarContent.entries[i].url === entryUrl) {
                    return sidebarContent.entries[i];
                }
                else if (sidebarContent.entries[i].entries) {
                    for (var j = 0; j < sidebarContent.entries[i].entries.length; j++) {
                        if (sidebarContent.entries[i].entries[j].url === entryUrl) {
                            return sidebarContent.entries[i].entries[j] ;
                        }
                    }
                }
            }
            return void(0);
        };

        // Set active menu link corresponding to URL path
        this.setActiveMenuUrlBySuffix = function (urlSuffix) {
            if (urlSuffix !== void(0)) {
                // Prepend menu entries url prefix to the submitted url suffix
                var urlParts = sidebarContent.entries[0].url.split("/");
                urlParts[urlParts.length - 1] = urlSuffix;

                sidebarContent.activeMenuUrl = urlParts.join("/");
            }
        };

        this.getContent = function () {
            return sidebarContent;
        };

        this.setContent = function (pageProperties) {
            var cloneContent;

            // Set page [type] content
            if (pageProperties.type === "general") {
                cloneContent = angular.copy(UI.getProjectsSidebarContent());
            }
            else if (CommonConstants.PROJECT_LEVELS.indexOf(pageProperties.type) !== -1) {
                cloneContent = angular.copy(UI.getProjectLevelSidebarContent(pageProperties));

                // Set title
                var titlePromise = getTitle(pageProperties);
                if (titlePromise !== void(0)) {
                    titlePromise.then(function (title) {
                        sidebarContent.title = title;
                    });
                }

                // Add subs if any
                // TODO: completely remove functionality if never to be used
                // appendEntrySubs(cloneContent.entries, pageProperties);
            }
            for (var i = 0; i < cloneContent.entries.length; i++) {
                cloneContent.entries[i].url = prependUrlPrefix(cloneContent.entries[i].url, pageProperties.urlPrefix);
            }

            // Change global content
            sidebarContent.title = cloneContent.title;
            sidebarContent.entries = cloneContent.entries;
            sidebarContent.activeMenuUrl = void(0);
            sidebarContent.menuExpandedIndex = void(0);
            sidebarContent.subMenuActiveIndex = void(0);
        };
    });