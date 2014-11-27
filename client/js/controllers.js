
var testAppControllers = angular.module('testAppControllers', []);

testAppControllers.controller('FileListCtrl', [
    '$scope',
    function ($scope) {
        $scope.files = [
            {
                'name': 'file1.jpg'
            },
            {
                'name': 'file2.jpg'
            },
            {
                'name': 'file3.jpg'
            }
        ];
    }
]);

testAppControllers.controller('FileDetailCtrl', [
    '$scope', '$routeParams',
    function ($scope, $routeParams) {
        $scope.file = {
            'id':  $routeParams.id
        }
    }
]);

