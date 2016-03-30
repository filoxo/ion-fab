angular.module('fabDirective', [])
  .directive('fabScrollContainer', function () {
    return {
      restrict: 'A',
      controller: ['$element', function ($element) {
        $element.parent().data('fabScrollContainer', $element);
      }]
    };
  })
  .directive('ionFabGroup', function fabButtonGroupDirective(){
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<div class="fab-group" ng-transclude></div>'
    }
  })
  .directive('ionFab', function fabButtonDirective($ionicScrollDelegate) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: template,
      link: link
    };

    //isAnchor
    function isAnchor(attr) {
      return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.uiSref);
    }

    //template
    function template(element, attr) {
      return isAnchor(attr) ?
        '<a class="fab" ng-transclude></a>' :
        '<button class="fab" ng-transclude></button>';
    }

    //link
    function link(scope, element, attr) {

      if(attr.animation == 'none') {
        return;
      }
      var liveDisplace = (attr.liveDisplace && attr.liveDisplace != 'false') || (!attr.liveDisplace && !attr.animation),
          target = element.inheritedData('fabScrollContainer') || window,
          scroll = 0,
          max = 80,
          current = 0,
          prevScroll = 0;

      element.addClass('animated');

      target.bind('scroll', function (e) {
        scroll = $ionicScrollDelegate.getScrollPosition().top;
        if (liveDisplace) {
          current = scroll >= 0 ? Math.min(max, Math.max(0, current + scroll - prevScroll)) : 0;
          window.requestAnimationFrame(function () {
            element.css("transform", "translate3d(0, " + current + "px, 0)");
          });
        } else {
          if (current < scroll) {
            switch(attr.animation){
              case 'zoom':
                toggleClassState('zoomIn', 'zoomOut');
                break;
              case 'rotate':
                toggleClassState('rotateIn', 'rotateOut');
                break;
              case 'fade':
              default:
                toggleClassState('fadeInUp', 'fadeOutDown');
            }
          } else if (current > scroll) {
            switch(attr.animation){
              case 'zoom':
                toggleClassState('zoomOut', 'zoomIn');
                break;
              case 'rotate':
                toggleClassState('rotateOut', 'rotateIn');
                break;
              case 'fade':
              default:
                toggleClassState('fadeOutDown', 'fadeInUp');
            }
          }
          current = scroll;
        }
        prevScroll = scroll;
      });

      function toggleClassState(fromClass, toClass){
        element.removeClass(fromClass).addClass(toClass);
      }
    }
  });
