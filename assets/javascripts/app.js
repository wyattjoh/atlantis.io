(function() {
    // Run the app!
    var app = angular.module('AtlantisLanding', []);

    var ListingCtrl = function($http) {
        var vm = this;

        $http.get("/data/resources.json")
            .success(function(response) {
                vm.resources = response.data;
                vm.config = response;
            })
            .error(function(err) {
                console.error(err);
            });
    };

    app.controller("ListingCtrl", ListingCtrl);

})();
