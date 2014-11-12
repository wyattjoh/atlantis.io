(function() {
    // Run the app!
    var app = angular.module('io.atlantis', [ 'oc.lazyLoad' ]);

    var ListingCtrl = function(ResourceService, ColorService) {
        var vm = this;

        // Set hostname
        vm.host = window.location.host;

        ResourceService.get().then(function(config) {
            vm.config = config;

            if (vm.host != vm.config.url) {
                $('#myModal').foundation('reveal', 'open');

                vm.firstTime = true;
            } else {
                vm.resources = vm.config.data;
            }
        });

        vm.getRandomColor = ColorService.getRandomColor;

        vm.randomStyle = {
            'background': vm.getRandomColor(vm),
            'border-color': vm.getRandomColor(vm)
        };
    };

    app.controller("ListingCtrl", ListingCtrl);

    var ResourceService = function($q, $http, $ocLazyLoad) {
        var config = $q.defer();
        var load = $q.defer();

        var loadPlugins = function(plugins) {
            for (var key in plugins) {
                plugins[key] = {
                    name: plugins[key],
                    files: [
                        '/assets/plugins/' + plugins[key] + '/module.js',
                        '/assets/plugins/' + plugins[key] + '/module.css'
                    ]
                };
            }

            // Load the pluguins
            $ocLazyLoad.load(plugins).then(function() {
                // Mark the plugins as loaded
                load.resolve(true);
            });
        };

        $http.get("/data/config.json")
            .success(function(data) {
                config.resolve(data);

                // If there are plugins
                if (data.plugins) {
                    // Load them
                    loadPlugins(data.plugins);
                }
            })
            .error(function(err) {
                console.error(err);
            });

        return {
            get: function() {
                return config.promise;
            },
            load: function() {
                return load.promise;
            }
        }
    };

    app.service('ResourceService', ResourceService);

    var ColorService = function() {
        return {
            getRandomColor: _.memoize(function(tok) {
                var letters = '0123456789ABCDEF'.split('');
                var color = '#';
                for (var i = 0; i < 6; i++ ) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            })
        }
    };

    app.service('ColorService', ColorService);

    var atlantisTile = function(ColorService, ResourceService) {
        return {
            restrict: 'E',
            templateUrl: '/assets/partials/atlantisTile.tpl.html',
            link: function(scope) {
                ResourceService.get().then(function(config) {
                    scope.config = config;
                });

                scope.getRandomColor = ColorService.getRandomColor;
            }
        }
    };

    app.directive('atlantisTile', atlantisTile);

    var atlantisResource = function($compile, ResourceService) {
        return {
            restrict: 'E',
            scope: {
                'resource': '='
            },
            link: function(scope, element) {
                // Create the resource scope
                var resourceScope = scope.$new();

                var completeCompilation = function() {
                    var template = '<' + scope.resource.plugin.directive + ' />',
                        compiled = $compile(template)(resourceScope);

                    element.append(compiled);
                };

                // If this needs a plugin
                if (scope.resource.plugin) {
                    // Add in scope details

                    // If there is any
                    if (scope.resource.data) {
                        // Loop over them
                        for (var key in scope.resource.data) {
                            // And add them to the scope
                            resourceScope[key] = scope.resource.data[key];
                        }
                    }

                    // Wait until the plugins are loaded
                    ResourceService.load().then(function() {
                        // When the plugins are loaded, load this
                        completeCompilation();
                    });

                } else {
                    // Default plugin type
                    scope.resource.plugin = {
                        directive: 'atlantis-tile'
                    };

                    completeCompilation();
                }
            }
        }
    };

    app.directive('atlantisResource', atlantisResource);

    window.selectText = function(elem) {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(elem);
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(elem);
            window.getSelection().addRange(range);
        }
    };

})();
