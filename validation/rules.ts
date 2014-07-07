///<reference path='../typings/q/q.d.ts'/>

///<reference path='abstract.ts'/>
///<reference path='util.ts'/>
///<reference path='error.ts'/>
///<reference path='errorInfo.ts'/>
///<reference path='validators.ts'/>

module Validation {

    export interface IValidatorFce {
        Name:string;
        ValidationFce: IValidate;
    }

    export class AbstractValidator<T> implements IAbstractValidator<T> {

        public Validators:{ [name: string]: Array<IPropertyValidator> ; } = {};
        public ValidationFunctions:{[name:string]: Array<IValidatorFce>;} = {};

        public RuleFor(prop:string, validator:IPropertyValidator) {
            if (this.Validators[prop] == undefined) {
                this.Validators[prop] = [];
            }

            this.Validators[prop].push(validator);
        }

        public ValidatorFor(prop:string,fce:IValidatorFce) {
            if (this.ValidationFunctions[prop] == undefined) {
                this.ValidationFunctions[prop] = [];
            }

            this.ValidationFunctions[prop].push(fce);
        }

        public CreateAbstractRule(name:string){
            return new AbstractValidationRule<T>(name, this);
        }

        public CreateRule(name:string, data:T){
            return new DataValidationRule<T>(name, this, data);
        }
    }


    export class AbstractValidationRule<T>{
        public ErrorInfo:IErrorInfo;
        public Rules:{ [name: string]: IValidationRule ; } = {};
        public Validators: { [name: string]: IValidator ; } = {};

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
        }

        private createRuleFor(prop:string){
            var propValidationRule = new PropertyValidationRule(prop);
            this.Rules[prop] = propValidationRule;
            this.ErrorInfo.Add(propValidationRule);

        }

        public SetOptional(fce:IOptional){
            _.each(this.Rules, function(value:IErrorInfo, key:string){value.Optional = fce;});
            _.each(this.Validators, function(value:any, key:string){value.Optional = fce;});
        }
        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        public Validate(context:T):IErrorInfo{

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
            for (var propName in this.Rules){
                var rule = this.Rules[propName];
                promises.push(rule.ValidateAsync(new ValidationContext(propName,context)));
            }
            var self = this;
            Q.all(promises).then(function(result){deferred.resolve(self.ErrorInfo);});

            return deferred.promise;
        }

    }
    export class DataValidationRule<T> extends AbstractValidationRule<T> {
        constructor(public Name:string,public validator:AbstractValidator<T>, public Data:T){
            super(Name,validator);
        }
        ValidateAll(){
            this.Validate(this.Data);
        }
        ValidateField(propName:string){
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

    /**
     * YUIDoc_comment
     *
     * @class rules
     * @constructor
     **/
    export class MetaDataRules {

        public CLASS_NAME:string = 'MetaDataRules';

        public Rules: { [index: string]: MetaDataRule; } = {};

        constructor(public Data:any, public MetaData:any) {
            for (var key in this.MetaData) {
                var metaData = this.MetaData[key];
                if (metaData[Util.RULE_PROPERTY_NAME] != null) {
                    this.Rules[key] = new MetaDataRule(metaData,new ValidationContext(key,this.Data))
                }
            }
        }

        public ValidateAll():void {
            for (var key in this.Rules)
            {
                this.Rules[key].Validate();
            }
        }
    }

    /**
     *  It represents a data context for validation rule.
     */
    export class ValidationContext implements IValidationContext {

        constructor(public Key:string, public Data: any) {
        }
        public get Value(): any {
            return this.Data[this.Key];
        }
    }

    export class PropertyValidationRule extends ErrorInfo implements  IValidationRule {

        static messages = {
            required: "Toto pole je povinné.",
            remote: "Please fix this field.",
            email: "Prosím, zadejte platnou emailovou adresu.",
            url: "Prosím, zadejte validní url adresu.",
            date: "Prosím, zadejte platné datum.",
            dateISO: "Prosím, zadejte platné datum. (ISO).",
            number: "Prosím, zadejte platné číslo.",
            digits: "Prosím, zadejte platné přirozené číslo.",
            signedDigits: "Prosím, zadejte platné celé číslo.",
            creditcard: "Prosím, zadejte platné číslo karty.",
            equalTo: "Prosím, zadejte stejnou hodnotu znovu.",
            maxlength: "Prosím, zadejte méně než {MaxLength} znak(ů).",
            minlength: "Prosím, zadejte více než {MinLength} znak(ů).",
            minlengthRokDiagnozy: "Prosím, zadejte rok ve správném formátu.",
            rangelength: "Prosím, zadejte hodnotu s délkou mezi {MinLength} a {MaxLength} znaků.",
            range: "Prosím, zadejte hodnotu mezi {Min} a {Max}.",
            max: "Prosím, zadejte hodnotu menší nebo rovno {Max}.",
            min: "Prosím, zadejte hodnotu větší nebo rovno {Min}.",
            step: "Prosím, zadejte hodnotu dělitelnou {0}.",
            stepCurrency: "Prosím, zadejte hodnotu dělitelnou {0}{1}.",
            param: "Prosím, zadejte hodnotu z číselníku {ParamId}.",
            mask: "Prosím, zadejte hodnotu ve tvaru {0}.",
            dateCompare: "{0}",
            dateCompareConst: "{0}",
            customFce: "{0}"
        }


        public ValidationFailures:{[name:string]: IValidationFailure} = {};
        public AsyncValidationFailures:{[name:string]: IAsyncValidationFailure} = {};

        constructor(public Name:string, validatorsToAdd?:Array<IPropertyValidator>) {
            super(Name);

            for (var index in validatorsToAdd) {
                this.AddPropertyValidator(validatorsToAdd[index]);
            }
        }
        public AddValidator(validator:any){
            if (validator.metaTagName == "param"){
                this.AddAsyncPropertyValidator(validator);
            }
            else {
                this.AddPropertyValidator(validator);
            }
        }
        public AddPropertyValidator(validator:IPropertyValidator):void {
            this.ValidationFailures[validator.metaTagName] =
            {
                Validator: validator,
                Error: new Error()
            };
        }

        public AddAsyncPropertyValidator(validator:IAsyncPropertyValidator):void {
            this.AsyncValidationFailures[validator.metaTagName] =
            {
                Validator: validator,
                Error: new Error()
            };
        }


        public get Errors():Array<IError> {
            return _.map(_.union(_.values(this.ValidationFailures),_.values(this.AsyncValidationFailures)), function (item:IValidationFailure) {
                return item.Error;
            });
        }

        public get Validators():Array<IPropertyValidator> {
            var validators = _.map(_.values(this.ValidationFailures), function (item:IValidationFailure) {
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
        Validate(context:IValidationContext):Array<IValidationFailure> {
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
                var validator:IPropertyValidator = validation.Validator;

                try {
                    var priority = 0;
                    if (shortCircuited && priority > lastPriority) {
                        validation.Error.HasError = false;
                    } else {
                        var hasError = !validator.isAcceptable(value);
                        var errMsg = Validation.StringFce.format(PropertyValidationRule.messages[validator.metaTagName], validator);

                        validation.Error.HasError = hasError;
                        validation.Error.ErrorMessage = hasError ? errMsg : "";

                        shortCircuited = hasError;
                        lastPriority = priority;
                    }

                } catch (e) {
                    //if (this.settings.debug && window.console) {
                    console.log("Exception occurred when checking element'" + validator.metaTagName + "' method.", e);
                    //}
                    throw e;
                }
            }
            return _.values(this.ValidationFailures);
        }

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsync(context:IValidationContext):Q.Promise<Array<IValidationFailure>> {
            return this.ValidateAsyncEx(context.Value);
        }
            /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsyncEx(value:string):Q.Promise<Array<IValidationFailure>> {
            var deferred = Q.defer<Array<IValidationFailure>>();
            var promises = [];
            for (var index in this.AsyncValidationFailures) {
                var validation:IAsyncValidationFailure = this.AsyncValidationFailures[index];
                var validator:IAsyncPropertyValidator = validation.Validator;

                try {

                    var hasErrorPromise = validator.isAcceptable(value);
                    hasErrorPromise.then(function (result) {
                        var hasError = !result;
                        var errMsg = Validation.StringFce.format(PropertyValidationRule.messages[validator.metaTagName], validator);

                        validation.Error.HasError = hasError;
                        validation.Error.ErrorMessage = hasError ? errMsg : "";
                    });

                    promises.push(hasErrorPromise);

                } catch (e) {
                    //if (this.settings.debug && window.console) {
                    console.log("Exception occurred when checking element'" + validator.metaTagName + "' method.", e);
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
     * Defines a rule associated with a property which can have multiple validators
     */
    export class MetaDataRule{

        public Rule: PropertyValidationRule;

        public get MetaErrors() { return this.Rule.ValidationFailures;}

        public get Error():IErrorInfo {return this.Rule;}

        constructor(metaData: any, public Context:IValidationContext) {

            //read label from metadata
            var label = metaData[Util.LABEL_PROPERTY_NAME];
            var name = label != undefined ? label : this.Context.Key;

            var validators:Array<IPropertyValidator> = [];
            for (var method in metaData.rules) {
                //create validators
                var validator = this.CreateValidator({Method: method, Parameters: metaData.rules[method]});
                validators.push(validator);
            }

            this.Rule = new PropertyValidationRule(name,validators);



            //this.Error.Optional = this.Context.Optional;

        }

        private CreateValidator(rule:IMetaRule):IPropertyValidator{

            switch (rule.Method) {
                case "required":
                    return new RequiredValidator();
                case "minlength":
                    var validator = new MinLengthValidator();
                    validator.MinLength = rule.Parameters;
                    return validator;
                case "maxlength":
                    var maxLengthValidator = new MaxLengthValidator();
                    maxLengthValidator.MaxLength = rule.Parameters;
                    return maxLengthValidator;
            }
        }

        public Validate(): void {
            this.Rule.Validate(this.Context);
        }
        public ClearErrors(): void{
            for (var key in this.MetaErrors) {
                var target = this.MetaErrors[key];
                target.Error.ErrorMessage = "";
                target.Error.HasError = false;
            }
        }
    }
}