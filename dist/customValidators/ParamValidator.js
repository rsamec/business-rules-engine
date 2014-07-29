///<reference path='../validation/validators.ts'/>
var Q = require("q");
var _ = require("underscore");

/**
* @ngdoc object
* @name ParamValidator
*
* @requires Q
*
* @description
* Returns true if the value is present in the list. Otherwise return false.
* The list is returned via Options property that can be parametrize by the name of the list with ParamId parameter.
*
*  @property {Date} Options
*  Promise that returns list of param items (key-value pairs)
*
*  <pre>
*     var optionsFce = function (paramId:string) {
*           var deferral = Q.defer();
*           setTimeout(function () {
*               var result:Array<any> = [];
*               if (paramId == "jobs") {
*                   result = [
*                       { "value": 1, "text": "manager" },
*                       { "value": 2, "text": "programmer" },
*                       { "value": 3, "text": "shop assistant" },
*                       { "value": 4, "text": "unemployed" },
*                       { "value": 5, "text": "machinery" },
*                       { "value": 6, "text": "agriculture" },
*                       { "value": 7, "text": "academic" },
*                       { "value": 8, "text": "goverment" }
*                   ];
*               }
*               if (paramId == "countries") {
*                   result = [
*                       { "value": "CZE", "text": "Czech Republic" },
*                       { "value": "Germany", "text": "Germany" },
*                       { "value": "France", "text": "France" },
*                   ];
*               }
*
*
*               deferral.resolve(result);
*           }, 1000);
*           return deferral.promise;
*       };
*  </pre>
*
*  @property {boolean} ParamId - The name of the list to be returned.
*
*  @example
*
*  <pre>
*             //when
*             var validator = new paramValidator();
*             validator.Options = optionsFce;
*             validator.ParamId = "jobs";
*
*             //excercise
*             var promiseResult = validator.isAcceptable("programmer");
*
*             it('value from list should return true', function (done) {
*
*                 promiseResult.then(function(result) {
*
*                     //verify
*                     expect(result).to.equal(true);
*
*                     done();
*
*                 }).done(null, done);
*             });
*
*             //excercise
*             var promiseResult2 = validator.isAcceptable("non existing item");
*
*             it('value out of list should return false', function (done) {
*
*                 promiseResult2.then(function(result) {
*
*                     //verify
*                     expect(result).to.equal(false);
*
*                     done();
*
*                 }).done(null, done);
*             });
*  </pre>
*
*/
var ParamValidator = (function () {
    function ParamValidator() {
        this.isAsync = true;
        this.tagName = "param";
    }
    /**
    * It checks validity of identification number of CZE company (called ico)
    * @param s {string} value to check
    * @returns {boolean} return true for valid value, otherwise false
    */
    ParamValidator.prototype.isAcceptable = function (s) {
        var deferred = Q.defer();

        this.Options(this.ParamId).then(function (result) {
            var hasSome = _.some(result, function (item) {
                return item.text == s;
            });
            if (hasSome)
                deferred.resolve(true);
            deferred.resolve(false);
        });

        return deferred.promise;
    };
    return ParamValidator;
})();
module.exports = ParamValidator;
//# sourceMappingURL=ParamValidator.js.map
