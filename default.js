app = angular.module('ticketSocket', ['ui.bootstrap', 'ngAnimate', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url: '/home'
    })
    .state('ticketType', {
      url: '/ticketType',
      templateUrl: 'partial-ticketType.html',
    });
});

app.controller('buyTicketsModal', function($scope, $uibModal, $log) {
  $scope.animationEnabled = true;
  $scope.open = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'buyTicketsModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: 'md'
    });
  };
});

app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, getEvents) {
  $scope.eventSelection = {};
  getEvents.getEvents().then(function(response) {
    $scope.eventSelection.list = response.data;
  });
  $scope.submit = function() {
    $scope.selectedEvent = myEvent.choice;
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});

app.controller('TicketTypeCtrl', function($scope, getTicketTypes) {
  getTicketTypes.getTicketTypes($scope.eventSelection.selected).then(function(response) {
    $scope.ticketTypes = response.data;
    for (var i=0; i<$scope.ticketTypes.data.length; i++) {
      $scope.ticketTypes.data[i].amount = 0;
    }
    $scope.getTotal = function() {
      var total = 0;
      for (var i=0; i<$scope.ticketTypes.data.length; i++) {
        total += $scope.ticketTypes.data[i].amount * $scope.ticketTypes.data[i].price;
      }
      return total;
    }
  });
});

app.factory('getEvents', function($http) {
  function getEvents() {
    return $http.get('http://qa-demo.ticketsocket.com/api/v1/events');
  }
  return {
    getEvents: getEvents
  }
});

app.factory('getTicketTypes', function($http)  {
  function getTicketTypes(eventId) {
    return $http.get('http://qa-demo.ticketsocket.com/api/v1/events/' + eventId + '/ticket-types');
  }
  return {
    getTicketTypes: getTicketTypes
  }
});