///<reference path='../../typings/underscore/underscore.d.ts'/>

module Validation {

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

            var containsLeafFce = function (key) { return _.contains(this, key) };
            var containsTableFce =  function (key) {return key == this };
            for (var key in o) {
                if (_.contains(metaDataKeys, key)) continue;
                var item = o[key];

                if (_.isArray(item)) {
                    data[key] = item;
                    continue;
                }
                if (typeof (item) == "object") {
                    var isLeafNode = _.every(_.keys(item), containsLeafFce, metaDataKeys);
                    if (isLeafNode) {
                        data[key] = undefined;
                        continue;
                    }
                    var isTableNode = _.some(_.keys(item),containsTableFce,tableKey);
                    if (isTableNode) {
                        data[key] = [];
                        continue;
                    }


                    data[key] = {};
                    var path = parentPath === undefined ? key : parentPath + "." + key;
                    //going on step down in the object tree!!
                    this.generateDataEx(o[key], data[key], path);
                }
            }
        }

    }
}