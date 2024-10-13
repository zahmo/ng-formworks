import { hasValue, inArray, isArray, isDefined, isEmpty, isMap, isObject, isSet, isString } from './validator.functions';
/**
 * Utility function library:
 *
 * addClasses, copy, forEach, forEachCopy, hasOwn, mergeFilteredObject,
 * uniqueItems, commonItems, fixTitle, toTitleCase
*/
/**
 * 'addClasses' function
 *
 * Merges two space-delimited lists of CSS classes and removes duplicates.
 *
 * // {string | string[] | Set<string>} oldClasses
 * // {string | string[] | Set<string>} newClasses
 * // {string | string[] | Set<string>} - Combined classes
 */
export function addClasses(oldClasses, newClasses) {
    const badType = i => !isSet(i) && !isArray(i) && !isString(i);
    if (badType(newClasses)) {
        return oldClasses;
    }
    if (badType(oldClasses)) {
        oldClasses = '';
    }
    const toSet = i => isSet(i) ? i : isArray(i) ? new Set(i) : new Set(i.split(' '));
    const combinedSet = toSet(oldClasses);
    const newSet = toSet(newClasses);
    newSet.forEach(c => combinedSet.add(c));
    if (isSet(oldClasses)) {
        return combinedSet;
    }
    if (isArray(oldClasses)) {
        return Array.from(combinedSet);
    }
    return Array.from(combinedSet).join(' ');
}
/**
 * 'copy' function
 *
 * Makes a shallow copy of a JavaScript object, array, Map, or Set.
 * If passed a JavaScript primitive value (string, number, boolean, or null),
 * it returns the value.
 *
 * // {Object|Array|string|number|boolean|null} object - The object to copy
 * // {boolean = false} errors - Show errors?
 * // {Object|Array|string|number|boolean|null} - The copied object
 */
export function copy(object, errors = false) {
    if (typeof object !== 'object' || object === null) {
        return object;
    }
    if (isMap(object)) {
        return new Map(object);
    }
    if (isSet(object)) {
        return new Set(object);
    }
    if (isArray(object)) {
        return [...object];
    }
    if (isObject(object)) {
        return { ...object };
    }
    if (errors) {
        console.error('copy error: Object to copy must be a JavaScript object or value.');
    }
    return object;
}
/**
 * 'forEach' function
 *
 * Iterates over all items in the first level of an object or array
 * and calls an iterator funciton on each item.
 *
 * The iterator function is called with four values:
 * 1. The current item's value
 * 2. The current item's key
 * 3. The parent object, which contains the current item
 * 4. The root object
 *
 * Setting the optional third parameter to 'top-down' or 'bottom-up' will cause
 * it to also recursively iterate over items in sub-objects or sub-arrays in the
 * specified direction.
 *
 * // {Object|Array} object - The object or array to iterate over
 * // {function} fn - the iterator funciton to call on each item
 * // {boolean = false} errors - Show errors?
 * // {void}
 */
export function forEach(object, fn, recurse = false, rootObject = object, errors = false) {
    if (isEmpty(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof fn === 'function') {
        for (const key of Object.keys(object)) {
            const value = object[key];
            if (recurse === 'bottom-up' && (isObject(value) || isArray(value))) {
                forEach(value, fn, recurse, rootObject);
            }
            fn(value, key, object, rootObject);
            if (recurse === 'top-down' && (isObject(value) || isArray(value))) {
                forEach(value, fn, recurse, rootObject);
            }
        }
    }
    if (errors) {
        if (typeof fn !== 'function') {
            console.error('forEach error: Iterator must be a function.');
            console.error('function', fn);
        }
        if (!isObject(object) && !isArray(object)) {
            console.error('forEach error: Input object must be an object or array.');
            console.error('object', object);
        }
    }
}
/**
 * 'forEachCopy' function
 *
 * Iterates over all items in the first level of an object or array
 * and calls an iterator function on each item. Returns a new object or array
 * with the same keys or indexes as the original, and values set to the results
 * of the iterator function.
 *
 * Does NOT recursively iterate over items in sub-objects or sub-arrays.
 *
 * // {Object | Array} object - The object or array to iterate over
 * // {function} fn - The iterator funciton to call on each item
 * // {boolean = false} errors - Show errors?
 * // {Object | Array} - The resulting object or array
 */
export function forEachCopy(object, fn, errors = false) {
    if (!hasValue(object)) {
        return;
    }
    if ((isObject(object) || isArray(object)) && typeof object !== 'function') {
        const newObject = isArray(object) ? [] : {};
        for (const key of Object.keys(object)) {
            newObject[key] = fn(object[key], key, object);
        }
        return newObject;
    }
    if (errors) {
        if (typeof fn !== 'function') {
            console.error('forEachCopy error: Iterator must be a function.');
            console.error('function', fn);
        }
        if (!isObject(object) && !isArray(object)) {
            console.error('forEachCopy error: Input object must be an object or array.');
            console.error('object', object);
        }
    }
}
/**
 * 'hasOwn' utility function
 *
 * Checks whether an object or array has a particular property.
 *
 * // {any} object - the object to check
 * // {string} property - the property to look for
 * // {boolean} - true if object has property, false if not
 */
export function hasOwn(object, property) {
    if (!object || !['number', 'string', 'symbol'].includes(typeof property) ||
        (!isObject(object) && !isArray(object) && !isMap(object) && !isSet(object))) {
        return false;
    }
    if (isMap(object) || isSet(object)) {
        return object.has(property);
    }
    if (typeof property === 'number') {
        if (isArray(object)) {
            return object[property];
        }
        property = property + '';
    }
    return object.hasOwnProperty(property);
}
/**
 * Types of possible expressions which the app is able to evaluate.
 */
export var ExpressionType;
(function (ExpressionType) {
    ExpressionType[ExpressionType["EQUALS"] = 0] = "EQUALS";
    ExpressionType[ExpressionType["NOT_EQUALS"] = 1] = "NOT_EQUALS";
    ExpressionType[ExpressionType["NOT_AN_EXPRESSION"] = 2] = "NOT_AN_EXPRESSION";
})(ExpressionType || (ExpressionType = {}));
/**
 * Detects the type of expression from the given candidate. `==` for equals,
 * `!=` for not equals. If none of these are contained in the candidate, the candidate
 * is not considered to be an expression at all and thus `NOT_AN_EXPRESSION` is returned.
 * // {expressionCandidate} expressionCandidate - potential expression
 */
export function getExpressionType(expressionCandidate) {
    if (expressionCandidate.indexOf('==') !== -1) {
        return ExpressionType.EQUALS;
    }
    if (expressionCandidate.toString().indexOf('!=') !== -1) {
        return ExpressionType.NOT_EQUALS;
    }
    return ExpressionType.NOT_AN_EXPRESSION;
}
export function isEqual(expressionType) {
    return expressionType === ExpressionType.EQUALS;
}
export function isNotEqual(expressionType) {
    return expressionType === ExpressionType.NOT_EQUALS;
}
export function isNotExpression(expressionType) {
    return expressionType === ExpressionType.NOT_AN_EXPRESSION;
}
/**
 * Splits the expression key by the expressionType on a pair of values
 * before and after the equals or nor equals sign.
 * // {expressionType} enum of an expression type
 * // {key} the given key from a for loop iver all conditions
 */
export function getKeyAndValueByExpressionType(expressionType, key) {
    if (isEqual(expressionType)) {
        return key.split('==', 2);
    }
    if (isNotEqual(expressionType)) {
        return key.split('!=', 2);
    }
    return null;
}
export function cleanValueOfQuotes(keyAndValue) {
    if (keyAndValue.charAt(0) === '\'' && keyAndValue.charAt(keyAndValue.length - 1) === '\'') {
        return keyAndValue.replace('\'', '').replace('\'', '');
    }
    return keyAndValue;
}
/**
 * 'mergeFilteredObject' utility function
 *
 * Shallowly merges two objects, setting key and values from source object
 * in target object, excluding specified keys.
 *
 * Optionally, it can also use functions to transform the key names and/or
 * the values of the merging object.
 *
 * // {PlainObject} targetObject - Target object to add keys and values to
 * // {PlainObject} sourceObject - Source object to copy keys and values from
 * // {string[]} excludeKeys - Array of keys to exclude
 * // {(string: string) => string = (k) => k} keyFn - Function to apply to keys
 * // {(any: any) => any = (v) => v} valueFn - Function to apply to values
 * // {PlainObject} - Returns targetObject
 */
export function mergeFilteredObject(targetObject, sourceObject, excludeKeys = [], keyFn = (key) => key, valFn = (val) => val) {
    if (!isObject(sourceObject)) {
        return targetObject;
    }
    if (!isObject(targetObject)) {
        targetObject = {};
    }
    for (const key of Object.keys(sourceObject)) {
        if (!inArray(key, excludeKeys) && isDefined(sourceObject[key])) {
            targetObject[keyFn(key)] = valFn(sourceObject[key]);
        }
    }
    return targetObject;
}
/**
 * 'uniqueItems' function
 *
 * Accepts any number of string value inputs,
 * and returns an array of all input vaues, excluding duplicates.
 *
 * // {...string} ...items -
 * // {string[]} -
 */
export function uniqueItems(...items) {
    const returnItems = [];
    for (const item of items) {
        if (!returnItems.includes(item)) {
            returnItems.push(item);
        }
    }
    return returnItems;
}
/**
 * 'commonItems' function
 *
 * Accepts any number of strings or arrays of string values,
 * and returns a single array containing only values present in all inputs.
 *
 * // {...string|string[]} ...arrays -
 * // {string[]} -
 */
export function commonItems(...arrays) {
    let returnItems = null;
    for (let array of arrays) {
        if (isString(array)) {
            array = [array];
        }
        returnItems = returnItems === null ? [...array] :
            returnItems.filter(item => array.includes(item));
        if (!returnItems.length) {
            return [];
        }
    }
    return returnItems;
}
/**
 * 'fixTitle' function
 *
 *
 * // {string} input -
 * // {string} -
 */
export function fixTitle(name) {
    return name && toTitleCase(name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' '));
}
/**
 * 'toTitleCase' function
 *
 * Intelligently converts an input string to Title Case.
 *
 * Accepts an optional second parameter with a list of additional
 * words and abbreviations to force into a particular case.
 *
 * This function is built on prior work by John Gruber and David Gouch:
 * http://daringfireball.net/2008/08/title_case_update
 * https://github.com/gouch/to-title-case
 *
 * // {string} input -
 * // {string|string[]} forceWords? -
 * // {string} -
 */
export function toTitleCase(input, forceWords) {
    if (!isString(input)) {
        return input;
    }
    let forceArray = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en',
        'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'v', 'v.',
        'vs', 'vs.', 'via'];
    if (isString(forceWords)) {
        forceWords = forceWords.split('|');
    }
    if (isArray(forceWords)) {
        forceArray = forceArray.concat(forceWords);
    }
    const forceArrayLower = forceArray.map(w => w.toLowerCase());
    const noInitialCase = input === input.toUpperCase() || input === input.toLowerCase();
    let prevLastChar = '';
    input = input.trim();
    return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (word, idx) => {
        if (!noInitialCase && word.slice(1).search(/[A-Z]|\../) !== -1) {
            return word;
        }
        else {
            let newWord;
            const forceWord = forceArray[forceArrayLower.indexOf(word.toLowerCase())];
            if (!forceWord) {
                if (noInitialCase) {
                    if (word.slice(1).search(/\../) !== -1) {
                        newWord = word.toLowerCase();
                    }
                    else {
                        newWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
                    }
                }
                else {
                    newWord = word[0].toUpperCase() + word.slice(1);
                }
            }
            else if (forceWord === forceWord.toLowerCase() && (idx === 0 || idx + word.length === input.length ||
                prevLastChar === ':' || input[idx - 1].search(/[^\s-]/) !== -1 ||
                (input[idx - 1] !== '-' && input[idx + word.length] === '-'))) {
                newWord = forceWord[0].toUpperCase() + forceWord.slice(1);
            }
            else {
                newWord = forceWord;
            }
            prevLastChar = word.slice(-1);
            return newWord;
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0eS5mdW5jdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1mb3Jtd29ya3MtY29yZS9zcmMvbGliL3NoYXJlZC91dGlsaXR5LmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUVwSTs7Ozs7RUFLRTtBQUVGOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FDeEIsVUFBMkMsRUFDM0MsVUFBMkM7SUFFM0MsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RCxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1FBQUMsT0FBTyxVQUFVLENBQUM7SUFBQyxDQUFDO0lBQy9DLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7UUFBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQUMsQ0FBQztJQUM3QyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbEYsTUFBTSxXQUFXLEdBQWEsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hELE1BQU0sTUFBTSxHQUFhLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7UUFBQyxPQUFPLFdBQVcsQ0FBQztJQUFDLENBQUM7SUFDOUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUFDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUFDLENBQUM7SUFDNUQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sVUFBVSxJQUFJLENBQUMsTUFBVyxFQUFFLE1BQU0sR0FBRyxLQUFLO0lBQzlDLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUFDLE9BQU8sTUFBTSxDQUFDO0lBQUMsQ0FBQztJQUNyRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBSyxDQUFDO1FBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUFDLENBQUM7SUFDakQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUssQ0FBQztRQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFBQyxDQUFDO0lBQ2pELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFHLENBQUM7UUFBQyxPQUFPLENBQUUsR0FBRyxNQUFNLENBQUUsQ0FBQztJQUFHLENBQUM7SUFDakQsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0s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dHksIGlzTWFwLCBpc09iamVjdCwgaXNTZXQsIGlzU3RyaW5nLCBQbGFpbk9iamVjdH0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIGxpYnJhcnk6XG4gKlxuICogYWRkQ2xhc3NlcywgY29weSwgZm9yRWFjaCwgZm9yRWFjaENvcHksIGhhc093biwgbWVyZ2VGaWx0ZXJlZE9iamVjdCxcbiAqIHVuaXF1ZUl0ZW1zLCBjb21tb25JdGVtcywgZml4VGl0bGUsIHRvVGl0bGVDYXNlXG4qL1xuXG4vKipcbiAqICdhZGRDbGFzc2VzJyBmdW5jdGlvblxuICpcbiAqIE1lcmdlcyB0d28gc3BhY2UtZGVsaW1pdGVkIGxpc3RzIG9mIENTUyBjbGFzc2VzIGFuZCByZW1vdmVzIGR1cGxpY2F0ZXMuXG4gKlxuICogLy8ge3N0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz59IG9sZENsYXNzZXNcbiAqIC8vIHtzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+fSBuZXdDbGFzc2VzXG4gKiAvLyB7c3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPn0gLSBDb21iaW5lZCBjbGFzc2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRDbGFzc2VzKFxuICBvbGRDbGFzc2VzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+LFxuICBuZXdDbGFzc2VzOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+XG4pOiBzdHJpbmcgfCBzdHJpbmdbXSB8IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgYmFkVHlwZSA9IGkgPT4gIWlzU2V0KGkpICYmICFpc0FycmF5KGkpICYmICFpc1N0cmluZyhpKTtcbiAgaWYgKGJhZFR5cGUobmV3Q2xhc3NlcykpIHsgcmV0dXJuIG9sZENsYXNzZXM7IH1cbiAgaWYgKGJhZFR5cGUob2xkQ2xhc3NlcykpIHsgb2xkQ2xhc3NlcyA9ICcnOyB9XG4gIGNvbnN0IHRvU2V0ID0gaSA9PiBpc1NldChpKSA/IGkgOiBpc0FycmF5KGkpID8gbmV3IFNldChpKSA6IG5ldyBTZXQoaS5zcGxpdCgnICcpKTtcbiAgY29uc3QgY29tYmluZWRTZXQ6IFNldDxhbnk+ID0gdG9TZXQob2xkQ2xhc3Nlcyk7XG4gIGNvbnN0IG5ld1NldDogU2V0PGFueT4gPSB0b1NldChuZXdDbGFzc2VzKTtcbiAgbmV3U2V0LmZvckVhY2goYyA9PiBjb21iaW5lZFNldC5hZGQoYykpO1xuICBpZiAoaXNTZXQob2xkQ2xhc3NlcykpIHsgcmV0dXJuIGNvbWJpbmVkU2V0OyB9XG4gIGlmIChpc0FycmF5KG9sZENsYXNzZXMpKSB7IHJldHVybiBBcnJheS5mcm9tKGNvbWJpbmVkU2V0KTsgfVxuICByZXR1cm4gQXJyYXkuZnJvbShjb21iaW5lZFNldCkuam9pbignICcpO1xufVxuXG4vKipcbiAqICdjb3B5JyBmdW5jdGlvblxuICpcbiAqIE1ha2VzIGEgc2hhbGxvdyBjb3B5IG9mIGEgSmF2YVNjcmlwdCBvYmplY3QsIGFycmF5LCBNYXAsIG9yIFNldC5cbiAqIElmIHBhc3NlZCBhIEphdmFTY3JpcHQgcHJpbWl0aXZlIHZhbHVlIChzdHJpbmcsIG51bWJlciwgYm9vbGVhbiwgb3IgbnVsbCksXG4gKiBpdCByZXR1cm5zIHRoZSB2YWx1ZS5cbiAqXG4gKiAvLyB7T2JqZWN0fEFycmF5fHN0cmluZ3xudW1iZXJ8Ym9vbGVhbnxudWxsfSBvYmplY3QgLSBUaGUgb2JqZWN0IHRvIGNvcHlcbiAqIC8vIHtib29sZWFuID0gZmFsc2V9IGVycm9ycyAtIFNob3cgZXJyb3JzP1xuICogLy8ge09iamVjdHxBcnJheXxzdHJpbmd8bnVtYmVyfGJvb2xlYW58bnVsbH0gLSBUaGUgY29waWVkIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weShvYmplY3Q6IGFueSwgZXJyb3JzID0gZmFsc2UpOiBhbnkge1xuICBpZiAodHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcgfHwgb2JqZWN0ID09PSBudWxsKSB7IHJldHVybiBvYmplY3Q7IH1cbiAgaWYgKGlzTWFwKG9iamVjdCkpICAgIHsgcmV0dXJuIG5ldyBNYXAob2JqZWN0KTsgfVxuICBpZiAoaXNTZXQob2JqZWN0KSkgICAgeyByZXR1cm4gbmV3IFNldChvYmplY3QpOyB9XG4gIGlmIChpc0FycmF5KG9iamVjdCkpICB7IHJldHVybiBbIC4uLm9iamVjdCBdOyAgIH1cbiAgaWYgKGlzT2JqZWN0KG9iamVjdCkpIHsgcmV0dXJuIHsgLi4ub2JqZWN0IH07ICAgfVxuICBpZiAoZXJyb3JzKSB7XG4gICAgY29uc29sZS5lcnJvcignY29weSBlcnJvcjogT2JqZWN0IHRvIGNvcHkgbXVzdCBiZSBhIEphdmFTY3JpcHQgb2JqZWN0IG9yIHZhbHVlLicpO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbi8qKlxuICogJ2ZvckVhY2gnIGZ1bmN0aW9uXG4gKlxuICogSXRlcmF0ZXMgb3ZlciBhbGwgaXRlbXMgaW4gdGhlIGZpcnN0IGxldmVsIG9mIGFuIG9iamVjdCBvciBhcnJheVxuICogYW5kIGNhbGxzIGFuIGl0ZXJhdG9yIGZ1bmNpdG9uIG9uIGVhY2ggaXRlbS5cbiAqXG4gKiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggZm91ciB2YWx1ZXM6XG4gKiAxLiBUaGUgY3VycmVudCBpdGVtJ3MgdmFsdWVcbiAqIDIuIFRoZSBjdXJyZW50IGl0ZW0ncyBrZXlcbiAqIDMuIFRoZSBwYXJlbnQgb2JqZWN0LCB3aGljaCBjb250YWlucyB0aGUgY3VycmVudCBpdGVtXG4gKiA0LiBUaGUgcm9vdCBvYmplY3RcbiAqXG4gKiBTZXR0aW5nIHRoZSBvcHRpb25hbCB0aGlyZCBwYXJhbWV0ZXIgdG8gJ3RvcC1kb3duJyBvciAnYm90dG9tLXVwJyB3aWxsIGNhdXNlXG4gKiBpdCB0byBhbHNvIHJlY3Vyc2l2ZWx5IGl0ZXJhdGUgb3ZlciBpdGVtcyBpbiBzdWItb2JqZWN0cyBvciBzdWItYXJyYXlzIGluIHRoZVxuICogc3BlY2lmaWVkIGRpcmVjdGlvbi5cbiAqXG4gKiAvLyB7T2JqZWN0fEFycmF5fSBvYmplY3QgLSBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIGl0ZXJhdGUgb3ZlclxuICogLy8ge2Z1bmN0aW9ufSBmbiAtIHRoZSBpdGVyYXRvciBmdW5jaXRvbiB0byBjYWxsIG9uIGVhY2ggaXRlbVxuICogLy8ge2Jvb2xlYW4gPSBmYWxzZX0gZXJyb3JzIC0gU2hvdyBlcnJvcnM/XG4gKiAvLyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvckVhY2goXG4gIG9iamVjdDogYW55LCBmbjogKHY6IGFueSwgaz86IHN0cmluZyB8IG51bWJlciwgYz86IGFueSwgcmM/OiBhbnkpID0+IGFueSxcbiAgcmVjdXJzZTogYm9vbGVhbiB8IHN0cmluZyA9IGZhbHNlLCByb290T2JqZWN0OiBhbnkgPSBvYmplY3QsIGVycm9ycyA9IGZhbHNlXG4pOiB2b2lkIHtcbiAgaWYgKGlzRW1wdHkob2JqZWN0KSkgeyByZXR1cm47IH1cbiAgaWYgKChpc09iamVjdChvYmplY3QpIHx8IGlzQXJyYXkob2JqZWN0KSkgJiYgdHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqZWN0KSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAgIGlmIChyZWN1cnNlID09PSAnYm90dG9tLXVwJyAmJiAoaXNPYmplY3QodmFsdWUpIHx8IGlzQXJyYXkodmFsdWUpKSkge1xuICAgICAgICBmb3JFYWNoKHZhbHVlLCBmbiwgcmVjdXJzZSwgcm9vdE9iamVjdCk7XG4gICAgICB9XG4gICAgICBmbih2YWx1ZSwga2V5LCBvYmplY3QsIHJvb3RPYmplY3QpO1xuICAgICAgaWYgKHJlY3Vyc2UgPT09ICd0b3AtZG93bicgJiYgKGlzT2JqZWN0KHZhbHVlKSB8fCBpc0FycmF5KHZhbHVlKSkpIHtcbiAgICAgICAgZm9yRWFjaCh2YWx1ZSwgZm4sIHJlY3Vyc2UsIHJvb3RPYmplY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoZXJyb3JzKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc29sZS5lcnJvcignZm9yRWFjaCBlcnJvcjogSXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICAgICAgY29uc29sZS5lcnJvcignZnVuY3Rpb24nLCBmbik7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3Qob2JqZWN0KSAmJiAhaXNBcnJheShvYmplY3QpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdmb3JFYWNoIGVycm9yOiBJbnB1dCBvYmplY3QgbXVzdCBiZSBhbiBvYmplY3Qgb3IgYXJyYXkuJyk7XG4gICAgICBjb25zb2xlLmVycm9yKCdvYmplY3QnLCBvYmplY3QpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqICdmb3JFYWNoQ29weScgZnVuY3Rpb25cbiAqXG4gKiBJdGVyYXRlcyBvdmVyIGFsbCBpdGVtcyBpbiB0aGUgZmlyc3QgbGV2ZWwgb2YgYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBhbmQgY2FsbHMgYW4gaXRlcmF0b3IgZnVuY3Rpb24gb24gZWFjaCBpdGVtLiBSZXR1cm5zIGEgbmV3IG9iamVjdCBvciBhcnJheVxuICogd2l0aCB0aGUgc2FtZSBrZXlzIG9yIGluZGV4ZXMgYXMgdGhlIG9yaWdpbmFsLCBhbmQgdmFsdWVzIHNldCB0byB0aGUgcmVzdWx0c1xuICogb2YgdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLlxuICpcbiAqIERvZXMgTk9UIHJlY3Vyc2l2ZWx5IGl0ZXJhdGUgb3ZlciBpdGVtcyBpbiBzdWItb2JqZWN0cyBvciBzdWItYXJyYXlzLlxuICpcbiAqIC8vIHtPYmplY3QgfCBBcnJheX0gb2JqZWN0IC0gVGhlIG9iamVjdCBvciBhcnJheSB0byBpdGVyYXRlIG92ZXJcbiAqIC8vIHtmdW5jdGlvbn0gZm4gLSBUaGUgaXRlcmF0b3IgZnVuY2l0b24gdG8gY2FsbCBvbiBlYWNoIGl0ZW1cbiAqIC8vIHtib29sZWFuID0gZmFsc2V9IGVycm9ycyAtIFNob3cgZXJyb3JzP1xuICogLy8ge09iamVjdCB8IEFycmF5fSAtIFRoZSByZXN1bHRpbmcgb2JqZWN0IG9yIGFycmF5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoQ29weShcbiAgb2JqZWN0OiBhbnksIGZuOiAodjogYW55LCBrPzogc3RyaW5nIHwgbnVtYmVyLCBvPzogYW55LCBwPzogc3RyaW5nKSA9PiBhbnksXG4gIGVycm9ycyA9IGZhbHNlXG4pOiBhbnkge1xuICBpZiAoIWhhc1ZhbHVlKG9iamVjdCkpIHsgcmV0dXJuOyB9XG4gIGlmICgoaXNPYmplY3Qob2JqZWN0KSB8fCBpc0FycmF5KG9iamVjdCkpICYmIHR5cGVvZiBvYmplY3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zdCBuZXdPYmplY3Q6IGFueSA9IGlzQXJyYXkob2JqZWN0KSA/IFtdIDoge307XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqZWN0KSkge1xuICAgICAgbmV3T2JqZWN0W2tleV0gPSBmbihvYmplY3Rba2V5XSwga2V5LCBvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3T2JqZWN0O1xuICB9XG4gIGlmIChlcnJvcnMpIHtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdmb3JFYWNoQ29weSBlcnJvcjogSXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICAgICAgY29uc29sZS5lcnJvcignZnVuY3Rpb24nLCBmbik7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3Qob2JqZWN0KSAmJiAhaXNBcnJheShvYmplY3QpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdmb3JFYWNoQ29weSBlcnJvcjogSW5wdXQgb2JqZWN0IG11c3QgYmUgYW4gb2JqZWN0IG9yIGFycmF5LicpO1xuICAgICAgY29uc29sZS5lcnJvcignb2JqZWN0Jywgb2JqZWN0KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiAnaGFzT3duJyB1dGlsaXR5IGZ1bmN0aW9uXG4gKlxuICogQ2hlY2tzIHdoZXRoZXIgYW4gb2JqZWN0IG9yIGFycmF5IGhhcyBhIHBhcnRpY3VsYXIgcHJvcGVydHkuXG4gKlxuICogLy8ge2FueX0gb2JqZWN0IC0gdGhlIG9iamVjdCB0byBjaGVja1xuICogLy8ge3N0cmluZ30gcHJvcGVydHkgLSB0aGUgcHJvcGVydHkgdG8gbG9vayBmb3JcbiAqIC8vIHtib29sZWFufSAtIHRydWUgaWYgb2JqZWN0IGhhcyBwcm9wZXJ0eSwgZmFsc2UgaWYgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNPd24ob2JqZWN0OiBhbnksIHByb3BlcnR5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFvYmplY3QgfHwgIVsnbnVtYmVyJywgJ3N0cmluZycsICdzeW1ib2wnXS5pbmNsdWRlcyh0eXBlb2YgcHJvcGVydHkpIHx8XG4gICAgKCFpc09iamVjdChvYmplY3QpICYmICFpc0FycmF5KG9iamVjdCkgJiYgIWlzTWFwKG9iamVjdCkgJiYgIWlzU2V0KG9iamVjdCkpXG4gICkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKGlzTWFwKG9iamVjdCkgfHwgaXNTZXQob2JqZWN0KSkgeyByZXR1cm4gb2JqZWN0Lmhhcyhwcm9wZXJ0eSk7IH1cbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAoaXNBcnJheShvYmplY3QpKSB7IHJldHVybiBvYmplY3RbPG51bWJlcj5wcm9wZXJ0eV07IH1cbiAgICBwcm9wZXJ0eSA9IHByb3BlcnR5ICsgJyc7XG4gIH1cbiAgcmV0dXJuIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSk7XG59XG5cbi8qKlxuICogVHlwZXMgb2YgcG9zc2libGUgZXhwcmVzc2lvbnMgd2hpY2ggdGhlIGFwcCBpcyBhYmxlIHRvIGV2YWx1YXRlLlxuICovXG5leHBvcnQgZW51bSBFeHByZXNzaW9uVHlwZSB7XG4gIEVRVUFMUyxcbiAgTk9UX0VRVUFMUyxcbiAgTk9UX0FOX0VYUFJFU1NJT05cbn1cblxuLyoqXG4gKiBEZXRlY3RzIHRoZSB0eXBlIG9mIGV4cHJlc3Npb24gZnJvbSB0aGUgZ2l2ZW4gY2FuZGlkYXRlLiBgPT1gIGZvciBlcXVhbHMsXG4gKiBgIT1gIGZvciBub3QgZXF1YWxzLiBJZiBub25lIG9mIHRoZXNlIGFyZSBjb250YWluZWQgaW4gdGhlIGNhbmRpZGF0ZSwgdGhlIGNhbmRpZGF0ZVxuICogaXMgbm90IGNvbnNpZGVyZWQgdG8gYmUgYW4gZXhwcmVzc2lvbiBhdCBhbGwgYW5kIHRodXMgYE5PVF9BTl9FWFBSRVNTSU9OYCBpcyByZXR1cm5lZC5cbiAqIC8vIHtleHByZXNzaW9uQ2FuZGlkYXRlfSBleHByZXNzaW9uQ2FuZGlkYXRlIC0gcG90ZW50aWFsIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEV4cHJlc3Npb25UeXBlKGV4cHJlc3Npb25DYW5kaWRhdGU6IHN0cmluZyk6IEV4cHJlc3Npb25UeXBlIHtcbiAgaWYgKGV4cHJlc3Npb25DYW5kaWRhdGUuaW5kZXhPZignPT0nKSAhPT0gLTEpIHtcbiAgICByZXR1cm4gRXhwcmVzc2lvblR5cGUuRVFVQUxTO1xuICB9XG5cbiAgaWYgKGV4cHJlc3Npb25DYW5kaWRhdGUudG9TdHJpbmcoKS5pbmRleE9mKCchPScpICE9PSAtMSkge1xuICAgIHJldHVybiBFeHByZXNzaW9uVHlwZS5OT1RfRVFVQUxTO1xuICB9XG5cbiAgcmV0dXJuIEV4cHJlc3Npb25UeXBlLk5PVF9BTl9FWFBSRVNTSU9OO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFcXVhbChleHByZXNzaW9uVHlwZSkge1xuICByZXR1cm4gZXhwcmVzc2lvblR5cGUgYXMgRXhwcmVzc2lvblR5cGUgPT09IEV4cHJlc3Npb25UeXBlLkVRVUFMUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTm90RXF1YWwoZXhwcmVzc2lvblR5cGUpIHtcbiAgcmV0dXJuIGV4cHJlc3Npb25UeXBlIGFzIEV4cHJlc3Npb25UeXBlID09PSBFeHByZXNzaW9uVHlwZS5OT1RfRVFVQUxTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOb3RFeHByZXNzaW9uKGV4cHJlc3Npb25UeXBlKSB7XG4gIHJldHVybiBleHByZXNzaW9uVHlwZSBhcyBFeHByZXNzaW9uVHlwZSA9PT0gRXhwcmVzc2lvblR5cGUuTk9UX0FOX0VYUFJFU1NJT047XG59XG5cbi8qKlxuICogU3BsaXRzIHRoZSBleHByZXNzaW9uIGtleSBieSB0aGUgZXhwcmVzc2lvblR5cGUgb24gYSBwYWlyIG9mIHZhbHVlc1xuICogYmVmb3JlIGFuZCBhZnRlciB0aGUgZXF1YWxzIG9yIG5vciBlcXVhbHMgc2lnbi5cbiAqIC8vIHtleHByZXNzaW9uVHlwZX0gZW51bSBvZiBhbiBleHByZXNzaW9uIHR5cGVcbiAqIC8vIHtrZXl9IHRoZSBnaXZlbiBrZXkgZnJvbSBhIGZvciBsb29wIGl2ZXIgYWxsIGNvbmRpdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEtleUFuZFZhbHVlQnlFeHByZXNzaW9uVHlwZShleHByZXNzaW9uVHlwZTogRXhwcmVzc2lvblR5cGUsIGtleTogc3RyaW5nKSB7XG4gIGlmIChpc0VxdWFsKGV4cHJlc3Npb25UeXBlKSkge1xuICAgIHJldHVybiBrZXkuc3BsaXQoJz09JywgMik7XG4gIH1cblxuICBpZiAoaXNOb3RFcXVhbChleHByZXNzaW9uVHlwZSkpIHtcbiAgICByZXR1cm4ga2V5LnNwbGl0KCchPScsIDIpO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhblZhbHVlT2ZRdW90ZXMoa2V5QW5kVmFsdWUpOiBTdHJpbmcge1xuICBpZiAoa2V5QW5kVmFsdWUuY2hhckF0KDApID09PSAnXFwnJyAmJiBrZXlBbmRWYWx1ZS5jaGFyQXQoa2V5QW5kVmFsdWUubGVuZ3RoIC0gMSkgPT09ICdcXCcnKSB7XG4gICAgcmV0dXJuIGtleUFuZFZhbHVlLnJlcGxhY2UoJ1xcJycsICcnKS5yZXBsYWNlKCdcXCcnLCAnJyk7XG4gIH1cbiAgcmV0dXJuIGtleUFuZFZhbHVlO1xufVxuXG4vKipcbiAqICdtZXJnZUZpbHRlcmVkT2JqZWN0JyB1dGlsaXR5IGZ1bmN0aW9uXG4gKlxuICogU2hhbGxvd2x5IG1lcmdlcyB0d28gb2JqZWN0cywgc2V0dGluZyBrZXkgYW5kIHZhbHVlcyBmcm9tIHNvdXJjZSBvYmplY3RcbiAqIGluIHRhcmdldCBvYmplY3QsIGV4Y2x1ZGluZyBzcGVjaWZpZWQga2V5cy5cbiAqXG4gKiBPcHRpb25hbGx5LCBpdCBjYW4gYWxzbyB1c2UgZnVuY3Rpb25zIHRvIHRyYW5zZm9ybSB0aGUga2V5IG5hbWVzIGFuZC9vclxuICogdGhlIHZhbHVlcyBvZiB0aGUgbWVyZ2luZyBvYmplY3QuXG4gKlxuICogLy8ge1BsYWluT2JqZWN0fSB0YXJnZXRPYmplY3QgLSBUYXJnZXQgb2JqZWN0IHRvIGFkZCBrZXlzIGFuZCB2YWx1ZXMgdG9cbiAqIC8vIHtQbGFpbk9iamVjdH0gc291cmNlT2JqZWN0IC0gU291cmNlIG9iamVjdCB0byBjb3B5IGtleXMgYW5kIHZhbHVlcyBmcm9tXG4gKiAvLyB7c3RyaW5nW119IGV4Y2x1ZGVLZXlzIC0gQXJyYXkgb2Yga2V5cyB0byBleGNsdWRlXG4gKiAvLyB7KHN0cmluZzogc3RyaW5nKSA9PiBzdHJpbmcgPSAoaykgPT4ga30ga2V5Rm4gLSBGdW5jdGlvbiB0byBhcHBseSB0byBrZXlzXG4gKiAvLyB7KGFueTogYW55KSA9PiBhbnkgPSAodikgPT4gdn0gdmFsdWVGbiAtIEZ1bmN0aW9uIHRvIGFwcGx5IHRvIHZhbHVlc1xuICogLy8ge1BsYWluT2JqZWN0fSAtIFJldHVybnMgdGFyZ2V0T2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUZpbHRlcmVkT2JqZWN0KFxuICB0YXJnZXRPYmplY3Q6IFBsYWluT2JqZWN0LFxuICBzb3VyY2VPYmplY3Q6IFBsYWluT2JqZWN0LFxuICBleGNsdWRlS2V5cyA9IDxzdHJpbmdbXT5bXSxcbiAga2V5Rm4gPSAoa2V5OiBzdHJpbmcpOiBzdHJpbmcgPT4ga2V5LFxuICB2YWxGbiA9ICh2YWw6IGFueSk6IGFueSA9PiB2YWxcbik6IFBsYWluT2JqZWN0IHtcbiAgaWYgKCFpc09iamVjdChzb3VyY2VPYmplY3QpKSB7IHJldHVybiB0YXJnZXRPYmplY3Q7IH1cbiAgaWYgKCFpc09iamVjdCh0YXJnZXRPYmplY3QpKSB7IHRhcmdldE9iamVjdCA9IHt9OyB9XG4gIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNvdXJjZU9iamVjdCkpIHtcbiAgICBpZiAoIWluQXJyYXkoa2V5LCBleGNsdWRlS2V5cykgJiYgaXNEZWZpbmVkKHNvdXJjZU9iamVjdFtrZXldKSkge1xuICAgICAgdGFyZ2V0T2JqZWN0W2tleUZuKGtleSldID0gdmFsRm4oc291cmNlT2JqZWN0W2tleV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0T2JqZWN0O1xufVxuXG4vKipcbiAqICd1bmlxdWVJdGVtcycgZnVuY3Rpb25cbiAqXG4gKiBBY2NlcHRzIGFueSBudW1iZXIgb2Ygc3RyaW5nIHZhbHVlIGlucHV0cyxcbiAqIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBpbnB1dCB2YXVlcywgZXhjbHVkaW5nIGR1cGxpY2F0ZXMuXG4gKlxuICogLy8gey4uLnN0cmluZ30gLi4uaXRlbXMgLVxuICogLy8ge3N0cmluZ1tdfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWVJdGVtcyguLi5pdGVtcyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgcmV0dXJuSXRlbXMgPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgaWYgKCFyZXR1cm5JdGVtcy5pbmNsdWRlcyhpdGVtKSkgeyByZXR1cm5JdGVtcy5wdXNoKGl0ZW0pOyB9XG4gIH1cbiAgcmV0dXJuIHJldHVybkl0ZW1zO1xufVxuXG4vKipcbiAqICdjb21tb25JdGVtcycgZnVuY3Rpb25cbiAqXG4gKiBBY2NlcHRzIGFueSBudW1iZXIgb2Ygc3RyaW5ncyBvciBhcnJheXMgb2Ygc3RyaW5nIHZhbHVlcyxcbiAqIGFuZCByZXR1cm5zIGEgc2luZ2xlIGFycmF5IGNvbnRhaW5pbmcgb25seSB2YWx1ZXMgcHJlc2VudCBpbiBhbGwgaW5wdXRzLlxuICpcbiAqIC8vIHsuLi5zdHJpbmd8c3RyaW5nW119IC4uLmFycmF5cyAtXG4gKiAvLyB7c3RyaW5nW119IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbW1vbkl0ZW1zKC4uLmFycmF5cyk6IHN0cmluZ1tdIHtcbiAgbGV0IHJldHVybkl0ZW1zID0gbnVsbDtcbiAgZm9yIChsZXQgYXJyYXkgb2YgYXJyYXlzKSB7XG4gICAgaWYgKGlzU3RyaW5nKGFycmF5KSkgeyBhcnJheSA9IFthcnJheV07IH1cbiAgICByZXR1cm5JdGVtcyA9IHJldHVybkl0ZW1zID09PSBudWxsID8gWyAuLi5hcnJheSBdIDpcbiAgICAgIHJldHVybkl0ZW1zLmZpbHRlcihpdGVtID0+IGFycmF5LmluY2x1ZGVzKGl0ZW0pKTtcbiAgICBpZiAoIXJldHVybkl0ZW1zLmxlbmd0aCkgeyByZXR1cm4gW107IH1cbiAgfVxuICByZXR1cm4gcmV0dXJuSXRlbXM7XG59XG5cbi8qKlxuICogJ2ZpeFRpdGxlJyBmdW5jdGlvblxuICpcbiAqXG4gKiAvLyB7c3RyaW5nfSBpbnB1dCAtXG4gKiAvLyB7c3RyaW5nfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaXhUaXRsZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gbmFtZSAmJiB0b1RpdGxlQ2FzZShuYW1lLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMSAkMicpLnJlcGxhY2UoL18vZywgJyAnKSk7XG59XG5cbi8qKlxuICogJ3RvVGl0bGVDYXNlJyBmdW5jdGlvblxuICpcbiAqIEludGVsbGlnZW50bHkgY29udmVydHMgYW4gaW5wdXQgc3RyaW5nIHRvIFRpdGxlIENhc2UuXG4gKlxuICogQWNjZXB0cyBhbiBvcHRpb25hbCBzZWNvbmQgcGFyYW1ldGVyIHdpdGggYSBsaXN0IG9mIGFkZGl0aW9uYWxcbiAqIHdvcmRzIGFuZCBhYmJyZXZpYXRpb25zIHRvIGZvcmNlIGludG8gYSBwYXJ0aWN1bGFyIGNhc2UuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyBidWlsdCBvbiBwcmlvciB3b3JrIGJ5IEpvaG4gR3J1YmVyIGFuZCBEYXZpZCBHb3VjaDpcbiAqIGh0dHA6Ly9kYXJpbmdmaXJlYmFsbC5uZXQvMjAwOC8wOC90aXRsZV9jYXNlX3VwZGF0ZVxuICogaHR0cHM6Ly9naXRodWIuY29tL2dvdWNoL3RvLXRpdGxlLWNhc2VcbiAqXG4gKiAvLyB7c3RyaW5nfSBpbnB1dCAtXG4gKiAvLyB7c3RyaW5nfHN0cmluZ1tdfSBmb3JjZVdvcmRzPyAtXG4gKiAvLyB7c3RyaW5nfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1RpdGxlQ2FzZShpbnB1dDogc3RyaW5nLCBmb3JjZVdvcmRzPzogc3RyaW5nfHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgaWYgKCFpc1N0cmluZyhpbnB1dCkpIHsgcmV0dXJuIGlucHV0OyB9XG4gIGxldCBmb3JjZUFycmF5OiBzdHJpbmdbXSA9IFsnYScsICdhbicsICdhbmQnLCAnYXMnLCAnYXQnLCAnYnV0JywgJ2J5JywgJ2VuJyxcbiAgICdmb3InLCAnaWYnLCAnaW4nLCAnbm9yJywgJ29mJywgJ29uJywgJ29yJywgJ3BlcicsICd0aGUnLCAndG8nLCAndicsICd2LicsXG4gICAndnMnLCAndnMuJywgJ3ZpYSddO1xuICBpZiAoaXNTdHJpbmcoZm9yY2VXb3JkcykpIHsgZm9yY2VXb3JkcyA9ICg8c3RyaW5nPmZvcmNlV29yZHMpLnNwbGl0KCd8Jyk7IH1cbiAgaWYgKGlzQXJyYXkoZm9yY2VXb3JkcykpIHsgZm9yY2VBcnJheSA9IGZvcmNlQXJyYXkuY29uY2F0KGZvcmNlV29yZHMpOyB9XG4gIGNvbnN0IGZvcmNlQXJyYXlMb3dlcjogc3RyaW5nW10gPSBmb3JjZUFycmF5Lm1hcCh3ID0+IHcudG9Mb3dlckNhc2UoKSk7XG4gIGNvbnN0IG5vSW5pdGlhbENhc2U6IGJvb2xlYW4gPVxuICAgIGlucHV0ID09PSBpbnB1dC50b1VwcGVyQ2FzZSgpIHx8IGlucHV0ID09PSBpbnB1dC50b0xvd2VyQ2FzZSgpO1xuICBsZXQgcHJldkxhc3RDaGFyID0gJyc7XG4gIGlucHV0ID0gaW5wdXQudHJpbSgpO1xuICByZXR1cm4gaW5wdXQucmVwbGFjZSgvW0EtWmEtejAtOVxcdTAwQzAtXFx1MDBGRl0rW15cXHMtXSovZywgKHdvcmQsIGlkeCkgPT4ge1xuICAgIGlmICghbm9Jbml0aWFsQ2FzZSAmJiB3b3JkLnNsaWNlKDEpLnNlYXJjaCgvW0EtWl18XFwuLi8pICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHdvcmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdXb3JkOiBzdHJpbmc7XG4gICAgICBjb25zdCBmb3JjZVdvcmQ6IHN0cmluZyA9XG4gICAgICAgIGZvcmNlQXJyYXlbZm9yY2VBcnJheUxvd2VyLmluZGV4T2Yod29yZC50b0xvd2VyQ2FzZSgpKV07XG4gICAgICBpZiAoIWZvcmNlV29yZCkge1xuICAgICAgICBpZiAobm9Jbml0aWFsQ2FzZSkge1xuICAgICAgICAgIGlmICh3b3JkLnNsaWNlKDEpLnNlYXJjaCgvXFwuLi8pICE9PSAtMSkge1xuICAgICAgICAgICAgbmV3V29yZCA9IHdvcmQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3V29yZCA9IHdvcmRbMF0udG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3V29yZCA9IHdvcmRbMF0udG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGZvcmNlV29yZCA9PT0gZm9yY2VXb3JkLnRvTG93ZXJDYXNlKCkgJiYgKFxuICAgICAgICAgIGlkeCA9PT0gMCB8fCBpZHggKyB3b3JkLmxlbmd0aCA9PT0gaW5wdXQubGVuZ3RoIHx8XG4gICAgICAgICAgcHJldkxhc3RDaGFyID09PSAnOicgfHwgaW5wdXRbaWR4IC0gMV0uc2VhcmNoKC9bXlxccy1dLykgIT09IC0xIHx8XG4gICAgICAgICAgKGlucHV0W2lkeCAtIDFdICE9PSAnLScgJiYgaW5wdXRbaWR4ICsgd29yZC5sZW5ndGhdID09PSAnLScpXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICBuZXdXb3JkID0gZm9yY2VXb3JkWzBdLnRvVXBwZXJDYXNlKCkgKyBmb3JjZVdvcmQuc2xpY2UoMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdXb3JkID0gZm9yY2VXb3JkO1xuICAgICAgfVxuICAgICAgcHJldkxhc3RDaGFyID0gd29yZC5zbGljZSgtMSk7XG4gICAgICByZXR1cm4gbmV3V29yZDtcbiAgICB9XG4gIH0pO1xufVxuIl19