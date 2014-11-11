(function() {
    // Run the app!
    var app = angular.module('AtlantisLanding', []);

    var ListingCtrl = function($http) {
        var vm = this;

        // Set hostname
        vm.host = window.location.host;

        var handleResources = function(response) {
            vm.config = response;

            if (vm.host != vm.config.url) {
                console.log("mismatch detected: " + vm.host + " != " + vm.config.url);

                $('#myModal').foundation('reveal', 'open');

                vm.firstTime = true;
            } else {
                vm.resources = response.data;
            }
        };

        // Fetch the resources
        $http.get("/data/resources.json")
            .success(handleResources)
            .error(function(err) {
                console.error(err);
            });
    };

    app.controller("ListingCtrl", ListingCtrl);

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
