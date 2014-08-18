define(["require", "exports", "moment", "underscore"], function(require, exports, moment, _) {
    var DateCompareValidator = (function () {
        function DateCompareValidator() {
            this.IgnoreTime = false;
            this.tagName = 'dateCompare';
        }
        DateCompareValidator.prototype.isAcceptable = function (s) {
            var isValid = false;

            if (!_.isDate(s))
                return false;

            if (this.CompareTo === undefined)
                Date.now();

            var now = moment(this.CompareTo);
            var then = moment(s);

            var diffs = then.diff(now);
            if (this.IgnoreTime)
                diffs = moment.duration(diffs).days();

            if (diffs < 0) {
                isValid = this.CompareOperator === 0 /* LessThan */ || this.CompareOperator === 1 /* LessThanEqual */ || this.CompareOperator === 3 /* NotEqual */;
            } else if (diffs > 0) {
                isValid = this.CompareOperator === 5 /* GreaterThan */ || this.CompareOperator === 4 /* GreaterThanEqual */ || this.CompareOperator === 3 /* NotEqual */;
            } else {
                isValid = this.CompareOperator === 1 /* LessThanEqual */ || this.CompareOperator === 2 /* Equal */ || this.CompareOperator === 4 /* GreaterThanEqual */;
            }
            return isValid;
        };
        return DateCompareValidator;
    })();

    
    return DateCompareValidator;
});
