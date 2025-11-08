app.controller('ProductController', function($scope, $location, ProductService) {
  $scope.products = [];
  $scope.newProduct = {};

  function loadProducts() {
    ProductService.getAll().then(function(response) {
      $scope.products = response.data;
    });
  }

  $scope.addProduct = function() {
    ProductService.create($scope.newProduct).then(function() {
      $scope.newProduct = {};
      $location.path('/products');
      loadProducts();
    });
  };

  $scope.deleteProduct = function(id) {
    if (confirm('Delete this product?')) {
      ProductService.delete(id).then(function() {
        loadProducts();
      });
    }
  };

  loadProducts();
});
