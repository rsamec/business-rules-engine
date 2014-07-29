///<reference path='../../typings/moment/moment.d.ts'/>
///<reference path='../validation/validators.ts'/>
var moment = require("moment");
var _ = require("underscore");

/**
* @ngdoc object
* @name DateCompareValidator
*
* @requires moment
* @requires underscore
*
* @description
* DateCompareValidator enables to compare date to another date (CompareTo).</br>
*
* @property {Date} CompareTo
* The datetime against the compare is done.
* If  property is not set, then comparison is done against actual datetime.
*
* @property {boolean} IgnoreDate
* It forces to ignore time part of date by date compare.
*
*
* @example
* <pre>
*
*  //create validator
*  var validator = new dateCompareValidator();
*  validator.CompareTo = new Date(2000,2,2);
*  validator.CompareOperator = Validation.CompareOperator.LessThanEqual;
*
*
*  //less more than month -> return true
*  var result = validator.isAcceptable(new Date(2000,1,1));
*  //equal up to days -> return true
*  var result = validator.isAcceptable(new Date(2000,2,2));
*
* </pre>
*
*/
var DateCompareValidator = (function () {
    function DateCompareValidator() {
        /**
        * It forces to ignore time part of date by date compare.
        * @type {boolean}
        */
        this.IgnoreTime = false;
        this.tagName = 'dateCompare';
    }
    DateCompareValidator.prototype.isAcceptable = function (s) {
        var isValid = false;

        //if date to compare is not specified - defaults to compare against now
        if (!_.isDate(s))
            return false;

        if (this.CompareTo == undefined)
            Date.now();

        var now = moment(this.CompareTo);
        var then = moment(s);

        var diffs = then.diff(now);
        if (this.IgnoreTime)
            diffs = moment.duration(diffs).days();

        if (diffs < 0) {
            isValid = this.CompareOperator == 0 /* LessThan */ || this.CompareOperator == 1 /* LessThanEqual */ || this.CompareOperator == 3 /* NotEqual */;
        } else if (diffs > 0) {
            isValid = this.CompareOperator == 5 /* GreaterThan */ || this.CompareOperator == 4 /* GreaterThanEqual */ || this.CompareOperator == 3 /* NotEqual */;
        } else {
            isValid = this.CompareOperator == 1 /* LessThanEqual */ || this.CompareOperator == 2 /* Equal */ || this.CompareOperator == 4 /* GreaterThanEqual */;
        }
        return isValid;
    };
    return DateCompareValidator;
})();

module.exports = DateCompareValidator;
//# sourceMappingURL=DateCompareValidator.js.map
