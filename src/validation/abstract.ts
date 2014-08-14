///<reference path='../../typings/q/q.d.ts'/>

module Validation {
    /**
     * Custom message functions.
     */
    export interface IErrorCustomMessage { (config:any, args:any):string;
    }

    /**
     * It represents a property validator for atomic object.
     */
    export interface IPropertyValidator {
        isAcceptable(s:any): boolean;
        customMessage?: IErrorCustomMessage;
        tagName?:string;
    }

    /**
     * It represents a property validator for simple string value.
     */
    export interface IStringValidator extends IPropertyValidator {
        isAcceptable(s:string): boolean;
    }

    /**
     * It represents an async property validator for atomic object.
     */
    export interface IAsyncPropertyValidator {
        isAcceptable(s:any): Q.Promise<boolean>;
        customMessage?: IErrorCustomMessage;
        isAsync:boolean;
        tagName?:string;
    }

    /**
     * It represents an async property validator for simple string value.
     */
    export interface IAsyncStringPropertyValidator extends IAsyncPropertyValidator {
        isAcceptable(s:string): Q.Promise<boolean>;
    }

    /**
     * It defines compare operators.
     */
    export enum CompareOperator {
        /**
         * must be less than
         */
        LessThan,
        /**
         * cannot be more than
         */
        LessThanEqual,
        /**
         *  must be the same as
         */
        Equal,

        /**
         * must be different from
         */
        NotEqual,

        /**
         * cannot be less than
         */
        GreaterThanEqual,

        /**
         * must be more than
         */
        GreaterThan
    }
}