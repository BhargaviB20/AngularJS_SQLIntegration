var app = angular.module('inventoryApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/products', {
            templateUrl: 'product-list.html',
            controller: 'ProductController'
        })
        .when('/add', {
            templateUrl: 'product-form.html',
            controller: 'ProductController'
        })
        .otherwise({
            redirectTo: '/products'
        });
});
