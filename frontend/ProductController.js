app.controller('ProductController', function($scope, $location, ProductService) {
    $scope.products = [];
    $scope.newProduct = {};
    $scope.errorMessage = '';

    function loadProducts() {
        $scope.errorMessage = '';
        ProductService.getAll()
            .then(function(response) {
                $scope.products = response.data;
            })
            .catch(function(err) {
                console.error('Error loading products', err);
                $scope.errorMessage = 'Could not load products. Is the backend running?';
            });
    }

    $scope.addProduct = function() {
        ProductService.create($scope.newProduct)
            .then(function(response) {
                $scope.newProduct = {};
                $location.path('/products');
            })
            .catch(function(err) {
                console.error('Error adding product', err);
                $scope.errorMessage = 'Could not add product.';
            });
    };

    $scope.deleteProduct = function(id) {
        if (confirm('Are you sure?')) {
            ProductService.delete(id)
                .then(function(response) {
                    loadProducts();
                })
                .catch(function(err) {
                    console.error('Error deleting product', err);
                    $scope.errorMessage = 'Could not delete product.';
                });
        }
    };

    loadProducts();
});
