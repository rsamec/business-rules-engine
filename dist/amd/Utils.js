define(["require", "exports"], function(require, exports) {
    var Utils;
    (function (Utils) {
        var StringFce = (function () {
            function StringFce() {
            }
            StringFce.format = function (s, args) {
                var formatted = s;
                for (var prop in args) {
                    var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
                    formatted = formatted.replace(regexp, args[prop]);
                }
                return formatted;
            };
            return StringFce;
        })();
        Utils.StringFce = StringFce;

        var NumberFce = (function () {
            function NumberFce() {
            }
            NumberFce.GetNegDigits = function (value) {
                if (value === undefined)
                    return 0;
                var digits = value.toString().split('.');
                if (digits.length > 1) {
                    var negDigitsLength = digits[1].length;
                    return negDigitsLength;
                }
                return 0;
            };
            return NumberFce;
        })();
        Utils.NumberFce = NumberFce;
    })(Utils || (Utils = {}));
    
    return Utils;
});
