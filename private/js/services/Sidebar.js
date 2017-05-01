
angular.module('ProjMngmnt')
    .service('Sidebar', function (DB, UI) {
        var hrefVoid = "javascript:void(0)";

        // Project levels string
        var projectString = "project";
        var subProjectString = "subProject";
        var constructionSiteString = "constructionSite";
        var projectLevels = [ projectString, subProjectString, constructionSiteString ];

        var sidebarContent = {};

        // Get title
        function getTitle(parentEntryProps) {
            var urlParts = parentEntryProps.urlPrefix.split("/");
            var uriPrefix = urlParts[urlParts.length - 2] + "/" + urlParts[urlParts.length - 1];

            return DB.getSingleResrcByUri(uriPrefix)
                .then(function (entry) {
                    return entry.name;
                });
        }

        // Get collapsible sub-hierarchy entry w/sub-links
        function getEntrySubs(parentEntryProps) {
            var subEntryType;
            var projectLevelTitle;

            if (parentEntryProps.type === projectString) {
                subEntryType = subProjectString;
                projectLevelTitle = "Sous-projets";
            }
            else if (parentEntryProps.type === subProjectString) {
                subEntryType = constructionSiteString;
                projectLevelTitle = "Chantiers";
            }
            else return void(0);

            var urlParts = parentEntryProps.urlPrefix.split("/");
            var uriPrefix = urlParts[urlParts.length - 2] + "/" + urlParts[urlParts.length - 1];

            return DB
                .getEntriesDAO({
                    type: subEntryType,
                    uriPrefix: uriPrefix
                })
                .getAll()
                .then(function (entries) {
                    var subsUrlSuffix = subEntryType + "s";

                    var subEntries = [];
                    for (var i = 0; i < entries.length; i++) {
                        subEntries.push({
                            title: entries[i].name,
                            url: subsUrlSuffix + "/" + entries[i].id
                        });
                    }
                    for (var i = 0; i < subEntries.length; i++) {
                        subEntries[i].url = prependUrlPrefix(subEntries[i].url, parentEntryProps.urlPrefix);
                    }

                    return {
                        url: prependUrlPrefix(subsUrlSuffix, parentEntryProps.urlPrefix),
                        iconClass: "fa fa-sitemap",
                        title: projectLevelTitle,
                        entries: subEntries
                    };
                });
        }

        function prependUrlPrefix(urlSuffix, urlPrefix) {
            // Avoid prefixing for collapsible entry links [javascript:void(0)]
            if (urlSuffix === hrefVoid) {
                return urlSuffix;
            }
            return "./" + (urlPrefix ? urlPrefix + "/" : "") + urlSuffix;
        }



        this.getEntryByUrl = function (entryUrl) {
            for (var i = 0; i < sidebarContent.entries.length; i++) {
                if (sidebarContent.entries[i].url === entryUrl) {
                    return sidebarContent.entries[i];
                }
            }
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
                cloneContent = angular.copy(UI.getPortfolioContent());
            }
            else if (projectLevels.indexOf(pageProperties.type) !== -1) {
                cloneContent = angular.copy(UI.getProjectLevelBaseContent());

                // Set title
                var titlePromise = getTitle(pageProperties);
                if (titlePromise !== void(0)) {
                    titlePromise.then(function (title) {
                        sidebarContent.title = title;
                    });
                }

                // Add subs if any
                var subsPromise = getEntrySubs(pageProperties);
                if (subsPromise !== void(0)) {
                    subsPromise.then(function (subsEntry) {
                        if (subsEntry !== void(0)){
                            cloneContent.entries.push(subsEntry);
                        }
                    });
                }
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