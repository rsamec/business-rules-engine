define(["require", "exports", "q", "underscore"], function(require, exports, Q, _) {
    var ParamValidator = (function () {
        function ParamValidator() {
            this.isAsync = true;
            this.tagName = "param";
        }
        ParamValidator.prototype.isAcceptable = function (s) {
            var deferred = Q.defer();

            this.Options(this.ParamId).then(function (result) {
                var hasSome = _.some(result, function (item) {
                    return item.text === s;
                });
                if (hasSome)
                    deferred.resolve(true);
                deferred.resolve(false);
            });

            return deferred.promise;
        };
        return ParamValidator;
    })();
    
    return ParamValidator;
});
