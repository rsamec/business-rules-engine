var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _ = require('underscore');

var Validation = require('../validation/Validation.js');
var Validators = require('../validation/BasicValidators.js');

var FormSchema;
(function (FormSchema) {
    var JsonSchemaAbstractValidationRuleFactory = (function () {
        function JsonSchemaAbstractValidationRuleFactory(jsonSchema) {
            this.jsonSchema = jsonSchema;
        }
        JsonSchemaAbstractValidationRuleFactory.prototype.CreateRule = function (name) {
            return this.ParseAbstractRule(this.jsonSchema).CreateRule(name);
        };

        JsonSchemaAbstractValidationRuleFactory.prototype.ParseAbstractRule = function (formSchema) {
            var rule = new Validation.AbstractValidator();

            for (var key in formSchema) {
                var item = formSchema[key];
                var type = item[Util.TYPE_KEY];
                if (type === "object") {
                    rule.ValidatorFor(key, this.ParseAbstractRule(item[Util.PROPERTIES_KEY]));
                } else if (type === "array") {
                    _.each(this.ParseValidationAttribute(item), function (validator) {
                        rule.RuleFor(key, validator);
                    });
                    rule.ValidatorFor(key, this.ParseAbstractRule(item[Util.ARRAY_KEY][Util.PROPERTIES_KEY]), true);
                } else {
                    _.each(this.ParseValidationAttribute(item), function (validator) {
                        rule.RuleFor(key, validator);
                    });
                }
            }
            return rule;
        };

        JsonSchemaAbstractValidationRuleFactory.prototype.ParseValidationAttribute = function (item) {
            var validators = new Array();
            if (item === undefined)
                return validators;

            validation = item["multipleOf"];
            if (validation !== undefined) {
                validators.push(new Validators.MultipleOfValidator(validation));
            }

            validation = item["maximum"];
            if (validation !== undefined) {
                validators.push(new Validators.MaxValidator(validation, item["exclusiveMaximum"]));
            }

            validation = item["minimum"];
            if (validation !== undefined) {
                validators.push(new Validators.MinValidator(validation, item["exclusiveMinimum"]));
            }

            validation = item["maxLength"];
            if (validation !== undefined) {
                validators.push(new Validators.MaxLengthValidator(validation));
            }

            validation = item["minLength"];
            if (validation !== undefined) {
                validators.push(new Validators.MinLengthValidator(validation));
            }

            validation = item["pattern"];
            if (validation !== undefined) {
                validators.push(new Validators.PatternValidator(validation));
            }

            validation = item["minItems"];
            if (validation !== undefined) {
                validators.push(new Validators.MinItemsValidator(validation));
            }

            validation = item["maxItems"];
            if (validation !== undefined) {
                validators.push(new Validators.MaxItemsValidator(validation));
            }

            validation = item["uniqueItems"];
            if (validation !== undefined) {
                validators.push(new Validators.UniqItemsValidator(validation));
            }

            var validation = item["required"];
            if (validation !== undefined && validation) {
                validators.push(new Validators.RequiredValidator());
            }

            validation = item["enum"];
            if (validation !== undefined) {
                validators.push(new Validators.EnumValidator(validation));
            }

            var validation = item["type"];
            if (validation !== undefined) {
                validators.push(new Validators.TypeValidator(validation));
            }

            return validators;
        };
        return JsonSchemaAbstractValidationRuleFactory;
    })();
    FormSchema.JsonSchemaAbstractValidationRuleFactory = JsonSchemaAbstractValidationRuleFactory;

    var JQueryValidationAbstractValidationRuleFactory = (function (_super) {
        __extends(JQueryValidationAbstractValidationRuleFactory, _super);
        function JQueryValidationAbstractValidationRuleFactory() {
            _super.apply(this, arguments);
        }
        JQueryValidationAbstractValidationRuleFactory.prototype.ParseValidationAttribute = function (itemEl) {
            var validators = new Array();
            if (itemEl === undefined)
                return validators;

            var item = itemEl.rules;

            if (item === undefined)
                return validators;

            var validation = item["required"];
            if (validation !== undefined && validation) {
                validators.push(new Validators.RequiredValidator());
            }

            var validation = item["remote"];
            if (validation !== undefined && validation) {
                validators.push(new Validators.RemoteValidator(validation));
            }

            validation = item["maxlength"];
            if (validation !== undefined) {
                validators.push(new Validators.MaxLengthValidator(validation));
            }

            validation = item["minlength"];
            if (validation !== undefined) {
                validators.push(new Validators.MinLengthValidator(validation));
            }

            validation = item["rangelength"];
            if (validation !== undefined) {
                validators.push(new Validators.RangeLengthValidator(validation));
            }

            validation = item["max"];
            if (validation !== undefined) {
                validators.push(new Validators.MaxValidator(validation));
            }

            validation = item["min"];
            if (validation !== undefined) {
                validators.push(new Validators.MinValidator(validation));
            }

            validation = item["range"];
            if (validation !== undefined) {
                validators.push(new Validators.RangeValidator(validation));
            }

            validation = item["email"];
            if (validation !== undefined) {
                validators.push(new Validators.EmailValidator());
            }

            validation = item["url"];
            if (validation !== undefined) {
                validators.push(new Validators.UrlValidator());
            }

            validation = item["date"];
            if (validation !== undefined) {
                validators.push(new Validators.DateValidator());
            }

            validation = item["dateISO"];
            if (validation !== undefined) {
                validators.push(new Validators.DateISOValidator());
            }

            validation = item["number"];
            if (validation !== undefined) {
                validators.push(new Validators.NumberValidator());
            }

            validation = item["digits"];
            if (validation !== undefined) {
                validators.push(new Validators.DigitValidator());
            }

            validation = item["creditcard"];
            if (validation !== undefined) {
                validators.push(new Validators.CreditCardValidator());
            }

            validation = item["equalTo"];
            if (validation !== undefined) {
                validators.push(new Validators.EqualToValidator(validation));
            }

            return validators;
        };
        return JQueryValidationAbstractValidationRuleFactory;
    })(JsonSchemaAbstractValidationRuleFactory);
    FormSchema.JQueryValidationAbstractValidationRuleFactory = JQueryValidationAbstractValidationRuleFactory;

    var Util = (function () {
        function Util() {
        }
        Util.InitValues = function (formSchema, data) {
            var data = data || {};

            for (var key in formSchema) {
                var item = formSchema[key];
                var type = item[Util.TYPE_KEY];
                if (type === "object") {
                    data[key] = {};
                    Util.InitValues(item[Util.PROPERTIES_KEY], data[key]);
                } else if (type === "array") {
                    data[key] = [];
                } else {
                    var defaultValue = item[Util.DEFAULT_KEY];
                    if (defaultValue === undefined)
                        continue;

                    if (type === 'boolean') {
                        if (defaultValue === '0') {
                            defaultValue = false;
                        } else {
                            defaultValue = !!defaultValue;
                        }
                    }
                    if ((type === 'number') || (type === 'integer')) {
                        if (_.isString(defaultValue)) {
                            if (!defaultValue.length) {
                                defaultValue = null;
                            } else if (!isNaN(Number(defaultValue))) {
                                defaultValue = Number(defaultValue);
                            }
                        }
                    }
                    if ((type === 'string') && (defaultValue === '')) {
                        defaultValue = null;
                    }

                    data[key] = defaultValue;
                }
            }
            return data;
        };
        Util.TYPE_KEY = "type";
        Util.PROPERTIES_KEY = "properties";
        Util.DEFAULT_KEY = "default";
        Util.ARRAY_KEY = "items";
        return Util;
    })();
    FormSchema.Util = Util;
})(FormSchema || (FormSchema = {}));
module.exports = FormSchema;
