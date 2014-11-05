




var FormSchema;
(function (FormSchema) {
    

    var JsonSchemaRuleFactory = (function () {
        function JsonSchemaRuleFactory(jsonSchema) {
            this.jsonSchema = jsonSchema;
        }
        JsonSchemaRuleFactory.prototype.CreateAbstractValidator = function () {
            return this.ParseAbstractRule(this.jsonSchema);
        };

        JsonSchemaRuleFactory.prototype.CreateRule = function (name) {
            return this.ParseAbstractRule(this.jsonSchema).CreateRule(name);
        };

        JsonSchemaRuleFactory.prototype.ParseAbstractRule = function (formSchema) {
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

        JsonSchemaRuleFactory.prototype.ParseValidationAttribute = function (item) {
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
                validators.push(new Validators.UniqItemsValidator());
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

            validation = item["email"];
            if (validation !== undefined) {
                validators.push(new Validators.EmailValidator());
            }

            validation = item["uri"];
            if (validation !== undefined) {
                validators.push(new Validators.UrlValidator());
            }

            return validators;
        };
        return JsonSchemaRuleFactory;
    })();
    FormSchema.JsonSchemaRuleFactory = JsonSchemaRuleFactory;

    var JQueryValidationRuleFactory = (function () {
        function JQueryValidationRuleFactory(metaData) {
            this.metaData = metaData;
        }
        JQueryValidationRuleFactory.prototype.CreateAbstractValidator = function () {
            return this.ParseAbstractRule(this.metaData);
        };

        JQueryValidationRuleFactory.prototype.CreateRule = function (name) {
            return this.ParseAbstractRule(this.metaData).CreateRule(name);
        };

        JQueryValidationRuleFactory.prototype.ParseAbstractRule = function (metaData) {
            var rule = new Validation.AbstractValidator();

            for (var key in metaData) {
                var item = metaData[key];
                var rules = item[JQueryValidationRuleFactory.RULES_KEY];

                if (_.isArray(item)) {
                    if (item[1] !== undefined) {
                        _.each(this.ParseValidationAttribute(item[1]), function (validator) {
                            rule.RuleFor(key, validator);
                        });
                    }
                    rule.ValidatorFor(key, this.ParseAbstractRule(item[0]), true);
                } else if (rules !== undefined) {
                    _.each(this.ParseValidationAttribute(rules), function (validator) {
                        rule.RuleFor(key, validator);
                    });
                } else if (_.isObject(item)) {
                    rule.ValidatorFor(key, this.ParseAbstractRule(item));
                } else {
                    continue;
                }
            }
            return rule;
        };

        JQueryValidationRuleFactory.prototype.ParseValidationAttribute = function (item) {
            var validators = new Array();
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
                validators.push(new Validators.UniqItemsValidator());
            }

            validation = item["enum"];
            if (validation !== undefined) {
                validators.push(new Validators.EnumValidator(validation));
            }

            return validators;
        };
        JQueryValidationRuleFactory.RULES_KEY = "rules";
        JQueryValidationRuleFactory.DEFAULT_KEY = "default";
        return JQueryValidationRuleFactory;
    })();
    FormSchema.JQueryValidationRuleFactory = JQueryValidationRuleFactory;

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

