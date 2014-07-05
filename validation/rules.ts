///<reference path='../typings/q/q.d.ts'/>

///<reference path='util.ts'/>
///<reference path='error.ts'/>
///<reference path='errorInfo.ts'/>
///<reference path='validators.ts'/>

module Validation {

    export interface IAbstractValidator<T>{
        RuleFor(prop:string,validator:IPropertyValidator);
    }

    export class AbstractValidator<T> implements IAbstractValidator<T> {

        public Validators:{ [name: string]: Array<IPropertyValidator> ; } = {};

        public RuleFor(prop:string,validator:IPropertyValidator){
            if (this.Validators[prop] == undefined) {
                this.Validators[prop] = [];
            }

            this.Validators[prop].push(validator);
        }

        public CreateRule(name:string){
            return new AbstractValidationRule<T>(name, this);
        }

    }
    export class AbstractValidationRule<T>{
        public ErrorInfo:IErrorInfo;
        public Rules:{ [name: string]: IValidationRule ; } = {};
        public Validators:Validators = new Validators();



        constructor(public Name:string,private validator:AbstractValidator<T>){
            this.ErrorInfo = new CompositeErrorInfo(this.Name);

            _.each(this.validator.Validators, function(val, key){
                this.createRuleFor(key);
                _.each(val, function(validator) {
                    this.Rules[key].AddPropertyValidator(validator);
                },this);
            },this);
        }

        private createRuleFor(prop:string){
            var propValidationRule = new PropertyValidationRule(prop);
            this.Rules[prop] = propValidationRule;
            this.ErrorInfo.Add(propValidationRule);

        }

        public AddValidation(item: IValidator, key: string){
            this.Validators.Add(item,key);
            this.ErrorInfo.Add(new ValidatorErrorInfo(key, item.Error));
        }

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        Validate(context:T):IErrorInfo{

            for (var propName in this.Rules){
                var rule = this.Rules[propName];
                rule.Validate(new ValidationContext(propName,context));
            }
            this.Validators.ValidateAll();
            return this.ErrorInfo;
        }

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsync(context:T):Q.Promise<IErrorInfo>{
            var deferred = Q.defer<IErrorInfo>();

            return deferred.promise;
        }

    }

    export interface IMetaDataRules{
        Rules: { [index: string]: MetaDataRule; }
        ValidateAll();
    }


    /**
     * YUIDoc_comment
     *
     * @class rules
     * @constructor
     **/
    export class MetaDataRules implements IMetaDataRules {

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
    export interface IValidationContext {
        /**
         * Return current value.
         */
        Value:string;

        /**
         * Return property name for current data context.
         */
        Key:string;
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

    export interface IValidationRule {
        /**
         *The validators that are grouped under this rule.
         */
        Validators:Array<IPropertyValidator>;

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        Validate(context:IValidationContext):Array<IValidationFailure>;

        /**
         * Performs validation using a validation context and returns a collection of Validation Failures asynchronoulsy.
         */
        ValidateAsync(context:IValidationContext):Q.Promise<Array<IValidationFailure>>;

    }
    export interface IValidationFailure {
        Validator:IPropertyValidator
        Error:IError;
    }
    export class PropertyValidationRule extends ErrorInfo implements  IValidationRule{

        private messages = {
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
            param: "Prosím, zadejte hodnotu z číselníku {0}.",
            mask: "Prosím, zadejte hodnotu ve tvaru {0}.",
            dateCompare: "{0}",
            dateCompareConst: "{0}",
            customFce: "{0}"
        }


        public ValidationFailures:{[name:string]: IValidationFailure} = {};

        constructor(public Name:string, validatorsToAdd?:Array<IPropertyValidator>){
            super(Name);

            for (var index in validatorsToAdd) {
                this.AddPropertyValidator(validatorsToAdd[index]);
            }
        }

        public AddPropertyValidator(validator:IPropertyValidator):void{
            this.ValidationFailures[validator.metaTagName] =
            {
                Validator: validator,
                Error: new Error()
            };
        }

        public get Errors():Array<IError>
        {
            return _.map(_.values(this.ValidationFailures), function(item:IValidationFailure) {
                return item.Error;
            });
        }

        public get Validators():Array<IPropertyValidator>
        {
            var validators = _.map(_.values(this.ValidationFailures), function(item:IValidationFailure) {
                    return item.Validator;
                });

            return validators;
        }

        public get HasErrors(): boolean {
            if (this.Optional != undefined && _.isFunction(this.Optional) && this.Optional()) return false;
            return _.some(_.values(this.Errors), function (error) {
                return error.HasError;
            });
        }

        public get ErrorCount(): number {
            return this.HasErrors ? 1 : 0;
        }
        public get ErrorMessage(): string {
            if (!this.HasErrors) return "";
            return _.reduce(_.values(this.Errors), function (memo, error:IError) {
                return memo + error.ErrorMessage;
            }, "");
        }


        /**
         * Performs validation using a validation context and returns a collection of Validation Failures.
         */
        Validate(context:IValidationContext):Array<IValidationFailure>
        {
            var lastPriority: number = 0;
            var shortCircuited: boolean = false;

            for (var index in this.ValidationFailures) {
                var validation:IValidationFailure = this.ValidationFailures[index];
                var validator:IPropertyValidator = validation.Validator;

                try {
                    var priority = 0;
                    if (shortCircuited && priority > lastPriority) {
                        validation.Error.HasError = false;
                    } else {
                        var hasError = !validator.isAcceptable(context.Value);
                        var errMsg = Validation.StringFce.format(this.messages[validator.metaTagName],validator);

                        validation.Error.HasError = hasError;
                        validation.Error.ErrorMessage = hasError ? errMsg : "";

                        shortCircuited = hasError;
                        lastPriority = priority;
                    }

                } catch (e) {
                    //if (this.settings.debug && window.console) {
                    console.log("Exception occurred when checking element " + context.Key + ", check the '" + validator.metaTagName + "' method.", e);
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
            var deferred = Q.defer<Array<IValidationFailure>>();

            return deferred.promise;
        }

    }

    /**
     * This represents validation rule.
     */
    export interface IMetaRule {
        Method: string;
        Parameters?: any;
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