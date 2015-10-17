define(['angularAMD', 'angular-route', 'jquery'], function (angularAMD) {
    var app = angular.module("ngreq-app", ['ngRoute']);
    
    /**
     * Configure Angular ngApp with route and cache the needed providers
     */
    app.config(function ($routeProvider, $sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'http://localhost:9778/**'
        ]);
        
        jQuery.ajax({
            url: "http://localhost:9778/www/config.json",
            async: false,
            
        }).success(function (data) {
            angular.forEach(data.routes, function (route) {
                console.log('route:', route);
                
                require.config({
                    paths: {
                        "resource": 'http://localhost:9778/www/js/lib/angular-resource/angular-resource'
                    }
                });
                
                $routeProvider
                .when("/" + route.name, angularAMD.route({
                    templateUrl: "http://localhost:9778/www/" + route.template, controller: route.controller, controllerUrl: "http://localhost:9778/www/" + route.controllerUrl, navTab: route.name
                }));
            });
        });
        
        
        $routeProvider
            .when("/home", angularAMD.route({
                templateUrl: 'views/home.html', controller: 'HomeController', navTab: "home"
            }))
            .when("/pictures", angularAMD.route({
                templateUrl: 'views/pictures.html', controllerUrl: 'controller/pictures_ctrl', navTab: "pictures"
            }))
            .when("/modules", angularAMD.route({
                templateUrl: 'views/modules.html', controller: 'ModulesController', navTab: "modules"
            }))
            .when("/map", angularAMD.route({
                templateUrl: 'views/map.html', controller: 'MapController', navTab: "map"
            }))
            .otherwise({redirectTo: '/home'})
        ;
    });
    
    // Define constant to be used by Google Analytics
    app.constant("SiteName", "/angularAMD");
    
    
    // Create function to link to GitHub
    app.directive('ghLink', function () {
        return {
            restrict: 'A',
            scope: true,
            template: '<a href="{{fullpath}}" target="_blank">{{filename}}</a>',
            controller: function ($scope, $attrs) {
                var gh_root = "https://github.com/marcoslin/angularAMD/blob/master/www/",
                    relfile = $attrs.ghLink,
                    fullpath = gh_root + relfile;
                $scope.fullpath = fullpath;
                $scope.filename = relfile.replace(/^.*[\\\/]/, '');
            }
        };
    });
    
    // Add support for pretty print
    app.directive('prettyprint', function() {
        return {
            restrict: 'C',
            link: function postLink(scope, element, attrs) {
                  element.html(prettyPrint(scope.dom));
            }
        };
    });
        
    // Bootstrap Angular when DOM is ready
    return angularAMD.bootstrap(app);

});
