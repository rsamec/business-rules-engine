///<reference path='../typings/underscore/underscore.d.ts'/>

///<reference path='validators.ts'/>

module Validation {

    /**
     * basic error structure
     */
    export interface IError {
        HasError: boolean;
        ErrorMessage: string;
    }

    /**
     * It defines conditional function.
     */
    export interface IOptional { (): boolean; }

    /**
     * It represents the validation result.
     */
    export interface IValidationFailure {
        Validator:IPropertyValidator
        Error:IError;
    }
    /**
     * It represents the validation result for validator.
     */
    export interface IAsyncValidationFailure {
        Validator:IAsyncPropertyValidator
        Error:IError;
    }

    /**
     * This class provides unit of information about error.
     * Implements composite design pattern to enable nesting of error information.
     */
    export interface IValidationResult {

        /**
         * The name of error collection.
         */
        Name: string;

        /**
         * Add error information to child collection of errors.
         * @param validationResult - error information to be added.
         */
        Add(validationResult:IValidationResult): void;

        /**
         * Remove error information from child collection of errors.
         * @param index - index of error information to be removed.
         */
        Remove(index:number): void;

        /**
         * Return collections of child errors information.
         */
        Children: Array<IValidationResult>;

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

        /**
         * It enables to have errors optional.
         */
        Optional?: IOptional;
    }

    /**
     * basic error structure
     *
     * @class error
     * @constructor
     **/
    export class Error implements IError{

        public CLASS_NAME:string = 'error';

        public HasError: boolean = true;
        public ErrorMessage: string = "";

        constructor() {

        }
    }

    /**
     *  It represents simple abstract error object.
     */
    export class ValidationResult implements IValidationResult {

        constructor(public Name: string) {}

        public get Children(): Array<IValidationResult> {
            return new Array();
        }

        public Add(error: IValidationResult) {
            throw ("Cannot add to ValidationResult to leaf node.");
        }
        public Remove(index: number) {
            throw ("Cannot remove ValidationResult from leaf node.");
        }

        public Optional: IOptional;

        public get HasErrors(): boolean {
            return false;
        }

        public get ErrorCount(): number {
            return 0;
        }
        public get ErrorMessage(): string {
            return "";
        }
    }

     /**
     *  It represents simple field error object.
     */
    export class FieldValidationResult extends ValidationResult implements IValidationResult {

        constructor(public Name: string,public MetaErrors: { [index: string]: IError })
        {
                 super(Name);
        }

        public get HasErrors(): boolean {
            if (this.Optional != undefined && _.isFunction(this.Optional) && this.Optional()) return false;
            return _.some(_.values(this.MetaErrors), function (error) {
                return error.HasError;
            });
        }

        public get ErrorCount(): number {
            return this.HasErrors ? 1 : 0;
        }
        public get ErrorMessage(): string {
            if (!this.HasErrors) return "";
            return _.reduce(_.values(this.MetaErrors), function (memo, error:IError) {
                return memo + error.ErrorMessage;
            }, "");
        }
    }

    /**
     *  It represents composition of error objects.
     */
    export class CompositeValidationResult implements IValidationResult {

        public Children: Array<IValidationResult> = [];

        constructor(public Name: string) {
        }

        public Optional: IOptional;

        public AddFirst(error: IValidationResult) {
            this.Children.unshift(error);
        }
        public Add(error: IValidationResult) {
            this.Children.push(error);
        }
        public Remove(index: number) {
            this.Children.splice(index, 1);
        }

        get HasErrors(): boolean {
            if (this.Optional != undefined && _.isFunction(this.Optional) && this.Optional()) return false;
            return _.some(this.Children, function (error) {
                return error.HasErrors;
            });
        }
        public get ErrorCount(): number {
            if (!this.HasErrors) return 0;
            return _.reduce(this.Children, function (memo, error:IValidationResult) {
                return memo + error.ErrorCount;
            }, 0);

            //return _.filter(this.children, function (error) { return error.HasErrors; }).length;
        }
        public get ErrorMessage(): string {
            if (!this.HasErrors) return "";
            return _.reduce(this.Children, function (memo, error:IValidationResult) {
                return memo + error.ErrorMessage;
            }, "");
        }
        public LogErrors() {
            this.traverse(this, 1);
        }

        public get Errors():{[name:string]:IValidationResult}{
            var map:{[name:string]:IValidationResult} = {}
            _.each(this.Children,function (val){
                map[val.Name] = val;
            });
            return map;
        }
        private get FlattenErros(): Array<IValidationResult> {
            var errors = new Array<IValidationResult>();
            this.flattenErrors(this, errors)
            return errors;
        }

        private flattenErrors(node: IValidationResult, errorCollection: Array<IValidationResult>) {
            if (node.Children.length == 0) {
                if (node.HasErrors) errorCollection.push(node);
            }
            else {
                for (var i = 0, len = node.Children.length; i < len; i++) {
                    //stop if there are no children with errors
                    if (node.Children[i].HasErrors)
                        this.flattenErrors(node.Children[i], errorCollection);
                }
            }
        }

        // recursively traverse a (sub)tree
        private traverse(node: IValidationResult, indent: number) {

            console.log(Array(indent++).join("--") + node.Name + " (" + node.ErrorMessage + ")" + '\n\r');

            for (var i = 0, len = node.Children.length; i < len; i++) {
                this.traverse(node.Children[i], indent);
            }

        }
    }
}