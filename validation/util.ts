///<reference path='../typings/underscore/underscore.d.ts'/>

module Validation {

    /**
     *  This represents generic dictionary.
     */
    export interface IDictionary<K, V> {
        Add(key:K, value:V): void;
        GetValue(key:K): V;
        ContainsKey(key:K): boolean;
        Values(): Array<V>;
        ToArray():Array<KeyValuePair<K,V>>;
    }

    /**
     *  This class represents generic dictionary.
     */
    export class Dictionary<K, V> implements IDictionary<K,V> {
        list: Array<KeyValuePair<K,V>> = [];
        Add(key: K, value: V) {
            this.list.push({ Key: key, Value: value });
        }

        GetValue(key: K) {
            for (var i = 0; i != this.list.length; i++)
            {
                if (this.list[i].Key == key) return this.list[i].Value;
            }
            return null;
        }
        ContainsKey(key: K) {
            for (var i = 0; i != this.list.length; i++)
            {
                if (this.list[i].Key == key) return true;
            }
            return false;
        }
        Values<V>(): Array<V>{
            return _.map(this.list, function (item:KeyValuePair<K,V>) { return item.Value; });
        }
        Keys<K>(): Array<K> {
            return _.map(this.list, function (item:KeyValuePair<K,V>) { return item.Key; });
        }
        ToArray(): Array<KeyValuePair<K, V>> {
            return this.list;
        }
        Count() {
            return this.list.length;
        }
    }

    /**
     * It represents key value pair.
     */
    export class KeyValuePair<K,V>{
        public Key: K;
        public Value: V;
    }


    export class StringFce{
        static format(s: string, args: any): string {
            var formatted = s;
            for (var prop in args) {
                var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
                formatted = formatted.replace(regexp, args[prop]);
            }
            return formatted;
        }
    }
    /**
     * YUIDoc_comment
     *
     * @class util
     * @constructor
     **/
    export class Util {

        public CLASS_NAME:string = 'util';

        static RULE_PROPERTY_NAME:string = "rules";
        static LABEL_PROPERTY_NAME:string = "label";

        constructor() {

        }

        static generateData(metaData:any){
            var data = {}
            Util.generateDataEx(metaData,data);
            return data;
        }

        //TODO: find better way how to distinguish between data fields items and meta data information
        //TODO: better documentation
        static generateDataEx(o, data, parentPath?){
            //TODO: better implementation - like _.defaults()
            var metaDataKeys = ["label", "rules", "help", "id", "defaultValue", "options","unit","hint", "Common", "disclaimer","saveOptions","optionsRef","apiId"];
            var tableKey = "RowData";
            for (var key in o) {
                if (_.contains(metaDataKeys, key)) continue;
                var item = o[key];

                if (_.isArray(item)) {
                    data[key] = item;
                    continue;
                }
                if (typeof (item) == "object") {
                    var isLeafNode = _.every(_.keys(item), function (key) { return _.contains(this, key) }, metaDataKeys);
                    if (isLeafNode) {
                        data[key] = undefined;
                        continue;
                    }
                    var isTableNode = _.some(_.keys(item), function (key) {return key == this },tableKey);
                    if (isTableNode) {
                        data[key] = [];
                        continue;
                    }


                    data[key] = {};
                    var path = parentPath == undefined ? key : parentPath + "." + key;
                    //going on step down in the object tree!!
                    this.generateDataEx(o[key], data[key], path);
                }
            }
        }

    }
}