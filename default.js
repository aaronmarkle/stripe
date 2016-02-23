app = angular.module('ticketSocket', ['ui.bootstrap', 'ngAnimate']);

app.controller('buyTicketsModal', function($scope, $uibModal, $log) {
  $scope.items = ['option 1', 'option 2', 'option 3'];
  $scope.animationEnabled = true;
  $scope.open = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'buyTicketsModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: 'md',
      resolve: {
        items: function() {
          return $scope.items;
        }
      }
    });
    modalInstance.result.then(function(selectedItem) {
      $scope.selected = selectedItem;
    }, function() {
      $log.info('Modal dismissed at ' + new Date());
    });
  };
});

app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };
  $scope.ok = function() {
    $uibModalInstance.close($scope.selected.item);
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});