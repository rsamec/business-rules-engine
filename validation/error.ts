module Validation {

    /**
     * basic error structure
     */
    export interface IError {
        HasError: boolean;
        ErrorMessage: string;
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
}