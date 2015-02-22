var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};






var Validation;
(function (_Validation) {
    

    

    

    

    

    (function (CompareOperator) {
        CompareOperator[CompareOperator["LessThan"] = 0] = "LessThan";

        CompareOperator[CompareOperator["LessThanEqual"] = 1] = "LessThanEqual";

        CompareOperator[CompareOperator["Equal"] = 2] = "Equal";

        CompareOperator[CompareOperator["NotEqual"] = 3] = "NotEqual";

        CompareOperator[CompareOperator["GreaterThanEqual"] = 4] = "GreaterThanEqual";

        CompareOperator[CompareOperator["GreaterThan"] = 5] = "GreaterThan";
    })(_Validation.CompareOperator || (_Validation.CompareOperator = {}));
    var CompareOperator = _Validation.CompareOperator;

    

    

    

    

    

    

    

    

    

    

    

    

    

    

    

    var Error = (function () {
        function Error() {
            this.HasError = false;
            this.ErrorMessage = "";
        }
        return Error;
    })();
    _Validation.Error = Error;

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
    _Validation.ValidationFailure = ValidationFailure;

    var ValidationResult = (function () {
        function ValidationResult(Name) {
            this.Name = Name;
            this.ErrorsChanged = new Utils.Signal();
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

        ValidationResult.prototype.DispatchErrorsChanged = function () {
            if (this.ErrorsChanged !== undefined)
                this.ErrorsChanged.dispatch(this);
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

        ValidationResult.prototype.add = function (child) {
            this.add(child);
            return true;
        };
        ValidationResult.prototype.remove = function (child) {
            this.remove(child);
            return true;
        };
        ValidationResult.prototype.getChildren = function () {
            return this.Children;
        };
        ValidationResult.prototype.getName = function () {
            return this.Name;
        };
        ValidationResult.prototype.isItem = function () {
            return true;
        };
        return ValidationResult;
    })();
    _Validation.ValidationResult = ValidationResult;

    var CompositeValidationResult = (function () {
        function CompositeValidationResult(Name) {
            this.Name = Name;
            this.Children = [];
            this.ErrorsChanged = new Utils.Signal();
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
        CompositeValidationResult.prototype.Clear = function () {
            this.Children.splice(0, this.Children.length);
        };

        Object.defineProperty(CompositeValidationResult.prototype, "HasErrorsDirty", {
            get: function () {
                if (this.Optional !== undefined && _.isFunction(this.Optional) && this.Optional())
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
                if (this.Optional !== undefined && _.isFunction(this.Optional) && this.Optional())
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
            if (headerMessage === undefined)
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
            if (node.Children.length === 0) {
                node["IsDirty"] = dirty;
            } else {
                for (var i = 0, len = node.Children.length; i < len; i++) {
                    this.SetDirtyEx(node.Children[i], dirty);
                }
            }
        };
        CompositeValidationResult.prototype.flattenErrors = function (node, errorCollection) {
            if (node.Children.length === 0) {
                if (node.HasErrors)
                    errorCollection.push(node);
            } else {
                for (var i = 0, len = node.Children.length; i < len; i++) {
                    if (node.Children[i].HasErrors)
                        this.flattenErrors(node.Children[i], errorCollection);
                }
            }
        };

        CompositeValidationResult.prototype.traverse = function (node, indent) {
            console.log(Array(indent++).join("--") + node.Name + " (" + node.ErrorMessage + ")" + '\n\r');

            for (var i = 0, len = node.Children.length; i < len; i++) {
                this.traverse(node.Children[i], indent);
            }
        };

        CompositeValidationResult.prototype.add = function (child) {
            this.add(child);
            return true;
        };
        CompositeValidationResult.prototype.remove = function (child) {
            this.remove(child);
            return true;
        };
        CompositeValidationResult.prototype.getChildren = function () {
            return this.Children;
        };
        CompositeValidationResult.prototype.getName = function () {
            return this.Name;
        };
        CompositeValidationResult.prototype.isItem = function () {
            return false;
        };
        return CompositeValidationResult;
    })();
    _Validation.CompositeValidationResult = CompositeValidationResult;

    var MixedValidationResult = (function (_super) {
        __extends(MixedValidationResult, _super);
        function MixedValidationResult(Composite, PropRule) {
            _super.call(this, Composite.Name);
            this.Composite = Composite;
            this.PropRule = PropRule;
        }
        Object.defineProperty(MixedValidationResult.prototype, "Children", {
            get: function () {
                return this.Composite.Children;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MixedValidationResult.prototype, "ValidationFailures", {
            get: function () {
                return this.PropRule.ValidationFailures;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(MixedValidationResult.prototype, "HasErrorsDirty", {
            get: function () {
                if (this.Composite.HasErrorsDirty)
                    return true;
                if (this.PropRule !== undefined && this.PropRule.HasErrorsDirty)
                    return true;
                return false;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(MixedValidationResult.prototype, "HasErrors", {
            get: function () {
                if (this.Composite.HasErrors)
                    return true;
                if (this.PropRule !== undefined && this.PropRule.HasErrors)
                    return true;
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MixedValidationResult.prototype, "ErrorCount", {
            get: function () {
                if (!this.Composite.HasErrors && this.PropRule !== undefined && !this.PropRule.HasErrors)
                    return 0;
                return this.Composite.ErrorCount + (this.PropRule !== undefined ? this.PropRule.ErrorCount : 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MixedValidationResult.prototype, "ErrorMessage", {
            get: function () {
                if (!this.Composite.HasErrors && this.PropRule !== undefined && !this.PropRule.HasErrors)
                    return "";
                this.Composite.ErrorMessage + this.PropRule !== undefined ? this.PropRule.ErrorMessage : "";
            },
            enumerable: true,
            configurable: true
        });
        return MixedValidationResult;
    })(CompositeValidationResult);

    var AbstractValidator = (function () {
        function AbstractValidator() {
            this.Validators = {};
            this.AbstractValidators = {};
            this.ValidationFunctions = {};
            this.ForList = false;
        }
        AbstractValidator.prototype.RuleFor = function (prop, validator) {
            if (this.Validators[prop] === undefined) {
                this.Validators[prop] = [];
            }

            this.Validators[prop].push(validator);
        };

        AbstractValidator.prototype.ValidationFor = function (prop, fce) {
            if (this.ValidationFunctions[prop] === undefined) {
                this.ValidationFunctions[prop] = [];
            }

            this.ValidationFunctions[prop].push(fce);
        };

        AbstractValidator.prototype.Validation = function (fce) {
            if (fce.Name === undefined)
                throw 'argument must have property Name';
            this.ValidationFor(fce.Name, fce);
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
    _Validation.AbstractValidator = AbstractValidator;

    var AbstractValidationRule = (function () {
        function AbstractValidationRule(Name, validator, ForList) {
            this.Name = Name;
            this.validator = validator;
            this.ForList = ForList;
            this.Rules = {};
            this.Validators = {};
            this.Children = {};
            this.ValidationResultVisitor = new ValidationResultVisitor(new CompositeValidationResult(this.Name));
            if (!this.ForList) {
                _.each(this.validator.Validators, function (val, key) {
                    this.createRuleFor(key);
                    _.each(val, function (validator) {
                        this.Rules[key].AddValidator(validator);
                    }, this);
                }, this);

                _.each(this.validator.ValidationFunctions, function (val) {
                    _.each(val, function (validation) {
                        var validator = this.Validators[validation.Name];
                        if (validator === undefined) {
                            validator = new Validator(validation.Name, validation.ValidationFce, validation.AsyncValidationFce);
                            this.Validators[validation.Name] = validator;
                            validator.AcceptVisitor(this.ValidationResultVisitor);
                        }
                    }, this);
                }, this);

                this.addChildren();
            }
        }
        Object.defineProperty(AbstractValidationRule.prototype, "ValidationResult", {
            get: function () {
                return this.ValidationResultVisitor.ValidationResult;
            },
            set: function (value) {
                this.ValidationResultVisitor.ValidationResult = value;
            },
            enumerable: true,
            configurable: true
        });

        AbstractValidationRule.prototype.AcceptVisitor = function (visitor) {
            visitor.AddValidator(this);
        };

        AbstractValidationRule.prototype.addChildren = function () {
            _.each(this.validator.AbstractValidators, function (val, key) {
                var validationRule;
                if (val.ForList) {
                    validationRule = val.CreateAbstractListRule(key);
                } else {
                    validationRule = val.CreateAbstractRule(key);
                }
                this.Children[key] = validationRule;
                validationRule.AcceptVisitor(this.ValidationResultVisitor);
            }, this);
        };

        AbstractValidationRule.prototype.SetOptional = function (fce) {
            this.ValidationResult.Optional = fce;
            _.each(this.Rules, function (value, key) {
                value.Optional = fce;
            });
            _.each(this.Validators, function (value, key) {
                value.Optional = fce;
            });
            _.each(this.Children, function (value, key) {
                value.SetOptional(fce);
            });
        };

        AbstractValidationRule.prototype.createRuleFor = function (prop) {
            var propValidationRule = new PropertyValidationRule(prop);
            this.Rules[prop] = propValidationRule;
            propValidationRule.AcceptVisitor(this.ValidationResultVisitor);
        };

        AbstractValidationRule.prototype.Validate = function (context) {
            _.each(this.Children, function (val, key) {
                if (context[key] === undefined)
                    context[key] = val.ForList ? [] : {};
                val.Validate(context[key]);
            }, this);

            for (var propName in this.Rules) {
                var rule = this.Rules[propName];
                rule.Validate(new ValidationContext(propName, context));
            }

            _.each(this.validator.ValidationFunctions, function (valFunctions) {
                _.each(valFunctions, function (valFce) {
                    var validator = this.Validators[valFce.Name];
                    if (validator !== undefined)
                        validator.Validate(context);
                }, this);
            }, this);

            return this.ValidationResult;
        };

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

            _.each(this.validator.ValidationFunctions, function (valFunctions) {
                _.each(valFunctions, function (valFce) {
                    var validator = this.Validators[valFce.Name];
                    if (validator !== undefined)
                        promises.push(validator.ValidateAsync(context));
                }, this);
            }, this);

            var self = this;
            Q.all(promises).then(function (result) {
                deferred.resolve(self.ValidationResult);
            });

            return deferred.promise;
        };

        AbstractValidationRule.prototype.ValidateAll = function (context) {
            this.Validate(context);
            return this.ValidateAsync(context);
        };
        AbstractValidationRule.prototype.ValidateProperty = function (context, propName) {
            var childRule = this.Children[propName];
            if (childRule !== undefined)
                childRule.Validate(context[propName]);

            var rule = this.Rules[propName];
            if (rule !== undefined) {
                var valContext = new ValidationContext(propName, context);
                rule.Validate(valContext);
                rule.ValidateAsync(valContext);
            }
            var validationFces = this.validator.ValidationFunctions[propName];
            if (validationFces !== undefined) {
                _.each(validationFces, function (valFce) {
                    var validator = this.Validators[valFce.Name];
                    if (validator !== undefined)
                        validator.Validate(context);
                }, this);
            }
        };

        AbstractValidationRule.prototype.add = function (child) {
            throw "not implemented";
        };
        AbstractValidationRule.prototype.remove = function (child) {
            throw "not implemented";
        };
        AbstractValidationRule.prototype.getChildren = function () {
            return _.map(this.Children, function (item) {
                return item;
            });
        };
        AbstractValidationRule.prototype.getName = function () {
            return this.Name;
        };
        AbstractValidationRule.prototype.isItem = function () {
            return this.getChildren().length === 0;
        };
        AbstractValidationRule.id = 0;
        return AbstractValidationRule;
    })();

    var ValidationResultVisitor = (function () {
        function ValidationResultVisitor(ValidationResult) {
            this.ValidationResult = ValidationResult;
        }
        ValidationResultVisitor.prototype.AddRule = function (rule) {
            this.ValidationResult.Add(rule);
        };

        ValidationResultVisitor.prototype.AddValidator = function (rule) {
            var error = _.find(this.ValidationResult.Children, function (item) {
                return item.Name === rule.ValidationResult.Name;
            });
            if (error !== undefined) {
                this.ValidationResult.Add(new MixedValidationResult(rule.ValidationResult, error));
            } else {
                this.ValidationResult.Add(rule.ValidationResult);
            }
        };
        ValidationResultVisitor.prototype.AddValidation = function (validator) {
            this.ValidationResult.Add(validator);
        };
        return ValidationResultVisitor;
    })();

    var AbstractListValidationRule = (function (_super) {
        __extends(AbstractListValidationRule, _super);
        function AbstractListValidationRule(Name, validator) {
            _super.call(this, Name, validator, true);
            this.Name = Name;
            this.validator = validator;
            this.RowsMap = new HashMap();
        }
        AbstractListValidationRule.prototype.Validate = function (context) {
            this.RefreshRows(context);
            for (var i = 0; i != context.length; i++) {
                var validationRule = this.RowsMap.get(context[i]);
                if (validationRule !== undefined)
                    validationRule.Validate(context[i]);
            }

            return this.ValidationResult;
        };

        AbstractListValidationRule.prototype.ValidateAsync = function (context) {
            var deferred = Q.defer();

            var promises = [];

            this.RefreshRows(context);
            for (var i = 0; i != context.length; i++) {
                var validationRule = this.RowsMap.get(context[i]);
                if (validationRule !== undefined)
                    promises.push(validationRule.ValidateAsync(context[i]));
            }
            var self = this;
            Q.all(promises).then(function (result) {
                deferred.resolve(self.ValidationResult);
            });

            return deferred.promise;
        };

        Object.defineProperty(AbstractListValidationRule.prototype, "Rows", {
            get: function () {
                return this.RowsMap.values();
            },
            enumerable: true,
            configurable: true
        });
        AbstractListValidationRule.prototype.RefreshRows = function (list) {
            this.refreshList(list);
        };
        AbstractListValidationRule.prototype.ClearRows = function (list) {
            var keysToRemove = _.difference(this.RowsMap.keys(), list);
            _.each(keysToRemove, function (key) {
                if (this.has(key))
                    this.remove(key);
            }, this.RowsMap);
        };
        AbstractListValidationRule.prototype.ClearValidationResult = function (list) {
            this.ClearRows(list);

            var results = _.map(this.RowsMap.values(), function (item) {
                return item.ValidationResult;
            });
            for (var i = this.ValidationResult.Children.length - 1; i >= 0; i--) {
                var item = this.ValidationResult.Children[i];
                if (item === undefined)
                    continue;
                if (results.indexOf(item) === -1) {
                    this.ValidationResult.Remove(i);
                }
            }
        };
        AbstractListValidationRule.prototype.getValidationRule = function (key, name) {
            if (name === undefined)
                name = "Row";
            var validationRule;
            if (!this.RowsMap.has(key)) {
                validationRule = this.validator.CreateAbstractRule(name);
                this.ValidationResult.Add(validationRule.ValidationResult);
                this.RowsMap.set(key, validationRule);
            } else {
                validationRule = this.RowsMap.get(key);
            }

            return validationRule;
        };
        AbstractListValidationRule.prototype.refreshList = function (list) {
            this.ClearValidationResult(list);
            _.each(list, function (item) {
                var rule = this.getValidationRule(item);
            }, this);
        };
        return AbstractListValidationRule;
    })(AbstractValidationRule);

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

    var MessageLocalization = (function () {
        function MessageLocalization() {
        }
        MessageLocalization.GetValidationMessage = function (validator) {
            var msgText = MessageLocalization.ValidationMessages[validator.tagName];
            if (msgText === undefined || msgText === "" || !_.isString(msgText)) {
                msgText = MessageLocalization.customMsg;
            }

            return Utils.StringFce.format(msgText, validator);
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
            "maxlength": "Please enter no more than {MaxLength} characters.",
            "minlength": "Please enter at least {MinLength} characters.",
            "rangelength": "Please enter a value between {MinLength} and {MaxLength} characters long.",
            "range": "Please enter a value between {Min} and {Max}.",
            "max": "Please enter a value less than or equal to {Max}.",
            "min": "Please enter a value greater than or equal to {Min}.",
            "step": "Please enter a value with step {Step}.",
            "contains": "Please enter a value from list of values. Attempted value '{AttemptedValue}'.",
            "mask": "Please enter a value corresponding with {Mask}.",
            minItems: "Please enter at least {Min} items.",
            maxItems: "Please enter no more than {Max} items.",
            uniqItems: "Please enter unique items.",
            enum: "Please enter a value from list of permitted values.",
            type: "Please enter a value of type '{Type}'.",
            multipleOf: "Please enter a value that is multiple of {Divider}.",
            "custom": MessageLocalization.customMsg
        };

        MessageLocalization.ValidationMessages = MessageLocalization.defaultMessages;
        return MessageLocalization;
    })();
    _Validation.MessageLocalization = MessageLocalization;

    var PropertyValidationRule = (function (_super) {
        __extends(PropertyValidationRule, _super);
        function PropertyValidationRule(Name, validatorsToAdd) {
            _super.call(this, Name);
            this.Name = Name;
            this.Validators = {};
            this.ValidationFailures = {};

            for (var index in validatorsToAdd) {
                this.AddValidator(validatorsToAdd[index]);
            }
        }
        PropertyValidationRule.prototype.AcceptVisitor = function (visitor) {
            visitor.AddRule(this);
        };

        PropertyValidationRule.prototype.AddValidator = function (validator) {
            this.Validators[validator.tagName] = validator;
            this.ValidationFailures[validator.tagName] = new ValidationFailure(new Error(), !!validator.isAsync);
        };

        Object.defineProperty(PropertyValidationRule.prototype, "Errors", {
            get: function () {
                return this.ValidationFailures;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(PropertyValidationRule.prototype, "HasErrors", {
            get: function () {
                if (this.Optional !== undefined && _.isFunction(this.Optional) && this.Optional())
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
                        newArray.push(error.Error.TranslateArgs);
                });
                return newArray;
            },
            enumerable: true,
            configurable: true
        });

        PropertyValidationRule.prototype.Validate = function (context) {
            try  {
                return this.ValidateEx(context.Value);
            } catch (e) {
                console.log("Exception occurred when checking element " + context.Key + ".", e);

                throw e;
            }
        };

        PropertyValidationRule.prototype.ValidateEx = function (value) {
            var lastPriority = 0;
            var shortCircuited = false;

            var original = this.HasErrors;

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
                        validation.Error.TranslateArgs = { TranslateId: validator.tagName, MessageArgs: _.extend(validator, { AttemptedValue: value }), CustomMessage: validator.customMessage };
                        validation.Error.ErrorMessage = hasError ? MessageLocalization.GetValidationMessage(validation.Error.TranslateArgs.MessageArgs) : "";

                        shortCircuited = hasError;
                        lastPriority = priority;
                    }
                } catch (e) {
                    console.log("Exception occurred when checking element'" + validator.tagName + "' method.", e);

                    throw e;
                }
            }
            if (original !== this.HasErrors)
                this.DispatchErrorsChanged();
            return _.filter(this.ValidationFailures, function (item) {
                return !item.IsAsync;
            });
        };

        PropertyValidationRule.prototype.ValidateAsync = function (context) {
            return this.ValidateAsyncEx(context.Value);
        };

        PropertyValidationRule.prototype.ValidateAsyncEx = function (value) {
            var deferred = Q.defer();
            var promises = [];
            var original = this.HasErrors;
            var setResultFce = function (result) {
                var hasError = !result;

                validation.Error.HasError = hasError;
                validation.Error.TranslateArgs = { TranslateId: validator.tagName, MessageArgs: _.extend(validator, { AttemptedValue: value }) };
                validation.Error.ErrorMessage = hasError ? MessageLocalization.GetValidationMessage(validation.Error.TranslateArgs.MessageArgs) : "";
            };

            for (var index in this.ValidationFailures) {
                var validation = this.ValidationFailures[index];
                if (!validation.IsAsync)
                    continue;
                var validator = this.Validators[index];

                try  {
                    var hasErrorPromise = ((value === undefined || value === null) && validator.tagName != "required") ? Q.when(true) : validator.isAcceptable(value);
                    hasErrorPromise.then(setResultFce);

                    promises.push(hasErrorPromise);
                } catch (e) {
                    console.log("Exception occurred when checking element'" + validator.tagName + "' method.", e);

                    throw e;
                }
            }

            var self = this;
            Q.all(promises).then(function (result) {
                if (original !== self.HasErrors)
                    self.DispatchErrorsChanged();
                deferred.resolve(_.filter(self.ValidationFailures, function (item) {
                    return item.IsAsync;
                }));
            });
            return deferred.promise;
        };
        return PropertyValidationRule;
    })(ValidationResult);

    var Validator = (function (_super) {
        __extends(Validator, _super);
        function Validator(Name, ValidateFce, AsyncValidationFce) {
            _super.call(this, Name);
            this.Name = Name;
            this.ValidateFce = ValidateFce;
            this.AsyncValidationFce = AsyncValidationFce;
            this.Error = new Error();
            this.ValidationFailures = {};
            this.ValidationFailures[this.Name] = new ValidationFailure(this.Error, false);
        }
        Validator.prototype.Validate = function (context) {
            var original = this.Error.HasError;
            if (this.ValidateFce !== undefined)
                this.ValidateFce.bind(context)(this.Error);
            if (original !== this.Error.HasError)
                this.DispatchErrorsChanged();
            return this.ValidationFailures[this.Name];
        };

        Validator.prototype.ValidateAsync = function (context) {
            var deferred = Q.defer();

            if (this.AsyncValidationFce === undefined) {
                deferred.resolve(this.ValidationFailures[this.Name]);
            } else {
                var original = this.Error.HasError;
                var self = this;
                this.AsyncValidationFce.bind(context)(this.Error).then(function () {
                    if (original !== self.Error.HasError)
                        self.DispatchErrorsChanged();
                    deferred.resolve(self.ValidationFailures[self.Name]);
                });
            }

            return deferred.promise;
        };

        Object.defineProperty(Validator.prototype, "HasError", {
            get: function () {
                return this.HasErrors;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Validator.prototype, "Errors", {
            get: function () {
                return this.ValidationFailures;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Validator.prototype, "HasErrors", {
            get: function () {
                if (this.Optional !== undefined && _.isFunction(this.Optional) && this.Optional())
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

        Validator.prototype.AcceptVisitor = function (visitor) {
            visitor.AddValidation(this);
        };
        return Validator;
    })(ValidationResult);
})(Validation || (Validation = {}));

