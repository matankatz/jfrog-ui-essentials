import {initSelectizeConfig} from './configurations/selectize.config';
import {initCodemirrorConfig} from './configurations/codemirror.config';

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (str) {
        return this.substr(this.length - str.length,str.length)===str;
    }
}
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        return this.substr(0, str.length)===str;
    }
}
window.Hamster = require('hamsterjs');
require('angular-mousewheel');

angular.module('jfrog.ui.essentials', [
        // Vendor modules
        'ngMessages',
        'ngAnimate',
        'ui.utils',
        'ui.select',
        'ui.codemirror',
        'ui.router',
        'ngCookies',
        'toaster',
        'ngSanitize',
        'ngClipboard',
        'ui.bootstrap',
        'ui.grid.draggable-rows',
        'monospaced.mousewheel',
        'ae-datetimepicker',


    // Library modules
        'jfrog.ui.essentials.templates',
        'jfrog.ui.essentials.directives',
        'jfrog.ui.essentials.services',
        'jfrog.ui.essentials.filters'
    ])
       .config(['$qProvider', ($qProvider) => {
           $qProvider.errorOnUnhandledRejections(false);
       }])
       .run(main);

/* @ngInject */
function main($httpBackend, $animate) {


    //$httpBackend.whenPOST(/.*/).passThrough();
    //$httpBackend.whenPUT(/.*/).passThrough();
    //$httpBackend.whenGET(/.*/).passThrough();
    //$httpBackend.whenDELETE(/.*/).passThrough();
    //$httpBackend.whenPATCH(/.*/).passThrough();

    //angular.uppercase was removed in 1.7.0, we polyfill it here, to prevent breakage of 3rd party (ui-grid)
    angular.uppercase = (str) => str.toUpperCase();

    tempFixForAnimateParamsReversal($animate);
	initSelectizeConfig();
	initCodemirrorConfig();
}

function tempFixForAnimateParamsReversal($animate) {
    if ($animate && $animate.enabled && $animate.enabled.bind) {
        let origFunc = $animate.enabled.bind($animate);
        $animate.enabled = function() {
            if (typeof arguments[0] === 'boolean' && typeof arguments[1] === 'object') {
                let temp = arguments[0];
                arguments[0] = arguments[1];
                arguments[1] = temp;
            }
            return origFunc.apply($animate, arguments);
        }
    }
}

