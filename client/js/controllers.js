
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
        };
    }
]);

testAppControllers.controller('FileUploadCtrl', [
    '$scope', '$http',
    function ($scope, $http) {
        $scope.$http = $http;
        $scope.status = "Waiting for user.";

        $scope.submit = function () {
            $scope.status = 'Uploading...';
            $http.jsonp("/magic/formpostsig?callback=JSON_CALLBACK").
            
                success(function(data, status, headers, config) {
                    var file = document.getElementById('file').files[0];
                    var fd = new FormData();
                    fd.append('key', data.key);
                    fd.append('acl', 'public-read'); 
                    fd.append('Content-Type', file.type);      
                    fd.append('AWSAccessKeyId', data.accesskey);
                    fd.append('policy', data.policyBase64);
                    fd.append('signature',data.signature);
                    fd.append("file",file);
                    
                    $http.post("https://"+data.bucket+".s3.amazonaws.com", fd).
                    
                        success(function(data, status, headers, config) {
                            $scope.status = "Upload complete!";
                        }).
                        
                        error(function(data, status, headers, config) {
                            $scope.status = "Upload failed."
                            $scope.error = true;
                        });
                }).
                
                error(function(data, status, headers, config) {
                    $scope.status = "Not enough magic.";
                    $scope.error = true;
                });
        
        }
    }
]);