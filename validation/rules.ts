///<reference path='error.ts'/>
///<reference path='errorInfo.ts'/>
///<reference path='validators.ts'/>

module Validation {

    /**
     * YUIDoc_comment
     *
     * @class rules
     * @constructor
     **/
    export class MetaDataRules {

        public CLASS_NAME:string = 'rules';

        public Rules: { [index: string]: MetaDataRule; } = {};

        constructor(public Data:any, public MetaData:any) {

            this.initRules();

        }

        private RULE_PROPERTY_NAME:string = "rules";


        private initRules(){
            for (var key in this.MetaData) {
                var metaData = this.MetaData[key];
                if (metaData[this.RULE_PROPERTY_NAME] != null) {
                    this.Rules[key] = new MetaDataRule(metaData,new RuleDataContext(key,this.Data))
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
    export interface IRuleDataContext {
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
    export class RuleDataContext implements IRuleDataContext {

        constructor(public Key:string, public Data: any) {
        }
        public get Value(): any {
            return this.Data[this.Key];
        }
    }

    /**
     * This represents validation rule.
     */
    export interface IRule {
        Method: string;
        Parameters?: any;
        Context: IRuleDataContext;
    }

    /**
     * It represents meta data validation rule with data context.
     */
    export class MetaDataRule {
        static validators: CommonValidators;

        static get Validators():CommonValidators {
            if (MetaDataRule.validators == undefined) MetaDataRule.validators = new CommonValidators();
            return MetaDataRule.validators;
        }
        public Error: FieldErrorInfo;
        public Rules: Array<IRule> = [];

        private LABEL_PROPERTY_NAME:string = "label";

        public get MetaErrors() { return this.Error.MetaErrors;}

        constructor(metaData: any, public Context:IRuleDataContext) {

            //read label from metadata
            var label = metaData[this.LABEL_PROPERTY_NAME];
            var name = label != undefined ? label : this.Context.Key;

            this.Error = new FieldErrorInfo(name, {});


            for (var method in metaData.rules) {
                //create rules
                var rule: IRule =  { Method: method, Parameters: metaData.rules[method], Context: this.Context};
                this.Rules.push(rule);

                //init default errors
                this.MetaErrors[method] = new Error();// { HasError: false, ErrorMessage: "" };
            }

            //this.Error.Optional = this.Context.Optional;

        }

        public Validate(): void {
            var result: IError;

            var lastPriority: number = 0;
            var shortCircuited: boolean = false;

            for (var i = 0; i != this.Rules.length; i++) {
                var rule:IRule = this.Rules[i];
                var method: string = rule.Method;
                try {
                    var priority = 0;
                    if (shortCircuited && priority > lastPriority) {
                        this.copyError({ HasError: false, ErrorMessage: "" },this.MetaErrors[method]);
                    } else {
                        result = MetaDataRule.Validators.CheckRule(rule);
                        this.copyError(result, this.MetaErrors[method]);
                        shortCircuited = result.HasError;
                        lastPriority = priority;
                    }

                } catch (e) {
                    //if (this.settings.debug && window.console) {
                    console.log("Exception occurred when checking element " + this.Context.Key + ", check the '" + method + "' method.", e);
                    //}
                    throw e;
                }
            }
        }
        public ClearErrors(): void{
            for (var key in this.MetaErrors) {
                var target = this.MetaErrors[key];
                target.ErrorMessage = "";
                target.HasError = false;
            }
        }
        private copyError(source: IError, target: IError): void {
            target.ErrorMessage = source.ErrorMessage;
            target.HasError = source.HasError;
        }
    }
}