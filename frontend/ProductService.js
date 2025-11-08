app.factory('ProductService', function($http) {
  var service = {};
  var apiUrl = 'http://localhost:3000/api/products';

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
