l_App = angular.module('AppHelloWorld', []);

l_App.controller('CtrHelloWorld', function($scope, $http, $sce) 
{
    $scope.AddUser = AddUser;
    $scope.DeleteUser = DeleteUser;
    $scope.DeleteTrace2 = DeleteTrace2;    
    
    LoadUsers();    
    
    function LoadUsers()
    {
      var l_Url = "http://localhost:8081/listUsers";
      $http.get($sce.trustAsResourceUrl(l_Url)).then(GetListUsers, RequestFailed);
    }

    function AddUser()
    {
      var l_Url = "http://localhost:8081/addUser";      
      var l_Data = {        
           "name" : "mohit",
           "password" : "password4",
           "profession" : "teacher",
           "id": 4  
          };

      $http.post($sce.trustAsResourceUrl(l_Url), JSON.stringify(l_Data)).then(UserResponse, RequestFailed);      
    }

    function DeleteUser()
    {
      var l_Url = "http://localhost:8081/deleteUser/2";      
      $http.delete($sce.trustAsResourceUrl(l_Url)).then(UserResponse, RequestFailed);      
    }

    function DeleteTrace2()
    {
      var l_Url = "http://localhost:8081/deleteTrace/trace2.txt";      
      $http.delete($sce.trustAsResourceUrl(l_Url)).then(UserResponse, RequestFailed);      
    }    

    function UserResponse(response)
    {
      $scope.users = angular.fromJson(response.data);
    }

    function GetListUsers(response)
    {
      $scope.users = angular.fromJson(response.data);
    }

    function RequestFailed(response)
    {
      alert( "request failed" );
    }  
});