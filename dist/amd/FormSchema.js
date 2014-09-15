define(["require", "exports", 'underscore'], function(require, exports, _) {
    var Validation = require("business-rules-engine");
    var Validators = require('business-rules-engine/commonjs/BasicValidators');

    var FormSchema;
    (function (FormSchema) {
        var Util = (function () {
            function Util() {
            }
            Util.GetFormValues = function (formSchema, data) {
                var data = data || {};

                for (var key in formSchema) {
                    var item = formSchema[key];
                    var type = item[Util.TYPE_KEY];
                    if (type === "object") {
                        data[key] = {};
                        Util.GetFormValues(item[Util.PROPERTIES_KEY], data[key]);
                    } else if (type === "array") {
                        data[key] = [];
                        continue;
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
                        continue;
                    }
                }
                return data;
            };

            Util.GetAbstractRule = function (formSchema, rule) {
                rule = rule || new Validation.AbstractValidator();

                for (var key in formSchema) {
                    var item = formSchema[key];
                    var type = item[Util.TYPE_KEY];
                    if (type === "object") {
                        rule.ValidatorFor(key, Util.GetAbstractRule(item[Util.PROPERTIES_KEY]));
                        continue;
                    } else if (type === "array") {
                        var itemValidation = item["minItems"];
                        if (itemValidation !== undefined) {
                            rule.RuleFor(key, new Validators.MinItemsValidator(itemValidation));
                        }

                        itemValidation = item["maxItems"];
                        if (itemValidation !== undefined) {
                            rule.RuleFor(key, new Validators.MaxItemsValidator(itemValidation));
                        }

                        rule.ValidatorFor(key, Util.GetAbstractRule(item[Util.ARRAY_KEY][Util.PROPERTIES_KEY]), true);
                        continue;
                    } else {
                        var validation = item["required"];
                        if (validation !== undefined && validation) {
                            rule.RuleFor(key, new Validators.RequiredValidator());
                        }

                        validation = item["maxLength"];
                        if (validation !== undefined) {
                            rule.RuleFor(key, new Validators.MaxLengthValidator(validation));
                        }

                        validation = item["enum"];
                        if (validation !== undefined) {
                            rule.RuleFor(key, new Validators.EnumValidator(validation));
                        }

                        validation = item["pattern"];
                        if (validation !== undefined) {
                            rule.RuleFor(key, new Validators.PatternValidator(validation));
                        }

                        continue;
                    }
                }
                return rule;
            };
            Util.TYPE_KEY = "type";
            Util.PROPERTIES_KEY = "properties";
            Util.DEFAULT_KEY = "default";
            Util.ARRAY_KEY = "items";
            return Util;
        })();
        FormSchema.Util = Util;
    })(FormSchema || (FormSchema = {}));
    
    return FormSchema;
});
