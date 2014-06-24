var runsService = require('services/epicenter-runs-service');
var urlService = require('services/epicenter-url-service');
var ajaxTransportService = require('services/ajax-transport-service');

module.exports = function() {

    var runid = "";
    var apiURL = urlService.getApiURL('operation');
    var transport = require('services/ajax-transport-service');

    return {

        do: function (operation, data) {
            var $def = $.Deferred();
            var postData = {name: operation, arguments: [data]};
            var doPOST;

            var runExpired = function () {
                //Run must've expired or something went wrong with epicenter
                runsService.getRunID(true).then(doPOST);
            };

            doPOST = function (runid) {
                return transport(apiURL + '/' + runid)
                   .post(postData)
                   .fail(runExpired)
                   .then(function (response){
                       $def.resolve(response.result);
                   });
            };

            runsService.getRunID()
                .done(doPOST)
                .fail(runExpired);
            return $def;
        }
    };
}();
