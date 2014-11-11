(function() {
    // Run the app!
    var app = angular.module('AtlantisLanding', []);

    var ListingCtrl = function($http) {
        var vm = this;

        $http.get("/data/resources.json")
            .success(function(data) {
                vm.resources = data;
                vm.resources_string = _.pluck(data, 'url').join(" ");
            })
            .error(function(err) {
                console.error(err);
            });

        $http.get("/data/config.json")
            .success(function(data) {
                vm.config = data;
            })
            .error(function(err) {
                console.error(err);
            });
    };

    app.controller("ListingCtrl", ListingCtrl);

})();
