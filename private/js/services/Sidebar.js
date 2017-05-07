
angular.module('ProjMngmnt')
    .service('Sidebar', function (CommonConstants, DB, UI) {
        var hrefVoid = "javascript:void(0)";
        var sidebarContent = { entries: [] };

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
        function appendEntrySubs(entries2append, parentEntryProps) {
            var entrySubs = [];

            if (parentEntryProps.type === CommonConstants.PROJECT_STRING) {
                entrySubs.push({
                    type: CommonConstants.SUB_PROJECT_STRING,
                    title: "Sous-projets"
                });
            }
            if (parentEntryProps.type === CommonConstants.PROJECT_STRING
                || parentEntryProps.type === CommonConstants.SUB_PROJECT_STRING) {
                entrySubs.push({
                    type: CommonConstants.CONSTRUCTION_SITE_STRING,
                    title: "Chantiers"
                });
            }
            else return void(0);

            var urlParts = parentEntryProps.urlPrefix.split("/");
            var uriPrefix = urlParts[urlParts.length - 2] + "/" + urlParts[urlParts.length - 1];

            entrySubs.forEach(function (entrySub) {
                var subsUrlSuffix = entrySub.type + "s";
                var subEntries = [];
                var sub = {
                    url: subsUrlSuffix,
                    iconClass: "fa fa-sitemap",
                    title: entrySub.title,
                    entries: subEntries,
                    fetched: false
                };

                entries2append.push(sub);

                DB
                    .getEntriesDAO({
                        type: entrySub.type,
                        uriPrefix: uriPrefix
                    })
                    .getAll()
                    .then(function (entries) {
                        for (var j = 0; j < entries.length; j++) {
                            subEntries.push({
                                title: entries[j].name,
                                url: subsUrlSuffix + "/" + entries[j].id
                            });
                        }
                        for (var j = 0; j < subEntries.length; j++) {
                            subEntries[j].url = prependUrlPrefix(subEntries[j].url, parentEntryProps.urlPrefix);
                        }
                        sub.fetched = true;
                    });
                }
            );
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
            else if (CommonConstants.PROJECT_LEVELS.indexOf(pageProperties.type) !== -1) {
                cloneContent = angular.copy(UI.getProjectLevelBaseContent());

                // Set title
                var titlePromise = getTitle(pageProperties);
                if (titlePromise !== void(0)) {
                    titlePromise.then(function (title) {
                        sidebarContent.title = title;
                    });
                }

                // Add subs if any
                appendEntrySubs(cloneContent.entries, pageProperties);
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