///<reference path='../typings/underscore/underscore.d.ts'/>

///<reference path='common.ts'/>
///<reference path='error.ts'/>


module Validation {

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
     *  It represents simple abstract error object.
     */
    export class ErrorInfo implements IErrorInfo {

        constructor(public Name: string) {}

        public get Children(): Array<IErrorInfo> {
            return new Array();
        }

        public Add(error: IErrorInfo) {
            throw ("Cannot add to ErrorInfo to leaf node.");
        }
        public Remove(index: number) {
            throw ("Cannot remove ErrorInfo from leaf node.");
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
    export class FieldErrorInfo extends ErrorInfo implements IErrorInfo {

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
     *  It represents simple validator error object.
     */
    export class ValidatorErrorInfo extends ErrorInfo implements IErrorInfo {

        constructor(public Name: string,public Error: IError ) {
            super(Name);
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
     *  It represents composition of error objects.
     */
    export class CompositeErrorInfo implements IErrorInfo {

        public Children: Array<IErrorInfo> = [];

        constructor(public Name: string) {
        }

        public Optional: IOptional;

        public AddFirst(error: IErrorInfo) {
            this.Children.unshift(error);
        }
        public Add(error: IErrorInfo) {
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
            return _.reduce(this.Children, function (memo, error:IErrorInfo) {
                return memo + error.ErrorCount;
            }, 0);

            //return _.filter(this.children, function (error) { return error.HasErrors; }).length;
        }
        public get ErrorMessage(): string {
            if (!this.HasErrors) return "";
            return _.reduce(this.Children, function (memo, error:IErrorInfo) {
                return memo + error.ErrorMessage;
            }, "");
        }
        public LogErrors() {
            this.traverse(this, 1);
        }

        private get FlattenErros(): Array<IErrorInfo> {
            var errors = new Array<IErrorInfo>();
            this.flattenErrors(this, errors)
            return errors;
        }

        private flattenErrors(node: IErrorInfo, errorCollection: Array<IErrorInfo>) {
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
        private traverse(node: IErrorInfo, indent: number) {

            console.log(Array(indent++).join("--") + node.Name + " (" + node.ErrorMessage + ")" + '\n\r');

            for (var i = 0, len = node.Children.length; i < len; i++) {
                this.traverse(node.Children[i], indent);
            }

        }
    }
}