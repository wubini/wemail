app.factory("EmailFactory", function($http){
  return {
    getAll : function(){
      return $http.get("/api/emails")
      .then(function(response){
        return response.data;
      });
    }
  };
});
