import { from, Observable } from 'rxjs';
/**
 * '_executeValidators' utility function
 *
 * Validates a control against an array of validators, and returns
 * an array of the same length containing a combination of error messages
 * (from invalid validators) and null values (from valid validators)
 *
 * //  { AbstractControl } control - control to validate
 * //  { IValidatorFn[] } validators - array of validators
 * //  { boolean } invert - invert?
 * // { PlainObject[] } - array of nulls and error message
 */
export function _executeValidators(control, validators, invert = false) {
    return validators.map(validator => validator(control, invert));
}
/**
 * '_executeAsyncValidators' utility function
 *
 * Validates a control against an array of async validators, and returns
 * an array of observabe results of the same length containing a combination of
 * error messages (from invalid validators) and null values (from valid ones)
 *
 * //  { AbstractControl } control - control to validate
 * //  { AsyncIValidatorFn[] } validators - array of async validators
 * //  { boolean } invert - invert?
 * //  - array of observable nulls and error message
 */
export function _executeAsyncValidators(control, validators, invert = false) {
    return validators.map(validator => validator(control, invert));
}
/**
 * '_mergeObjects' utility function
 *
 * Recursively Merges one or more objects into a single object with combined keys.
 * Automatically detects and ignores null and undefined inputs.
 * Also detects duplicated boolean 'not' keys and XORs their values.
 *
 * //  { PlainObject[] } objects - one or more objects to merge
 * // { PlainObject } - merged object
 */
export function _mergeObjects(...objects) {
    const mergedObject = {};
    for (const currentObject of objects) {
        if (isObject(currentObject)) {
            for (const key of Object.keys(currentObject)) {
                const currentValue = currentObject[key];
                const mergedValue = mergedObject[key];
                mergedObject[key] = !isDefined(mergedValue) ? currentValue :
                    key === 'not' && isBoolean(mergedValue, 'strict') &&
                        isBoolean(currentValue, 'strict') ? xor(mergedValue, currentValue) :
                        getType(mergedValue) === 'object' && getType(currentValue) === 'object' ?
                            _mergeObjects(mergedValue, currentValue) :
                            currentValue;
            }
        }
    }
    return mergedObject;
}
/**
 * '_mergeErrors' utility function
 *
 * Merges an array of objects.
 * Used for combining the validator errors returned from 'executeValidators'
 *
 * //  { PlainObject[] } arrayOfErrors - array of objects
 * // { PlainObject } - merged object, or null if no usable input objectcs
 */
export function _mergeErrors(arrayOfErrors) {
    const mergedErrors = _mergeObjects(...arrayOfErrors);
    return isEmpty(mergedErrors) ? null : mergedErrors;
}
/**
 * 'isDefined' utility function
 *
 * Checks if a variable contains a value of any type.
 * Returns true even for otherwise 'falsey' values of 0, '', and false.
 *
 * //   value - the value to check
 * // { boolean } - false if undefined or null, otherwise true
 */
export function isDefined(value) {
    return value !== undefined && value !== null;
}
/**
 * 'hasValue' utility function
 *
 * Checks if a variable contains a value.
 * Returs false for null, undefined, or a zero-length strng, '',
 * otherwise returns true.
 * (Stricter than 'isDefined' because it also returns false for '',
 * though it stil returns true for otherwise 'falsey' values 0 and false.)
 *
 * //   value - the value to check
 * // { boolean } - false if undefined, null, or '', otherwise true
 */
export function hasValue(value) {
    return value !== undefined && value !== null && value !== '';
}
/**
 * 'isEmpty' utility function
 *
 * Similar to !hasValue, but also returns true for empty arrays and objects.
 *
 * //   value - the value to check
 * // { boolean } - false if undefined, null, or '', otherwise true
 */
export function isEmpty(value) {
    if (isArray(value)) {
        return !value.length;
    }
    if (isObject(value)) {
        return !Object.keys(value).length;
    }
    return value === undefined || value === null || value === '';
}
/**
 * 'isString' utility function
 *
 * Checks if a value is a string.
 *
 * //   value - the value to check
 * // { boolean } - true if string, false if not
 */
export function isString(value) {
    return typeof value === 'string';
}
/**
 * 'isNumber' utility function
 *
 * Checks if a value is a regular number, numeric string, or JavaScript Date.
 *
 * //   value - the value to check
 * //  { any = false } strict - if truthy, also checks JavaScript tyoe
 * // { boolean } - true if number, false if not
 */
export function isNumber(value, strict = false) {
    if (strict && typeof value !== 'number') {
        return false;
    }
    return !isNaN(value) && value !== value / 0;
}
/**
 * 'isInteger' utility function
 *
 * Checks if a value is an integer.
 *
 * //   value - the value to check
 * //  { any = false } strict - if truthy, also checks JavaScript tyoe
 * // {boolean } - true if number, false if not
 */
export function isInteger(value, strict = false) {
    if (strict && typeof value !== 'number') {
        return false;
    }
    return !isNaN(value) && value !== value / 0 && value % 1 === 0;
}
/**
 * 'isBoolean' utility function
 *
 * Checks if a value is a boolean.
 *
 * //   value - the value to check
 * //  { any = null } option - if 'strict', also checks JavaScript type
 *                              if TRUE or FALSE, checks only for that value
 * // { boolean } - true if boolean, false if not
 */
export function isBoolean(value, option = null) {
    if (option === 'strict') {
        return value === true || value === false;
    }
    if (option === true) {
        return value === true || value === 1 || value === 'true' || value === '1';
    }
    if (option === false) {
        return value === false || value === 0 || value === 'false' || value === '0';
    }
    return value === true || value === 1 || value === 'true' || value === '1' ||
        value === false || value === 0 || value === 'false' || value === '0';
}
export function isFunction(item) {
    return typeof item === 'function';
}
export function isObject(item) {
    return item !== null && typeof item === 'object';
}
export function isArray(item) {
    return Array.isArray(item);
}
export function isDate(item) {
    return !!item && Object.prototype.toString.call(item) === '[object Date]';
}
export function isMap(item) {
    return !!item && Object.prototype.toString.call(item) === '[object Map]';
}
export function isSet(item) {
    return !!item && Object.prototype.toString.call(item) === '[object Set]';
}
export function isSymbol(item) {
    return typeof item === 'symbol';
}
/**
 * 'getType' function
 *
 * Detects the JSON Schema Type of a value.
 * By default, detects numbers and integers even if formatted as strings.
 * (So all integers are also numbers, and any number may also be a string.)
 * However, it only detects true boolean values (to detect boolean values
 * in non-boolean formats, use isBoolean() instead).
 *
 * If passed a second optional parameter of 'strict', it will only detect
 * numbers and integers if they are formatted as JavaScript numbers.
 *
 * Examples:
 * getType('10.5') = 'number'
 * getType(10.5) = 'number'
 * getType('10') = 'integer'
 * getType(10) = 'integer'
 * getType('true') = 'string'
 * getType(true) = 'boolean'
 * getType(null) = 'null'
 * getType({ }) = 'object'
 * getType([]) = 'array'
 *
 * getType('10.5', 'strict') = 'string'
 * getType(10.5, 'strict') = 'number'
 * getType('10', 'strict') = 'string'
 * getType(10, 'strict') = 'integer'
 * getType('true', 'strict') = 'string'
 * getType(true, 'strict') = 'boolean'
 *
 * //   value - value to check
 * //  { any = false } strict - if truthy, also checks JavaScript tyoe
 * // { SchemaType }
 */
export function getType(value, strict = false) {
    if (!isDefined(value)) {
        return 'null';
    }
    if (isArray(value)) {
        return 'array';
    }
    if (isObject(value)) {
        return 'object';
    }
    if (isBoolean(value, 'strict')) {
        return 'boolean';
    }
    if (isInteger(value, strict)) {
        return 'integer';
    }
    if (isNumber(value, strict)) {
        return 'number';
    }
    if (isString(value) || (!strict && isDate(value))) {
        return 'string';
    }
    return null;
}
/**
 * 'isType' function
 *
 * Checks wether an input (probably string) value contains data of
 * a specified JSON Schema type
 *
 * //  { PrimitiveValue } value - value to check
 * //  { SchemaPrimitiveType } type - type to check
 * // { boolean }
 */
export function isType(value, type) {
    switch (type) {
        case 'string':
            return isString(value) || isDate(value);
        case 'number':
            return isNumber(value);
        case 'integer':
            return isInteger(value);
        case 'boolean':
            return isBoolean(value);
        case 'null':
            return !hasValue(value);
        default:
            console.error(`isType error: "${type}" is not a recognized type.`);
            return null;
    }
}
/**
 * 'isPrimitive' function
 *
 * Checks wether an input value is a JavaScript primitive type:
 * string, number, boolean, or null.
 *
 * //   value - value to check
 * // { boolean }
 */
export function isPrimitive(value) {
    return (isString(value) || isNumber(value) ||
        isBoolean(value, 'strict') || value === null);
}
/**
 *
 * @param date
 * @returns {string}
 * exmaple:
 * toDateString('2018-01-01') = '2018-01-01'
 * toDateString('2018-01-30T00:00:00.000Z') = '2018-01-30'
 */
export const toIsoString = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
};
/**
 * 'toJavaScriptType' function
 *
 * Converts an input (probably string) value to a JavaScript primitive type -
 * 'string', 'number', 'boolean', or 'null' - before storing in a JSON object.
 *
 * Does not coerce values (other than null), and only converts the types
 * of values that would otherwise be valid.
 *
 * If the optional third parameter 'strictIntegers' is TRUE, and the
 * JSON Schema type 'integer' is specified, it also verifies the input value
 * is an integer and, if it is, returns it as a JaveScript number.
 * If 'strictIntegers' is FALSE (or not set) the type 'integer' is treated
 * exactly the same as 'number', and allows decimals.
 *
 * Valid Examples:
 * toJavaScriptType('10',   'number' ) = 10   // '10'   is a number
 * toJavaScriptType('10',   'integer') = 10   // '10'   is also an integer
 * toJavaScriptType( 10,    'integer') = 10   //  10    is still an integer
 * toJavaScriptType( 10,    'string' ) = '10' //  10    can be made into a string
 * toJavaScriptType('10.5', 'number' ) = 10.5 // '10.5' is a number
 *
 * Invalid Examples:
 * toJavaScriptType('10.5', 'integer') = null // '10.5' is not an integer
 * toJavaScriptType( 10.5,  'integer') = null //  10.5  is still not an integer
 *
 * //  { PrimitiveValue } value - value to convert
 * //  { SchemaPrimitiveType | SchemaPrimitiveType[] } types - types to convert to
 * //  { boolean = false } strictIntegers - if FALSE, treat integers as numbers
 * // { PrimitiveValue }
 */
export function toJavaScriptType(value, types, strictIntegers = true) {
    if (!isDefined(value)) {
        return null;
    }
    if (isString(types)) {
        types = [types];
    }
    if (strictIntegers && inArray('integer', types)) {
        if (isInteger(value, 'strict')) {
            return value;
        }
        if (isInteger(value)) {
            return parseInt(value, 10);
        }
    }
    if (inArray('number', types) || (!strictIntegers && inArray('integer', types))) {
        if (isNumber(value, 'strict')) {
            return value;
        }
        if (isNumber(value)) {
            return parseFloat(value);
        }
    }
    if (inArray('string', types)) {
        if (isString(value)) {
            return value;
        }
        // If value is a date, and types includes 'string',
        // convert the date to a string
        if (isDate(value)) {
            return toIsoString(value);
        }
        if (isNumber(value)) {
            return value.toString();
        }
    }
    // If value is a date, and types includes 'integer' or 'number',
    // but not 'string', convert the date to a number
    if (isDate(value) && (inArray('integer', types) || inArray('number', types))) {
        return value.getTime();
    }
    if (inArray('boolean', types)) {
        if (isBoolean(value, true)) {
            return true;
        }
        if (isBoolean(value, false)) {
            return false;
        }
    }
    return null;
}
/**
 * 'toSchemaType' function
 *
 * Converts an input (probably string) value to the "best" JavaScript
 * equivalent available from an allowed list of JSON Schema types, which may
 * contain 'string', 'number', 'integer', 'boolean', and/or 'null'.
 * If necssary, it does progressively agressive type coersion.
 * It will not return null unless null is in the list of allowed types.
 *
 * Number conversion examples:
 * toSchemaType('10', ['number','integer','string']) = 10 // integer
 * toSchemaType('10', ['number','string']) = 10 // number
 * toSchemaType('10', ['string']) = '10' // string
 * toSchemaType('10.5', ['number','integer','string']) = 10.5 // number
 * toSchemaType('10.5', ['integer','string']) = '10.5' // string
 * toSchemaType('10.5', ['integer']) = 10 // integer
 * toSchemaType(10.5, ['null','boolean','string']) = '10.5' // string
 * toSchemaType(10.5, ['null','boolean']) = true // boolean
 *
 * String conversion examples:
 * toSchemaType('1.5x', ['boolean','number','integer','string']) = '1.5x' // string
 * toSchemaType('1.5x', ['boolean','number','integer']) = '1.5' // number
 * toSchemaType('1.5x', ['boolean','integer']) = '1' // integer
 * toSchemaType('1.5x', ['boolean']) = true // boolean
 * toSchemaType('xyz', ['number','integer','boolean','null']) = true // boolean
 * toSchemaType('xyz', ['number','integer','null']) = null // null
 * toSchemaType('xyz', ['number','integer']) = 0 // number
 *
 * Boolean conversion examples:
 * toSchemaType('1', ['integer','number','string','boolean']) = 1 // integer
 * toSchemaType('1', ['number','string','boolean']) = 1 // number
 * toSchemaType('1', ['string','boolean']) = '1' // string
 * toSchemaType('1', ['boolean']) = true // boolean
 * toSchemaType('true', ['number','string','boolean']) = 'true' // string
 * toSchemaType('true', ['boolean']) = true // boolean
 * toSchemaType('true', ['number']) = 0 // number
 * toSchemaType(true, ['number','string','boolean']) = true // boolean
 * toSchemaType(true, ['number','string']) = 'true' // string
 * toSchemaType(true, ['number']) = 1 // number
 *
 * //  { PrimitiveValue } value - value to convert
 * //  { SchemaPrimitiveType | SchemaPrimitiveType[] } types - allowed types to convert to
 * // { PrimitiveValue }
 */
export function toSchemaType(value, types) {
    if (!isArray(types)) {
        types = [types];
    }
    if (types.includes('null') && !hasValue(value)) {
        return null;
    }
    if (types.includes('boolean') && !isBoolean(value, 'strict')) {
        return value;
    }
    if (types.includes('integer')) {
        const testValue = toJavaScriptType(value, 'integer');
        if (testValue !== null) {
            return +testValue;
        }
    }
    if (types.includes('number')) {
        const testValue = toJavaScriptType(value, 'number');
        if (testValue !== null) {
            return +testValue;
        }
    }
    if ((isString(value) || isNumber(value, 'strict')) &&
        types.includes('string')) { // Convert number to string
        return toJavaScriptType(value, 'string');
    }
    if (types.includes('boolean') && isBoolean(value)) {
        return toJavaScriptType(value, 'boolean');
    }
    if (types.includes('string')) { // Convert null & boolean to string
        if (value === null) {
            return '';
        }
        const testValue = toJavaScriptType(value, 'string');
        if (testValue !== null) {
            return testValue;
        }
    }
    if ((types.includes('number') ||
        types.includes('integer'))) {
        if (value === true) {
            return 1;
        } // Convert boolean & null to number
        if (value === false || value === null || value === '') {
            return 0;
        }
    }
    if (types.includes('number')) { // Convert mixed string to number
        const testValue = parseFloat(value);
        if (!!testValue) {
            return testValue;
        }
    }
    if (types.includes('integer')) { // Convert string or number to integer
        const testValue = parseInt(value, 10);
        if (!!testValue) {
            return testValue;
        }
    }
    if (types.includes('boolean')) { // Convert anything to boolean
        return !!value;
    }
    if ((types.includes('number') ||
        types.includes('integer')) && !types.includes('null')) {
        return 0; // If null not allowed, return 0 for non-convertable values
    }
}
/**
 * 'isPromise' function
 *
 * //   object
 * // { boolean }
 */
export function isPromise(object) {
    return !!object && typeof object.then === 'function';
}
/**
 * 'isObservable' function
 *
 * //   object
 * // { boolean }
 */
export function isObservable(object) {
    return !!object && typeof object.subscribe === 'function';
}
/**
 * '_toPromise' function
 *
 * //  { object } object
 * // { Promise<any> }
 */
export function _toPromise(object) {
    return isPromise(object) ? object : object.toPromise();
}
/**
 * 'toObservable' function
 *
 * //  { object } object
 * // { Observable<any> }
 */
export function toObservable(object) {
    const observable = isPromise(object) ? from(object) : object;
    if (isObservable(observable)) {
        return observable;
    }
    console.error('toObservable error: Expected validator to return Promise or Observable.');
    return new Observable();
}
/**
 * 'inArray' function
 *
 * Searches an array for an item, or one of a list of items, and returns true
 * as soon as a match is found, or false if no match.
 *
 * If the optional third parameter allIn is set to TRUE, and the item to find
 * is an array, then the function returns true only if all elements from item
 * are found in the array list, and false if any element is not found. If the
 * item to find is not an array, setting allIn to TRUE has no effect.
 *
 * //  { any|any[] } item - the item to search for
 * //   array - the array to search
 * //  { boolean = false } allIn - if TRUE, all items must be in array
 * // { boolean } - true if item(s) in array, false otherwise
 */
export function inArray(item, array, allIn = false) {
    if (!isDefined(item) || !isArray(array)) {
        return false;
    }
    return isArray(item) ?
        item[allIn ? 'every' : 'some'](subItem => array.includes(subItem)) :
        array.includes(item);
}
/**
 * 'xor' utility function - exclusive or
 *
 * Returns true if exactly one of two values is truthy.
 *
 * //   value1 - first value to check
 * //   value2 - second value to check
 * // { boolean } - true if exactly one input value is truthy, false if not
 */
export function xor(value1, value2) {
    return (!!value1 && !value2) || (!value1 && !!value2);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLmZ1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWZvcm13b3Jrcy1jb3JlL3NyYy9saWIvc2hhcmVkL3ZhbGlkYXRvci5mdW5jdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFnRHhDOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxHQUFHLEtBQUs7SUFDcEUsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sVUFBVSx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sR0FBRyxLQUFLO0lBQ3pFLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxVQUFVLGFBQWEsQ0FBQyxHQUFHLE9BQU87SUFDdEMsTUFBTSxZQUFZLEdBQWdCLEVBQUcsQ0FBQztJQUN0QyxLQUFLLE1BQU0sYUFBYSxJQUFJLE9BQU8sRUFBRTtRQUNuQyxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUMzQixLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQzVDLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLEdB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Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxNQUFNLFVBQVUsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLEtBQUs7SUFDaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUFFLE9BQU8sS0FBSyxDQUFDO0tBQUU7SUFDMUQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNO0lBQ2hDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0Q29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IGZyb20sIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBWYWxpZGF0b3IgdXRpbGl0eSBmdW5jdGlvbiBsaWJyYXJ5OlxuICpcbiAqIFZhbGlkYXRvciBhbmQgZXJyb3IgdXRpbGl0aWVzOlxuICogICBfZXhlY3V0ZVZhbGlkYXRvcnMsIF9leGVjdXRlQXN5bmNWYWxpZGF0b3JzLCBfbWVyZ2VPYmplY3RzLCBfbWVyZ2VFcnJvcnNcbiAqXG4gKiBJbmRpdmlkdWFsIHZhbHVlIGNoZWNraW5nOlxuICogICBpc0RlZmluZWQsIGhhc1ZhbHVlLCBpc0VtcHR5XG4gKlxuICogSW5kaXZpZHVhbCB0eXBlIGNoZWNraW5nOlxuICogICBpc1N0cmluZywgaXNOdW1iZXIsIGlzSW50ZWdlciwgaXNCb29sZWFuLCBpc0Z1bmN0aW9uLCBpc09iamVjdCwgaXNBcnJheSxcbiAqICAgaXNNYXAsIGlzU2V0LCBpc1Byb21pc2UsIGlzT2JzZXJ2YWJsZVxuICpcbiAqIE11bHRpcGxlIHR5cGUgY2hlY2tpbmcgYW5kIGZpeGluZzpcbiAqICAgZ2V0VHlwZSwgaXNUeXBlLCBpc1ByaW1pdGl2ZSwgdG9KYXZhU2NyaXB0VHlwZSwgdG9TY2hlbWFUeXBlLFxuICogICBfdG9Qcm9taXNlLCB0b09ic2VydmFibGVcbiAqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uczpcbiAqICAgaW5BcnJheSwgeG9yXG4gKlxuICogVHlwZXNjcmlwdCB0eXBlcyBhbmQgaW50ZXJmYWNlczpcbiAqICAgU2NoZW1hUHJpbWl0aXZlVHlwZSwgU2NoZW1hVHlwZSwgSmF2YVNjcmlwdFByaW1pdGl2ZVR5cGUsIEphdmFTY3JpcHRUeXBlLFxuICogICBQcmltaXRpdmVWYWx1ZSwgUGxhaW5PYmplY3QsIElWYWxpZGF0b3JGbiwgQXN5bmNJVmFsaWRhdG9yRm5cbiAqXG4gKiBOb3RlOiAnSVZhbGlkYXRvckZuJyBpcyBzaG9ydCBmb3IgJ2ludmVydGFibGUgdmFsaWRhdG9yIGZ1bmN0aW9uJyxcbiAqICAgd2hpY2ggaXMgYSB2YWxpZGF0b3IgZnVuY3Rpb25zIHRoYXQgYWNjZXB0cyBhbiBvcHRpb25hbCBzZWNvbmRcbiAqICAgYXJndW1lbnQgd2hpY2gsIGlmIHNldCB0byBUUlVFLCBjYXVzZXMgdGhlIHZhbGlkYXRvciB0byBwZXJmb3JtXG4gKiAgIHRoZSBvcHBvc2l0ZSBvZiBpdHMgb3JpZ2luYWwgZnVuY3Rpb24uXG4gKi9cblxuZXhwb3J0IHR5cGUgU2NoZW1hUHJpbWl0aXZlVHlwZSA9XG4gICdzdHJpbmcnIHwgJ251bWJlcicgfCAnaW50ZWdlcicgfCAnYm9vbGVhbicgfCAnbnVsbCc7XG5leHBvcnQgdHlwZSBTY2hlbWFUeXBlID1cbiAgJ3N0cmluZycgfCAnbnVtYmVyJyB8ICdpbnRlZ2VyJyB8ICdib29sZWFuJyB8ICdudWxsJyB8ICdvYmplY3QnIHwgJ2FycmF5JztcbmV4cG9ydCB0eXBlIEphdmFTY3JpcHRQcmltaXRpdmVUeXBlID1cbiAgJ3N0cmluZycgfCAnbnVtYmVyJyB8ICdib29sZWFuJyB8ICdudWxsJyB8ICd1bmRlZmluZWQnO1xuZXhwb3J0IHR5cGUgSmF2YVNjcmlwdFR5cGUgPVxuICAnc3RyaW5nJyB8ICdudW1iZXInIHwgJ2Jvb2xlYW4nIHwgJ251bGwnIHwgJ3VuZGVmaW5lZCcgfCAnb2JqZWN0JyB8ICdhcnJheScgfFxuICAnbWFwJyB8ICdzZXQnIHwgJ2FyZ3VtZW50cycgfCAnZGF0ZScgfCAnZXJyb3InIHwgJ2Z1bmN0aW9uJyB8ICdqc29uJyB8XG4gICdtYXRoJyB8ICdyZWdleHAnOyAvLyBOb3RlOiB0aGlzIGxpc3QgaXMgaW5jb21wbGV0ZVxuZXhwb3J0IHR5cGUgUHJpbWl0aXZlVmFsdWUgPSBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZDtcbmV4cG9ydCBpbnRlcmZhY2UgUGxhaW5PYmplY3QgeyBbazogc3RyaW5nXTogYW55OyB9XG5cbmV4cG9ydCB0eXBlIElWYWxpZGF0b3JGbiA9IChjOiBBYnN0cmFjdENvbnRyb2wsIGk/OiBib29sZWFuKSA9PiBQbGFpbk9iamVjdDtcbmV4cG9ydCB0eXBlIEFzeW5jSVZhbGlkYXRvckZuID0gKGM6IEFic3RyYWN0Q29udHJvbCwgaT86IGJvb2xlYW4pID0+IGFueTtcblxuLyoqXG4gKiAnX2V4ZWN1dGVWYWxpZGF0b3JzJyB1dGlsaXR5IGZ1bmN0aW9uXG4gKlxuICogVmFsaWRhdGVzIGEgY29udHJvbCBhZ2FpbnN0IGFuIGFycmF5IG9mIHZhbGlkYXRvcnMsIGFuZCByZXR1cm5zXG4gKiBhbiBhcnJheSBvZiB0aGUgc2FtZSBsZW5ndGggY29udGFpbmluZyBhIGNvbWJpbmF0aW9uIG9mIGVycm9yIG1lc3NhZ2VzXG4gKiAoZnJvbSBpbnZhbGlkIHZhbGlkYXRvcnMpIGFuZCBudWxsIHZhbHVlcyAoZnJvbSB2YWxpZCB2YWxpZGF0b3JzKVxuICpcbiAqIC8vICB7IEFic3RyYWN0Q29udHJvbCB9IGNvbnRyb2wgLSBjb250cm9sIHRvIHZhbGlkYXRlXG4gKiAvLyAgeyBJVmFsaWRhdG9yRm5bXSB9IHZhbGlkYXRvcnMgLSBhcnJheSBvZiB2YWxpZGF0b3JzXG4gKiAvLyAgeyBib29sZWFuIH0gaW52ZXJ0IC0gaW52ZXJ0P1xuICogLy8geyBQbGFpbk9iamVjdFtdIH0gLSBhcnJheSBvZiBudWxscyBhbmQgZXJyb3IgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gX2V4ZWN1dGVWYWxpZGF0b3JzKGNvbnRyb2wsIHZhbGlkYXRvcnMsIGludmVydCA9IGZhbHNlKSB7XG4gIHJldHVybiB2YWxpZGF0b3JzLm1hcCh2YWxpZGF0b3IgPT4gdmFsaWRhdG9yKGNvbnRyb2wsIGludmVydCkpO1xufVxuXG4vKipcbiAqICdfZXhlY3V0ZUFzeW5jVmFsaWRhdG9ycycgdXRpbGl0eSBmdW5jdGlvblxuICpcbiAqIFZhbGlkYXRlcyBhIGNvbnRyb2wgYWdhaW5zdCBhbiBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JzLCBhbmQgcmV0dXJuc1xuICogYW4gYXJyYXkgb2Ygb2JzZXJ2YWJlIHJlc3VsdHMgb2YgdGhlIHNhbWUgbGVuZ3RoIGNvbnRhaW5pbmcgYSBjb21iaW5hdGlvbiBvZlxuICogZXJyb3IgbWVzc2FnZXMgKGZyb20gaW52YWxpZCB2YWxpZGF0b3JzKSBhbmQgbnVsbCB2YWx1ZXMgKGZyb20gdmFsaWQgb25lcylcbiAqXG4gKiAvLyAgeyBBYnN0cmFjdENvbnRyb2wgfSBjb250cm9sIC0gY29udHJvbCB0byB2YWxpZGF0ZVxuICogLy8gIHsgQXN5bmNJVmFsaWRhdG9yRm5bXSB9IHZhbGlkYXRvcnMgLSBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JzXG4gKiAvLyAgeyBib29sZWFuIH0gaW52ZXJ0IC0gaW52ZXJ0P1xuICogLy8gIC0gYXJyYXkgb2Ygb2JzZXJ2YWJsZSBudWxscyBhbmQgZXJyb3IgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gX2V4ZWN1dGVBc3luY1ZhbGlkYXRvcnMoY29udHJvbCwgdmFsaWRhdG9ycywgaW52ZXJ0ID0gZmFsc2UpIHtcbiAgcmV0dXJuIHZhbGlkYXRvcnMubWFwKHZhbGlkYXRvciA9PiB2YWxpZGF0b3IoY29udHJvbCwgaW52ZXJ0KSk7XG59XG5cbi8qKlxuICogJ19tZXJnZU9iamVjdHMnIHV0aWxpdHkgZnVuY3Rpb25cbiAqXG4gKiBSZWN1cnNpdmVseSBNZXJnZXMgb25lIG9yIG1vcmUgb2JqZWN0cyBpbnRvIGEgc2luZ2xlIG9iamVjdCB3aXRoIGNvbWJpbmVkIGtleXMuXG4gKiBBdXRvbWF0aWNhbGx5IGRldGVjdHMgYW5kIGlnbm9yZXMgbnVsbCBhbmQgdW5kZWZpbmVkIGlucHV0cy5cbiAqIEFsc28gZGV0ZWN0cyBkdXBsaWNhdGVkIGJvb2xlYW4gJ25vdCcga2V5cyBhbmQgWE9ScyB0aGVpciB2YWx1ZXMuXG4gKlxuICogLy8gIHsgUGxhaW5PYmplY3RbXSB9IG9iamVjdHMgLSBvbmUgb3IgbW9yZSBvYmplY3RzIHRvIG1lcmdlXG4gKiAvLyB7IFBsYWluT2JqZWN0IH0gLSBtZXJnZWQgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfbWVyZ2VPYmplY3RzKC4uLm9iamVjdHMpIHtcbiAgY29uc3QgbWVyZ2VkT2JqZWN0OiBQbGFpbk9iamVjdCA9IHsgfTtcbiAgZm9yIChjb25zdCBjdXJyZW50T2JqZWN0IG9mIG9iamVjdHMpIHtcbiAgICBpZiAoaXNPYmplY3QoY3VycmVudE9iamVjdCkpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGN1cnJlbnRPYmplY3QpKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRPYmplY3Rba2V5XTtcbiAgICAgICAgY29uc3QgbWVyZ2VkVmFsdWUgPSBtZXJnZWRPYmplY3Rba2V5XTtcbiAgICAgICAgbWVyZ2VkT2JqZWN0W2tleV0gPSAhaXNEZWZpbmVkKG1lcmdlZFZhbHVlKSA/IGN1cnJlbnRWYWx1ZSA6XG4gICAgICAgICAga2V5ID09PSAnbm90JyAmJiBpc0Jvb2xlYW4obWVyZ2VkVmFsdWUsICdzdHJpY3QnKSAmJlxuICAgICAgICAgICAgaXNCb29sZWFuKGN1cnJlbnRWYWx1ZSwgJ3N0cmljdCcpID8geG9yKG1lcmdlZFZhbHVlLCBjdXJyZW50VmFsdWUpIDpcbiAgICAgICAgICBnZXRUeXBlKG1lcmdlZFZhbHVlKSA9PT0gJ29iamVjdCcgJiYgZ2V0VHlwZShjdXJyZW50VmFsdWUpID09PSAnb2JqZWN0JyA/XG4gICAgICAgICAgICBfbWVyZ2VPYmplY3RzKG1lcmdlZFZhbHVlLCBjdXJyZW50VmFsdWUpIDpcbiAgICAgICAgICAgIGN1cnJlbnRWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1lcmdlZE9iamVjdDtcbn1cblxuLyoqXG4gKiAnX21lcmdlRXJyb3JzJyB1dGlsaXR5IGZ1bmN0aW9uXG4gKlxuICogTWVyZ2VzIGFuIGFycmF5IG9mIG9iamVjdHMuXG4gKiBVc2VkIGZvciBjb21iaW5pbmcgdGhlIHZhbGlkYXRvciBlcnJvcnMgcmV0dXJuZWQgZnJvbSAnZXhlY3V0ZVZhbGlkYXRvcnMnXG4gKlxuICogLy8gIHsgUGxhaW5PYmplY3RbXSB9IGFycmF5T2ZFcnJvcnMgLSBhcnJheSBvZiBvYmplY3RzXG4gKiAvLyB7IFBsYWluT2JqZWN0IH0gLSBtZXJnZWQgb2JqZWN0LCBvciBudWxsIGlmIG5vIHVzYWJsZSBpbnB1dCBvYmplY3Rjc1xuICovXG5leHBvcnQgZnVuY3Rpb24gX21lcmdlRXJyb3JzKGFycmF5T2ZFcnJvcnMpIHtcbiAgY29uc3QgbWVyZ2VkRXJyb3JzID0gX21lcmdlT2JqZWN0cyguLi5hcnJheU9mRXJyb3JzKTtcbiAgcmV0dXJuIGlzRW1wdHkobWVyZ2VkRXJyb3JzKSA/IG51bGwgOiBtZXJnZWRFcnJvcnM7XG59XG5cbi8qKlxuICogJ2lzRGVmaW5lZCcgdXRpbGl0eSBmdW5jdGlvblxuICpcbiAqIENoZWNrcyBpZiBhIHZhcmlhYmxlIGNvbnRhaW5zIGEgdmFsdWUgb2YgYW55IHR5cGUuXG4gKiBSZXR1cm5zIHRydWUgZXZlbiBmb3Igb3RoZXJ3aXNlICdmYWxzZXknIHZhbHVlcyBvZiAwLCAnJywgYW5kIGZhbHNlLlxuICpcbiAqIC8vICAgdmFsdWUgLSB0aGUgdmFsdWUgdG8gY2hlY2tcbiAqIC8vIHsgYm9vbGVhbiB9IC0gZmFsc2UgaWYgdW5kZWZpbmVkIG9yIG51bGwsIG90aGVyd2lzZSB0cnVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmluZWQodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGw7XG59XG5cbi8qKlxuICogJ2hhc1ZhbHVlJyB1dGlsaXR5IGZ1bmN0aW9uXG4gKlxuICogQ2hlY2tzIGlmIGEgdmFyaWFibGUgY29udGFpbnMgYSB2YWx1ZS5cbiAqIFJldHVycyBmYWxzZSBmb3IgbnVsbCwgdW5kZWZpbmVkLCBvciBhIHplcm8tbGVuZ3RoIHN0cm5nLCAnJyxcbiAqIG90aGVyd2lzZSByZXR1cm5zIHRydWUuXG4gKiAoU3RyaWN0ZXIgdGhhbiAnaXNEZWZpbmVkJyBiZWNhdXNlIGl0IGFsc28gcmV0dXJucyBmYWxzZSBmb3IgJycsXG4gKiB0aG91Z2ggaXQgc3RpbCByZXR1cm5zIHRydWUgZm9yIG90aGVyd2lzZSAnZmFsc2V5JyB2YWx1ZXMgMCBhbmQgZmFsc2UuKVxuICpcbiAqIC8vICAgdmFsdWUgLSB0aGUgdmFsdWUgdG8gY2hlY2tcbiAqIC8vIHsgYm9vbGVhbiB9IC0gZmFsc2UgaWYgdW5kZWZpbmVkLCBudWxsLCBvciAnJywgb3RoZXJ3aXNlIHRydWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc1ZhbHVlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSAnJztcbn1cblxuLyoqXG4gKiAnaXNFbXB0eScgdXRpbGl0eSBmdW5jdGlvblxuICpcbiAqIFNpbWlsYXIgdG8gIWhhc1ZhbHVlLCBidXQgYWxzbyByZXR1cm5zIHRydWUgZm9yIGVtcHR5IGFycmF5cyBhbmQgb2JqZWN0cy5cbiAqXG4gKiAvLyAgIHZhbHVlIC0gdGhlIHZhbHVlIHRvIGNoZWNrXG4gKiAvLyB7IGJvb2xlYW4gfSAtIGZhbHNlIGlmIHVuZGVmaW5lZCwgbnVsbCwgb3IgJycsIG90aGVyd2lzZSB0cnVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkgeyByZXR1cm4gIXZhbHVlLmxlbmd0aDsgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7IHJldHVybiAhT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aDsgfVxuICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gJyc7XG59XG5cbi8qKlxuICogJ2lzU3RyaW5nJyB1dGlsaXR5IGZ1bmN0aW9uXG4gKlxuICogQ2hlY2tzIGlmIGEgdmFsdWUgaXMgYSBzdHJpbmcuXG4gKlxuICogLy8gICB2YWx1ZSAtIHRoZSB2YWx1ZSB0byBjaGVja1xuICogLy8geyBib29sZWFuIH0gLSB0cnVlIGlmIHN0cmluZywgZmFsc2UgaWYgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiAnaXNOdW1iZXInIHV0aWxpdHkgZnVuY3Rpb25cbiAqXG4gKiBDaGVja3MgaWYgYSB2YWx1ZSBpcyBhIHJlZ3VsYXIgbnVtYmVyLCBudW1lcmljIHN0cmluZywgb3IgSmF2YVNjcmlwdCBEYXRlLlxuICpcbiAqIC8vICAgdmFsdWUgLSB0aGUgdmFsdWUgdG8gY2hlY2tcbiAqIC8vICB7IGFueSA9IGZhbHNlIH0gc3RyaWN0IC0gaWYgdHJ1dGh5LCBhbHNvIGNoZWNrcyBKYXZhU2NyaXB0IHR5b2VcbiAqIC8vIHsgYm9vbGVhbiB9IC0gdHJ1ZSBpZiBudW1iZXIsIGZhbHNlIGlmIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUsIHN0cmljdDogYW55ID0gZmFsc2UpIHtcbiAgaWYgKHN0cmljdCAmJiB0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7IHJldHVybiBmYWxzZTsgfVxuICByZXR1cm4gIWlzTmFOKHZhbHVlKSAmJiB2YWx1ZSAhPT0gdmFsdWUgLyAwO1xufVxuXG4vKipcbiAqICdpc0ludGVnZXInIHV0aWxpdHkgZnVuY3Rpb25cbiAqXG4gKiBDaGVja3MgaWYgYSB2YWx1ZSBpcyBhbiBpbnRlZ2VyLlxuICpcbiAqIC8vICAgdmFsdWUgLSB0aGUgdmFsdWUgdG8gY2hlY2tcbiAqIC8vICB7IGFueSA9IGZhbHNlIH0gc3RyaWN0IC0gaWYgdHJ1dGh5LCBhbHNvIGNoZWNrcyBKYXZhU2NyaXB0IHR5b2VcbiAqIC8vIHtib29sZWFuIH0gLSB0cnVlIGlmIG51bWJlciwgZmFsc2UgaWYgbm90XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0ludGVnZXIodmFsdWUsIHN0cmljdDogYW55ID0gZmFsc2UpIHtcbiAgaWYgKHN0cmljdCAmJiB0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7IHJldHVybiBmYWxzZTsgfVxuICByZXR1cm4gIWlzTmFOKHZhbHVlKSAmJiAgdmFsdWUgIT09IHZhbHVlIC8gMCAmJiB2YWx1ZSAlIDEgPT09IDA7XG59XG5cbi8qKlxuICogJ2lzQm9vbGVhbicgdXRpbGl0eSBmdW5jdGlvblxuICpcbiAqIENoZWNrcyBpZiBhIHZhbHVlIGlzIGEgYm9vbGVhbi5cbiAqXG4gKiAvLyAgIHZhbHVlIC0gdGhlIHZhbHVlIHRvIGNoZWNrXG4gKiAvLyAgeyBhbnkgPSBudWxsIH0gb3B0aW9uIC0gaWYgJ3N0cmljdCcsIGFsc28gY2hlY2tzIEphdmFTY3JpcHQgdHlwZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBUUlVFIG9yIEZBTFNFLCBjaGVja3Mgb25seSBmb3IgdGhhdCB2YWx1ZVxuICogLy8geyBib29sZWFuIH0gLSB0cnVlIGlmIGJvb2xlYW4sIGZhbHNlIGlmIG5vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNCb29sZWFuKHZhbHVlLCBvcHRpb246IGFueSA9IG51bGwpIHtcbiAgaWYgKG9wdGlvbiA9PT0gJ3N0cmljdCcpIHsgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSBmYWxzZTsgfVxuICBpZiAob3B0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSAxIHx8IHZhbHVlID09PSAndHJ1ZScgfHwgdmFsdWUgPT09ICcxJztcbiAgfVxuICBpZiAob3B0aW9uID09PSBmYWxzZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IDAgfHwgdmFsdWUgPT09ICdmYWxzZScgfHwgdmFsdWUgPT09ICcwJztcbiAgfVxuICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IDEgfHwgdmFsdWUgPT09ICd0cnVlJyB8fCB2YWx1ZSA9PT0gJzEnIHx8XG4gICAgdmFsdWUgPT09IGZhbHNlIHx8IHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAnZmFsc2UnIHx8IHZhbHVlID09PSAnMCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKGl0ZW06IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdHlwZW9mIGl0ZW0gPT09ICdmdW5jdGlvbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChpdGVtOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIGl0ZW0gIT09IG51bGwgJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShpdGVtOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoaXRlbSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGUoaXRlbTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAhIWl0ZW0gJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZW0pID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc01hcChpdGVtOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuICEhaXRlbSAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaXRlbSkgPT09ICdbb2JqZWN0IE1hcF0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTZXQoaXRlbTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAhIWl0ZW0gJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZW0pID09PSAnW29iamVjdCBTZXRdJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3ltYm9sKGl0ZW06IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gdHlwZW9mIGl0ZW0gPT09ICdzeW1ib2wnO1xufVxuXG4vKipcbiAqICdnZXRUeXBlJyBmdW5jdGlvblxuICpcbiAqIERldGVjdHMgdGhlIEpTT04gU2NoZW1hIFR5cGUgb2YgYSB2YWx1ZS5cbiAqIEJ5IGRlZmF1bHQsIGRldGVjdHMgbnVtYmVycyBhbmQgaW50ZWdlcnMgZXZlbiBpZiBmb3JtYXR0ZWQgYXMgc3RyaW5ncy5cbiAqIChTbyBhbGwgaW50ZWdlcnMgYXJlIGFsc28gbnVtYmVycywgYW5kIGFueSBudW1iZXIgbWF5IGFsc28gYmUgYSBzdHJpbmcuKVxuICogSG93ZXZlciwgaXQgb25seSBkZXRlY3RzIHRydWUgYm9vbGVhbiB2YWx1ZXMgKHRvIGRldGVjdCBib29sZWFuIHZhbHVlc1xuICogaW4gbm9uLWJvb2xlYW4gZm9ybWF0cywgdXNlIGlzQm9vbGVhbigpIGluc3RlYWQpLlxuICpcbiAqIElmIHBhc3NlZCBhIHNlY29uZCBvcHRpb25hbCBwYXJhbWV0ZXIgb2YgJ3N0cmljdCcsIGl0IHdpbGwgb25seSBkZXRlY3RcbiAqIG51bWJlcnMgYW5kIGludGVnZXJzIGlmIHRoZXkgYXJlIGZvcm1hdHRlZCBhcyBKYXZhU2NyaXB0IG51bWJlcnMuXG4gKlxuICogRXhhbXBsZXM6XG4gKiBnZXRUeXBlKCcxMC41JykgPSAnbnVtYmVyJ1xuICogZ2V0VHlwZSgxMC41KSA9ICdudW1iZXInXG4gKiBnZXRUeXBlKCcxMCcpID0gJ2ludGVnZXInXG4gKiBnZXRUeXBlKDEwKSA9ICdpbnRlZ2VyJ1xuICogZ2V0VHlwZSgndHJ1ZScpID0gJ3N0cmluZydcbiAqIGdldFR5cGUodHJ1ZSkgPSAnYm9vbGVhbidcbiAqIGdldFR5cGUobnVsbCkgPSAnbnVsbCdcbiAqIGdldFR5cGUoeyB9KSA9ICdvYmplY3QnXG4gKiBnZXRUeXBlKFtdKSA9ICdhcnJheSdcbiAqXG4gKiBnZXRUeXBlKCcxMC41JywgJ3N0cmljdCcpID0gJ3N0cmluZydcbiAqIGdldFR5cGUoMTAuNSwgJ3N0cmljdCcpID0gJ251bWJlcidcbiAqIGdldFR5cGUoJzEwJywgJ3N0cmljdCcpID0gJ3N0cmluZydcbiAqIGdldFR5cGUoMTAsICdzdHJpY3QnKSA9ICdpbnRlZ2VyJ1xuICogZ2V0VHlwZSgndHJ1ZScsICdzdHJpY3QnKSA9ICdzdHJpbmcnXG4gKiBnZXRUeXBlKHRydWUsICdzdHJpY3QnKSA9ICdib29sZWFuJ1xuICpcbiAqIC8vICAgdmFsdWUgLSB2YWx1ZSB0byBjaGVja1xuICogLy8gIHsgYW55ID0gZmFsc2UgfSBzdHJpY3QgLSBpZiB0cnV0aHksIGFsc28gY2hlY2tzIEphdmFTY3JpcHQgdHlvZVxuICogLy8geyBTY2hlbWFUeXBlIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGUodmFsdWUsIHN0cmljdDogYW55ID0gZmFsc2UpIHtcbiAgaWYgKCFpc0RlZmluZWQodmFsdWUpKSB7IHJldHVybiAnbnVsbCc7IH1cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7IHJldHVybiAnYXJyYXknOyB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHsgcmV0dXJuICdvYmplY3QnOyB9XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUsICdzdHJpY3QnKSkgeyByZXR1cm4gJ2Jvb2xlYW4nOyB9XG4gIGlmIChpc0ludGVnZXIodmFsdWUsIHN0cmljdCkpIHsgcmV0dXJuICdpbnRlZ2VyJzsgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUsIHN0cmljdCkpIHsgcmV0dXJuICdudW1iZXInOyB9XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkgfHwgKCFzdHJpY3QgJiYgaXNEYXRlKHZhbHVlKSkpIHsgcmV0dXJuICdzdHJpbmcnOyB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqICdpc1R5cGUnIGZ1bmN0aW9uXG4gKlxuICogQ2hlY2tzIHdldGhlciBhbiBpbnB1dCAocHJvYmFibHkgc3RyaW5nKSB2YWx1ZSBjb250YWlucyBkYXRhIG9mXG4gKiBhIHNwZWNpZmllZCBKU09OIFNjaGVtYSB0eXBlXG4gKlxuICogLy8gIHsgUHJpbWl0aXZlVmFsdWUgfSB2YWx1ZSAtIHZhbHVlIHRvIGNoZWNrXG4gKiAvLyAgeyBTY2hlbWFQcmltaXRpdmVUeXBlIH0gdHlwZSAtIHR5cGUgdG8gY2hlY2tcbiAqIC8vIHsgYm9vbGVhbiB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1R5cGUodmFsdWUsIHR5cGUpIHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiBpc1N0cmluZyh2YWx1ZSkgfHwgaXNEYXRlKHZhbHVlKTtcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKTtcbiAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgIHJldHVybiBpc0ludGVnZXIodmFsdWUpO1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIGlzQm9vbGVhbih2YWx1ZSk7XG4gICAgY2FzZSAnbnVsbCc6XG4gICAgICByZXR1cm4gIWhhc1ZhbHVlKHZhbHVlKTtcbiAgICBkZWZhdWx0OlxuICAgICAgY29uc29sZS5lcnJvcihgaXNUeXBlIGVycm9yOiBcIiR7dHlwZX1cIiBpcyBub3QgYSByZWNvZ25pemVkIHR5cGUuYCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqICdpc1ByaW1pdGl2ZScgZnVuY3Rpb25cbiAqXG4gKiBDaGVja3Mgd2V0aGVyIGFuIGlucHV0IHZhbHVlIGlzIGEgSmF2YVNjcmlwdCBwcmltaXRpdmUgdHlwZTpcbiAqIHN0cmluZywgbnVtYmVyLCBib29sZWFuLCBvciBudWxsLlxuICpcbiAqIC8vICAgdmFsdWUgLSB2YWx1ZSB0byBjaGVja1xuICogLy8geyBib29sZWFuIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHJpbWl0aXZlKHZhbHVlKSB7XG4gIHJldHVybiAoaXNTdHJpbmcodmFsdWUpIHx8IGlzTnVtYmVyKHZhbHVlKSB8fFxuICAgIGlzQm9vbGVhbih2YWx1ZSwgJ3N0cmljdCcpIHx8IHZhbHVlID09PSBudWxsKTtcbn1cblxuLyoqXG4gKiBcbiAqIEBwYXJhbSBkYXRlIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqIGV4bWFwbGU6XG4gKiB0b0RhdGVTdHJpbmcoJzIwMTgtMDEtMDEnKSA9ICcyMDE4LTAxLTAxJ1xuICogdG9EYXRlU3RyaW5nKCcyMDE4LTAxLTMwVDAwOjAwOjAwLjAwMFonKSA9ICcyMDE4LTAxLTMwJ1xuICovXG5leHBvcnQgY29uc3QgdG9Jc29TdHJpbmcgPSAoZGF0ZTogRGF0ZSkgPT4ge1xuICBjb25zdCBkYXkgPSBkYXRlLmdldERhdGUoKTtcbiAgY29uc3QgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xuICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICByZXR1cm4gYCR7eWVhcn0tJHttb250aCA8IDEwID8gJzAnICsgbW9udGggOiBtb250aH0tJHtkYXkgPCAxMCA/ICcwJyArIGRheSA6IGRheX1gO1xufVxuXG4vKipcbiAqICd0b0phdmFTY3JpcHRUeXBlJyBmdW5jdGlvblxuICpcbiAqIENvbnZlcnRzIGFuIGlucHV0IChwcm9iYWJseSBzdHJpbmcpIHZhbHVlIHRvIGEgSmF2YVNjcmlwdCBwcmltaXRpdmUgdHlwZSAtXG4gKiAnc3RyaW5nJywgJ251bWJlcicsICdib29sZWFuJywgb3IgJ251bGwnIC0gYmVmb3JlIHN0b3JpbmcgaW4gYSBKU09OIG9iamVjdC5cbiAqXG4gKiBEb2VzIG5vdCBjb2VyY2UgdmFsdWVzIChvdGhlciB0aGFuIG51bGwpLCBhbmQgb25seSBjb252ZXJ0cyB0aGUgdHlwZXNcbiAqIG9mIHZhbHVlcyB0aGF0IHdvdWxkIG90aGVyd2lzZSBiZSB2YWxpZC5cbiAqXG4gKiBJZiB0aGUgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyICdzdHJpY3RJbnRlZ2VycycgaXMgVFJVRSwgYW5kIHRoZVxuICogSlNPTiBTY2hlbWEgdHlwZSAnaW50ZWdlcicgaXMgc3BlY2lmaWVkLCBpdCBhbHNvIHZlcmlmaWVzIHRoZSBpbnB1dCB2YWx1ZVxuICogaXMgYW4gaW50ZWdlciBhbmQsIGlmIGl0IGlzLCByZXR1cm5zIGl0IGFzIGEgSmF2ZVNjcmlwdCBudW1iZXIuXG4gKiBJZiAnc3RyaWN0SW50ZWdlcnMnIGlzIEZBTFNFIChvciBub3Qgc2V0KSB0aGUgdHlwZSAnaW50ZWdlcicgaXMgdHJlYXRlZFxuICogZXhhY3RseSB0aGUgc2FtZSBhcyAnbnVtYmVyJywgYW5kIGFsbG93cyBkZWNpbWFscy5cbiAqXG4gKiBWYWxpZCBFeGFtcGxlczpcbiAqIHRvSmF2YVNjcmlwdFR5cGUoJzEwJywgICAnbnVtYmVyJyApID0gMTAgICAvLyAnMTAnICAgaXMgYSBudW1iZXJcbiAqIHRvSmF2YVNjcmlwdFR5cGUoJzEwJywgICAnaW50ZWdlcicpID0gMTAgICAvLyAnMTAnICAgaXMgYWxzbyBhbiBpbnRlZ2VyXG4gKiB0b0phdmFTY3JpcHRUeXBlKCAxMCwgICAgJ2ludGVnZXInKSA9IDEwICAgLy8gIDEwICAgIGlzIHN0aWxsIGFuIGludGVnZXJcbiAqIHRvSmF2YVNjcmlwdFR5cGUoIDEwLCAgICAnc3RyaW5nJyApID0gJzEwJyAvLyAgMTAgICAgY2FuIGJlIG1hZGUgaW50byBhIHN0cmluZ1xuICogdG9KYXZhU2NyaXB0VHlwZSgnMTAuNScsICdudW1iZXInICkgPSAxMC41IC8vICcxMC41JyBpcyBhIG51bWJlclxuICpcbiAqIEludmFsaWQgRXhhbXBsZXM6XG4gKiB0b0phdmFTY3JpcHRUeXBlKCcxMC41JywgJ2ludGVnZXInKSA9IG51bGwgLy8gJzEwLjUnIGlzIG5vdCBhbiBpbnRlZ2VyXG4gKiB0b0phdmFTY3JpcHRUeXBlKCAxMC41LCAgJ2ludGVnZXInKSA9IG51bGwgLy8gIDEwLjUgIGlzIHN0aWxsIG5vdCBhbiBpbnRlZ2VyXG4gKlxuICogLy8gIHsgUHJpbWl0aXZlVmFsdWUgfSB2YWx1ZSAtIHZhbHVlIHRvIGNvbnZlcnRcbiAqIC8vICB7IFNjaGVtYVByaW1pdGl2ZVR5cGUgfCBTY2hlbWFQcmltaXRpdmVUeXBlW10gfSB0eXBlcyAtIHR5cGVzIHRvIGNvbnZlcnQgdG9cbiAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IHN0cmljdEludGVnZXJzIC0gaWYgRkFMU0UsIHRyZWF0IGludGVnZXJzIGFzIG51bWJlcnNcbiAqIC8vIHsgUHJpbWl0aXZlVmFsdWUgfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9KYXZhU2NyaXB0VHlwZSh2YWx1ZSwgdHlwZXMsIHN0cmljdEludGVnZXJzID0gdHJ1ZSkgIHtcbiAgaWYgKCFpc0RlZmluZWQodmFsdWUpKSB7IHJldHVybiBudWxsOyB9XG4gIGlmIChpc1N0cmluZyh0eXBlcykpIHsgdHlwZXMgPSBbdHlwZXNdOyB9XG4gIGlmIChzdHJpY3RJbnRlZ2VycyAmJiBpbkFycmF5KCdpbnRlZ2VyJywgdHlwZXMpKSB7XG4gICAgaWYgKGlzSW50ZWdlcih2YWx1ZSwgJ3N0cmljdCcpKSB7IHJldHVybiB2YWx1ZTsgfVxuICAgIGlmIChpc0ludGVnZXIodmFsdWUpKSB7IHJldHVybiBwYXJzZUludCh2YWx1ZSwgMTApOyB9XG4gIH1cbiAgaWYgKGluQXJyYXkoJ251bWJlcicsIHR5cGVzKSB8fCAoIXN0cmljdEludGVnZXJzICYmIGluQXJyYXkoJ2ludGVnZXInLCB0eXBlcykpKSB7XG4gICAgaWYgKGlzTnVtYmVyKHZhbHVlLCAnc3RyaWN0JykpIHsgcmV0dXJuIHZhbHVlOyB9XG4gICAgaWYgKGlzTnVtYmVyKHZhbHVlKSkgeyByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7IH1cbiAgfVxuICBpZiAoaW5BcnJheSgnc3RyaW5nJywgdHlwZXMpKSB7XG4gICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkgeyByZXR1cm4gdmFsdWU7IH1cbiAgICAvLyBJZiB2YWx1ZSBpcyBhIGRhdGUsIGFuZCB0eXBlcyBpbmNsdWRlcyAnc3RyaW5nJyxcbiAgICAvLyBjb252ZXJ0IHRoZSBkYXRlIHRvIGEgc3RyaW5nXG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHsgcmV0dXJuIHRvSXNvU3RyaW5nKHZhbHVlKTsgfVxuICAgIGlmIChpc051bWJlcih2YWx1ZSkpIHsgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7IH1cbiAgfVxuICAvLyBJZiB2YWx1ZSBpcyBhIGRhdGUsIGFuZCB0eXBlcyBpbmNsdWRlcyAnaW50ZWdlcicgb3IgJ251bWJlcicsXG4gIC8vIGJ1dCBub3QgJ3N0cmluZycsIGNvbnZlcnQgdGhlIGRhdGUgdG8gYSBudW1iZXJcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkgJiYgKGluQXJyYXkoJ2ludGVnZXInLCB0eXBlcykgfHwgaW5BcnJheSgnbnVtYmVyJywgdHlwZXMpKSkge1xuICAgIHJldHVybiB2YWx1ZS5nZXRUaW1lKCk7XG4gIH1cbiAgaWYgKGluQXJyYXkoJ2Jvb2xlYW4nLCB0eXBlcykpIHtcbiAgICBpZiAoaXNCb29sZWFuKHZhbHVlLCB0cnVlKSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIGlmIChpc0Jvb2xlYW4odmFsdWUsIGZhbHNlKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiAndG9TY2hlbWFUeXBlJyBmdW5jdGlvblxuICpcbiAqIENvbnZlcnRzIGFuIGlucHV0IChwcm9iYWJseSBzdHJpbmcpIHZhbHVlIHRvIHRoZSBcImJlc3RcIiBKYXZhU2NyaXB0XG4gKiBlcXVpdmFsZW50IGF2YWlsYWJsZSBmcm9tIGFuIGFsbG93ZWQgbGlzdCBvZiBKU09OIFNjaGVtYSB0eXBlcywgd2hpY2ggbWF5XG4gKiBjb250YWluICdzdHJpbmcnLCAnbnVtYmVyJywgJ2ludGVnZXInLCAnYm9vbGVhbicsIGFuZC9vciAnbnVsbCcuXG4gKiBJZiBuZWNzc2FyeSwgaXQgZG9lcyBwcm9ncmVzc2l2ZWx5IGFncmVzc2l2ZSB0eXBlIGNvZXJzaW9uLlxuICogSXQgd2lsbCBub3QgcmV0dXJuIG51bGwgdW5sZXNzIG51bGwgaXMgaW4gdGhlIGxpc3Qgb2YgYWxsb3dlZCB0eXBlcy5cbiAqXG4gKiBOdW1iZXIgY29udmVyc2lvbiBleGFtcGxlczpcbiAqIHRvU2NoZW1hVHlwZSgnMTAnLCBbJ251bWJlcicsJ2ludGVnZXInLCdzdHJpbmcnXSkgPSAxMCAvLyBpbnRlZ2VyXG4gKiB0b1NjaGVtYVR5cGUoJzEwJywgWydudW1iZXInLCdzdHJpbmcnXSkgPSAxMCAvLyBudW1iZXJcbiAqIHRvU2NoZW1hVHlwZSgnMTAnLCBbJ3N0cmluZyddKSA9ICcxMCcgLy8gc3RyaW5nXG4gKiB0b1NjaGVtYVR5cGUoJzEwLjUnLCBbJ251bWJlcicsJ2ludGVnZXInLCdzdHJpbmcnXSkgPSAxMC41IC8vIG51bWJlclxuICogdG9TY2hlbWFUeXBlKCcxMC41JywgWydpbnRlZ2VyJywnc3RyaW5nJ10pID0gJzEwLjUnIC8vIHN0cmluZ1xuICogdG9TY2hlbWFUeXBlKCcxMC41JywgWydpbnRlZ2VyJ10pID0gMTAgLy8gaW50ZWdlclxuICogdG9TY2hlbWFUeXBlKDEwLjUsIFsnbnVsbCcsJ2Jvb2xlYW4nLCdzdHJpbmcnXSkgPSAnMTAuNScgLy8gc3RyaW5nXG4gKiB0b1NjaGVtYVR5cGUoMTAuNSwgWydudWxsJywnYm9vbGVhbiddKSA9IHRydWUgLy8gYm9vbGVhblxuICpcbiAqIFN0cmluZyBjb252ZXJzaW9uIGV4YW1wbGVzOlxuICogdG9TY2hlbWFUeXBlKCcxLjV4JywgWydib29sZWFuJywnbnVtYmVyJywnaW50ZWdlcicsJ3N0cmluZyddKSA9ICcxLjV4JyAvLyBzdHJpbmdcbiAqIHRvU2NoZW1hVHlwZSgnMS41eCcsIFsnYm9vbGVhbicsJ251bWJlcicsJ2ludGVnZXInXSkgPSAnMS41JyAvLyBudW1iZXJcbiAqIHRvU2NoZW1hVHlwZSgnMS41eCcsIFsnYm9vbGVhbicsJ2ludGVnZXInXSkgPSAnMScgLy8gaW50ZWdlclxuICogdG9TY2hlbWFUeXBlKCcxLjV4JywgWydib29sZWFuJ10pID0gdHJ1ZSAvLyBib29sZWFuXG4gKiB0b1NjaGVtYVR5cGUoJ3h5eicsIFsnbnVtYmVyJywnaW50ZWdlcicsJ2Jvb2xlYW4nLCdudWxsJ10pID0gdHJ1ZSAvLyBib29sZWFuXG4gKiB0b1NjaGVtYVR5cGUoJ3h5eicsIFsnbnVtYmVyJywnaW50ZWdlcicsJ251bGwnXSkgPSBudWxsIC8vIG51bGxcbiAqIHRvU2NoZW1hVHlwZSgneHl6JywgWydudW1iZXInLCdpbnRlZ2VyJ10pID0gMCAvLyBudW1iZXJcbiAqXG4gKiBCb29sZWFuIGNvbnZlcnNpb24gZXhhbXBsZXM6XG4gKiB0b1NjaGVtYVR5cGUoJzEnLCBbJ2ludGVnZXInLCdudW1iZXInLCdzdHJpbmcnLCdib29sZWFuJ10pID0gMSAvLyBpbnRlZ2VyXG4gKiB0b1NjaGVtYVR5cGUoJzEnLCBbJ251bWJlcicsJ3N0cmluZycsJ2Jvb2xlYW4nXSkgPSAxIC8vIG51bWJlclxuICogdG9TY2hlbWFUeXBlKCcxJywgWydzdHJpbmcnLCdib29sZWFuJ10pID0gJzEnIC8vIHN0cmluZ1xuICogdG9TY2hlbWFUeXBlKCcxJywgWydib29sZWFuJ10pID0gdHJ1ZSAvLyBib29sZWFuXG4gKiB0b1NjaGVtYVR5cGUoJ3RydWUnLCBbJ251bWJlcicsJ3N0cmluZycsJ2Jvb2xlYW4nXSkgPSAndHJ1ZScgLy8gc3RyaW5nXG4gKiB0b1NjaGVtYVR5cGUoJ3RydWUnLCBbJ2Jvb2xlYW4nXSkgPSB0cnVlIC8vIGJvb2xlYW5cbiAqIHRvU2NoZW1hVHlwZSgndHJ1ZScsIFsnbnVtYmVyJ10pID0gMCAvLyBudW1iZXJcbiAqIHRvU2NoZW1hVHlwZSh0cnVlLCBbJ251bWJlcicsJ3N0cmluZycsJ2Jvb2xlYW4nXSkgPSB0cnVlIC8vIGJvb2xlYW5cbiAqIHRvU2NoZW1hVHlwZSh0cnVlLCBbJ251bWJlcicsJ3N0cmluZyddKSA9ICd0cnVlJyAvLyBzdHJpbmdcbiAqIHRvU2NoZW1hVHlwZSh0cnVlLCBbJ251bWJlciddKSA9IDEgLy8gbnVtYmVyXG4gKlxuICogLy8gIHsgUHJpbWl0aXZlVmFsdWUgfSB2YWx1ZSAtIHZhbHVlIHRvIGNvbnZlcnRcbiAqIC8vICB7IFNjaGVtYVByaW1pdGl2ZVR5cGUgfCBTY2hlbWFQcmltaXRpdmVUeXBlW10gfSB0eXBlcyAtIGFsbG93ZWQgdHlwZXMgdG8gY29udmVydCB0b1xuICogLy8geyBQcmltaXRpdmVWYWx1ZSB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1NjaGVtYVR5cGUodmFsdWUsIHR5cGVzKSB7XG4gIGlmICghaXNBcnJheSg8U2NoZW1hUHJpbWl0aXZlVHlwZT50eXBlcykpIHtcbiAgICB0eXBlcyA9IDxTY2hlbWFQcmltaXRpdmVUeXBlW10+W3R5cGVzXTtcbiAgfVxuICBpZiAoKDxTY2hlbWFQcmltaXRpdmVUeXBlW10+dHlwZXMpLmluY2x1ZGVzKCdudWxsJykgJiYgIWhhc1ZhbHVlKHZhbHVlKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmICgoPFNjaGVtYVByaW1pdGl2ZVR5cGVbXT50eXBlcykuaW5jbHVkZXMoJ2Jvb2xlYW4nKSAmJiAhaXNCb29sZWFuKHZhbHVlLCAnc3RyaWN0JykpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKCg8U2NoZW1hUHJpbWl0aXZlVHlwZVtdPnR5cGVzKS5pbmNsdWRlcygnaW50ZWdlcicpKSB7XG4gICAgY29uc3QgdGVzdFZhbHVlID0gdG9KYXZhU2NyaXB0VHlwZSh2YWx1ZSwgJ2ludGVnZXInKTtcbiAgICBpZiAodGVzdFZhbHVlICE9PSBudWxsKSB7IHJldHVybiArdGVzdFZhbHVlOyB9XG4gIH1cbiAgaWYgKCg8U2NoZW1hUHJpbWl0aXZlVHlwZVtdPnR5cGVzKS5pbmNsdWRlcygnbnVtYmVyJykpIHtcbiAgICBjb25zdCB0ZXN0VmFsdWUgPSB0b0phdmFTY3JpcHRUeXBlKHZhbHVlLCAnbnVtYmVyJyk7XG4gICAgaWYgKHRlc3RWYWx1ZSAhPT0gbnVsbCkgeyByZXR1cm4gK3Rlc3RWYWx1ZTsgfVxuICB9XG4gIGlmIChcbiAgICAoaXNTdHJpbmcodmFsdWUpIHx8IGlzTnVtYmVyKHZhbHVlLCAnc3RyaWN0JykpICYmXG4gICAgKDxTY2hlbWFQcmltaXRpdmVUeXBlW10+dHlwZXMpLmluY2x1ZGVzKCdzdHJpbmcnKVxuICApIHsgLy8gQ29udmVydCBudW1iZXIgdG8gc3RyaW5nXG4gICAgcmV0dXJuIHRvSmF2YVNjcmlwdFR5cGUodmFsdWUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoKDxTY2hlbWFQcmltaXRpdmVUeXBlW10+dHlwZXMpLmluY2x1ZGVzKCdib29sZWFuJykgJiYgaXNCb29sZWFuKHZhbHVlKSkge1xuICAgIHJldHVybiB0b0phdmFTY3JpcHRUeXBlKHZhbHVlLCAnYm9vbGVhbicpO1xuICB9XG4gIGlmICgoPFNjaGVtYVByaW1pdGl2ZVR5cGVbXT50eXBlcykuaW5jbHVkZXMoJ3N0cmluZycpKSB7IC8vIENvbnZlcnQgbnVsbCAmIGJvb2xlYW4gdG8gc3RyaW5nXG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7IHJldHVybiAnJzsgfVxuICAgIGNvbnN0IHRlc3RWYWx1ZSA9IHRvSmF2YVNjcmlwdFR5cGUodmFsdWUsICdzdHJpbmcnKTtcbiAgICBpZiAodGVzdFZhbHVlICE9PSBudWxsKSB7IHJldHVybiB0ZXN0VmFsdWU7IH1cbiAgfVxuICBpZiAoKFxuICAgICg8U2NoZW1hUHJpbWl0aXZlVHlwZVtdPnR5cGVzKS5pbmNsdWRlcygnbnVtYmVyJykgfHxcbiAgICAoPFNjaGVtYVByaW1pdGl2ZVR5cGVbXT50eXBlcykuaW5jbHVkZXMoJ2ludGVnZXInKSlcbiAgKSB7XG4gICAgaWYgKHZhbHVlID09PSB0cnVlKSB7IHJldHVybiAxOyB9IC8vIENvbnZlcnQgYm9vbGVhbiAmIG51bGwgdG8gbnVtYmVyXG4gICAgaWYgKHZhbHVlID09PSBmYWxzZSB8fCB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gJycpIHsgcmV0dXJuIDA7IH1cbiAgfVxuICBpZiAoKDxTY2hlbWFQcmltaXRpdmVUeXBlW10+dHlwZXMpLmluY2x1ZGVzKCdudW1iZXInKSkgeyAvLyBDb252ZXJ0IG1peGVkIHN0cmluZyB0byBudW1iZXJcbiAgICBjb25zdCB0ZXN0VmFsdWUgPSBwYXJzZUZsb2F0KDxzdHJpbmc+dmFsdWUpO1xuICAgIGlmICghIXRlc3RWYWx1ZSkgeyByZXR1cm4gdGVzdFZhbHVlOyB9XG4gIH1cbiAgaWYgKCg8U2NoZW1hUHJpbWl0aXZlVHlwZVtdPnR5cGVzKS5pbmNsdWRlcygnaW50ZWdlcicpKSB7IC8vIENvbnZlcnQgc3RyaW5nIG9yIG51bWJlciB0byBpbnRlZ2VyXG4gICAgY29uc3QgdGVzdFZhbHVlID0gcGFyc2VJbnQoPHN0cmluZz52YWx1ZSwgMTApO1xuICAgIGlmICghIXRlc3RWYWx1ZSkgeyByZXR1cm4gdGVzdFZhbHVlOyB9XG4gIH1cbiAgaWYgKCg8U2NoZW1hUHJpbWl0aXZlVHlwZVtdPnR5cGVzKS5pbmNsdWRlcygnYm9vbGVhbicpKSB7IC8vIENvbnZlcnQgYW55dGhpbmcgdG8gYm9vbGVhblxuICAgIHJldHVybiAhIXZhbHVlO1xuICB9XG4gIGlmICgoXG4gICAgICAoPFNjaGVtYVByaW1pdGl2ZVR5cGVbXT50eXBlcykuaW5jbHVkZXMoJ251bWJlcicpIHx8XG4gICAgICAoPFNjaGVtYVByaW1pdGl2ZVR5cGVbXT50eXBlcykuaW5jbHVkZXMoJ2ludGVnZXInKVxuICAgICkgJiYgISg8U2NoZW1hUHJpbWl0aXZlVHlwZVtdPnR5cGVzKS5pbmNsdWRlcygnbnVsbCcpXG4gICkge1xuICAgIHJldHVybiAwOyAvLyBJZiBudWxsIG5vdCBhbGxvd2VkLCByZXR1cm4gMCBmb3Igbm9uLWNvbnZlcnRhYmxlIHZhbHVlc1xuICB9XG59XG5cbi8qKlxuICogJ2lzUHJvbWlzZScgZnVuY3Rpb25cbiAqXG4gKiAvLyAgIG9iamVjdFxuICogLy8geyBib29sZWFuIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvbWlzZShvYmplY3QpOiBvYmplY3QgaXMgUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuICEhb2JqZWN0ICYmIHR5cGVvZiBvYmplY3QudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLyoqXG4gKiAnaXNPYnNlcnZhYmxlJyBmdW5jdGlvblxuICpcbiAqIC8vICAgb2JqZWN0XG4gKiAvLyB7IGJvb2xlYW4gfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNPYnNlcnZhYmxlKG9iamVjdCk6IG9iamVjdCBpcyBPYnNlcnZhYmxlPGFueT4ge1xuICByZXR1cm4gISFvYmplY3QgJiYgdHlwZW9mIG9iamVjdC5zdWJzY3JpYmUgPT09ICdmdW5jdGlvbic7XG59XG5cbi8qKlxuICogJ190b1Byb21pc2UnIGZ1bmN0aW9uXG4gKlxuICogLy8gIHsgb2JqZWN0IH0gb2JqZWN0XG4gKiAvLyB7IFByb21pc2U8YW55PiB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfdG9Qcm9taXNlKG9iamVjdCk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBpc1Byb21pc2Uob2JqZWN0KSA/IG9iamVjdCA6IG9iamVjdC50b1Byb21pc2UoKTtcbn1cblxuLyoqXG4gKiAndG9PYnNlcnZhYmxlJyBmdW5jdGlvblxuICpcbiAqIC8vICB7IG9iamVjdCB9IG9iamVjdFxuICogLy8geyBPYnNlcnZhYmxlPGFueT4gfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9PYnNlcnZhYmxlKG9iamVjdCk6IE9ic2VydmFibGU8YW55PiB7XG4gIGNvbnN0IG9ic2VydmFibGUgPSBpc1Byb21pc2Uob2JqZWN0KSA/IGZyb20ob2JqZWN0KSA6IG9iamVjdDtcbiAgaWYgKGlzT2JzZXJ2YWJsZShvYnNlcnZhYmxlKSkgeyByZXR1cm4gb2JzZXJ2YWJsZTsgfVxuICBjb25zb2xlLmVycm9yKCd0b09ic2VydmFibGUgZXJyb3I6IEV4cGVjdGVkIHZhbGlkYXRvciB0byByZXR1cm4gUHJvbWlzZSBvciBPYnNlcnZhYmxlLicpO1xuICByZXR1cm4gbmV3IE9ic2VydmFibGUoKTtcbn1cblxuLyoqXG4gKiAnaW5BcnJheScgZnVuY3Rpb25cbiAqXG4gKiBTZWFyY2hlcyBhbiBhcnJheSBmb3IgYW4gaXRlbSwgb3Igb25lIG9mIGEgbGlzdCBvZiBpdGVtcywgYW5kIHJldHVybnMgdHJ1ZVxuICogYXMgc29vbiBhcyBhIG1hdGNoIGlzIGZvdW5kLCBvciBmYWxzZSBpZiBubyBtYXRjaC5cbiAqXG4gKiBJZiB0aGUgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyIGFsbEluIGlzIHNldCB0byBUUlVFLCBhbmQgdGhlIGl0ZW0gdG8gZmluZFxuICogaXMgYW4gYXJyYXksIHRoZW4gdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSBvbmx5IGlmIGFsbCBlbGVtZW50cyBmcm9tIGl0ZW1cbiAqIGFyZSBmb3VuZCBpbiB0aGUgYXJyYXkgbGlzdCwgYW5kIGZhbHNlIGlmIGFueSBlbGVtZW50IGlzIG5vdCBmb3VuZC4gSWYgdGhlXG4gKiBpdGVtIHRvIGZpbmQgaXMgbm90IGFuIGFycmF5LCBzZXR0aW5nIGFsbEluIHRvIFRSVUUgaGFzIG5vIGVmZmVjdC5cbiAqXG4gKiAvLyAgeyBhbnl8YW55W10gfSBpdGVtIC0gdGhlIGl0ZW0gdG8gc2VhcmNoIGZvclxuICogLy8gICBhcnJheSAtIHRoZSBhcnJheSB0byBzZWFyY2hcbiAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGFsbEluIC0gaWYgVFJVRSwgYWxsIGl0ZW1zIG11c3QgYmUgaW4gYXJyYXlcbiAqIC8vIHsgYm9vbGVhbiB9IC0gdHJ1ZSBpZiBpdGVtKHMpIGluIGFycmF5LCBmYWxzZSBvdGhlcndpc2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluQXJyYXkoaXRlbSwgYXJyYXksIGFsbEluID0gZmFsc2UpIHtcbiAgaWYgKCFpc0RlZmluZWQoaXRlbSkgfHwgIWlzQXJyYXkoYXJyYXkpKSB7IHJldHVybiBmYWxzZTsgfVxuICByZXR1cm4gaXNBcnJheShpdGVtKSA/XG4gICAgaXRlbVthbGxJbiA/ICdldmVyeScgOiAnc29tZSddKHN1Ykl0ZW0gPT4gYXJyYXkuaW5jbHVkZXMoc3ViSXRlbSkpIDpcbiAgICBhcnJheS5pbmNsdWRlcyhpdGVtKTtcbn1cblxuLyoqXG4gKiAneG9yJyB1dGlsaXR5IGZ1bmN0aW9uIC0gZXhjbHVzaXZlIG9yXG4gKlxuICogUmV0dXJucyB0cnVlIGlmIGV4YWN0bHkgb25lIG9mIHR3byB2YWx1ZXMgaXMgdHJ1dGh5LlxuICpcbiAqIC8vICAgdmFsdWUxIC0gZmlyc3QgdmFsdWUgdG8gY2hlY2tcbiAqIC8vICAgdmFsdWUyIC0gc2Vjb25kIHZhbHVlIHRvIGNoZWNrXG4gKiAvLyB7IGJvb2xlYW4gfSAtIHRydWUgaWYgZXhhY3RseSBvbmUgaW5wdXQgdmFsdWUgaXMgdHJ1dGh5LCBmYWxzZSBpZiBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHhvcih2YWx1ZTEsIHZhbHVlMikge1xuICByZXR1cm4gKCEhdmFsdWUxICYmICF2YWx1ZTIpIHx8ICghdmFsdWUxICYmICEhdmFsdWUyKTtcbn1cbiJdfQ==