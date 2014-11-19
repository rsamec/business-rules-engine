define(["require", "exports"], function(require, exports) {
    var Utils;
    (function (Utils) {
        var StringFce = (function () {
            function StringFce() {
            }
            StringFce.format = function (s, args) {
                var formatted = s;
                for (var prop in args) {
                    var regexp = new RegExp('\\{' + prop + '\\}', 'gi');
                    formatted = formatted.replace(regexp, args[prop]);
                }
                return formatted;
            };
            return StringFce;
        })();
        Utils.StringFce = StringFce;

        var NumberFce = (function () {
            function NumberFce() {
            }
            NumberFce.GetNegDigits = function (value) {
                if (value === undefined)
                    return 0;
                var digits = value.toString().split('.');
                if (digits.length > 1) {
                    var negDigitsLength = digits[1].length;
                    return negDigitsLength;
                }
                return 0;
            };
            return NumberFce;
        })();
        Utils.NumberFce = NumberFce;

        

        var Signal = (function () {
            function Signal() {
                this.listeners = [];
                this.priorities = [];
            }
            Signal.prototype.add = function (listener, priority) {
                if (typeof priority === "undefined") { priority = 0; }
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
            };

            Signal.prototype.remove = function (listener) {
                var index = this.listeners.indexOf(listener);
                if (index >= 0) {
                    this.priorities.splice(index, 1);
                    this.listeners.splice(index, 1);
                }
            };

            Signal.prototype.dispatch = function (parameter) {
                var indexesToRemove;
                var hasBeenCanceled = this.listeners.every(function (listener) {
                    var result = listener(parameter);
                    return result !== false;
                });

                return hasBeenCanceled;
            };

            Signal.prototype.clear = function () {
                this.listeners = [];
                this.priorities = [];
            };

            Signal.prototype.hasListeners = function () {
                return this.listeners.length > 0;
            };
            return Signal;
        })();
        Utils.Signal = Signal;

        

        var CompositeDotObject = (function () {
            function CompositeDotObject() {
            }
            CompositeDotObject.Transform = function (component, obj) {
                if (obj === undefined)
                    obj = {};
                if (component.isItem()) {
                    obj[component.getName()] = component;
                } else {
                    var children = component.getChildren();
                    var parent = obj[component.getName()] = component;
                    for (var comp in children) {
                        CompositeDotObject.Transform(children[comp], parent);
                    }
                }
                return obj;
            };
            return CompositeDotObject;
        })();
        Utils.CompositeDotObject = CompositeDotObject;
    })(Utils || (Utils = {}));
    
    return Utils;
});
