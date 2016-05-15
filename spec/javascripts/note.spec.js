describe("A suite is just a function", function() {
  var a;

  it("and so is a spec", function() {
    a = true;

    expect(a).toBe(true);
  });
});

describe("NotePad test", function() {
  beforeEach(module('myApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    controller = _$controller_;
}));

  describe('$scope.changeCreateMode', function(){
   var $scope, controller;

   beforeEach(function(){
     $scope = {};
     controller = $controller('notecontroller', {$scope : $scope});
   });

   it('called', function() {
     $scope.changeCreateMode();
   });

  });


});
