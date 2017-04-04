(function () {
  'use strict';

  angular
    .module('app.account')
    .controller('AccountController', Controller);

  /* @ngInject */
  function Controller($rootScope, $scope, $localForage, Member, Channel, member) {
    var vm = this;

    vm.mode = 'info';
    let init = false;

    vm.changeMode = function(mode) {
      vm.mode = mode;
    };

    vm.member = member;

    $localForage
      .getItem('selectedPlayer')
      .then((player) => {
        if (player && player !== vm.member.player) {
          vm.member.player = player;
        }
      });

    $scope.$watch('vm.member.profileImage', (image, old) => {
      if (typeof image === 'string' && image !== old) {
        updateMember();
      }
    });

    $scope.$watch('vm.member.player', (player, old) => {
      if (typeof player === 'string') {
        updateMember();
      }
    });

    $scope.$watch('vm.member.color', (color) => {
      if (color && init) {
        updateMember();
      } else if (color) {
        init = true;
      }
    });

    $scope.$watchCollection('vm.member.channel', (channel) => {
      if (channel && init) {
        
        Channel
          .prototype$patchAttributes(
            { id: vm.member.channel.id },
            vm.member.channel
          );
      }
    });

    function updateMember() {
      Member
        .prototype$patchAttributes(
          { id: vm.member.id },
          vm.member
        )
        .$promise
        .then(() => {
          $rootScope.$broadcast('loginEvent');
        });
    }
  }
})();
