app = angular.module('ticketSocket', ['ui.bootstrap', 'ngAnimate', 'ui.router']);

//Stripe Configuration
Stripe.setPublishableKey('pk_test_XufkDRqkvLQIXIWK2QO7Mw2I');

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url: '/home'
    })
    .state('ticketType', {
      url: '/ticketType',
      templateUrl: 'partial-ticketType.html'
    })
    .state('checkout', {
      url:'/checkout',
      templateUrl: 'partial-stripeCheckout.html'
    })
    .state('success', {
      url:'/success',
      templateUrl: 'partial-success.html'
    })
});

app.controller('buyTicketsModal', function($scope, $uibModal, $log) {
  $scope.animationEnabled = true;
  $scope.open = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      templateUrl: 'buyTicketsModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: 'md'
    });
  };
});

app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, getEvents) {
  $scope.username = 'qa-demo';
  $scope.eventSelection = {};
  getEvents.getEvents($scope.username).then(function(response) {
    $scope.eventSelection.list = response.data;
  });
  $scope.submit = function() {
    $scope.selectedEvent = myEvent.choice;
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});

app.controller('TicketTypeCtrl', function($scope, getTicketTypes, checkoutTotal) {
  $scope.username = 'qa-demo';
  getTicketTypes.getTicketTypes($scope.username, $scope.eventSelection.selected).then(function(response) {
    $scope.ticketTypes = response.data;
    for (var i=0; i<$scope.ticketTypes.data.length; i++) {
      $scope.ticketTypes.data[i].amount = 0;
    }
    $scope.getTotal = function() {
      $scope.currentTotal = 0;
      for (var i=0; i<$scope.ticketTypes.data.length; i++) {
        $scope.currentTotal += $scope.ticketTypes.data[i].amount * $scope.ticketTypes.data[i].price;
        checkoutTotal.setTotal($scope.currentTotal);
      }
      return $scope.currentTotal;
    }
  });
});

app.controller('StripeCheckoutCtrl', function($scope, $http, $state, checkoutTotal) {
  $scope.paymentTotal = checkoutTotal.getTotal();
  $scope.card = {};
  $scope.card.amount = $scope.paymentTotal;
  function stripeResponseHandler(status, response) {
    if (response.error) {
      $scope.tokenError = response.error.message;
    } else {
      var token = response.id;
      $scope.card.stripeToken = token;
      $http.post('/creditAuth', $scope.card)
        .success(function(data) {
          $scope.results = data;
          $state.transitionTo('success');
        })
    }
  }
  $scope.submit = function() {
    Stripe.card.createToken({
    number: $scope.card.number,
    cvc: $scope.card.cvc,
    exp_month: $scope.card.expirymonth,
    exp_year: $scope.card.expiryyear
    }, stripeResponseHandler);
  }
});

app.factory('getEvents', function($http) {
  function getEvents(username) {
    return $http.get('http://' + username + '.ticketsocket.com/api/v1/events');
  }
  return {
    getEvents: getEvents
  }
});

app.factory('getTicketTypes', function($http)  {
  function getTicketTypes(username, eventId) {
    return $http.get('http://' + username + '.ticketsocket.com/api/v1/events/' + eventId + '/ticket-types');
  }
  return {
    getTicketTypes: getTicketTypes
  }
});

app.factory('checkoutTotal', function() {
  function getTotal() {
    return currentTotal;
  }
  function setTotal(amount) {
    currentTotal = amount;
  }
  return {
    getTotal: getTotal,
    setTotal: setTotal
  }
});