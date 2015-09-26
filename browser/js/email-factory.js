app.factory("EmailFactory", function($http){
  return {
    getAll : function(){
      return $http.get("http://127.0.0.1:1337/api/emails")
      .then(function(response){
        return response.data;
      });
    }
  };
});
