///<reference path='abstract.ts'/>

module Validation {

    /**
     * basic error structure
     *
     * @class error
     * @constructor
     **/
    export class Error implements IError{

        public CLASS_NAME:string = 'error';

        public HasError: boolean = false;
        public ErrorMessage: string = "";

        constructor() {

        }
    }
}