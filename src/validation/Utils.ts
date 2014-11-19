///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>

import _ = require('underscore');
/**
 * Utility functions for business rules purposes.
 *
 *  +  String functions
 *  +  Number functions
 */
module Utils {

    /*
    It represents utility for string manipulation.
     */
    export class StringFce {
        static format(s:string, args:any):string {
            var formatted = s;
            for (var prop in args) {
                var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
                formatted = formatted.replace(regexp, args[prop]);
            }
            return formatted;
        }
    }

    /*
    It represents utility for number manipulation.
     */
    export class NumberFce {
        static GetNegDigits(value:string):number {
            if (value === undefined) return 0;
            var digits = value.toString().split('.');
            if (digits.length > 1) {
                var negDigitsLength = digits[1].length;
                return negDigitsLength;
            }
            return 0;
        }
    }

    /*
     It represents signal (event).
     */
    export interface ISignal<T> {
        add(listener: (parameter: T) => any, priority?: number): void;
        remove(listener: (parameter: T) => any): void;
        dispatch(parameter: T): boolean;
        clear(): void;
        hasListeners(): boolean;
    }

    /*
    It represents signal (event).
     */
    export class Signal<T> implements ISignal<T> {
        private listeners: { (parameter: T): any }[] = [];
        private priorities: number[] = [];

        add(listener: (parameter: T) => any, priority = 0): void {
            var index = this.listeners.indexOf(listener);
            if (index !== -1) {
                this.priorities[index] = priority;
                return;
            }
            for (var i = 0, l = this.priorities.length; i < l; i++) {
                if (this.priorities[i] < priority) {
                    this.priorities.splice(i, 0, priority);
                    this.listeners.splice(i, 0, listener);
                    return;
                }
            }
            this.priorities.push(priority);
            this.listeners.push(listener);
        }

        remove(listener: (parameter: T) => any): void {
            var index = this.listeners.indexOf(listener);
            if (index >= 0) {
                this.priorities.splice(index, 1);
                this.listeners.splice(index, 1);
            }
        }

        dispatch(parameter: T): boolean {
            var indexesToRemove: number[];
            var hasBeenCanceled = this.listeners.every((listener: (parameter: T) => any) =>  {
                var result = listener(parameter);
                return result !== false;
            });

            return hasBeenCanceled;
        }

        clear(): void {
            this.listeners = [];
            this.priorities = [];
        }

        hasListeners(): boolean {
            return this.listeners.length > 0;
        }
    }

    /*
    It is component element from composite design pattern.
     */
    export interface IComponent{
        add(child:IComponent):boolean;
        remove(child:IComponent):boolean;
        getChildren():IComponent[];
        getName():string;
        isItem():boolean;
    }

    /*
     It represents utility for making composite object accessible by dot notation.
     */
    export class CompositeDotObject{

        /*
        It transforms composite object to dot accessible composite object.
         */
        static Transform(component:IComponent,obj){
            if (obj === undefined) obj = {};
            if (component.isItem()){
                obj[component.getName()] = component;
            }
            else{
                var children = component.getChildren();
                var parent = obj[component.getName()] = component;
                for (var comp in children ) {
                    CompositeDotObject.Transform(children[comp],parent);
                }
            }
            return obj;
        }
    }
}
export = Utils;