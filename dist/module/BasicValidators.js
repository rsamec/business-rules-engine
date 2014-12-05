


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
                return digits[1].length;
            }
            return 0;
        };
        return NumberFce;
    })();

    var LettersOnlyValidator = (function () {
        function LettersOnlyValidator() {
            this.lettersRegexp = /^[A-Za-z]+$/;
            this.tagName = "lettersonly";
        }
        LettersOnlyValidator.prototype.isAcceptable = function (s) {
            return this.lettersRegexp.test(s);
        };
        return LettersOnlyValidator;
    })();
    Validators.LettersOnlyValidator = LettersOnlyValidator;

    var ZipCodeValidator = (function () {
        function ZipCodeValidator() {
            this.numberRegexp = /^[0-9]+$/;
            this.tagName = "zipcode";
        }
        ZipCodeValidator.prototype.isAcceptable = function (s) {
            return s.length === 5 && this.numberRegexp.test(s);
        };
        return ZipCodeValidator;
    })();
    Validators.ZipCodeValidator = ZipCodeValidator;

    var EmailValidator = (function () {
        function EmailValidator() {
            this.emailRegexp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
            this.tagName = "email";
        }
        EmailValidator.prototype.isAcceptable = function (s) {
            return this.emailRegexp.test(s);
        };
        return EmailValidator;
    })();
    Validators.EmailValidator = EmailValidator;

    var UrlValidator = (function () {
        function UrlValidator() {
            this.urlRegexp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
            this.tagName = "url";
        }
        UrlValidator.prototype.isAcceptable = function (s) {
            return this.urlRegexp.test(s);
        };
        return UrlValidator;
    })();
    Validators.UrlValidator = UrlValidator;

    var CreditCardValidator = (function () {
        function CreditCardValidator() {
            this.tagName = "creditcard";
        }
        CreditCardValidator.prototype.isAcceptable = function (value) {
            if (/[^0-9 \-]+/.test(value)) {
                return false;
            }
            var nCheck = 0, nDigit = 0, bEven = false, n, cDigit;

            value = value.replace(/\D/g, "");

            if (value.length < 13 || value.length > 19) {
                return false;
            }

            for (n = value.length - 1; n >= 0; n--) {
                cDigit = value.charAt(n);
                nDigit = parseInt(cDigit, 10);
                if (bEven) {
                    if ((nDigit *= 2) > 9) {
                        nDigit -= 9;
                    }
                }
                nCheck += nDigit;
                bEven = !bEven;
            }

            return (nCheck % 10) === 0;
        };
        return CreditCardValidator;
    })();
    Validators.CreditCardValidator = CreditCardValidator;

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

    var EqualToValidator = (function () {
        function EqualToValidator(Value) {
            this.Value = Value;
            this.tagName = "equalTo";
        }
        EqualToValidator.prototype.isAcceptable = function (s) {
            return s === this.Value;
        };
        return EqualToValidator;
    })();
    Validators.EqualToValidator = EqualToValidator;

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
        function MinValidator(Min, Exclusive) {
            this.Min = Min;
            this.Exclusive = Exclusive;
            this.tagName = "min";
            if (Min === undefined)
                this.Min = MinimalDefaultValue;
        }
        MinValidator.prototype.isAcceptable = function (s) {
            if (!_.isNumber(s))
                s = parseFloat(s);
            return this.Exclusive ? (s > this.Min) : (s >= this.Min);
        };
        return MinValidator;
    })();
    Validators.MinValidator = MinValidator;

    var MinItemsValidator = (function () {
        function MinItemsValidator(Min) {
            this.Min = Min;
            this.tagName = "minItems";
            if (Min === undefined)
                this.Min = MinimalDefaultValue;
        }
        MinItemsValidator.prototype.isAcceptable = function (s) {
            if (_.isArray(s))
                return s.length >= this.Min;
            return false;
        };
        return MinItemsValidator;
    })();
    Validators.MinItemsValidator = MinItemsValidator;

    var MaxValidator = (function () {
        function MaxValidator(Max, Exclusive) {
            this.Max = Max;
            this.Exclusive = Exclusive;
            this.tagName = "max";
            if (Max === undefined)
                this.Max = MaximalDefaultValue;
        }
        MaxValidator.prototype.isAcceptable = function (s) {
            if (!_.isNumber(s))
                s = parseFloat(s);

            return this.Exclusive ? (s < this.Max) : (s <= this.Max);
        };
        return MaxValidator;
    })();
    Validators.MaxValidator = MaxValidator;

    var MaxItemsValidator = (function () {
        function MaxItemsValidator(Max) {
            this.Max = Max;
            this.tagName = "maxItems";
            if (Max === undefined)
                this.Max = MaximalDefaultValue;
        }
        MaxItemsValidator.prototype.isAcceptable = function (s) {
            if (_.isArray(s))
                return s.length <= this.Max;
            return false;
        };
        return MaxItemsValidator;
    })();
    Validators.MaxItemsValidator = MaxItemsValidator;

    var UniqItemsValidator = (function () {
        function UniqItemsValidator() {
            this.tagName = "uniqItems";
        }
        UniqItemsValidator.prototype.isAcceptable = function (s) {
            if (_.isArray(s))
                return _.uniq(s).length === s.length;
            return false;
        };
        return UniqItemsValidator;
    })();
    Validators.UniqItemsValidator = UniqItemsValidator;

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
            return s >= this.Min && s <= this.Max;
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

    var EnumValidator = (function () {
        function EnumValidator(Enum) {
            this.Enum = Enum;
            this.tagName = "enum";
            if (Enum === undefined)
                this.Enum = [];
        }
        EnumValidator.prototype.isAcceptable = function (s) {
            return _.contains(this.Enum, s);
        };
        return EnumValidator;
    })();
    Validators.EnumValidator = EnumValidator;

    var TypeValidator = (function () {
        function TypeValidator(Type) {
            this.Type = Type;
            this.tagName = "type";
            if (this.Type === undefined)
                this.Type = "string";
        }
        TypeValidator.prototype.isAcceptable = function (s) {
            if (this.Type === "string")
                return _.isString(s);
            if (this.Type === "boolean")
                return _.isBoolean(s);
            if (this.Type === "number")
                return _.isNumber(s);
            if (this.Type === "integer")
                return /^\d+$/.test(s);
            if (this.Type === "object")
                return _.isObject(s);
            if (this.Type === "array")
                return _.isArray(s);
            return false;
        };
        return TypeValidator;
    })();
    Validators.TypeValidator = TypeValidator;

    var StepValidator = (function () {
        function StepValidator(Step) {
            this.Step = Step;
            this.StepDefaultValue = "1";
            this.tagName = "step";
            if (Step === undefined)
                this.Step = this.StepDefaultValue;
        }
        StepValidator.prototype.isAcceptable = function (s) {
            var maxNegDigits = Math.max(NumberFce.GetNegDigits(s), NumberFce.GetNegDigits(this.Step));
            var multiplier = Math.pow(10, maxNegDigits);
            return (parseInt(s, 10) * multiplier) % (parseInt(this.Step, 10) * multiplier) === 0;
        };
        return StepValidator;
    })();
    Validators.StepValidator = StepValidator;

    var MultipleOfValidator = (function () {
        function MultipleOfValidator(Divider) {
            this.Divider = Divider;
            this.MultipleOfDefaultValue = 1;
            this.tagName = "multipleOf";
            if (Divider === undefined)
                this.Divider = this.MultipleOfDefaultValue;
        }
        MultipleOfValidator.prototype.isAcceptable = function (s) {
            if (!_.isNumber(s))
                return false;
            return (s % this.Divider) % 1 === 0;
        };
        return MultipleOfValidator;
    })();
    Validators.MultipleOfValidator = MultipleOfValidator;

    var PatternValidator = (function () {
        function PatternValidator(Pattern) {
            this.Pattern = Pattern;
            this.tagName = "pattern";
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

    var RemoteValidator = (function () {
        function RemoteValidator(Options) {
            this.Options = Options;
            this.isAsync = true;
            this.tagName = "remote";

        }
        RemoteValidator.prototype.isAcceptable = function (s) {
            var deferred = Q.defer();

            this.axios.post(this.Options.url, {
                method: this.Options.type || "get",
                data: _.extend({} || this.Options.data, {
                    "value": s
                })
            }).then(function (response) {
                var isAcceptable = response === true || response === "true";
                deferred.resolve(isAcceptable);
            }).catch(function (response) {
                deferred.resolve(false);
                console.log(response);
            });

            return deferred.promise;
        };
        return RemoteValidator;
    })();
    Validators.RemoteValidator = RemoteValidator;
})(Validators || (Validators = {}));

