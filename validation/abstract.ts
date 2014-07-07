///<reference path='../typings/q/q.d.ts'/>

///<reference path='common.ts'/>

module Validation {
    /**
     * It defines conditional function.
     */
    export interface IOptional { (): boolean; }


    /**
     *  This class represents simple generic dictinary.
     */
    export interface IDictionary<K, V> {
        Add(key:K, value:V): void;
        GetValue(key:K): V;
        ContainsKey(key:K): boolean;
        Values(): Array<V>;
        ToArray():Array<KeyValuePair<K,V>>;
    }

    /**
     * basic error structure
     */
    export interface IError {
        HasError: boolean;
        ErrorMessage: string;
    }

    /**
     * This class provides unit of information about error.
     * Implements composite design pattern to enable nesting of error informations.
     */
    export interface IErrorInfo {
        /**
         * The name of error collection.
         */
        Name: string;

        /**
         * Add error information to child collection of errors.
         * @param errorInfo - error information to be added
         */
        Add(errorInfo:IErrorInfo): void;


        Remove(index:number): void;

        /**
         * Return collections of child errors information.
         */
        Children: Array<IErrorInfo>;

        /**
         * Return true if there is any error.
         */
        HasErrors: boolean;
        /**
         * Return error message, if there is no error, return empty string.
         */
        ErrorMessage: string;
        /**
         * Return number of errors.
         */
        ErrorCount: number;

        Optional?: IOptional;
    }

    /**
     * It defines validation function.
     */
    export interface IValidate { (args: IError): void; }
    /**
     * This class represents validator.
     */
    export interface IValidator extends IError {
        Validate(context:any): boolean;
        Error: IError;
    }


    export interface IPropertyValidator{
        isAcceptable(s: any): boolean;
        metaTagName:string;
    }
    export interface IAsyncPropertyValidator{
        isAcceptable(s: any): Q.Promise<boolean>;
        metaTagName:string;
    }
    export interface IStringValidator extends IPropertyValidator{
        isAcceptable(s: string): boolean;
    }

    export interface IAbstractValidator<T>{
        RuleFor(prop:string,validator:IPropertyValidator);
    }

/*
    export interface IMetaDataRules{
        Rules: { [index: string]: IMetaDataRule; }
        ValidateAll();
    }
*/


    /**
     *  It represents a data context for validation rule.
     */
    export interface IValidationContext {
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
        Data:any
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
    export interface IAsyncValidationFailure {
        Validator:IAsyncPropertyValidator
        Error:IError;
    }

    /**
     * This represents validation rule.
     */
    export interface IMetaRule {
        Method: string;
        Parameters?: any;
    }


}