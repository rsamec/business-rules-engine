///<reference path='../typings/underscore/underscore.d.ts'/>

///<reference path='abstract.ts'/>
///<reference path='error.ts'/>

module Validation {

    /**
     *  This class represents simple generic dictinary.
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
}