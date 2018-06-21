import * as ko from "knockout";
import * as $ from 'jquery';
import "bootstrap";

import "./screens"; // Here we inject the UI

window['__$'] = $;

/* -------------------------------------------------------- */
/* External CSS and some JavaScript that runs independently */

require<any>('bootstrap/dist/css/bootstrap.css');
require<any>('font-awesome/css/font-awesome.css');
require<any>('./styles/styles.css');
/* -------------------------------------------------------- */
/* Shared global state                                      */

var applicationViewModel = {
    obsScreenComponentName: <KnockoutObservable<string | null>>ko.observable(null),
};

window['applicationViewModel'] = applicationViewModel;
ko.applyBindings(applicationViewModel, document.getElementsByTagName('body')[0]);

applicationViewModel.obsScreenComponentName('board');