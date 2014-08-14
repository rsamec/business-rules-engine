///<reference path='../../typings/q/q.d.ts'/>

///<reference path='abstract.ts'/>
///<reference path='errors.ts'/>

module Validation {

    /**
     * @ngdoc module
     * @name Validation
     *
     *
     * @description
     * # Validation (core module)
     * The module itself contains the essential components for an validation engine to function. The table below
     * lists a high level breakdown of each of the components (object, functions) available within this core module.
     *
     * <div doc-module-components="Validation"></div>
     */


    /**
     * It defines validation function.
     */
    export interface IValidate { (args: IError): void; }


    /**
     * It defines async validation function.
     */
    export interface IAsyncValidate { (args: IError): Q.Promise<any>; }

    /**
     * It represents named validation function. It used to define shared validation rules.
     */
    export interface IValidatorFce {

        /**
         * Return name for shared validation rule.
         */
        Name:string;

        /**
         * It defines validation function
         */
        ValidationFce?: IValidate;

        /**
         * It defines async validation function.
         */
        AsyncValidationFce?:IAsyncValidate;
    }

    /**
     * This class represents custom validator. It used to create shared validation rules.
     */
    export interface IValidator {

        /**
         * It executes sync validation rules using a validation context and returns a collection of Validation Failures.
         */
        Validate(context:any): IValidationFailure;
        /**
         * It executes sync and async validation rules using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsync(context:any):Q.Promise<IValidationFailure>;

        /**
         * Return validation failures.
         */
        Error: IError;
    }

    /**
     * It represents abstract validator for type of <T>.
     */
    export interface IAbstractValidator<T>{

        /**
         *  Register property validator for property.
         * @param prop name
         * @param validator - property validator
         */
        RuleFor(prop:string,validator:IPropertyValidator);
        /**
         *  Register shared validation and assign property name as dependency on shared rule.
         *  Dependency = when the property is validated then the shared rule is validated also.
         * @param prop name
         * @param validatorFce name validation function
         */
        ValidationFor(prop:string,validatorFce:IValidatorFce);

        /**
         *  Register shared validation. There are no relationship to dependent property.
         *  Dependency = when the property is validated then the shared rule is validated also.
         * @param validatorFce name validation function
         */
        Validation(validator:IValidatorFce);

        /**
         * Register child validator for property - composition of validators
         * @param prop name
         * @param validator child validator
         */
        ValidatorFor<K>(prop:string,validator:IAbstractValidator<K>);

        //Validators:{ [name: string]: Array<IPropertyValidator> ; };

        /**
         * It creates new concrete validation rule and assigned data context to this rule.
         * @param name of the rule
         * @constructor
         */
        CreateRule(name:string):IAbstractValidationRule<any>;
        CreateAbstractRule(name:string):IAbstractValidationRule<any>;
        CreateAbstractListRule(name:string):IAbstractValidationRule<any>;

        /**
         * return true if this validation rule is intended for list of items, otherwise true
         */
        ForList:boolean;
    }

    /**
     * It represents concrete validation rule for type of <T>.
     */
    export interface IAbstractValidationRule<T> {

        /**
         * It executes sync validation rules using a validation context and returns a collection of Validation Failures.
         */
        Validate(context:T):IValidationResult

        /**
         * It executes async validation rules using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsync(context:T):Q.Promise<IValidationResult>

        /**
         * It executes sync and async validation rules using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAll(context:T):Q.Promise<IValidationResult>;

        /**
         * It executes sync and async validation rules for the passed property using a validation context.
         */
        ValidateProperty(context:T, propName:string):void;

        /**
         * Return validation results.
         */
        ValidationResult: IValidationResult

        /**
         * Return property validation rules.
         */
        Rules:{ [name: string]: IPropertyValidationRule<T> ; }

        /**
         * Return shared validation rules.
         */
        Validators: { [name: string]: IValidator ; }

        /**
         * Return child validators.
         */
        Children:{ [name: string]: IAbstractValidationRule<any> ; }

    }

    /**
     * It represents property validation rule for type of <T>.
     */
    export interface IPropertyValidationRule<T> {
        /**
         *The validators that are grouped under this rule.
         */
        Validators:{[name:string]:any};


        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        Validate(context:IValidationContext<T>):Array<IValidationFailure>;

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsync(context:IValidationContext<T>):Q.Promise<Array<IValidationFailure>>;

    }


    /**
     *  It represents a data context for validation rule.
     */
    export interface IValidationContext<T> {
        /**
         * Return current value.
         */
        Value:string;

        /**
         * Return property name for current data context.
         */
        Key:string;

        /**
         * Data context for validation rule.
         */
        Data:T
    }


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
     * +  register property validation rules - use _RuleFor_ property
     * +  register property async validation rules - use _RuleFor_ property
     * +  register shared validation rules - use _Validation_ or _ValidationFor_ property
     * +  register custom object validator - use _ValidatorFor_ property - enables composition of child custom validators
     */
    export class AbstractValidator<T> implements IAbstractValidator<T> {

        public Validators:{ [name: string]: Array<IPropertyValidator> ; } = {};
        public AbstractValidators:{ [name: string]: IAbstractValidator<any> ; } = {};
        public ValidationFunctions:{[name:string]: Array<IValidatorFce>;} = {};

        /**
         *  Register property validator for property.
         * @param prop name
         * @param validator - property validator
         */
        public RuleFor(prop:string, validator:IPropertyValidator) {
            if (this.Validators[prop] == undefined) {
                this.Validators[prop] = [];
            }

            this.Validators[prop].push(validator);
        }
        /**
         *  Register shared validation and assign property name as dependency on shared rule.
         *  Dependency = when the property is validated then the shared rule is validated also.
         * @param prop name
         * @param validatorFce name validation function
         */
        public ValidationFor(prop:string,fce:IValidatorFce) {
            if (this.ValidationFunctions[prop] == undefined) {
                this.ValidationFunctions[prop] = [];
            }

            this.ValidationFunctions[prop].push(fce);
        }

        /**
         *  Register shared validation. There are no relationship to dependent property.
         *  Dependency = when the property is validated then the shared rule is validated also.
         * @param validatorFce name validation function
         */
        public Validation(fce:IValidatorFce) {
            if (fce.Name === undefined) throw 'argument must have property Name';
            this.ValidationFor(fce.Name,fce);
        }
        /**
         * Register child validator for property - composition of validators
         * @param prop name
         * @param validator child validator
         */
        public ValidatorFor<K>(prop:string,validator:IAbstractValidator<K>, forList?:boolean) {

            validator.ForList = forList;
            this.AbstractValidators[prop] = validator;
        }

        public CreateAbstractRule(name:string) :IAbstractValidationRule<T> {
            return new AbstractValidationRule<T>(name, this);
        }
        public CreateAbstractListRule(name:string) :IAbstractValidationRule<T>{
            return new AbstractListValidationRule<T>(name, this);
        }

        public CreateRule(name:string): IAbstractValidationRule<T>{
            return new AbstractValidationRule<T>(name, this);
        }


        /**
        * Return true if this validation rule is intended for list of items, otherwise true.
        */
        public ForList:boolean = false;

    }

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
    class AbstractValidationRule<T> implements IAbstractValidationRule<T>{
        public ValidationResult:IValidationResult;
        public Rules:{ [name: string]: IPropertyValidationRule<T> ; } = {};
        public Validators: { [name: string]: IValidator ; } = {};
        public Children:{ [name: string]: IAbstractValidationRule<any> ; } = {};

        /**
         * Return true if this validation rule is intended for list of items, otherwise true.
         */
        public ForList:boolean = false;

        constructor(public Name:string,public validator:AbstractValidator<T>, forList?:boolean){
            this.ValidationResult = new CompositeValidationResult(this.Name);

            if (!forList) {
                _.each(this.validator.Validators, function (val, key) {
                    this.createRuleFor(key);
                    _.each(val, function (validator) {
                        this.Rules[key].AddValidator(validator);
                    }, this);
                }, this);

                _.each(this.validator.ValidationFunctions, function (val:Array<IValidatorFce>) {
                    _.each(val, function (validation) {
                        var validator = this.Validators[validation.Name];
                        if (validator == undefined) {
                            validator = new Validator(validation.Name, validation.ValidationFce, validation.AsyncValidationFce);
                            this.Validators[validation.Name] = validator;
                            this.ValidationResult.Add(validator);
                        }
                    }, this)
                }, this);

                this.addChildren();
            }
        }

        public addChildren(){
            _.each(this.validator.AbstractValidators, function(val, key){
                var validationRule;
                if (val.ForList){
                    validationRule = val.CreateAbstractListRule(key);
                }
                else {
                    validationRule = val.CreateAbstractRule(key);
                }
                this.Children[key] = validationRule;
                this.ValidationResult.Add(validationRule.ValidationResult);
            },this);

        }

        public SetOptional(fce:IOptional){

            this.ValidationResult.Optional = fce;
//            _.each(this.Rules, function(value:IValidationResult, key:string){value.Optional = fce;});
//            _.each(this.Validators, function(value:any, key:string){value.Optional = fce;});
//            _.each(this.Children, function(value:any, key:string){value.SetOptional(fce);});
        }

        private createRuleFor(prop:string){
            var propValidationRule = new PropertyValidationRule(prop);
            this.Rules[prop] = propValidationRule;
            this.ValidationResult.Add(propValidationRule);

        }

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        public Validate(context:T):IValidationResult{

            _.each(this.Children,function(val,key){
                if (context[key] === undefined) context[key] = {};
                val.Validate(context[key]);
            },this);


            for (var propName in this.Rules){
                var rule = this.Rules[propName];
                rule.Validate(new ValidationContext(propName,context));
            }

            _.each (this.validator.ValidationFunctions, function (valFunctions:Array<IValidatorFce>) {
                _.each(valFunctions, function (valFce) {
                    var validator = this.Validators[valFce.Name];
                    if (validator != undefined) validator.Validate(context);
                },this)
            },this);

            return this.ValidationResult;
        }

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        public ValidateAsync(context:T):Q.Promise<IValidationResult>{
            var deferred = Q.defer<IValidationResult>();

            var promises = [];
            _.each(this.Children,function(val,key){
                promises.push(val.ValidateAsync(context[key]));
            },this);

            for (var propName in this.Rules){
                var rule = this.Rules[propName];
                promises.push(rule.ValidateAsync(new ValidationContext(propName,context)));
            }

            _.each (this.validator.ValidationFunctions, function (valFunctions:Array<IValidatorFce>) {
                _.each(valFunctions, function (valFce) {
                    var validator = this.Validators[valFce.Name];
                    if (validator != undefined) promises.push(validator.ValidateAsync(context));
                },this)
            },this);

            var self = this;
            Q.all(promises).then(function(result){deferred.resolve(self.ValidationResult);});

            return deferred.promise;
        }

        ValidateAll(context:T):Q.Promise<IValidationResult>{
            this.Validate(context);
            return this.ValidateAsync(context);
        }
        ValidateProperty(context:T, propName:string){
            var childRule = this.Children[propName];
            if (childRule != undefined) childRule.Validate(context[propName]);

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
                    if (validator != undefined) validator.Validate(context);
                }, this);
            }
        }

    }


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
    class AbstractListValidationRule<T> extends AbstractValidationRule<T> {

        constructor(public Name:string, public validator:AbstractValidator<T>) {
            super(Name, validator, true);
        }


        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        public Validate(context:any):IValidationResult {

            //super.Validate(context);


            this.NotifyListChanged(context);
            for (var i = 0; i != context.length; i++) {
                var validationRule = this.getValidationRule(i);
                if (validationRule != undefined)  validationRule.Validate(context[i]);
            }

            return this.ValidationResult;
        }

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        public ValidateAsync(context:any):Q.Promise<IValidationResult>{
            var deferred = Q.defer<IValidationResult>();

            var promises = [];

            this.NotifyListChanged(context);
            for (var i = 0; i != context.length; i++) {
                var validationRule = this.getValidationRule(i);
                if (validationRule != undefined) promises.push(validationRule.ValidateAsync(context[i]));
            }
            var self = this;
            Q.all(promises).then(function(result){deferred.resolve(self.ValidationResult);});

            return deferred.promise;
        }

        private getValidationRule(i:number) {
            var keyName = this.getIndexedKey(i);
            return this.Children[keyName];
        }
        private getIndexedKey(i:number){
            return this.Name + i.toString();
        }

        public NotifyListChanged(list:Array<any>) {
            for (var i = 0; i != list.length; i++) {
                var validationRule = this.getValidationRule(i);
                if (validationRule == undefined) {
                    var keyName = this.getIndexedKey(i);
                    validationRule = this.validator.CreateAbstractRule(keyName);
                    this.Children[keyName] = validationRule;
                    this.ValidationResult.Add(validationRule.ValidationResult);
                }
            }
        }
    }

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
    class ValidationContext<T> implements IValidationContext<T> {

        constructor(public Key:string, public Data: T) {
        }
        public get Value(): any {
            return this.Data[this.Key];
        }
    }


   class MessageLocalization {

        static customMsg = "Please, fix the field.";

        static defaultMessages = {
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
            "custom": MessageLocalization.customMsg
        };


        static ValidationMessages = MessageLocalization.defaultMessages;

        static GetValidationMessage(validator:any) {
            var msgText = MessageLocalization.ValidationMessages[validator.tagName];
            if (msgText == undefined || msgText == "" || !_.isString(msgText)) {
                msgText = MessageLocalization.customMsg;
            }

            return StringFce.format(msgText, validator);
        }
    }
    class StringFce {
        static format(s:string, args:any):string {
            var formatted = s;
            for (var prop in args) {
                var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
                formatted = formatted.replace(regexp, args[prop]);
            }
            return formatted;
        }
    }
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
    class PropertyValidationRule<T> extends ValidationResult implements  IPropertyValidationRule<T> {


        public Validators:{[name:string]: any} = {};
        public ValidationFailures:{[name:string]: IValidationFailure} = {};
        //public AsyncValidationFailures:{[name:string]: IAsyncValidationFailure} = {};

        constructor(public Name:string, validatorsToAdd?:Array<IPropertyValidator>) {
            super(Name);


            for (var index in validatorsToAdd) {
                this.AddValidator(validatorsToAdd[index]);
            }


        }
        public AddValidator(validator:any){
            this.Validators[validator.tagName] = validator;
            this.ValidationFailures[validator.tagName] = new ValidationFailure(new Error(),!!validator.isAsync);
        }


        public get Errors():{[name:string]: IValidationFailure} {
            return this.ValidationFailures;
        }

        public get HasErrors():boolean {
            if (this.Optional != undefined && _.isFunction(this.Optional) && this.Optional()) return false;
            return _.some(_.values(this.Errors), function (error) {
                return error.HasError;
            });
        }


        public get ErrorCount():number {
            return this.HasErrors ? 1 : 0;
        }

        public get ErrorMessage():string {
            if (!this.HasErrors) return "";
            return _.reduce(_.values(this.Errors), function (memo, error:IError) {
                return memo + error.ErrorMessage;
            }, "");
        }
        public get TranslateArgs():Array<IErrorTranslateArgs>{
            if (!this.HasErrors) return [];
            var newArray = [];
             _.each(_.values(this.Errors), function (error:IValidationFailure) {
                if (error.HasError) newArray.push(error.Error.TranslateArgs);
            });
            return newArray;
        }

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        Validate(context:IValidationContext<T>):Array<IValidationFailure> {
            try {
                return this.ValidateEx(context.Value);

            } catch (e) {
                //if (this.settings.debug && window.console) {
                console.log("Exception occurred when checking element " + context.Key + ".", e);
                //}
                throw e;
            }
        }

        ValidateEx(value:any):Array<IValidationFailure> {

            var lastPriority:number = 0;
            var shortCircuited:boolean = false;

            for (var index in this.ValidationFailures) {

                var validation:IValidationFailure = this.ValidationFailures[index];
                if (validation.IsAsync) continue;
                var validator:IPropertyValidator = this.Validators[index];

                try {
                    var priority = 0;
                    if (shortCircuited && priority > lastPriority) {
                        validation.Error.HasError = false;
                    } else {

                        var hasError = ((value===undefined || value === null) && validator.tagName!="required")?false: !validator.isAcceptable(value);

                        validation.Error.HasError = hasError;
                        validation.Error.TranslateArgs = { TranslateId:validator.tagName, MessageArgs:_.extend(validator,{AttemptedValue: value}), CustomMessage: validator.customMessage};
                        validation.Error.ErrorMessage = hasError ? MessageLocalization.GetValidationMessage(validation.Error.TranslateArgs.MessageArgs) : "";

                        shortCircuited = hasError;
                        lastPriority = priority;
                    }

                } catch (e) {
                    //if (this.settings.debug && window.console) {
                    console.log("Exception occurred when checking element'" + validator.tagName + "' method.", e);
                    //}
                    throw e;
                }
            }
            return _.filter(this.ValidationFailures,function(item){return !item.IsAsync;});
        }


        /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsync(context:IValidationContext<T>):Q.Promise<Array<IValidationFailure>> {
            return this.ValidateAsyncEx(context.Value);
        }
            /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsyncEx(value:string):Q.Promise<Array<IValidationFailure>> {
            var deferred = Q.defer<Array<IValidationFailure>>();
            var promises = [];
            for (var index in this.ValidationFailures) {
                var validation:IValidationFailure = this.ValidationFailures[index];
                if (!validation.IsAsync) continue;
                var validator:IAsyncPropertyValidator = this.Validators[index];

                try {

                    var hasErrorPromise = ((value===undefined || value === null) && validator.tagName!="required")?Q.when(true):validator.isAcceptable(value);
                    hasErrorPromise.then(function (result) {
                        var hasError = !result;

                        validation.Error.HasError = hasError;
                        validation.Error.TranslateArgs = { TranslateId:validator.tagName, MessageArgs:_.extend(validator,{AttemptedValue: value})};
                        validation.Error.ErrorMessage = hasError ? MessageLocalization.GetValidationMessage(validation.Error.TranslateArgs.MessageArgs) : "";


                    });

                    promises.push(hasErrorPromise);

                } catch (e) {
                    //if (this.settings.debug && window.console) {
                    console.log("Exception occurred when checking element'" + validator.tagName + "' method.", e);
                    //}
                    throw e;
                }
            }

            var self = this;
            Q.all(promises).then(function(result){deferred.resolve(_.filter(self.ValidationFailures,function(item){return item.IsAsync;}))});
            return deferred.promise;

        }
    }



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
    class Validator extends ValidationResult implements IValidator  {
        public Error: IError = new Error();
        public ValidationFailures:{[name:string]: IValidationFailure} = {};

        constructor (public Name:string,private ValidateFce?: IValidate, private AsyncValidationFce?:IAsyncValidate) {
            super(Name);
            this.ValidationFailures[this.Name] = new ValidationFailure(this.Error,false);

        }
        public Optional:IOptional;

        public Validate(context:any):IValidationFailure {
            if (this.ValidateFce != undefined)  this.ValidateFce.bind(context)(this.Error);
            return this.ValidationFailures[this.Name];
        }

        public ValidateAsync(context:any):Q.Promise<IValidationFailure>{
            var deferred = Q.defer<IValidationFailure>();

            if (this.AsyncValidationFce == undefined) {
                deferred.resolve(this.ValidationFailures[this.Name]);
            }
            else {
                var self = this;
                this.AsyncValidationFce.bind(context)(this.Error).then(function () {
                    deferred.resolve(self.ValidationFailures[self.Name]);
                });
            }

            return deferred.promise;
        }

        public get HasError():boolean{
            return this.HasErrors;
        }


        public get Errors():{[name:string]: IValidationFailure} {
            return this.ValidationFailures;
        }
        public get HasErrors(): boolean {
            if (this.Optional != undefined && _.isFunction(this.Optional) && this.Optional()) return false;
            return this.Error.HasError;
        }

        public get ErrorCount(): number {
            return this.HasErrors ? 1 : 0;
        }
        public get ErrorMessage(): string {
            if (!this.HasErrors) return "";
            return this.Error.ErrorMessage;
        }

        public get TranslateArgs():Array<IErrorTranslateArgs> {
            if (!this.HasErrors) return [];
            var newArray = [];
            newArray.push(this.Error.TranslateArgs);
            return newArray;
        }
    }
}
//var _ = require('underscore');
//var Q = require('q');
//module.exports = Validation;
