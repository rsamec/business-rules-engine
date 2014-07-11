///<reference path='../typings/q/q.d.ts'/>

///<reference path='util.ts'/>
///<reference path='error.ts'/>
///<reference path='errorInfo.ts'/>
///<reference path='validators.ts'/>

module Validation {

    /**
     * It defines validation function.
     */
    export interface IValidate { (args: IError): void; }

    /**
     * It represents named validation function.
     */
    export interface IValidatorFce {
        Name:string;
        ValidationFce: IValidate;
    }

    /**
     * This class represents custom validator.
     */
    export interface IValidator extends IError {
        Validate(context:any): boolean;
        Error: IError;
    }


    /**
     * It represents abstract validator for type of <T>.
     */
    export interface IAbstractValidator<T>{
        RuleFor(prop:string,validator:IPropertyValidator);
        ValidationFor(prop:string,validator:IValidatorFce);
        ValidatorFor<K>(prop:string,validator:IAbstractValidator<K>);


        /**
         * It creates new concrete validation rule and assigned data context to this rule.
         * @param name of the rule
         * @param data context
         * @constructor
         */
        CreateRule(name:string, data:T):IValidationRule<T>;
        CreateAbstractRule(name:string):AbstractValidationRule<any>;
    }


    /**
     * It represents concrete validation rule for type of <T> with data context assigned to rule.
     */
    export interface IValidationRule<T> {

        /**
         * Performs validation and async validation using a validation context.
         */
         ValidateAll():void;

        /**
         * Performs validation and async validation using a validation context for a passed field.
         */
        ValidateField(propName:string):void;

        /**
         * Return validation results.
         */
        ErrorInfo: IErrorInfo

    }

    /**
     * It represents property validation rule for type of <T>.
     */
    export interface IPropertyValidationRule<T> {
        /**
         *The validators that are grouped under this rule.
         */
        Validators:Array<IPropertyValidator>;

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        Validate(context:IValidationContext<T>):Array<IValidationResult>;

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsync(context:IValidationContext<T>):Q.Promise<Array<IValidationResult>>;

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
     * It represents the validation result.
     */
    export interface IValidationResult {
        Validator:IPropertyValidator
        Error:IError;
    }
    /**
     * It represents the validation result for validator.
     */
    export interface IAsyncValidationResult {
        Validator:IAsyncPropertyValidator
        Error:IError;
    }

    /**
     * @ngdoc object
     * @name  AbstractValidator
     *
     * @description
     * It represents abstract validator.
     */
    export class AbstractValidator<T> implements IAbstractValidator<T> {

        public Validators:{ [name: string]: Array<IPropertyValidator> ; } = {};
        public AbstractValidators:{ [name: string]: IAbstractValidator<any> ; } = {};
        public ValidationFunctions:{[name:string]: Array<IValidatorFce>;} = {};

        public RuleFor(prop:string, validator:IPropertyValidator) {
            if (this.Validators[prop] == undefined) {
                this.Validators[prop] = [];
            }

            this.Validators[prop].push(validator);
        }

        public ValidationFor(prop:string,fce:IValidatorFce) {
            if (this.ValidationFunctions[prop] == undefined) {
                this.ValidationFunctions[prop] = [];
            }

            this.ValidationFunctions[prop].push(fce);
        }

        public ValidatorFor<K>(prop:string,validator:IAbstractValidator<K>) {

            this.AbstractValidators[prop] = validator;
        }

        public CreateAbstractRule(name:string){
            return new AbstractValidationRule<T>(name, this);
        }

        public CreateRule(name:string, data:T){
            return new ValidationRule<T>(name, this, data);
        }
    }


    export class AbstractValidationRule<T>{
        public ErrorInfo:IErrorInfo;
        public Rules:{ [name: string]: IPropertyValidationRule<T> ; } = {};
        public Validators: { [name: string]: IValidator ; } = {};
        public Children:{ [name: string]: AbstractValidationRule<any> ; } = {};

        constructor(public Name:string,public validator:AbstractValidator<T>){
            this.ErrorInfo = new CompositeErrorInfo(this.Name);

            _.each(this.validator.Validators, function(val, key){
                this.createRuleFor(key);
                _.each(val, function(validator) {
                    this.Rules[key].AddValidator(validator);
                },this);
            },this);

            _.each(this.validator.ValidationFunctions, function(val:Array<IValidatorFce>, key){
                _.each(val, function(validation) {
                    var validator =  this.Validators[validation.Name];
                    if (validator == undefined){
                        validator = new Validator(validation.Name,validation.ValidationFce);
                        this.Validators[validation.Name] = validator;
                        this.ErrorInfo.Add(validator);
                    }
                },this)
            },this);

            _.each(this.validator.AbstractValidators, function(val, key){
                var validationRule = val.CreateAbstractRule(key);
                this.Children[key] = validationRule;
                this.ErrorInfo.Add(validationRule.ErrorInfo);
            },this);
        }

        private createRuleFor(prop:string){
            var propValidationRule = new PropertyValidationRule(prop);
            this.Rules[prop] = propValidationRule;
            this.ErrorInfo.Add(propValidationRule);

        }

        public SetOptional(fce:IOptional){
            this.ErrorInfo.Optional = fce;
//            _.each(this.Rules, function(value:IErrorInfo, key:string){value.Optional = fce;});
//            _.each(this.Validators, function(value:any, key:string){value.Optional = fce;});
//            _.each(this.Children, function(value:any, key:string){value.SetOptional(fce);});
        }
        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        public Validate(context:T):IErrorInfo{

            _.each(this.Children,function(val,key){
                val.Validate(context[key]);
            },this);


            for (var propName in this.Rules){
                var rule = this.Rules[propName];
                rule.Validate(new ValidationContext(propName,context));
            }

            _.each (this.validator.ValidationFunctions, function (valFunctions:Array<IValidatorFce>, key:string) {
                _.each(valFunctions, function (valFce) {
                    var validator = this.Validators[valFce.Name];
                    if (validator != undefined) validator.Validate(context);
                },this)
            },this);


            return this.ErrorInfo;
        }

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        public ValidateAsync(context:T):Q.Promise<IErrorInfo>{
            var deferred = Q.defer<IErrorInfo>();

            var promises = [];
            _.each(this.Children,function(val,key){
                promises.push(val.ValidateAsync(context[key]));
            },this);

            for (var propName in this.Rules){
                var rule = this.Rules[propName];
                promises.push(rule.ValidateAsync(new ValidationContext(propName,context)));
            }
            var self = this;
            Q.all(promises).then(function(result){deferred.resolve(self.ErrorInfo);});

            return deferred.promise;
        }
    }

    export class ValidationRule<T> extends AbstractValidationRule<T> implements  IValidationRule<T>{
        public Fields:{ [name: string]: FieldRule ; } = {};


        constructor(public Name:string,public validator:AbstractValidator<T>, public Data:T){
            super(Name,validator);

            _.each(this.Rules,function(val,key){
                this.Fields[key] =  new FieldRule(key, this);
            },this)
        }

        ValidateAll(){
            this.Validate(this.Data);
            this.ValidateAsync(this.Data);
        }
        ValidateField(propName:string){
            var childRule = this.Children[propName];
            if (childRule != undefined) childRule.Validate(this.Data[propName]);

            var rule = this.Rules[propName];
            if (rule != undefined) {
                var context = new ValidationContext(propName, this.Data);
                rule.Validate(context);
                rule.ValidateAsync(context);
            }
            var validationFces = this.validator.ValidationFunctions[propName];
            if (validationFces != undefined) {
                _.each(validationFces, function (valFce) {
                    var validator = this.Validators[valFce.Name];
                    if (validator != undefined) validator.Validate(this.Data);
                }, this);
            }
        }

    }

    export class FieldRule {

        constructor(public PropName:string, private DataValidationRule){
        }

        public get Data():any {
             return this.DataValidationRule.Data;
        }
        public get Value():any{
            return this.Data[this.PropName];
        }
        public set Value(value:any){
            this.Data[this.PropName] = value;
        }

        Validate(){
            this.DataValidationRule.ValidateField(this.PropName);
        }

        public get ErrorMessage():string{
            return this.DataValidationRule.Rules[this.PropName].ErrorMessage;
        }
    }



    /**
     *  It represents a data context for validation rule.
     */
    export class ValidationContext<T> implements IValidationContext<T> {

        constructor(public Key:string, public Data: T) {
        }
        public get Value(): any {
            return this.Data[this.Key];
        }
    }
    export class ValidationService{

        static customMsg =  "Please, fix the field.";

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
            "maxlength": "Please enter no more than {MaxLength} characters..",
            "minlength": "Please enter at least {MinLength} characters.",
            "rangelength": "Please enter a value between {MinLength} and {MaxLength} characters long.",
            "range": "Please enter a value between {Min} and {Max}.",
            "max": "Please enter a value less than or equal to {Max}.",
            "min": "Please enter a value greater than or equal to {Min}.",
            "step": "Please enter a value with step {Step}.",
            "param": "Please enter a value from {ParamId}.",
            "mask": "Please enter a value corresponding with {Mask}.",
            "dateCompare": "Please enter a date.",
            "custom": ValidationService.customMsg
        };


        static ValidationMessages = ValidationService.defaultMessages;
        static GetValidationMessage(tagName){
            var msgText = ValidationService.ValidationMessages[tagName];
            if (msgText == undefined) { msgText = ValidationService.customMsg;}
            return msgText;
        }
        static config(config:any){
            if (config.Messages != undefined){
                ValidationService.ValidationMessages = config.Messages;
            }
        }
    }
    export class PropertyValidationRule<T> extends ErrorInfo implements  IPropertyValidationRule<T> {

        public ValidationFailures:{[name:string]: IValidationResult} = {};
        public AsyncValidationFailures:{[name:string]: IAsyncValidationResult} = {};

        constructor(public Name:string, validatorsToAdd?:Array<IPropertyValidator>) {
            super(Name);

            for (var index in validatorsToAdd) {
                this.AddPropertyValidator(validatorsToAdd[index]);
            }
        }
        public AddValidator(validator:any){
            if (validator.isAsync){
                this.AddAsyncPropertyValidator(validator);
            }
            else {
                this.AddPropertyValidator(validator);
            }
        }
        public AddPropertyValidator(validator:IPropertyValidator):void {
            this.ValidationFailures[validator.tagName] =
            {
                Validator: validator,
                Error: new Error()
            };
        }

        public AddAsyncPropertyValidator(validator:IAsyncPropertyValidator):void {
            this.AsyncValidationFailures[validator.tagName] =
            {
                Validator: validator,
                Error: new Error()
            };
        }


        public get Errors():Array<IError> {
            return _.map(_.union(_.values(this.ValidationFailures),_.values(this.AsyncValidationFailures)), function (item:IValidationResult) {
                return item.Error;
            });
        }

        public get Validators():Array<IPropertyValidator> {
            var validators = _.map(_.values(this.ValidationFailures), function (item:IValidationResult) {
                return item.Validator;
            });

            return validators;
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

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        Validate(context:IValidationContext<T>):Array<IValidationResult> {
            try {
                return this.ValidateEx(context.Value);

            } catch (e) {
                //if (this.settings.debug && window.console) {
                console.log("Exception occurred when checking element " + context.Key + ".", e);
                //}
                throw e;
            }
        }

        ValidateEx(value:any):Array<IValidationResult> {
            var lastPriority:number = 0;
            var shortCircuited:boolean = false;

            for (var index in this.ValidationFailures) {
                var validation:IValidationResult = this.ValidationFailures[index];
                var validator:IPropertyValidator = validation.Validator;

                try {
                    var priority = 0;
                    if (shortCircuited && priority > lastPriority) {
                        validation.Error.HasError = false;
                    } else {
                        var hasError = !validator.isAcceptable(value);

                        var errMsg = Validation.StringFce.format(ValidationService.GetValidationMessage(validator.tagName), validator);

                        validation.Error.HasError = hasError;
                        validation.Error.ErrorMessage = hasError ? errMsg : "";

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
            return _.values(this.ValidationFailures);
        }


        /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsync(context:IValidationContext<T>):Q.Promise<Array<IValidationResult>> {
            return this.ValidateAsyncEx(context.Value);
        }
            /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsyncEx(value:string):Q.Promise<Array<IValidationResult>> {
            var deferred = Q.defer<Array<IValidationResult>>();
            var promises = [];
            for (var index in this.AsyncValidationFailures) {
                var validation:IAsyncValidationResult = this.AsyncValidationFailures[index];
                var validator:IAsyncPropertyValidator = validation.Validator;

                try {

                    var hasErrorPromise = validator.isAcceptable(value);
                    hasErrorPromise.then(function (result) {
                        var hasError = !result;
                        var errMsg = Validation.StringFce.format(ValidationService.GetValidationMessage(validator.tagName), validator);

                        validation.Error.HasError = hasError;
                        validation.Error.ErrorMessage = hasError ? errMsg : "";
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
            Q.all(promises).then(function(result){deferred.resolve(_.values(self.AsyncValidationFailures))});
            return deferred.promise;

        }
    }

    /**
     *  It represents a validation rule.
     */
    export class Validator extends ErrorInfo implements IValidator  {
        public Error: IError = new Error();

        constructor (public Name:string,private ValidateFce: IValidate) {
            super(Name);
        }
        public Optional:IOptional;
        public Validate(context:any) {
            this.ValidateFce.bind(context)(this.Error);
            return this.HasError;
        }

        public get HasError():boolean{
            return this.HasErrors;
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
    }

    /**
     * It represents the collection of validators - it is grouped by validator groups.
     *
     * @class validators
     * @constructor
     **/
    /*export class Validators {

     static NO_GROUP_NAME: string = "NoGroup";
     static ALL_GROUP_NAME: string = "All";


     validators: Array<IValidator> = [];
     groupValidators: IDictionary<string, Array<IValidator>> = new Dictionary<string, Array<IValidator>>();

     public Add(item: IValidator, key: string) {
     //pridam validator do obecne skupiny vsech validatoru
     this.validators.push(item);

     if (key == undefined || !_.isString(key) || key == "") {
     this.AddGroup(item, Validators.NO_GROUP_NAME);
     return;
     }

     var groups = key.split(",");

     for (var i = 0; i != groups.length; i++) {
     this.AddGroup(item, groups[i]);
     }
     }
     private AddGroup(item: IValidator, key: string) {

     //vytvorim skupinu validatoru
     if (!this.groupValidators.ContainsKey(key)) {
     this.groupValidators.Add(key, new Array());
     }

     //pridam validator do skupiny
     this.groupValidators.GetValue(key).push(item);

     }
     public ValidateAll(){
     this.Validate(Validators.ALL_GROUP_NAME);
     }
     public Validate(key: string): void {
     if (key == undefined) return;
     if (key == "") {
     //volam vsechny nezařazené validatory
     this.ValidateGroup(Validators.NO_GROUP_NAME);

     }
     else if (key == Validators.ALL_GROUP_NAME) {
     //volam vsechny validatory
     var validators = this.validators;
     for (var i = 0; i != validators.length; i++) {
     validators[i].Validate();
     }
     }
     else {
     //volam vsechny nezařazené validatory
     this.ValidateGroup(Validators.NO_GROUP_NAME);

     //volam pouze validatory pro predane skupiny
     var groups = key.split(",");
     for (var i = 0; i != groups.length; i++) {
     this.ValidateGroup(groups[i]);
     }
     }
     }
     private ValidateGroup(key: string): void {
     if (key == undefined || !_.isString(key) || key == "") return;
     if (!this.groupValidators.ContainsKey(key)) return;
     var validators = this.groupValidators.GetValue(key)
     for (var i = 0; i != validators.length; i++) {
     validators[i].Validate();
     }
     }

     }*/



}