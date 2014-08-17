///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/q/q.d.ts'/>
///<reference path='../../typings/moment/moment.d.ts'/>
///<reference path='../../typings/node-form/node-form.d.ts'/>
var _ = require("underscore");
var Q = require("q");

var Validators;
(function (Validators) {
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

    var lettersRegexp = /^[A-Za-z]+$/;
    var LettersOnlyValidator = (function () {
        function LettersOnlyValidator() {
            this.tagName = "lettersonly";
        }
        LettersOnlyValidator.prototype.isAcceptable = function (s) {
            return lettersRegexp.test(s);
        };
        return LettersOnlyValidator;
    })();
    Validators.LettersOnlyValidator = LettersOnlyValidator;

    var numberRegexp = /^[0-9]+$/;
    var ZipCodeValidator = (function () {
        function ZipCodeValidator() {
            this.tagName = "zipcode";
        }
        ZipCodeValidator.prototype.isAcceptable = function (s) {
            return s.length === 5 && numberRegexp.test(s);
        };
        return ZipCodeValidator;
    })();
    Validators.ZipCodeValidator = ZipCodeValidator;

    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
    var emailRegexp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    var EmailValidator = (function () {
        function EmailValidator() {
            this.tagName = "email";
        }
        EmailValidator.prototype.isAcceptable = function (s) {
            return emailRegexp.test(s);
        };
        return EmailValidator;
    })();
    Validators.EmailValidator = EmailValidator;

    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
    var urlRegexp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    var UrlValidator = (function () {
        function UrlValidator() {
            this.tagName = "url";
        }
        UrlValidator.prototype.isAcceptable = function (s) {
            return urlRegexp.test(s);
        };
        return UrlValidator;
    })();
    Validators.UrlValidator = UrlValidator;

    var RequiredValidator = (function () {
        function RequiredValidator() {
            this.tagName = "required";
        }
        RequiredValidator.prototype.isAcceptable = function (s) {
            return s !== undefined && s !== "";
        };
        return RequiredValidator;
    })();
    Validators.RequiredValidator = RequiredValidator;
    var DateValidator = (function () {
        function DateValidator() {
            this.tagName = "date";
        }
        DateValidator.prototype.isAcceptable = function (s) {
            return !/Invalid|NaN/.test(new Date(s).toString());
        };
        return DateValidator;
    })();
    Validators.DateValidator = DateValidator;
    var DateISOValidator = (function () {
        function DateISOValidator() {
            this.tagName = "dateISO";
        }
        DateISOValidator.prototype.isAcceptable = function (s) {
            return /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(s);
        };
        return DateISOValidator;
    })();
    Validators.DateISOValidator = DateISOValidator;
    var NumberValidator = (function () {
        function NumberValidator() {
            this.tagName = "number";
        }
        NumberValidator.prototype.isAcceptable = function (s) {
            return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(s);
        };
        return NumberValidator;
    })();
    Validators.NumberValidator = NumberValidator;
    var DigitValidator = (function () {
        function DigitValidator() {
            this.tagName = "digit";
        }
        DigitValidator.prototype.isAcceptable = function (s) {
            return /^\d+$/.test(s);
        };
        return DigitValidator;
    })();
    Validators.DigitValidator = DigitValidator;

    var SignedDigitValidator = (function () {
        function SignedDigitValidator() {
            this.tagName = "signedDigit";
        }
        SignedDigitValidator.prototype.isAcceptable = function (s) {
            return /^-?\d+$/.test(s);
        };
        return SignedDigitValidator;
    })();
    Validators.SignedDigitValidator = SignedDigitValidator;
    var MinimalDefaultValue = 0;
    var MinLengthValidator = (function () {
        function MinLengthValidator(MinLength) {
            this.MinLength = MinLength;
            this.tagName = "minlength";
            if (MinLength === undefined)
                this.MinLength = MinimalDefaultValue;
        }
        MinLengthValidator.prototype.isAcceptable = function (s) {
            return s.length >= this.MinLength;
        };
        return MinLengthValidator;
    })();
    Validators.MinLengthValidator = MinLengthValidator;
    var MaximalDefaultValue = 0;
    var MaxLengthValidator = (function () {
        function MaxLengthValidator(MaxLength) {
            this.MaxLength = MaxLength;
            this.tagName = "maxlength";
            if (MaxLength === undefined)
                this.MaxLength = MaximalDefaultValue;
        }
        MaxLengthValidator.prototype.isAcceptable = function (s) {
            return s.length <= this.MaxLength;
        };
        return MaxLengthValidator;
    })();
    Validators.MaxLengthValidator = MaxLengthValidator;

    var RangeLengthValidator = (function () {
        function RangeLengthValidator(RangeLength) {
            this.RangeLength = RangeLength;
            this.tagName = "rangelength";
            if (RangeLength === undefined)
                this.RangeLength = [MinimalDefaultValue, MaximalDefaultValue];
        }
        RangeLengthValidator.prototype.isAcceptable = function (s) {
            return s.length >= this.MinLength && s.length <= this.MaxLength;
        };

        Object.defineProperty(RangeLengthValidator.prototype, "MinLength", {
            get: function () {
                return this.RangeLength[0];
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(RangeLengthValidator.prototype, "MaxLength", {
            get: function () {
                return this.RangeLength[1];
            },
            enumerable: true,
            configurable: true
        });
        return RangeLengthValidator;
    })();
    Validators.RangeLengthValidator = RangeLengthValidator;
    var MinValidator = (function () {
        function MinValidator(Min) {
            this.Min = Min;
            this.tagName = "min";
            if (Min === undefined)
                this.Min = MinimalDefaultValue;
        }
        MinValidator.prototype.isAcceptable = function (s) {
            if (!_.isNumber(s))
                s = parseFloat(s);
            return s >= this.Min;
        };
        return MinValidator;
    })();
    Validators.MinValidator = MinValidator;
    var MaxValidator = (function () {
        function MaxValidator(Max) {
            this.Max = Max;
            this.tagName = "max";
            if (Max === undefined)
                this.Max = MaximalDefaultValue;
        }
        MaxValidator.prototype.isAcceptable = function (s) {
            if (!_.isNumber(s))
                s = parseFloat(s);
            return s <= this.Max;
        };
        return MaxValidator;
    })();
    Validators.MaxValidator = MaxValidator;

    var RangeValidator = (function () {
        function RangeValidator(Range) {
            this.Range = Range;
            this.tagName = "range";
            if (Range === undefined)
                this.Range = [MinimalDefaultValue, MaximalDefaultValue];
        }
        RangeValidator.prototype.isAcceptable = function (s) {
            if (!_.isNumber(s))
                s = parseFloat(s);
            return s.length >= this.Min && s.length <= this.Max;
        };

        Object.defineProperty(RangeValidator.prototype, "Min", {
            get: function () {
                return this.Range[0];
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(RangeValidator.prototype, "Max", {
            get: function () {
                return this.Range[1];
            },
            enumerable: true,
            configurable: true
        });
        return RangeValidator;
    })();
    Validators.RangeValidator = RangeValidator;
    var StepDefaultValue = "1";
    var StepValidator = (function () {
        function StepValidator(Step) {
            this.Step = Step;
            this.tagName = "step";
            if (Step === undefined)
                this.Step = StepDefaultValue;
        }
        StepValidator.prototype.isAcceptable = function (s) {
            var maxNegDigits = Math.max(NumberFce.GetNegDigits(s), NumberFce.GetNegDigits(this.Step));
            var multiplier = Math.pow(10, maxNegDigits);
            return (parseInt(s, 10) * multiplier) % (parseInt(this.Step, 10) * multiplier) === 0;
        };
        return StepValidator;
    })();
    Validators.StepValidator = StepValidator;
    var PatternDefaultValue = "*";
    var PatternValidator = (function () {
        function PatternValidator(Pattern) {
            this.Pattern = Pattern;
            this.tagName = "pattern";
            if (Pattern === undefined)
                this.Pattern = PatternDefaultValue;
        }
        PatternValidator.prototype.isAcceptable = function (s) {
            return new RegExp(this.Pattern).test(s);
        };
        return PatternValidator;
    })();
    Validators.PatternValidator = PatternValidator;
    var ContainsValidator = (function () {
        function ContainsValidator(Options) {
            this.Options = Options;
            this.isAsync = true;
            this.tagName = "contains";
            if (Options === undefined)
                this.Options = Q.when([]);
        }
        ContainsValidator.prototype.isAcceptable = function (s) {
            var deferred = Q.defer();

            this.Options.then(function (result) {
                var hasSome = _.some(result, function (item) {
                    return item === s;
                });
                if (hasSome)
                    deferred.resolve(true);
                deferred.resolve(false);
            });

            return deferred.promise;
        };
        return ContainsValidator;
    })();
    Validators.ContainsValidator = ContainsValidator;
})(Validators || (Validators = {}));
module.exports = Validators;
//# sourceMappingURL=BasicValidators.js.map
