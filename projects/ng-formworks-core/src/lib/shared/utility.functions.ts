import { isNil, some } from 'lodash';
import { hasValue, inArray, isArray, isDefined, isEmpty, isMap, isObject, isSet, isString, PlainObject } from './validator.functions';

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
export function addClasses(
  oldClasses: string | string[] | Set<string>,
  newClasses: string | string[] | Set<string>
): string | string[] | Set<string> {
  const badType = i => !isSet(i) && !isArray(i) && !isString(i);
  if (badType(newClasses)) { return oldClasses; }
  if (badType(oldClasses)) { oldClasses = ''; }
  const toSet = i => isSet(i) ? i : isArray(i) ? new Set(i) : new Set(i.split(' '));
  const combinedSet: Set<any> = toSet(oldClasses);
  const newSet: Set<any> = toSet(newClasses);
  newSet.forEach(c => combinedSet.add(c));
  if (isSet(oldClasses)) { return combinedSet; }
  if (isArray(oldClasses)) { return Array.from(combinedSet); }
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
export function copy(object: any, errors = false): any {
  if (typeof object !== 'object' || object === null) { return object; }
  if (isMap(object))    { return new Map(object); }
  if (isSet(object))    { return new Set(object); }
  if (isArray(object))  { return [ ...object ];   }
  if (isObject(object)) { return { ...object };   }
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
export function forEach(
  object: any, fn: (v: any, k?: string | number, c?: any, rc?: any) => any,
  recurse: boolean | string = false, rootObject: any = object, errors = false
): void {
  if (isEmpty(object)) { return; }
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
export function forEachCopy(
  object: any, fn: (v: any, k?: string | number, o?: any, p?: string) => any,
  errors = false
): any {
  if (!hasValue(object)) { return; }
  if ((isObject(object) || isArray(object)) && typeof object !== 'function') {
    const newObject: any = isArray(object) ? [] : {};
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
export function hasOwn(object: any, property: string): boolean {
  if (!object || !['number', 'string', 'symbol'].includes(typeof property) ||
    (!isObject(object) && !isArray(object) && !isMap(object) && !isSet(object))
  ) { return false; }
  if (isMap(object) || isSet(object)) { return object.has(property); }
  if (typeof property === 'number') {
    if (isArray(object)) { return object[<number>property]; }
    property = property + '';
  }
  return object.hasOwnProperty(property);
}

/**
 * Types of possible expressions which the app is able to evaluate.
 */
export enum ExpressionType {
  EQUALS,
  NOT_EQUALS,
  NOT_AN_EXPRESSION
}

/**
 * Detects the type of expression from the given candidate. `==` for equals,
 * `!=` for not equals. If none of these are contained in the candidate, the candidate
 * is not considered to be an expression at all and thus `NOT_AN_EXPRESSION` is returned.
 * // {expressionCandidate} expressionCandidate - potential expression
 */
export function getExpressionType(expressionCandidate: string): ExpressionType {
  if (expressionCandidate.indexOf('==') !== -1) {
    return ExpressionType.EQUALS;
  }

  if (expressionCandidate.toString().indexOf('!=') !== -1) {
    return ExpressionType.NOT_EQUALS;
  }

  return ExpressionType.NOT_AN_EXPRESSION;
}

export function isEqual(expressionType) {
  return expressionType as ExpressionType === ExpressionType.EQUALS;
}

export function isNotEqual(expressionType) {
  return expressionType as ExpressionType === ExpressionType.NOT_EQUALS;
}

export function isNotExpression(expressionType) {
  return expressionType as ExpressionType === ExpressionType.NOT_AN_EXPRESSION;
}

/**
 * Splits the expression key by the expressionType on a pair of values
 * before and after the equals or nor equals sign.
 * // {expressionType} enum of an expression type
 * // {key} the given key from a for loop iver all conditions
 */
export function getKeyAndValueByExpressionType(expressionType: ExpressionType, key: string) {
  if (isEqual(expressionType)) {
    return key.split('==', 2);
  }

  if (isNotEqual(expressionType)) {
    return key.split('!=', 2);
  }

  return null;
}

export function cleanValueOfQuotes(keyAndValue): String {
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
export function mergeFilteredObject(
  targetObject: PlainObject,
  sourceObject: PlainObject,
  excludeKeys = <string[]>[],
  keyFn = (key: string): string => key,
  valFn = (val: any): any => val
): PlainObject {
  if (!isObject(sourceObject)) { return targetObject; }
  if (!isObject(targetObject)) { targetObject = {}; }
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
export function uniqueItems(...items): string[] {
  const returnItems = [];
  for (const item of items) {
    if (!returnItems.includes(item)) { returnItems.push(item); }
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
export function commonItems(...arrays): string[] {
  let returnItems = null;
  for (let array of arrays) {
    if (isString(array)) { array = [array]; }
    returnItems = returnItems === null ? [ ...array ] :
      returnItems.filter(item => array.includes(item));
    if (!returnItems.length) { return []; }
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
export function fixTitle(name: string): string {
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
export function toTitleCase(input: string, forceWords?: string|string[]): string {
  if (!isString(input)) { return input; }
  let forceArray: string[] = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en',
   'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'v', 'v.',
   'vs', 'vs.', 'via'];
  if (isString(forceWords)) { forceWords = (<string>forceWords).split('|'); }
  if (isArray(forceWords)) { forceArray = forceArray.concat(forceWords); }
  const forceArrayLower: string[] = forceArray.map(w => w.toLowerCase());
  const noInitialCase: boolean =
    input === input.toUpperCase() || input === input.toLowerCase();
  let prevLastChar = '';
  input = input.trim();
  return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (word, idx) => {
    if (!noInitialCase && word.slice(1).search(/[A-Z]|\../) !== -1) {
      return word;
    } else {
      let newWord: string;
      const forceWord: string =
        forceArray[forceArrayLower.indexOf(word.toLowerCase())];
      if (!forceWord) {
        if (noInitialCase) {
          if (word.slice(1).search(/\../) !== -1) {
            newWord = word.toLowerCase();
          } else {
            newWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
          }
        } else {
          newWord = word[0].toUpperCase() + word.slice(1);
        }
      } else if (
        forceWord === forceWord.toLowerCase() && (
          idx === 0 || idx + word.length === input.length ||
          prevLastChar === ':' || input[idx - 1].search(/[^\s-]/) !== -1 ||
          (input[idx - 1] !== '-' && input[idx + word.length] === '-')
        )
      ) {
        newWord = forceWord[0].toUpperCase() + forceWord.slice(1);
      } else {
        newWord = forceWord;
      }
      prevLastChar = word.slice(-1);
      return newWord;
    }
  });
}


/**
 * Recursively checks if at least one property of the given object (including nested objects)
 * has a non-null and non-undefined value.
 *
 * @param obj - The object to check.
 * @returns `true` if at least one property has a non-null and non-undefined value, otherwise `false`.
 *
 * @example
 * const testObj = { a: null, b: { b1: null, b2: undefined } };
 * console.log(hasNonNullValue(testObj));  // Output: false
 * 
 * const testObj2 = { a: 1, b: { b1: null, b2: undefined } };
 * console.log(hasNonNullValue(testObj2));  // Output: true
 */
export function hasNonNullValue(obj: Record<string, any>): boolean {
  // If the object is null or not an object, return false immediately
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  // _.some checks if at least one element passes the given condition.
  return some(obj, (value: any): boolean => {
    // If value is an object, recurse deeper into the object.
    if (isObject(value)) {
      return hasNonNullValue(value);
    }
    // Check if value is neither null nor undefined.
    return !isNil(value);
  });
}
/**
 * Recursively compares array sizes of nested arrays
 *
 * @param obj1 - The object to check.
 * @param obj2 - The object to check.
 * @returns `false` if at least one nested array size mismatches`.
 *
 * @example
 * const obj1 = { a: ['a','aa'], b:{c:[1,11,11]} };
 * const obj2 = { a: ['ee','dd'], b:{c:[2]} };
 * 
 * console.log(compareObjectArraySizes(obj1,obj1));  // Output: false
 * mismatch will be on path b/c
 */
  export function compareObjectArraySizes(obj1: any, obj2: any, comparePath = "") {
    if (isArray(obj1) && isArray(obj2)) {
      if (obj1.length != obj2.length) {
        console.log(`size mismatch at ${comparePath}` );
        return false; // immediately return false on mismatch
      } else {
        for (let ind = 0; ind < obj1.length; ind++) {
          const item1 = obj1[ind];
          const item2 = obj2[ind];
          const result = compareObjectArraySizes(item1, item2, `${comparePath}/${ind}`);
          if (result === false) {
            return false; // propagate false if mismatch is found
          }
        }
      }
    }
  
    if (isObject(obj1) && !isArray(obj1)) {
      for (let key in obj1) {
        if (obj2.hasOwnProperty(key)) {
          const result = compareObjectArraySizes(obj1[key], obj2[key], `${comparePath}/${key}`);
          if (result === false) {
            return false; // propagate false if mismatch is found
          }
        }
      }
    }
  
    return true; // all checks passed
  }

//below are experimental helpers to make conditions more stricter
//example allowing 
//"or(equals(model.devices[arrayIndices].accessoryType, 'airpurifier'), greaterThan(model.devices[arrayIndices].batteryLevel, 20))"
//but not
//"model.devices[arrayIndices].accessoryType === 'airpurifier'"
// predefinedFunctions = ['equals', 'greaterThan', 'contains', 'or', 'and'];
//use 
//const functionBody = "or(equals(model.devices[arrayIndices].accessoryType, 'airpurifier'), greaterThan(model.devices[arrayIndices].batteryLevel, 20))";
// try {
//   const parsedConditions = ConditionParser.parseFunctionBody(functionBody);
//   console.log(parsedConditions);
// } catch (error) {
//   console.error('Error:', error.message);
// } 
//should out put
// {
//   "conditions": [
//     {
//       "conditionName": "or",
//       "parameters": {
//         "conditions": [
//           {
//             "conditionName": "equals",
//             "parameters": {
//               "src": "model.devices[arrayIndices].accessoryType",
//               "trg": "airpurifier"
//             }
//           },
//           {
//             "conditionName": "greaterThan",
//             "parameters": {
//               "src": "model.devices[arrayIndices].batteryLevel",
//               "trg": "20"
//             }
//           }
//         ]
//       }
//     }
//   ]
// }

  /* predefinedFunctions something like
  predefinedFunctions = {
    equals: (src: string, trg: string) => src === trg,
    greaterThan: (src: number, trg: number) => src > trg,
    contains: (src: string, trg: string) => src.includes(trg),
    or: (conditions: any[]) => conditions.some(cond => cond),
    and: (conditions: any[]) => conditions.every(cond => cond)
  };
  */
  class ConditionParser {
    private static predefinedFunctions = ['equals', 'greaterThan', 'contains', 'or', 'and'];
  
    static parseFunctionBody(functionBody: string): any[] {
      const regex = /(\w+)\s*\(([^)]+)\)/g;
      let match;
      const conditions: any[] = [];
  
      while ((match = regex.exec(functionBody)) !== null) {
        const functionName = match[1];
        const params = match[2].split(',').map(param => param.trim());
  
        if (!this.predefinedFunctions.includes(functionName)) {
          throw new Error(`Invalid function: ${functionName}`);
        }
  
        // Recursively parse the parameters if they are function calls (e.g., in 'or' or 'and')
        const parsedParams = params.map(param => {
          if (param.startsWith('or(') || param.startsWith('and(')) {
            return this.parseFunctionBody(param); // Handle nested conditions
          }
          return param;
        });
  
        // Extract dependencies (data paths) from the parameters
        const dependencies = this.extractDependencies(parsedParams);
  
        conditions.push({
          conditionName: functionName,
          parameters: this.buildParameters(functionName, parsedParams),
          dependencies: dependencies // Add dependencies
        });
      }
  
      return conditions;
    }
  
    static buildParameters(functionName: string, params: string[]): any {
      switch (functionName) {
        case 'equals':
        case 'greaterThan':
        case 'contains':
          return { src: params[0], trg: params[1] };
        case 'or':
        case 'and':
          return { conditions: params };
        default:
          throw new Error(`Unsupported function: ${functionName}`);
      }
    }
  
    // Extract data paths from parameters
    static extractDependencies(params: string[]): string[] {
      const dependencies: string[] = [];
  
      params.forEach(param => {
        // Regex to match data paths (e.g., "model.devices[arrayIndices].accessoryType")
        const regex = /model\.[a-zA-Z0-9_]+\[(.*)\]\.[a-zA-Z0-9_]+|model\.[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+/g;
        const matches = param.match(regex);
  
        if (matches) {
          dependencies.push(...matches);
        }
      });
  
      return dependencies;
    }
  }
  
  class ConditionEvaluator {
    private static predefinedFunctions = {
      equals: (src: string, trg: string) => src === trg,
      greaterThan: (src: number, trg: number) => src > trg,
      contains: (src: string, trg: string) => src.includes(trg),
      or: (conditions: any[]) => conditions.some(cond => cond),
      and: (conditions: any[]) => conditions.every(cond => cond)
    };
  
    static evaluateChangedConditions(changedData: string, conditions: any[]) {
      return conditions.filter(condition => {
        // Check if any condition's dependencies contain the changed data
        return condition.dependencies.some(dep => dep.includes(changedData));
      });
    }
  
    static evaluateCondition(condition: any): boolean {
      const { conditionName, parameters } = condition;
  
      if (this.predefinedFunctions[conditionName]) {
        // Evaluate basic conditions
        return this.predefinedFunctions[conditionName](parameters.src, parameters.trg);
      } else if (conditionName === 'or' || conditionName === 'and') {
        // Evaluate logical conditions
        const subResults = parameters.conditions.map((subCond: any) => this.evaluateCondition(subCond));
        return this.predefinedFunctions[conditionName](subResults);
      }
  
      return false;
    }
  
    static evaluate(conditions: any[], changedData: string): boolean {
      const changedConditions = this.evaluateChangedConditions(changedData, conditions);
      
      const results = changedConditions.map(condition => this.evaluateCondition(condition));
      return results.every(result => result === true);  // Default to AND logic
    }
  }
  
  class ExpressionAnalyzer {
    // Regex to detect a variable reference (e.g., model.devices[arrayIndices].accessoryType)
    private static variablePattern = /[a-zA-Z_][a-zA-Z0-9_]*|\[.*?\]/g;
  
    // Regex to detect string literals (e.g., 'airpurifier', "batteryLevel")
    private static stringLiteralPattern = /^['"].*['"]$/;
  
    // Regex to detect numeric literals (e.g., 20, -5.5)
    private static numericLiteralPattern = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
  
    // Regex to detect boolean literals (e.g., true, false)
    private static booleanLiteralPattern = /^(true|false)$/;
  
    static isVariableOrLiteral(value: string): 'variable' | 'literal' {
      // Check if the value is a string literal
      if (this.stringLiteralPattern.test(value)) {
        return 'literal';
      }
  
      // Check if the value is a numeric literal
      if (this.numericLiteralPattern.test(value)) {
        return 'literal';
      }
  
      // Check if the value is a boolean literal
      if (this.booleanLiteralPattern.test(value)) {
        return 'literal';
      }
  
      // If it matches variable-like pattern, then it's a variable
      if (this.variablePattern.test(value)) {
        return 'variable';
      }
  
      return 'literal'; // Default to literal if no matches are found
    }
  
    // To check if a parameter is a literal or contains variables (e.g., "model.devices[arrayIndices].accessoryType")
    static checkIfVariableOrLiteral(value: string): 'literal' | 'variable' {
      // Remove white spaces and check each part of the expression (split by dots and brackets)
      const parts = value.split('.').flatMap(part => part.split('[').map(subPart => subPart.replace(']', '')));
  
      for (const part of parts) {
        if (this.isVariableOrLiteral(part) === 'variable') {
          return 'variable'; // If any part is a variable, return 'variable'
        }
      }
  
      return 'literal'; // If no part is a variable, return 'literal'
    }
  }
  



