///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='../../typings/q/q.d.ts'/>
///<reference path='../../typings/moment/moment.d.ts'/>
var Validation;
(function (Validation) {
    

    

    

    

    /**
    * It defines compare operators.
    */
    (function (CompareOperator) {
        //must be less than
        CompareOperator[CompareOperator["LessThan"] = 0] = "LessThan";

        //cannot be more than
        CompareOperator[CompareOperator["LessThanEqual"] = 1] = "LessThanEqual";

        //must be the same as
        CompareOperator[CompareOperator["Equal"] = 2] = "Equal";

        //must be different from
        CompareOperator[CompareOperator["NotEqual"] = 3] = "NotEqual";

        //cannot be less than
        CompareOperator[CompareOperator["GreaterThanEqual"] = 4] = "GreaterThanEqual";

        //must be more than
        CompareOperator[CompareOperator["GreaterThan"] = 5] = "GreaterThan";
    })(Validation.CompareOperator || (Validation.CompareOperator = {}));
    var CompareOperator = Validation.CompareOperator;

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
    Validation.StringFce = StringFce;
    var NumberFce = (function () {
        function NumberFce() {
        }
        NumberFce.GetNegDigits = function (value) {
            if (value == undefined)
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
    Validation.NumberFce = NumberFce;

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
    Validation.LettersOnlyValidator = LettersOnlyValidator;

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
    Validation.ZipCodeValidator = ZipCodeValidator;

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
    Validation.EmailValidator = EmailValidator;

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
    Validation.UrlValidator = UrlValidator;

    var RequiredValidator = (function () {
        function RequiredValidator() {
            this.tagName = "required";
        }
        RequiredValidator.prototype.isAcceptable = function (s) {
            return s != undefined && s != "";
        };
        return RequiredValidator;
    })();
    Validation.RequiredValidator = RequiredValidator;
    var DateValidator = (function () {
        function DateValidator() {
            this.tagName = "date";
        }
        DateValidator.prototype.isAcceptable = function (s) {
            return !/Invalid|NaN/.test(new Date(s).toString());
        };
        return DateValidator;
    })();
    Validation.DateValidator = DateValidator;
    var DateISOValidator = (function () {
        function DateISOValidator() {
            this.tagName = "dateISO";
        }
        DateISOValidator.prototype.isAcceptable = function (s) {
            return /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(s);
        };
        return DateISOValidator;
    })();
    Validation.DateISOValidator = DateISOValidator;
    var NumberValidator = (function () {
        function NumberValidator() {
            this.tagName = "number";
        }
        NumberValidator.prototype.isAcceptable = function (s) {
            return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(s);
        };
        return NumberValidator;
    })();
    Validation.NumberValidator = NumberValidator;
    var DigitValidator = (function () {
        function DigitValidator() {
            this.tagName = "digit";
        }
        DigitValidator.prototype.isAcceptable = function (s) {
            return /^\d+$/.test(s);
        };
        return DigitValidator;
    })();
    Validation.DigitValidator = DigitValidator;

    var SignedDigitValidator = (function () {
        function SignedDigitValidator() {
            this.tagName = "signedDigit";
        }
        SignedDigitValidator.prototype.isAcceptable = function (s) {
            return /^-?\d+$/.test(s);
        };
        return SignedDigitValidator;
    })();
    Validation.SignedDigitValidator = SignedDigitValidator;
    var MinimalDefaultValue = 0;
    var MinLengthValidator = (function () {
        function MinLengthValidator(MinLength) {
            this.MinLength = MinLength;
            this.tagName = "minlength";
            if (MinLength == undefined)
                this.MinLength = MinimalDefaultValue;
        }
        MinLengthValidator.prototype.isAcceptable = function (s) {
            return s.length >= this.MinLength;
        };
        return MinLengthValidator;
    })();
    Validation.MinLengthValidator = MinLengthValidator;
    var MaximalDefaultValue = 0;
    var MaxLengthValidator = (function () {
        function MaxLengthValidator(MaxLength) {
            this.MaxLength = MaxLength;
            this.tagName = "maxlength";
            if (MaxLength == undefined)
                this.MaxLength = MaximalDefaultValue;
        }
        MaxLengthValidator.prototype.isAcceptable = function (s) {
            return s.length <= this.MaxLength;
        };
        return MaxLengthValidator;
    })();
    Validation.MaxLengthValidator = MaxLengthValidator;

    var RangeLengthValidator = (function () {
        function RangeLengthValidator(RangeLength) {
            this.RangeLength = RangeLength;
            this.tagName = "rangelength";
            if (RangeLength == undefined)
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
    Validation.RangeLengthValidator = RangeLengthValidator;
    var MinValidator = (function () {
        function MinValidator(Min) {
            this.Min = Min;
            this.tagName = "min";
            if (Min == undefined)
                this.Min = MinimalDefaultValue;
        }
        MinValidator.prototype.isAcceptable = function (s) {
            if (!_.isNumber(s))
                s = parseFloat(s);
            return s >= this.Min;
        };
        return MinValidator;
    })();
    Validation.MinValidator = MinValidator;
    var MaxValidator = (function () {
        function MaxValidator(Max) {
            this.Max = Max;
            this.tagName = "max";
            if (Max == undefined)
                this.Max = MaximalDefaultValue;
        }
        MaxValidator.prototype.isAcceptable = function (s) {
            if (!_.isNumber(s))
                s = parseFloat(s);
            return s <= this.Max;
        };
        return MaxValidator;
    })();
    Validation.MaxValidator = MaxValidator;

    var RangeValidator = (function () {
        function RangeValidator(Range) {
            this.Range = Range;
            this.tagName = "range";
            if (Range == undefined)
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
    Validation.RangeValidator = RangeValidator;
    var StepDefaultValue = "1";
    var StepValidator = (function () {
        function StepValidator(Step) {
            this.Step = Step;
            this.tagName = "step";
            if (Step == undefined)
                this.Step = StepDefaultValue;
        }
        StepValidator.prototype.isAcceptable = function (s) {
            var maxNegDigits = Math.max(NumberFce.GetNegDigits(s), NumberFce.GetNegDigits(this.Step));
            var multiplier = Math.pow(10, maxNegDigits);
            return (parseInt(s) * multiplier) % (parseInt(this.Step) * multiplier) == 0;
        };
        return StepValidator;
    })();
    Validation.StepValidator = StepValidator;
    var PatternDefaultValue = "*";
    var PatternValidator = (function () {
        function PatternValidator(Pattern) {
            this.Pattern = Pattern;
            this.tagName = "pattern";
            if (Pattern == undefined)
                this.Pattern = PatternDefaultValue;
        }
        PatternValidator.prototype.isAcceptable = function (s) {
            return new RegExp(this.Pattern).test(s);
        };
        return PatternValidator;
    })();
    Validation.PatternValidator = PatternValidator;
    var ContainsValidator = (function () {
        function ContainsValidator(Options) {
            this.Options = Options;
            this.isAsync = true;
            this.tagName = "contains";
            if (Options == undefined)
                this.Options = Q.when([]);
        }
        ContainsValidator.prototype.isAcceptable = function (s) {
            var deferred = Q.defer();

            this.Options.then(function (result) {
                var hasSome = _.some(result, function (item) {
                    return item == s;
                });
                if (hasSome)
                    deferred.resolve(true);
                deferred.resolve(false);
            });

            return deferred.promise;
        };
        return ContainsValidator;
    })();
    Validation.ContainsValidator = ContainsValidator;
})(Validation || (Validation = {}));
///<reference path='../../typings/underscore/underscore.d.ts'/>
///<reference path='validators.ts'/>
var Validation;
(function (Validation) {
    

    

    

    

    

    /**
    *
    * @ngdoc object
    * @name  Error
    * @module Validation
    *
    *
    * @description
    * It represents basic error structure.
    */
    var Error = (function () {
        function Error() {
            this.HasError = true;
            this.ErrorMessage = "";
        }
        return Error;
    })();
    Validation.Error = Error;

    /**
    *
    * @ngdoc object
    * @name  ValidationFailure
    * @module Validation
    *
    *
    * @description
    * It represents validation failure.
    */
    var ValidationFailure = (function () {
        function ValidationFailure(Error, IsAsync) {
            this.Error = Error;
            this.IsAsync = IsAsync;
        }
        Object.defineProperty(ValidationFailure.prototype, "HasError", {
            get: function () {
                return this.Error.HasError;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValidationFailure.prototype, "ErrorMessage", {
            get: function () {
                return this.Error.ErrorMessage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValidationFailure.prototype, "TranslateArgs", {
            get: function () {
                return this.Error.TranslateArgs;
            },
            enumerable: true,
            configurable: true
        });
        return ValidationFailure;
    })();
    Validation.ValidationFailure = ValidationFailure;

    /**
    *
    * @ngdoc object
    * @name  ValidationResult
    * @module Validation
    *
    *
    * @description
    * It represents simple abstract error object.
    */
    var ValidationResult = (function () {
        function ValidationResult(Name) {
            this.Name = Name;
        }
        Object.defineProperty(ValidationResult.prototype, "Children", {
            get: function () {
                return [];
            },
            enumerable: true,
            configurable: true
        });

        ValidationResult.prototype.Add = function (error) {
            throw ("Cannot add to ValidationResult to leaf node.");
        };
        ValidationResult.prototype.Remove = function (index) {
            throw ("Cannot remove ValidationResult from leaf node.");
        };

        Object.defineProperty(ValidationResult.prototype, "HasErrorsDirty", {
            get: function () {
                return this.IsDirty && this.HasErrors;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ValidationResult.prototype, "HasErrors", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ValidationResult.prototype, "ErrorCount", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValidationResult.prototype, "ErrorMessage", {
            get: function () {
                return "";
            },
            enumerable: true,
            configurable: true
        });
        return ValidationResult;
    })();
    Validation.ValidationResult = ValidationResult;

    /**
    *
    * @ngdoc object
    * @name  CompositeValidationResult
    * @module Validation
    *
    *
    * @description
    * It represents composite error object.
    */
    var CompositeValidationResult = (function () {
        function CompositeValidationResult(Name) {
            this.Name = Name;
            this.Children = [];
        }
        CompositeValidationResult.prototype.AddFirst = function (error) {
            this.Children.unshift(error);
        };
        CompositeValidationResult.prototype.Add = function (error) {
            this.Children.push(error);
        };
        CompositeValidationResult.prototype.Remove = function (index) {
            this.Children.splice(index, 1);
        };

        Object.defineProperty(CompositeValidationResult.prototype, "HasErrorsDirty", {
            get: function () {
                if (this.Optional != undefined && _.isFunction(this.Optional) && this.Optional())
                    return false;
                return _.some(this.Children, function (error) {
                    return error.HasErrorsDirty;
                });
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CompositeValidationResult.prototype, "HasErrors", {
            get: function () {
                if (this.Optional != undefined && _.isFunction(this.Optional) && this.Optional())
                    return false;
                return _.some(this.Children, function (error) {
                    return error.HasErrors;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompositeValidationResult.prototype, "ErrorCount", {
            get: function () {
                if (!this.HasErrors)
                    return 0;
                return _.reduce(this.Children, function (memo, error) {
                    return memo + error.ErrorCount;
                }, 0);
                //return _.filter(this.children, function (error) { return error.HasErrors; }).length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompositeValidationResult.prototype, "ErrorMessage", {
            get: function () {
                if (!this.HasErrors)
                    return "";
                return _.reduce(this.Children, function (memo, error) {
                    return memo + error.ErrorMessage;
                }, "");
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(CompositeValidationResult.prototype, "TranslateArgs", {
            get: function () {
                if (!this.HasErrors)
                    return [];
                var newArgs = [];
                _.each(this.Children, function (error) {
                    newArgs = newArgs.concat(error.TranslateArgs);
                });
                return newArgs;
            },
            enumerable: true,
            configurable: true
        });

        CompositeValidationResult.prototype.LogErrors = function (headerMessage) {
            if (headerMessage == undefined)
                headerMessage = "Output";
            console.log("---------------\n");
            console.log("--- " + headerMessage + " ----\n");
            console.log("---------------\n");
            this.traverse(this, 1);
            console.log("\n\n\n");
        };

        Object.defineProperty(CompositeValidationResult.prototype, "Errors", {
            get: function () {
                var map = {};
                _.each(this.Children, function (val) {
                    map[val.Name] = val;
                });
                return map;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompositeValidationResult.prototype, "FlattenErros", {
            get: function () {
                var errors = [];
                this.flattenErrors(this, errors);
                return errors;
            },
            enumerable: true,
            configurable: true
        });
        CompositeValidationResult.prototype.SetDirty = function () {
            this.SetDirtyEx(this, true);
        };
        CompositeValidationResult.prototype.SetPristine = function () {
            this.SetDirtyEx(this, false);
        };
        CompositeValidationResult.prototype.SetDirtyEx = function (node, dirty) {
            if (node.Children.length == 0) {
                node["IsDirty"] = dirty;
            } else {
                for (var i = 0, len = node.Children.length; i < len; i++) {
                    //stop if there are no children with errors
                    this.SetDirtyEx(node.Children[i], dirty);
                }
            }
        };
        CompositeValidationResult.prototype.flattenErrors = function (node, errorCollection) {
            if (node.Children.length == 0) {
                if (node.HasErrors)
                    errorCollection.push(node);
            } else {
                for (var i = 0, len = node.Children.length; i < len; i++) {
                    //stop if there are no children with errors
                    if (node.Children[i].HasErrors)
                        this.flattenErrors(node.Children[i], errorCollection);
                }
            }
        };

        // recursively traverse a (sub)tree
        CompositeValidationResult.prototype.traverse = function (node, indent) {
            console.log(Array(indent++).join("--") + node.Name + " (" + node.ErrorMessage + ")" + '\n\r');

            for (var i = 0, len = node.Children.length; i < len; i++) {
                this.traverse(node.Children[i], indent);
            }
        };
        return CompositeValidationResult;
    })();
    Validation.CompositeValidationResult = CompositeValidationResult;
})(Validation || (Validation = {}));
///<reference path='../../typings/q/q.d.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path='errors.ts'/>
///<reference path='validators.ts'/>
var Validation;
(function (Validation) {
    

    

    

    

    

    

    

    /**
    *
    * @ngdoc object
    * @name  AbstractValidator
    * @module Validation
    *
    *
    * @description
    * It enables to create custom validator for your own abstract object (class) and to assign validation rules to its properties.
    * You can assigned these rules
    *
    * +  property validation rules - use _RuleFor_ property
    * +  property async validation rules - use _RuleFor_ property
    * +  shared validation rules - use _ValidationFor_ property
    * +  custom object validator - use _ValidatorFor_ property - enables composition of child custom validators
    */
    var AbstractValidator = (function () {
        function AbstractValidator() {
            this.Validators = {};
            this.AbstractValidators = {};
            this.ValidationFunctions = {};
            /**
            * Return true if this validation rule is intended for list of items, otherwise true.
            */
            this.ForList = false;
        }
        AbstractValidator.prototype.RuleFor = function (prop, validator) {
            if (this.Validators[prop] == undefined) {
                this.Validators[prop] = [];
            }

            this.Validators[prop].push(validator);
        };

        AbstractValidator.prototype.ValidationFor = function (prop, fce) {
            if (this.ValidationFunctions[prop] == undefined) {
                this.ValidationFunctions[prop] = [];
            }

            this.ValidationFunctions[prop].push(fce);
        };

        AbstractValidator.prototype.ValidatorFor = function (prop, validator, forList) {
            validator.ForList = forList;
            this.AbstractValidators[prop] = validator;
        };

        AbstractValidator.prototype.CreateAbstractRule = function (name) {
            return new AbstractValidationRule(name, this);
        };
        AbstractValidator.prototype.CreateAbstractListRule = function (name) {
            return new AbstractListValidationRule(name, this);
        };

        AbstractValidator.prototype.CreateRule = function (name) {
            return new AbstractValidationRule(name, this);
        };
        return AbstractValidator;
    })();
    Validation.AbstractValidator = AbstractValidator;

    /**
    *
    * @ngdoc object
    * @name  AbstractValidationRule
    * @module Validation
    *
    *
    * @description
    * It represents concreate validator for custom object. It enables to assign validation rules to custom object properties.
    */
    var AbstractValidationRule = (function () {
        function AbstractValidationRule(Name, validator, forList) {
            this.Name = Name;
            this.validator = validator;
            this.Rules = {};
            this.Validators = {};
            this.Children = {};
            /**
            * Return true if this validation rule is intended for list of items, otherwise true.
            */
            this.ForList = false;
            this.ValidationResult = new Validation.CompositeValidationResult(this.Name);

            if (!forList) {
                _.each(this.validator.Validators, function (val, key) {
                    this.createRuleFor(key);
                    _.each(val, function (validator) {
                        this.Rules[key].AddValidator(validator);
                    }, this);
                }, this);

                _.each(this.validator.ValidationFunctions, function (val) {
                    _.each(val, function (validation) {
                        var validator = this.Validators[validation.Name];
                        if (validator == undefined) {
                            validator = new Validator(validation.Name, validation.ValidationFce);
                            this.Validators[validation.Name] = validator;
                            this.ValidationResult.Add(validator);
                        }
                    }, this);
                }, this);

                this.addChildren();
            }
        }
        AbstractValidationRule.prototype.addChildren = function () {
            _.each(this.validator.AbstractValidators, function (val, key) {
                var validationRule;
                if (val.ForList) {
                    validationRule = val.CreateAbstractListRule(key);
                } else {
                    validationRule = val.CreateAbstractRule(key);
                }
                this.Children[key] = validationRule;
                this.ValidationResult.Add(validationRule.ValidationResult);
            }, this);
        };

        AbstractValidationRule.prototype.SetOptional = function (fce) {
            this.ValidationResult.Optional = fce;
            //            _.each(this.Rules, function(value:IValidationResult, key:string){value.Optional = fce;});
            //            _.each(this.Validators, function(value:any, key:string){value.Optional = fce;});
            //            _.each(this.Children, function(value:any, key:string){value.SetOptional(fce);});
        };

        AbstractValidationRule.prototype.createRuleFor = function (prop) {
            var propValidationRule = new PropertyValidationRule(prop);
            this.Rules[prop] = propValidationRule;
            this.ValidationResult.Add(propValidationRule);
        };

        /**
        * Performs validation using a validation context and returns a collection of Validation Failures.
        */
        AbstractValidationRule.prototype.Validate = function (context) {
            _.each(this.Children, function (val, key) {
                if (context[key] === undefined)
                    context[key] = {};
                val.Validate(context[key]);
            }, this);

            for (var propName in this.Rules) {
                var rule = this.Rules[propName];
                rule.Validate(new ValidationContext(propName, context));
            }

            _.each(this.validator.ValidationFunctions, function (valFunctions) {
                _.each(valFunctions, function (valFce) {
                    var validator = this.Validators[valFce.Name];
                    if (validator != undefined)
                        validator.Validate(context);
                }, this);
            }, this);

            return this.ValidationResult;
        };

        /**
        * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
        */
        AbstractValidationRule.prototype.ValidateAsync = function (context) {
            var deferred = Q.defer();

            var promises = [];
            _.each(this.Children, function (val, key) {
                promises.push(val.ValidateAsync(context[key]));
            }, this);

            for (var propName in this.Rules) {
                var rule = this.Rules[propName];
                promises.push(rule.ValidateAsync(new ValidationContext(propName, context)));
            }
            var self = this;
            Q.all(promises).then(function (result) {
                deferred.resolve(self.ValidationResult);
            });

            return deferred.promise;
        };

        AbstractValidationRule.prototype.ValidateAll = function (context) {
            this.Validate(context);
            this.ValidateAsync(context);
        };
        AbstractValidationRule.prototype.ValidateField = function (context, propName) {
            var childRule = this.Children[propName];
            if (childRule != undefined)
                childRule.Validate(context[propName]);

            var rule = this.Rules[propName];
            if (rule != undefined) {
                var valContext = new ValidationContext(propName, context);
                rule.Validate(valContext);
                rule.ValidateAsync(valContext);
            }
            var validationFces = this.validator.ValidationFunctions[propName];
            if (validationFces != undefined) {
                _.each(validationFces, function (valFce) {
                    var validator = this.Validators[valFce.Name];
                    if (validator != undefined)
                        validator.Validate(context);
                }, this);
            }
        };
        return AbstractValidationRule;
    })();
    Validation.AbstractValidationRule = AbstractValidationRule;

    /**
    *
    * @ngdoc object
    * @name  AbstractListValidationRule
    * @module Validation
    *
    *
    * @description
    * It represents an validator for custom object. It enables to assign rules to custom object properties.
    */
    var AbstractListValidationRule = (function (_super) {
        __extends(AbstractListValidationRule, _super);
        function AbstractListValidationRule(Name, validator) {
            _super.call(this, Name, validator, true);
            this.Name = Name;
            this.validator = validator;
        }
        /**
        * Performs validation using a validation context and returns a collection of Validation Failures.
        */
        AbstractListValidationRule.prototype.Validate = function (context) {
            //super.Validate(context);
            this.NotifyListChanged(context);
            for (var i = 0; i != context.length; i++) {
                var validationRule = this.getValidationRule(i);
                if (validationRule != undefined)
                    validationRule.Validate(context[i]);
            }

            return this.ValidationResult;
        };

        /**
        * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
        */
        AbstractListValidationRule.prototype.ValidateAsync = function (context) {
            var deferred = Q.defer();

            var promises = [];

            this.NotifyListChanged(context);
            for (var i = 0; i != context.length; i++) {
                var validationRule = this.getValidationRule(i);
                if (validationRule != undefined)
                    promises.push(validationRule.ValidateAsync(context[i]));
            }
            var self = this;
            Q.all(promises).then(function (result) {
                deferred.resolve(self.ValidationResult);
            });

            return deferred.promise;
        };

        AbstractListValidationRule.prototype.getValidationRule = function (i) {
            var keyName = this.getIndexedKey(i);
            return this.Children[keyName];
        };
        AbstractListValidationRule.prototype.getIndexedKey = function (i) {
            return this.Name + i.toString();
        };

        AbstractListValidationRule.prototype.NotifyListChanged = function (list) {
            for (var i = 0; i != list.length; i++) {
                var validationRule = this.getValidationRule(i);
                if (validationRule == undefined) {
                    var keyName = this.getIndexedKey(i);
                    validationRule = this.validator.CreateAbstractRule(keyName);
                    this.Children[keyName] = validationRule;
                    this.ValidationResult.Add(validationRule.ValidationResult);
                }
            }
        };
        return AbstractListValidationRule;
    })(AbstractValidationRule);
    Validation.AbstractListValidationRule = AbstractListValidationRule;

    /**
    *
    * @ngdoc object
    * @name  ValidationContext
    * @module Validation
    *
    *
    * @description
    * It represents a data context for validation rule.
    */
    var ValidationContext = (function () {
        function ValidationContext(Key, Data) {
            this.Key = Key;
            this.Data = Data;
        }
        Object.defineProperty(ValidationContext.prototype, "Value", {
            get: function () {
                return this.Data[this.Key];
            },
            enumerable: true,
            configurable: true
        });
        return ValidationContext;
    })();
    Validation.ValidationContext = ValidationContext;

    var MessageLocalization = (function () {
        function MessageLocalization() {
        }
        MessageLocalization.GetValidationMessage = function (validator) {
            var msgText = MessageLocalization.ValidationMessages[validator.tagName];
            if (msgText == undefined || msgText == "" || !_.isString(msgText)) {
                msgText = MessageLocalization.customMsg;
            }

            return Validation.StringFce.format(msgText, validator);
        };
        MessageLocalization.customMsg = "Please, fix the field.";

        MessageLocalization.defaultMessages = {
            "required": "This field is required.",
            "remote": "Please fix the field.",
            "email": "Please enter a valid email address.",
            "url": "Please enter a valid URL.",
            "date": "Please enter a valid date.",
            "dateISO": "Please enter a valid date ( ISO ).",
            "number": "Please enter a valid number.",
            "digits": "Please enter only digits.",
            "signedDigits": "Please enter only signed digits.",
            "creditcard": "Please enter a valid credit card number.",
            "equalTo": "Please enter the same value again.",
            "maxlength": "Please enter no more than {MaxLength} characters..",
            "minlength": "Please enter at least {MinLength} characters.",
            "rangelength": "Please enter a value between {MinLength} and {MaxLength} characters long.",
            "range": "Please enter a value between {Min} and {Max}.",
            "max": "Please enter a value less than or equal to {Max}.",
            "min": "Please enter a value greater than or equal to {Min}.",
            "step": "Please enter a value with step {Step}.",
            "contains": "Please enter a value from list of values. Attempted value '{AttemptedValue}'.",
            "mask": "Please enter a value corresponding with {Mask}.",
            "custom": MessageLocalization.customMsg
        };

        MessageLocalization.ValidationMessages = MessageLocalization.defaultMessages;
        return MessageLocalization;
    })();
    Validation.MessageLocalization = MessageLocalization;

    /**
    *
    * @ngdoc object
    * @name  PropertyValidationRule
    * @module Validation
    *
    *
    * @description
    * It represents a property validation rule. The property has assigned collection of property validators.
    */
    var PropertyValidationRule = (function (_super) {
        __extends(PropertyValidationRule, _super);
        //public AsyncValidationFailures:{[name:string]: IAsyncValidationFailure} = {};
        function PropertyValidationRule(Name, validatorsToAdd) {
            _super.call(this, Name);
            this.Name = Name;
            this.Validators = {};
            this.ValidationFailures = {};

            for (var index in validatorsToAdd) {
                this.AddValidator(validatorsToAdd[index]);
            }
        }
        PropertyValidationRule.prototype.AddValidator = function (validator) {
            this.Validators[validator.tagName] = validator;
            this.ValidationFailures[validator.tagName] = new Validation.ValidationFailure(new Validation.Error(), !!validator.isAsync);
        };

        Object.defineProperty(PropertyValidationRule.prototype, "Errors", {
            get: function () {
                return _.map(_.values(this.ValidationFailures), function (item) {
                    return item.Error;
                });
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PropertyValidationRule.prototype, "HasErrors", {
            get: function () {
                if (this.Optional != undefined && _.isFunction(this.Optional) && this.Optional())
                    return false;
                return _.some(_.values(this.Errors), function (error) {
                    return error.HasError;
                });
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PropertyValidationRule.prototype, "ErrorCount", {
            get: function () {
                return this.HasErrors ? 1 : 0;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PropertyValidationRule.prototype, "ErrorMessage", {
            get: function () {
                if (!this.HasErrors)
                    return "";
                return _.reduce(_.values(this.Errors), function (memo, error) {
                    return memo + error.ErrorMessage;
                }, "");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyValidationRule.prototype, "TranslateArgs", {
            get: function () {
                if (!this.HasErrors)
                    return [];
                var newArray = [];
                _.each(_.values(this.Errors), function (error) {
                    if (error.HasError)
                        newArray.push(error.TranslateArgs);
                });
                return newArray;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Performs validation using a validation context and returns a collection of Validation Failures.
        */
        PropertyValidationRule.prototype.Validate = function (context) {
            try  {
                return this.ValidateEx(context.Value);
            } catch (e) {
                //if (this.settings.debug && window.console) {
                console.log("Exception occurred when checking element " + context.Key + ".", e);

                throw e;
            }
        };

        PropertyValidationRule.prototype.ValidateEx = function (value) {
            var lastPriority = 0;
            var shortCircuited = false;

            for (var index in this.ValidationFailures) {
                var validation = this.ValidationFailures[index];
                if (validation.IsAsync)
                    continue;
                var validator = this.Validators[index];

                try  {
                    var priority = 0;
                    if (shortCircuited && priority > lastPriority) {
                        validation.Error.HasError = false;
                    } else {
                        var hasError = ((value === undefined || value === null) && validator.tagName != "required") ? false : !validator.isAcceptable(value);

                        validation.Error.HasError = hasError;
                        validation.Error.TranslateArgs = { TranslateId: validator.tagName, MessageArgs: _.extend(validator, { AttemptedValue: value }) };
                        validation.Error.ErrorMessage = hasError ? MessageLocalization.GetValidationMessage(validation.Error.TranslateArgs.MessageArgs) : "";

                        shortCircuited = hasError;
                        lastPriority = priority;
                    }
                } catch (e) {
                    //if (this.settings.debug && window.console) {
                    console.log("Exception occurred when checking element'" + validator.tagName + "' method.", e);

                    throw e;
                }
            }
            return _.filter(this.ValidationFailures, function (item) {
                return !item.IsAsync;
            });
        };

        /**
        * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
        */
        PropertyValidationRule.prototype.ValidateAsync = function (context) {
            return this.ValidateAsyncEx(context.Value);
        };

        /**
        * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
        */
        PropertyValidationRule.prototype.ValidateAsyncEx = function (value) {
            var deferred = Q.defer();
            var promises = [];
            for (var index in this.ValidationFailures) {
                var validation = this.ValidationFailures[index];
                if (!validation.IsAsync)
                    continue;
                var validator = this.Validators[index];

                try  {
                    var hasErrorPromise = ((value === undefined || value === null) && validator.tagName != "required") ? Q.when(true) : validator.isAcceptable(value);
                    hasErrorPromise.then(function (result) {
                        var hasError = !result;

                        validation.Error.HasError = hasError;
                        validation.Error.TranslateArgs = { TranslateId: validator.tagName, MessageArgs: _.extend(validator, { AttemptedValue: value }) };
                        validation.Error.ErrorMessage = hasError ? MessageLocalization.GetValidationMessage(validation.Error.TranslateArgs.MessageArgs) : "";
                    });

                    promises.push(hasErrorPromise);
                } catch (e) {
                    //if (this.settings.debug && window.console) {
                    console.log("Exception occurred when checking element'" + validator.tagName + "' method.", e);

                    throw e;
                }
            }

            var self = this;
            Q.all(promises).then(function (result) {
                deferred.resolve(_.filter(self.ValidationFailures, function (item) {
                    return item.IsAsync;
                }));
            });
            return deferred.promise;
        };
        return PropertyValidationRule;
    })(Validation.ValidationResult);
    Validation.PropertyValidationRule = PropertyValidationRule;

    /**
    *
    * @ngdoc object
    * @name  Validator
    * @module Validation
    *
    *
    * @description
    * It represents a custom validator. It enables to define your own shared validation rules
    */
    var Validator = (function (_super) {
        __extends(Validator, _super);
        function Validator(Name, ValidateFce) {
            _super.call(this, Name);
            this.Name = Name;
            this.ValidateFce = ValidateFce;
            this.Error = new Validation.Error();
        }
        Validator.prototype.Validate = function (context) {
            this.ValidateFce.bind(context)(this.Error);
            return this.HasError;
        };

        Object.defineProperty(Validator.prototype, "HasError", {
            get: function () {
                return this.HasErrors;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Validator.prototype, "HasErrors", {
            get: function () {
                if (this.Optional != undefined && _.isFunction(this.Optional) && this.Optional())
                    return false;
                return this.Error.HasError;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Validator.prototype, "ErrorCount", {
            get: function () {
                return this.HasErrors ? 1 : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Validator.prototype, "ErrorMessage", {
            get: function () {
                if (!this.HasErrors)
                    return "";
                return this.Error.ErrorMessage;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Validator.prototype, "TranslateArgs", {
            get: function () {
                if (!this.HasErrors)
                    return [];
                var newArray = [];
                newArray.push(this.Error.TranslateArgs);
                return newArray;
            },
            enumerable: true,
            configurable: true
        });
        return Validator;
    })(Validation.ValidationResult);
    Validation.Validator = Validator;
})(Validation || (Validation = {}));
//var _ = require('underscore');
//var Q = require('q');
//module.exports = Validation;
