app.factory('ProductService', function($http) {
    var service = {};
    var apiUrl = '/api/products'; // relative path (works on Render + local)

    service.getAll = function() {
        return $http.get(apiUrl);
    };

    service.create = function(product) {
        return $http.post(apiUrl, product);
    };

    service.delete = function(id) {
        return $http.delete(apiUrl + '/' + id);
    };

    return service;
});
