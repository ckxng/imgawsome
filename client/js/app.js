
var testApp = angular.module('testApp', [
    'ngRoute',
    'testAppControllers'
]);

testApp.config(
    ['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.
            when('/files', {
                templateUrl: 'parts/file-list.html',
                controller: 'FileListCtrl'
            }).
            when('/files/:id', {
                templateUrl: 'parts/file-detail.html',
                controller: 'FileDetailCtrl'
            }).
            when('/file_upload', {
                templateUrl: 'parts/file-upload.html',
                controller: 'FileUploadCtrl'
            }).
            otherwise({
                redirectTo: '/files'
            });
    }
]);

