app = angular.module('ticketSocket', ['ui.bootstrap', 'ngAnimate']);

app.controller('buyTicketsModal', function($scope, $uibModal, $log) {
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

app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, getEvents) {
  getEvents.getEvents().then(function(response) {
    $scope.eventSelection = response.data;
  });
  $scope.ok = function() {
    $uibModalInstance.close($scope.selected.item);
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});

app.factory('getEvents', function($http) {
  function getEvents() {
    return $http.get('http://rcastillo.ticketsocket.com/api/v1/events');
  }
  return {
    getEvents: getEvents
  }
});