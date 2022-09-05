"use strict";
Array.prototype.groupBy = function (predicate, asArray = false) {
    let result = this.reduce(function (rv, x) {
        (rv[predicate(x)] = rv[predicate(x)] || []).push(x);
        return rv;
    }, {});
    if (asArray === true) {
        result = Object.keys(result).map(key => {
            return {
                key: key,
                values: result[key],
            };
        });
    }
    return result;
};
Array.prototype.selectMany = function (predicate) {
    const result = [];
    for (const item of this) {
        result.push(...predicate(item));
    }
    return result;
};
Array.prototype.firstOrUndefined = function (predicate) {
    if (!predicate) {
        if (this.length > 0) {
            return this[0];
        }
        return undefined;
    }
    const result = this.filter(x => predicate(x));
    if (result.length > 0) {
        return result[0];
    }
    return undefined;
};
Array.prototype.zip = function (second, predicate) {
    return this.map((element, index) => predicate(element, second[index]));
};
Array.prototype.remove = function (element) {
    const index = this.indexOf(element);
    if (index >= 0) {
        this.splice(index, 1);
    }
    return index;
};
Array.prototype.findMissingElements = function (second) {
    const missing = [];
    for (const item of this) {
        if (!second.includes(item)) {
            missing.push(item);
        }
    }
    return missing;
};
Array.prototype.distinct = function () {
    return [...new Set(this)];
};
Array.prototype.distinctBy = function (predicate) {
    const distinctProjections = [];
    const result = [];
    for (const element of this) {
        const projection = predicate(element);
        if (!distinctProjections.includes(projection)) {
            distinctProjections.push(projection);
            result.push(element);
        }
    }
    return result;
};
Array.prototype.all = function (predicate) {
    return !this.some(x => !predicate(x));
};
Array.prototype.toRecord = function (keyPredicate, valuePredicate) {
    const result = {};
    for (const item of this) {
        result[keyPredicate(item)] = valuePredicate ? valuePredicate(item) : item;
    }
    return result;
};
Array.prototype.sorted = function (predicate) {
    const cloned = [...this];
    if (predicate) {
        cloned.sort((a, b) => predicate(a) - predicate(b));
    }
    else {
        cloned.sort((a, b) => a - b);
    }
    return cloned;
};
Array.prototype.sortedDescending = function (predicate) {
    const sorted = this.sorted(predicate);
    sorted.reverse();
    return sorted;
};
Array.prototype.sum = function (predicate) {
    if (predicate) {
        return this.map(predicate).reduce((a, b) => a + b);
    }
    return this.reduce((a, b) => a + b);
};
Array.prototype.sumBigInt = function (predicate) {
    if (predicate) {
        return this.map(predicate).reduce((a, b) => BigInt(a) + BigInt(b), BigInt(0));
    }
    return this.reduce((a, b) => BigInt(a) + BigInt(b), BigInt(0));
};
//# sourceMappingURL=array.extensions.js.map