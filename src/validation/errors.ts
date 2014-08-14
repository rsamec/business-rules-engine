///<reference path='../../typings/underscore/underscore.d.ts'/>

///<reference path='abstract.ts'/>

module Validation {

    /**
     * basic error structure
     */
    export interface IError {
        HasError: boolean;
        ErrorMessage: string;
        TranslateArgs?:IErrorTranslateArgs;
    }

    /**
     *  support for localization of error messages
     */
    export interface IErrorTranslateArgs
    {
        TranslateId:string;
        MessageArgs:any;
        CustomMessage?:IErrorCustomMessage;
    }

    /**
     * It defines conditional function.
     */
    export interface IOptional { (): boolean; }

    /**
     * It represents the validation result.
     */
    export interface IValidationFailure extends IError{
        //Validator:IPropertyValidator
        IsAsync:boolean;
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
         * Return true if there is any error and hasw dirty state.
         */
        HasErrorsDirty: boolean;

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

        /**
         * It enables support for localization of error messages.
         */
        TranslateArgs?:Array<IErrorTranslateArgs>
    }

     /**
     *
     * @ngdoc object
     * @name  Error
     * @module Validation
     *
     *
     * @description
     * It represents basic error structure.
     */
    export class Error implements IError{

        public HasError: boolean = true;
        public ErrorMessage: string = "";

        constructor() {

        }
    }


    /**
     *
     * @ngdoc object
     * @name  ValidationFailure
     * @module Validation
     *
     *
     * @description
     * It represents validation failure.
     */
    export class ValidationFailure implements IError
    {
        constructor(public Error:IError, public IsAsync:boolean) {

        }
        public get HasError(): boolean {return this.Error.HasError;}
        public get ErrorMessage(): string {return this.Error.ErrorMessage;}
        public get TranslateArgs():IErrorTranslateArgs {return this.Error.TranslateArgs;}


    }

    /**
     *
     * @ngdoc object
     * @name  ValidationResult
     * @module Validation
     *
     *
     * @description
     * It represents simple abstract error object.
     */
     export class ValidationResult implements IValidationResult {

        constructor(public Name: string) {}


        public IsDirty:boolean;

        public get Children(): Array<IValidationResult> {
            return [];
        }

        public Add(error: IValidationResult) {
            throw ("Cannot add to ValidationResult to leaf node.");
        }
        public Remove(index: number) {
            throw ("Cannot remove ValidationResult from leaf node.");
        }

        public Optional: IOptional;
        public TranslateArgs:Array<IErrorTranslateArgs>;

        public get HasErrorsDirty():boolean {
             return this.IsDirty && this.HasErrors;
        }

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
     *
     * @ngdoc object
     * @name  CompositeValidationResult
     * @module Validation
     *
     *
     * @description
     * It represents composite error object.
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

        public get HasErrorsDirty():boolean {
            if (this.Optional !== undefined && _.isFunction(this.Optional) && this.Optional()) return false;
            return _.some(this.Children, function (error) {
                return error.HasErrorsDirty;
            });
        }

        get HasErrors(): boolean {
            if (this.Optional !== undefined && _.isFunction(this.Optional) && this.Optional()) return false;
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

        public get TranslateArgs():Array<IErrorTranslateArgs> {
            if (!this.HasErrors) return [];
            var newArgs = [];
            _.each(this.Children, function (error:IValidationResult) {
                newArgs = newArgs.concat(error.TranslateArgs);
            });
            return newArgs;
        }

        public LogErrors(headerMessage?:string) {
            if (headerMessage === undefined) headerMessage = "Output";
            console.log("---------------\n");
            console.log("--- "  + headerMessage  + " ----\n");
            console.log("---------------\n");
            this.traverse(this, 1);
            console.log("\n\n\n");
        }

        public get Errors():{[name:string]:IValidationResult}{
            var map:{[name:string]:IValidationResult} = {};
            _.each(this.Children,function (val){
                map[val.Name] = val;
            });
            return map;
        }
        private get FlattenErros(): Array<IValidationResult> {
            var errors = [];
            this.flattenErrors(this, errors);
            return errors;
        }
        public SetDirty(){
            this.SetDirtyEx(this,true);
        }
        public SetPristine(){
            this.SetDirtyEx(this,false);
        }
        private SetDirtyEx(node: IValidationResult,  dirty:boolean){
            if (node.Children.length === 0) {
                node["IsDirty"] = dirty;
            }
            else {
                for (var i = 0, len = node.Children.length; i < len; i++) {
                    //stop if there are no children with errors
                    this.SetDirtyEx(node.Children[i], dirty);
                }
            }
        }
        private flattenErrors(node: IValidationResult, errorCollection: Array<IValidationResult>) {
            if (node.Children.length === 0) {
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