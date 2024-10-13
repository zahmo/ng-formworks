import isEqual from 'lodash/isEqual';
import { isArray, isEmpty, isNumber, isObject, isString } from './validator.functions';
import { hasOwn, uniqueItems, commonItems } from './utility.functions';
/**
 * 'mergeSchemas' function
 *
 * Merges multiple JSON schemas into a single schema with combined rules.
 *
 * If able to logically merge properties from all schemas,
 * returns a single schema object containing all merged properties.
 *
 * Example: ({ a: b, max: 1 }, { c: d, max: 2 }) => { a: b, c: d, max: 1 }
 *
 * If unable to logically merge, returns an allOf schema object containing
 * an array of the original schemas;
 *
 * Example: ({ a: b }, { a: d }) => { allOf: [ { a: b }, { a: d } ] }
 *
 * //   schemas - one or more input schemas
 * //  - merged schema
 */
export function mergeSchemas(...schemas) {
    schemas = schemas.filter(schema => !isEmpty(schema));
    if (schemas.some(schema => !isObject(schema))) {
        return null;
    }
    const combinedSchema = {};
    for (const schema of schemas) {
        for (const key of Object.keys(schema)) {
            const combinedValue = combinedSchema[key];
            const schemaValue = schema[key];
            if (!hasOwn(combinedSchema, key) || isEqual(combinedValue, schemaValue)) {
                combinedSchema[key] = schemaValue;
            }
            else {
                switch (key) {
                    case 'allOf':
                        // Combine all items from both arrays
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.allOf = mergeSchemas(...combinedValue, ...schemaValue);
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'additionalItems':
                    case 'additionalProperties':
                    case 'contains':
                    case 'propertyNames':
                        // Merge schema objects
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            combinedSchema[key] = mergeSchemas(combinedValue, schemaValue);
                            // additionalProperties == false in any schema overrides all other values
                        }
                        else if (key === 'additionalProperties' &&
                            (combinedValue === false || schemaValue === false)) {
                            combinedSchema.combinedSchema = false;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'anyOf':
                    case 'oneOf':
                    case 'enum':
                        // Keep only items that appear in both arrays
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema[key] = combinedValue.filter(item1 => schemaValue.findIndex(item2 => isEqual(item1, item2)) > -1);
                            if (!combinedSchema[key].length) {
                                return { allOf: [...schemas] };
                            }
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'definitions':
                        // Combine keys from both objects
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            const combinedObject = { ...combinedValue };
                            for (const subKey of Object.keys(schemaValue)) {
                                if (!hasOwn(combinedObject, subKey) ||
                                    isEqual(combinedObject[subKey], schemaValue[subKey])) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                    // Don't combine matching keys with different values
                                }
                                else {
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.definitions = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'dependencies':
                        // Combine all keys from both objects
                        // and merge schemas on matching keys,
                        // converting from arrays to objects if necessary
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            const combinedObject = { ...combinedValue };
                            for (const subKey of Object.keys(schemaValue)) {
                                if (!hasOwn(combinedObject, subKey) ||
                                    isEqual(combinedObject[subKey], schemaValue[subKey])) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                    // If both keys are arrays, include all items from both arrays,
                                    // excluding duplicates
                                }
                                else if (isArray(schemaValue[subKey]) && isArray(combinedObject[subKey])) {
                                    combinedObject[subKey] =
                                        uniqueItems(...combinedObject[subKey], ...schemaValue[subKey]);
                                    // If either key is an object, merge the schemas
                                }
                                else if ((isArray(schemaValue[subKey]) || isObject(schemaValue[subKey])) &&
                                    (isArray(combinedObject[subKey]) || isObject(combinedObject[subKey]))) {
                                    // If either key is an array, convert it to an object first
                                    const required = isArray(combinedSchema.required) ?
                                        combinedSchema.required : [];
                                    const combinedDependency = isArray(combinedObject[subKey]) ?
                                        { required: uniqueItems(...required, combinedObject[subKey]) } :
                                        combinedObject[subKey];
                                    const schemaDependency = isArray(schemaValue[subKey]) ?
                                        { required: uniqueItems(...required, schemaValue[subKey]) } :
                                        schemaValue[subKey];
                                    combinedObject[subKey] =
                                        mergeSchemas(combinedDependency, schemaDependency);
                                }
                                else {
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.dependencies = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'items':
                        // If arrays, keep only items that appear in both arrays
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.items = combinedValue.filter(item1 => schemaValue.findIndex(item2 => isEqual(item1, item2)) > -1);
                            if (!combinedSchema.items.length) {
                                return { allOf: [...schemas] };
                            }
                            // If both keys are objects, merge them
                        }
                        else if (isObject(combinedValue) && isObject(schemaValue)) {
                            combinedSchema.items = mergeSchemas(combinedValue, schemaValue);
                            // If object + array, combine object with each array item
                        }
                        else if (isArray(combinedValue) && isObject(schemaValue)) {
                            combinedSchema.items =
                                combinedValue.map(item => mergeSchemas(item, schemaValue));
                        }
                        else if (isObject(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.items =
                                schemaValue.map(item => mergeSchemas(item, combinedValue));
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'multipleOf':
                        // TODO: Adjust to correctly handle decimal values
                        // If numbers, set to least common multiple
                        if (isNumber(combinedValue) && isNumber(schemaValue)) {
                            const gcd = (x, y) => !y ? x : gcd(y, x % y);
                            const lcm = (x, y) => (x * y) / gcd(x, y);
                            combinedSchema.multipleOf = lcm(combinedValue, schemaValue);
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'maximum':
                    case 'exclusiveMaximum':
                    case 'maxLength':
                    case 'maxItems':
                    case 'maxProperties':
                        // If numbers, set to lowest value
                        if (isNumber(combinedValue) && isNumber(schemaValue)) {
                            combinedSchema[key] = Math.min(combinedValue, schemaValue);
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'minimum':
                    case 'exclusiveMinimum':
                    case 'minLength':
                    case 'minItems':
                    case 'minProperties':
                        // If numbers, set to highest value
                        if (isNumber(combinedValue) && isNumber(schemaValue)) {
                            combinedSchema[key] = Math.max(combinedValue, schemaValue);
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'not':
                        // Combine not values into anyOf array
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            const notAnyOf = [combinedValue, schemaValue]
                                .reduce((notAnyOfArray, notSchema) => isArray(notSchema.anyOf) &&
                                Object.keys(notSchema).length === 1 ?
                                [...notAnyOfArray, ...notSchema.anyOf] :
                                [...notAnyOfArray, notSchema], []);
                            // TODO: Remove duplicate items from array
                            combinedSchema.not = { anyOf: notAnyOf };
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'patternProperties':
                        // Combine all keys from both objects
                        // and merge schemas on matching keys
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            const combinedObject = { ...combinedValue };
                            for (const subKey of Object.keys(schemaValue)) {
                                if (!hasOwn(combinedObject, subKey) ||
                                    isEqual(combinedObject[subKey], schemaValue[subKey])) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                    // If both keys are objects, merge them
                                }
                                else if (isObject(schemaValue[subKey]) && isObject(combinedObject[subKey])) {
                                    combinedObject[subKey] =
                                        mergeSchemas(combinedObject[subKey], schemaValue[subKey]);
                                }
                                else {
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.patternProperties = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'properties':
                        // Combine all keys from both objects
                        // unless additionalProperties === false
                        // and merge schemas on matching keys
                        if (isObject(combinedValue) && isObject(schemaValue)) {
                            const combinedObject = { ...combinedValue };
                            // If new schema has additionalProperties,
                            // merge or remove non-matching property keys in combined schema
                            if (hasOwn(schemaValue, 'additionalProperties')) {
                                Object.keys(combinedValue)
                                    .filter(combinedKey => !Object.keys(schemaValue).includes(combinedKey))
                                    .forEach(nonMatchingKey => {
                                    if (schemaValue.additionalProperties === false) {
                                        delete combinedObject[nonMatchingKey];
                                    }
                                    else if (isObject(schemaValue.additionalProperties)) {
                                        combinedObject[nonMatchingKey] = mergeSchemas(combinedObject[nonMatchingKey], schemaValue.additionalProperties);
                                    }
                                });
                            }
                            for (const subKey of Object.keys(schemaValue)) {
                                if (isEqual(combinedObject[subKey], schemaValue[subKey]) || (!hasOwn(combinedObject, subKey) &&
                                    !hasOwn(combinedObject, 'additionalProperties'))) {
                                    combinedObject[subKey] = schemaValue[subKey];
                                    // If combined schema has additionalProperties,
                                    // merge or ignore non-matching property keys in new schema
                                }
                                else if (!hasOwn(combinedObject, subKey) &&
                                    hasOwn(combinedObject, 'additionalProperties')) {
                                    // If combinedObject.additionalProperties === false,
                                    // do nothing (don't set key)
                                    // If additionalProperties is object, merge with new key
                                    if (isObject(combinedObject.additionalProperties)) {
                                        combinedObject[subKey] = mergeSchemas(combinedObject.additionalProperties, schemaValue[subKey]);
                                    }
                                    // If both keys are objects, merge them
                                }
                                else if (isObject(schemaValue[subKey]) &&
                                    isObject(combinedObject[subKey])) {
                                    combinedObject[subKey] =
                                        mergeSchemas(combinedObject[subKey], schemaValue[subKey]);
                                }
                                else {
                                    return { allOf: [...schemas] };
                                }
                            }
                            combinedSchema.properties = combinedObject;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'required':
                        // If arrays, include all items from both arrays, excluding duplicates
                        if (isArray(combinedValue) && isArray(schemaValue)) {
                            combinedSchema.required = uniqueItems(...combinedValue, ...schemaValue);
                            // If booleans, aet true if either true
                        }
                        else if (typeof schemaValue === 'boolean' &&
                            typeof combinedValue === 'boolean') {
                            combinedSchema.required = !!combinedValue || !!schemaValue;
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case '$schema':
                    case '$id':
                    case 'id':
                        // Don't combine these keys
                        break;
                    case 'title':
                    case 'description':
                    case '$comment':
                        // Return the last value, overwriting any previous one
                        // These properties are not used for validation, so conflicts don't matter
                        combinedSchema[key] = schemaValue;
                        break;
                    case 'type':
                        if ((isArray(schemaValue) || isString(schemaValue)) &&
                            (isArray(combinedValue) || isString(combinedValue))) {
                            const combinedTypes = commonItems(combinedValue, schemaValue);
                            if (!combinedTypes.length) {
                                return { allOf: [...schemas] };
                            }
                            combinedSchema.type = combinedTypes.length > 1 ? combinedTypes : combinedTypes[0];
                        }
                        else {
                            return { allOf: [...schemas] };
                        }
                        break;
                    case 'uniqueItems':
                        // Set true if either true
                        combinedSchema.uniqueItems = !!combinedValue || !!schemaValue;
                        break;
                    default:
                        return { allOf: [...schemas] };
                }
            }
        }
    }
    return combinedSchema;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2Utc2NoZW1hcy5mdW5jdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWZvcm13b3Jrcy1jb3JlL3NyYy9saWIvc2hhcmVkL21lcmdlLXNjaGVtYXMuZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxPQUFPLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUNMLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQy9DLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHdkU7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxHQUFHLE9BQU87SUFDckMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3JELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUFDLE9BQU8sSUFBSSxDQUFDO0lBQUMsQ0FBQztJQUMvRCxNQUFNLGNBQWMsR0FBUSxFQUFFLENBQUM7SUFDL0IsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUM3QixLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUN0QyxNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUMsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FB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Y2VzQ29udGVudCI6WyJpbXBvcnQgaXNFcXVhbCBmcm9tICdsb2Rhc2gvaXNFcXVhbCc7XG5cbmltcG9ydCB7XG4gIGlzQXJyYXksIGlzRW1wdHksIGlzTnVtYmVyLCBpc09iamVjdCwgaXNTdHJpbmdcbn0gZnJvbSAnLi92YWxpZGF0b3IuZnVuY3Rpb25zJztcbmltcG9ydCB7IGhhc093biwgdW5pcXVlSXRlbXMsIGNvbW1vbkl0ZW1zIH0gZnJvbSAnLi91dGlsaXR5LmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBKc29uUG9pbnRlciwgUG9pbnRlciB9IGZyb20gJy4vanNvbnBvaW50ZXIuZnVuY3Rpb25zJztcblxuLyoqXG4gKiAnbWVyZ2VTY2hlbWFzJyBmdW5jdGlvblxuICpcbiAqIE1lcmdlcyBtdWx0aXBsZSBKU09OIHNjaGVtYXMgaW50byBhIHNpbmdsZSBzY2hlbWEgd2l0aCBjb21iaW5lZCBydWxlcy5cbiAqXG4gKiBJZiBhYmxlIHRvIGxvZ2ljYWxseSBtZXJnZSBwcm9wZXJ0aWVzIGZyb20gYWxsIHNjaGVtYXMsXG4gKiByZXR1cm5zIGEgc2luZ2xlIHNjaGVtYSBvYmplY3QgY29udGFpbmluZyBhbGwgbWVyZ2VkIHByb3BlcnRpZXMuXG4gKlxuICogRXhhbXBsZTogKHsgYTogYiwgbWF4OiAxIH0sIHsgYzogZCwgbWF4OiAyIH0pID0+IHsgYTogYiwgYzogZCwgbWF4OiAxIH1cbiAqXG4gKiBJZiB1bmFibGUgdG8gbG9naWNhbGx5IG1lcmdlLCByZXR1cm5zIGFuIGFsbE9mIHNjaGVtYSBvYmplY3QgY29udGFpbmluZ1xuICogYW4gYXJyYXkgb2YgdGhlIG9yaWdpbmFsIHNjaGVtYXM7XG4gKlxuICogRXhhbXBsZTogKHsgYTogYiB9LCB7IGE6IGQgfSkgPT4geyBhbGxPZjogWyB7IGE6IGIgfSwgeyBhOiBkIH0gXSB9XG4gKlxuICogLy8gICBzY2hlbWFzIC0gb25lIG9yIG1vcmUgaW5wdXQgc2NoZW1hc1xuICogLy8gIC0gbWVyZ2VkIHNjaGVtYVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VTY2hlbWFzKC4uLnNjaGVtYXMpIHtcbiAgc2NoZW1hcyA9IHNjaGVtYXMuZmlsdGVyKHNjaGVtYSA9PiAhaXNFbXB0eShzY2hlbWEpKTtcbiAgaWYgKHNjaGVtYXMuc29tZShzY2hlbWEgPT4gIWlzT2JqZWN0KHNjaGVtYSkpKSB7IHJldHVybiBudWxsOyB9XG4gIGNvbnN0IGNvbWJpbmVkU2NoZW1hOiBhbnkgPSB7fTtcbiAgZm9yIChjb25zdCBzY2hlbWEgb2Ygc2NoZW1hcykge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNjaGVtYSkpIHtcbiAgICAgIGNvbnN0IGNvbWJpbmVkVmFsdWUgPSBjb21iaW5lZFNjaGVtYVtrZXldO1xuICAgICAgY29uc3Qgc2NoZW1hVmFsdWUgPSBzY2hlbWFba2V5XTtcbiAgICAgIGlmICghaGFzT3duKGNvbWJpbmVkU2NoZW1hLCBrZXkpIHx8IGlzRXF1YWwoY29tYmluZWRWYWx1ZSwgc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgIGNvbWJpbmVkU2NoZW1hW2tleV0gPSBzY2hlbWFWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgY2FzZSAnYWxsT2YnOlxuICAgICAgICAgICAgLy8gQ29tYmluZSBhbGwgaXRlbXMgZnJvbSBib3RoIGFycmF5c1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkoY29tYmluZWRWYWx1ZSkgJiYgaXNBcnJheShzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEuYWxsT2YgPSBtZXJnZVNjaGVtYXMoLi4uY29tYmluZWRWYWx1ZSwgLi4uc2NoZW1hVmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYWRkaXRpb25hbEl0ZW1zJzogY2FzZSAnYWRkaXRpb25hbFByb3BlcnRpZXMnOlxuICAgICAgICAgIGNhc2UgJ2NvbnRhaW5zJzogY2FzZSAncHJvcGVydHlOYW1lcyc6XG4gICAgICAgICAgICAvLyBNZXJnZSBzY2hlbWEgb2JqZWN0c1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGNvbWJpbmVkVmFsdWUpICYmIGlzT2JqZWN0KHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYVtrZXldID0gbWVyZ2VTY2hlbWFzKGNvbWJpbmVkVmFsdWUsIHNjaGVtYVZhbHVlKTtcbiAgICAgICAgICAgIC8vIGFkZGl0aW9uYWxQcm9wZXJ0aWVzID09IGZhbHNlIGluIGFueSBzY2hlbWEgb3ZlcnJpZGVzIGFsbCBvdGhlciB2YWx1ZXNcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgIGtleSA9PT0gJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyAmJlxuICAgICAgICAgICAgICAoY29tYmluZWRWYWx1ZSA9PT0gZmFsc2UgfHwgc2NoZW1hVmFsdWUgPT09IGZhbHNlKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLmNvbWJpbmVkU2NoZW1hID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhbnlPZic6IGNhc2UgJ29uZU9mJzogY2FzZSAnZW51bSc6XG4gICAgICAgICAgICAvLyBLZWVwIG9ubHkgaXRlbXMgdGhhdCBhcHBlYXIgaW4gYm90aCBhcnJheXNcbiAgICAgICAgICAgIGlmIChpc0FycmF5KGNvbWJpbmVkVmFsdWUpICYmIGlzQXJyYXkoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hW2tleV0gPSBjb21iaW5lZFZhbHVlLmZpbHRlcihpdGVtMSA9PlxuICAgICAgICAgICAgICAgIHNjaGVtYVZhbHVlLmZpbmRJbmRleChpdGVtMiA9PiBpc0VxdWFsKGl0ZW0xLCBpdGVtMikpID4gLTFcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgaWYgKCFjb21iaW5lZFNjaGVtYVtrZXldLmxlbmd0aCkgeyByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTsgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZGVmaW5pdGlvbnMnOlxuICAgICAgICAgICAgLy8gQ29tYmluZSBrZXlzIGZyb20gYm90aCBvYmplY3RzXG4gICAgICAgICAgICBpZiAoaXNPYmplY3QoY29tYmluZWRWYWx1ZSkgJiYgaXNPYmplY3Qoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkT2JqZWN0ID0geyAuLi5jb21iaW5lZFZhbHVlIH07XG4gICAgICAgICAgICAgIGZvciAoY29uc3Qgc3ViS2V5IG9mIE9iamVjdC5rZXlzKHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmICghaGFzT3duKGNvbWJpbmVkT2JqZWN0LCBzdWJLZXkpIHx8XG4gICAgICAgICAgICAgICAgICBpc0VxdWFsKGNvbWJpbmVkT2JqZWN0W3N1YktleV0sIHNjaGVtYVZhbHVlW3N1YktleV0pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID0gc2NoZW1hVmFsdWVbc3ViS2V5XTtcbiAgICAgICAgICAgICAgICAvLyBEb24ndCBjb21iaW5lIG1hdGNoaW5nIGtleXMgd2l0aCBkaWZmZXJlbnQgdmFsdWVzXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5kZWZpbml0aW9ucyA9IGNvbWJpbmVkT2JqZWN0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZGVwZW5kZW5jaWVzJzpcbiAgICAgICAgICAgIC8vIENvbWJpbmUgYWxsIGtleXMgZnJvbSBib3RoIG9iamVjdHNcbiAgICAgICAgICAgIC8vIGFuZCBtZXJnZSBzY2hlbWFzIG9uIG1hdGNoaW5nIGtleXMsXG4gICAgICAgICAgICAvLyBjb252ZXJ0aW5nIGZyb20gYXJyYXlzIHRvIG9iamVjdHMgaWYgbmVjZXNzYXJ5XG4gICAgICAgICAgICBpZiAoaXNPYmplY3QoY29tYmluZWRWYWx1ZSkgJiYgaXNPYmplY3Qoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkT2JqZWN0ID0geyAuLi5jb21iaW5lZFZhbHVlIH07XG4gICAgICAgICAgICAgIGZvciAoY29uc3Qgc3ViS2V5IG9mIE9iamVjdC5rZXlzKHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmICghaGFzT3duKGNvbWJpbmVkT2JqZWN0LCBzdWJLZXkpIHx8XG4gICAgICAgICAgICAgICAgICBpc0VxdWFsKGNvbWJpbmVkT2JqZWN0W3N1YktleV0sIHNjaGVtYVZhbHVlW3N1YktleV0pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID0gc2NoZW1hVmFsdWVbc3ViS2V5XTtcbiAgICAgICAgICAgICAgICAvLyBJZiBib3RoIGtleXMgYXJlIGFycmF5cywgaW5jbHVkZSBhbGwgaXRlbXMgZnJvbSBib3RoIGFycmF5cyxcbiAgICAgICAgICAgICAgICAvLyBleGNsdWRpbmcgZHVwbGljYXRlc1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICBpc0FycmF5KHNjaGVtYVZhbHVlW3N1YktleV0pICYmIGlzQXJyYXkoY29tYmluZWRPYmplY3Rbc3ViS2V5XSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W3N1YktleV0gPVxuICAgICAgICAgICAgICAgICAgICB1bmlxdWVJdGVtcyguLi5jb21iaW5lZE9iamVjdFtzdWJLZXldLCAuLi5zY2hlbWFWYWx1ZVtzdWJLZXldKTtcbiAgICAgICAgICAgICAgICAvLyBJZiBlaXRoZXIga2V5IGlzIGFuIG9iamVjdCwgbWVyZ2UgdGhlIHNjaGVtYXNcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgKGlzQXJyYXkoc2NoZW1hVmFsdWVbc3ViS2V5XSkgfHwgaXNPYmplY3Qoc2NoZW1hVmFsdWVbc3ViS2V5XSkpICYmXG4gICAgICAgICAgICAgICAgICAoaXNBcnJheShjb21iaW5lZE9iamVjdFtzdWJLZXldKSB8fCBpc09iamVjdChjb21iaW5lZE9iamVjdFtzdWJLZXldKSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIC8vIElmIGVpdGhlciBrZXkgaXMgYW4gYXJyYXksIGNvbnZlcnQgaXQgdG8gYW4gb2JqZWN0IGZpcnN0XG4gICAgICAgICAgICAgICAgICBjb25zdCByZXF1aXJlZCA9IGlzQXJyYXkoY29tYmluZWRTY2hlbWEucmVxdWlyZWQpID9cbiAgICAgICAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEucmVxdWlyZWQgOiBbXTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkRGVwZW5kZW5jeSA9IGlzQXJyYXkoY29tYmluZWRPYmplY3Rbc3ViS2V5XSkgP1xuICAgICAgICAgICAgICAgICAgICB7IHJlcXVpcmVkOiB1bmlxdWVJdGVtcyguLi5yZXF1aXJlZCwgY29tYmluZWRPYmplY3Rbc3ViS2V5XSkgfSA6XG4gICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W3N1YktleV07XG4gICAgICAgICAgICAgICAgICBjb25zdCBzY2hlbWFEZXBlbmRlbmN5ID0gaXNBcnJheShzY2hlbWFWYWx1ZVtzdWJLZXldKSA/XG4gICAgICAgICAgICAgICAgICAgIHsgcmVxdWlyZWQ6IHVuaXF1ZUl0ZW1zKC4uLnJlcXVpcmVkLCBzY2hlbWFWYWx1ZVtzdWJLZXldKSB9IDpcbiAgICAgICAgICAgICAgICAgICAgc2NoZW1hVmFsdWVbc3ViS2V5XTtcbiAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W3N1YktleV0gPVxuICAgICAgICAgICAgICAgICAgICBtZXJnZVNjaGVtYXMoY29tYmluZWREZXBlbmRlbmN5LCBzY2hlbWFEZXBlbmRlbmN5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLmRlcGVuZGVuY2llcyA9IGNvbWJpbmVkT2JqZWN0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnaXRlbXMnOlxuICAgICAgICAgICAgLy8gSWYgYXJyYXlzLCBrZWVwIG9ubHkgaXRlbXMgdGhhdCBhcHBlYXIgaW4gYm90aCBhcnJheXNcbiAgICAgICAgICAgIGlmIChpc0FycmF5KGNvbWJpbmVkVmFsdWUpICYmIGlzQXJyYXkoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLml0ZW1zID0gY29tYmluZWRWYWx1ZS5maWx0ZXIoaXRlbTEgPT5cbiAgICAgICAgICAgICAgICBzY2hlbWFWYWx1ZS5maW5kSW5kZXgoaXRlbTIgPT4gaXNFcXVhbChpdGVtMSwgaXRlbTIpKSA+IC0xXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGlmICghY29tYmluZWRTY2hlbWEuaXRlbXMubGVuZ3RoKSB7IHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9OyB9XG4gICAgICAgICAgICAvLyBJZiBib3RoIGtleXMgYXJlIG9iamVjdHMsIG1lcmdlIHRoZW1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoY29tYmluZWRWYWx1ZSkgJiYgaXNPYmplY3Qoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLml0ZW1zID0gbWVyZ2VTY2hlbWFzKGNvbWJpbmVkVmFsdWUsIHNjaGVtYVZhbHVlKTtcbiAgICAgICAgICAgIC8vIElmIG9iamVjdCArIGFycmF5LCBjb21iaW5lIG9iamVjdCB3aXRoIGVhY2ggYXJyYXkgaXRlbVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGNvbWJpbmVkVmFsdWUpICYmIGlzT2JqZWN0KHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5pdGVtcyA9XG4gICAgICAgICAgICAgICAgY29tYmluZWRWYWx1ZS5tYXAoaXRlbSA9PiBtZXJnZVNjaGVtYXMoaXRlbSwgc2NoZW1hVmFsdWUpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoY29tYmluZWRWYWx1ZSkgJiYgaXNBcnJheShzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEuaXRlbXMgPVxuICAgICAgICAgICAgICAgIHNjaGVtYVZhbHVlLm1hcChpdGVtID0+IG1lcmdlU2NoZW1hcyhpdGVtLCBjb21iaW5lZFZhbHVlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdtdWx0aXBsZU9mJzpcbiAgICAgICAgICAgIC8vIFRPRE86IEFkanVzdCB0byBjb3JyZWN0bHkgaGFuZGxlIGRlY2ltYWwgdmFsdWVzXG4gICAgICAgICAgICAvLyBJZiBudW1iZXJzLCBzZXQgdG8gbGVhc3QgY29tbW9uIG11bHRpcGxlXG4gICAgICAgICAgICBpZiAoaXNOdW1iZXIoY29tYmluZWRWYWx1ZSkgJiYgaXNOdW1iZXIoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGdjZCA9ICh4LCB5KSA9PiAheSA/IHggOiBnY2QoeSwgeCAlIHkpO1xuICAgICAgICAgICAgICBjb25zdCBsY20gPSAoeCwgeSkgPT4gKHggKiB5KSAvIGdjZCh4LCB5KTtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEubXVsdGlwbGVPZiA9IGxjbShjb21iaW5lZFZhbHVlLCBzY2hlbWFWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdtYXhpbXVtJzogY2FzZSAnZXhjbHVzaXZlTWF4aW11bSc6IGNhc2UgJ21heExlbmd0aCc6XG4gICAgICAgICAgY2FzZSAnbWF4SXRlbXMnOiBjYXNlICdtYXhQcm9wZXJ0aWVzJzpcbiAgICAgICAgICAgIC8vIElmIG51bWJlcnMsIHNldCB0byBsb3dlc3QgdmFsdWVcbiAgICAgICAgICAgIGlmIChpc051bWJlcihjb21iaW5lZFZhbHVlKSAmJiBpc051bWJlcihzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWFba2V5XSA9IE1hdGgubWluKGNvbWJpbmVkVmFsdWUsIHNjaGVtYVZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ21pbmltdW0nOiBjYXNlICdleGNsdXNpdmVNaW5pbXVtJzogY2FzZSAnbWluTGVuZ3RoJzpcbiAgICAgICAgICBjYXNlICdtaW5JdGVtcyc6IGNhc2UgJ21pblByb3BlcnRpZXMnOlxuICAgICAgICAgICAgLy8gSWYgbnVtYmVycywgc2V0IHRvIGhpZ2hlc3QgdmFsdWVcbiAgICAgICAgICAgIGlmIChpc051bWJlcihjb21iaW5lZFZhbHVlKSAmJiBpc051bWJlcihzY2hlbWFWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWFba2V5XSA9IE1hdGgubWF4KGNvbWJpbmVkVmFsdWUsIHNjaGVtYVZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ25vdCc6XG4gICAgICAgICAgICAvLyBDb21iaW5lIG5vdCB2YWx1ZXMgaW50byBhbnlPZiBhcnJheVxuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGNvbWJpbmVkVmFsdWUpICYmIGlzT2JqZWN0KHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICBjb25zdCBub3RBbnlPZiA9IFtjb21iaW5lZFZhbHVlLCBzY2hlbWFWYWx1ZV1cbiAgICAgICAgICAgICAgICAucmVkdWNlKChub3RBbnlPZkFycmF5LCBub3RTY2hlbWEpID0+XG4gICAgICAgICAgICAgICAgICBpc0FycmF5KG5vdFNjaGVtYS5hbnlPZikgJiZcbiAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKG5vdFNjaGVtYSkubGVuZ3RoID09PSAxID9cbiAgICAgICAgICAgICAgICAgICAgWyAuLi5ub3RBbnlPZkFycmF5LCAuLi5ub3RTY2hlbWEuYW55T2YgXSA6XG4gICAgICAgICAgICAgICAgICAgIFsgLi4ubm90QW55T2ZBcnJheSwgbm90U2NoZW1hIF1cbiAgICAgICAgICAgICAgICAsIFtdKTtcbiAgICAgICAgICAgICAgLy8gVE9ETzogUmVtb3ZlIGR1cGxpY2F0ZSBpdGVtcyBmcm9tIGFycmF5XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLm5vdCA9IHsgYW55T2Y6IG5vdEFueU9mIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdwYXR0ZXJuUHJvcGVydGllcyc6XG4gICAgICAgICAgICAvLyBDb21iaW5lIGFsbCBrZXlzIGZyb20gYm90aCBvYmplY3RzXG4gICAgICAgICAgICAvLyBhbmQgbWVyZ2Ugc2NoZW1hcyBvbiBtYXRjaGluZyBrZXlzXG4gICAgICAgICAgICBpZiAoaXNPYmplY3QoY29tYmluZWRWYWx1ZSkgJiYgaXNPYmplY3Qoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkT2JqZWN0ID0geyAuLi5jb21iaW5lZFZhbHVlIH07XG4gICAgICAgICAgICAgIGZvciAoY29uc3Qgc3ViS2V5IG9mIE9iamVjdC5rZXlzKHNjaGVtYVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlmICghaGFzT3duKGNvbWJpbmVkT2JqZWN0LCBzdWJLZXkpIHx8XG4gICAgICAgICAgICAgICAgICBpc0VxdWFsKGNvbWJpbmVkT2JqZWN0W3N1YktleV0sIHNjaGVtYVZhbHVlW3N1YktleV0pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID0gc2NoZW1hVmFsdWVbc3ViS2V5XTtcbiAgICAgICAgICAgICAgICAvLyBJZiBib3RoIGtleXMgYXJlIG9iamVjdHMsIG1lcmdlIHRoZW1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgaXNPYmplY3Qoc2NoZW1hVmFsdWVbc3ViS2V5XSkgJiYgaXNPYmplY3QoY29tYmluZWRPYmplY3Rbc3ViS2V5XSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W3N1YktleV0gPVxuICAgICAgICAgICAgICAgICAgICBtZXJnZVNjaGVtYXMoY29tYmluZWRPYmplY3Rbc3ViS2V5XSwgc2NoZW1hVmFsdWVbc3ViS2V5XSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb21iaW5lZFNjaGVtYS5wYXR0ZXJuUHJvcGVydGllcyA9IGNvbWJpbmVkT2JqZWN0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncHJvcGVydGllcyc6XG4gICAgICAgICAgICAvLyBDb21iaW5lIGFsbCBrZXlzIGZyb20gYm90aCBvYmplY3RzXG4gICAgICAgICAgICAvLyB1bmxlc3MgYWRkaXRpb25hbFByb3BlcnRpZXMgPT09IGZhbHNlXG4gICAgICAgICAgICAvLyBhbmQgbWVyZ2Ugc2NoZW1hcyBvbiBtYXRjaGluZyBrZXlzXG4gICAgICAgICAgICBpZiAoaXNPYmplY3QoY29tYmluZWRWYWx1ZSkgJiYgaXNPYmplY3Qoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkT2JqZWN0ID0geyAuLi5jb21iaW5lZFZhbHVlIH07XG4gICAgICAgICAgICAgIC8vIElmIG5ldyBzY2hlbWEgaGFzIGFkZGl0aW9uYWxQcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAvLyBtZXJnZSBvciByZW1vdmUgbm9uLW1hdGNoaW5nIHByb3BlcnR5IGtleXMgaW4gY29tYmluZWQgc2NoZW1hXG4gICAgICAgICAgICAgIGlmIChoYXNPd24oc2NoZW1hVmFsdWUsICdhZGRpdGlvbmFsUHJvcGVydGllcycpKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29tYmluZWRWYWx1ZSlcbiAgICAgICAgICAgICAgICAgIC5maWx0ZXIoY29tYmluZWRLZXkgPT4gIU9iamVjdC5rZXlzKHNjaGVtYVZhbHVlKS5pbmNsdWRlcyhjb21iaW5lZEtleSkpXG4gICAgICAgICAgICAgICAgICAuZm9yRWFjaChub25NYXRjaGluZ0tleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY2hlbWFWYWx1ZS5hZGRpdGlvbmFsUHJvcGVydGllcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgY29tYmluZWRPYmplY3Rbbm9uTWF0Y2hpbmdLZXldO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHNjaGVtYVZhbHVlLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W25vbk1hdGNoaW5nS2V5XSA9IG1lcmdlU2NoZW1hcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0W25vbk1hdGNoaW5nS2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVtYVZhbHVlLmFkZGl0aW9uYWxQcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZm9yIChjb25zdCBzdWJLZXkgb2YgT2JqZWN0LmtleXMoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRXF1YWwoY29tYmluZWRPYmplY3Rbc3ViS2V5XSwgc2NoZW1hVmFsdWVbc3ViS2V5XSkgfHwgKFxuICAgICAgICAgICAgICAgICAgIWhhc093bihjb21iaW5lZE9iamVjdCwgc3ViS2V5KSAmJlxuICAgICAgICAgICAgICAgICAgIWhhc093bihjb21iaW5lZE9iamVjdCwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJylcbiAgICAgICAgICAgICAgICApKSB7XG4gICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID0gc2NoZW1hVmFsdWVbc3ViS2V5XTtcbiAgICAgICAgICAgICAgICAvLyBJZiBjb21iaW5lZCBzY2hlbWEgaGFzIGFkZGl0aW9uYWxQcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgIC8vIG1lcmdlIG9yIGlnbm9yZSBub24tbWF0Y2hpbmcgcHJvcGVydHkga2V5cyBpbiBuZXcgc2NoZW1hXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICFoYXNPd24oY29tYmluZWRPYmplY3QsIHN1YktleSkgJiZcbiAgICAgICAgICAgICAgICAgIGhhc093bihjb21iaW5lZE9iamVjdCwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJylcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIC8vIElmIGNvbWJpbmVkT2JqZWN0LmFkZGl0aW9uYWxQcm9wZXJ0aWVzID09PSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgKGRvbid0IHNldCBrZXkpXG4gICAgICAgICAgICAgICAgICAvLyBJZiBhZGRpdGlvbmFsUHJvcGVydGllcyBpcyBvYmplY3QsIG1lcmdlIHdpdGggbmV3IGtleVxuICAgICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGNvbWJpbmVkT2JqZWN0LmFkZGl0aW9uYWxQcm9wZXJ0aWVzKSkge1xuICAgICAgICAgICAgICAgICAgICBjb21iaW5lZE9iamVjdFtzdWJLZXldID0gbWVyZ2VTY2hlbWFzKFxuICAgICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkT2JqZWN0LmFkZGl0aW9uYWxQcm9wZXJ0aWVzLCBzY2hlbWFWYWx1ZVtzdWJLZXldXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgYm90aCBrZXlzIGFyZSBvYmplY3RzLCBtZXJnZSB0aGVtXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgIGlzT2JqZWN0KHNjaGVtYVZhbHVlW3N1YktleV0pICYmXG4gICAgICAgICAgICAgICAgICBpc09iamVjdChjb21iaW5lZE9iamVjdFtzdWJLZXldKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgY29tYmluZWRPYmplY3Rbc3ViS2V5XSA9XG4gICAgICAgICAgICAgICAgICAgIG1lcmdlU2NoZW1hcyhjb21iaW5lZE9iamVjdFtzdWJLZXldLCBzY2hlbWFWYWx1ZVtzdWJLZXldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgYWxsT2Y6IFsgLi4uc2NoZW1hcyBdIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLnByb3BlcnRpZXMgPSBjb21iaW5lZE9iamVjdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3JlcXVpcmVkJzpcbiAgICAgICAgICAgIC8vIElmIGFycmF5cywgaW5jbHVkZSBhbGwgaXRlbXMgZnJvbSBib3RoIGFycmF5cywgZXhjbHVkaW5nIGR1cGxpY2F0ZXNcbiAgICAgICAgICAgIGlmIChpc0FycmF5KGNvbWJpbmVkVmFsdWUpICYmIGlzQXJyYXkoc2NoZW1hVmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLnJlcXVpcmVkID0gdW5pcXVlSXRlbXMoLi4uY29tYmluZWRWYWx1ZSwgLi4uc2NoZW1hVmFsdWUpO1xuICAgICAgICAgICAgLy8gSWYgYm9vbGVhbnMsIGFldCB0cnVlIGlmIGVpdGhlciB0cnVlXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICB0eXBlb2Ygc2NoZW1hVmFsdWUgPT09ICdib29sZWFuJyAmJlxuICAgICAgICAgICAgICB0eXBlb2YgY29tYmluZWRWYWx1ZSA9PT0gJ2Jvb2xlYW4nXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgY29tYmluZWRTY2hlbWEucmVxdWlyZWQgPSAhIWNvbWJpbmVkVmFsdWUgfHwgISFzY2hlbWFWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJyRzY2hlbWEnOiBjYXNlICckaWQnOiBjYXNlICdpZCc6XG4gICAgICAgICAgICAvLyBEb24ndCBjb21iaW5lIHRoZXNlIGtleXNcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd0aXRsZSc6IGNhc2UgJ2Rlc2NyaXB0aW9uJzogY2FzZSAnJGNvbW1lbnQnOlxuICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSBsYXN0IHZhbHVlLCBvdmVyd3JpdGluZyBhbnkgcHJldmlvdXMgb25lXG4gICAgICAgICAgICAvLyBUaGVzZSBwcm9wZXJ0aWVzIGFyZSBub3QgdXNlZCBmb3IgdmFsaWRhdGlvbiwgc28gY29uZmxpY3RzIGRvbid0IG1hdHRlclxuICAgICAgICAgICAgY29tYmluZWRTY2hlbWFba2V5XSA9IHNjaGVtYVZhbHVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3R5cGUnOlxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAoaXNBcnJheShzY2hlbWFWYWx1ZSkgfHwgaXNTdHJpbmcoc2NoZW1hVmFsdWUpKSAmJlxuICAgICAgICAgICAgICAoaXNBcnJheShjb21iaW5lZFZhbHVlKSB8fCBpc1N0cmluZyhjb21iaW5lZFZhbHVlKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBjb25zdCBjb21iaW5lZFR5cGVzID0gY29tbW9uSXRlbXMoY29tYmluZWRWYWx1ZSwgc2NoZW1hVmFsdWUpO1xuICAgICAgICAgICAgICBpZiAoIWNvbWJpbmVkVHlwZXMubGVuZ3RoKSB7IHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9OyB9XG4gICAgICAgICAgICAgIGNvbWJpbmVkU2NoZW1hLnR5cGUgPSBjb21iaW5lZFR5cGVzLmxlbmd0aCA+IDEgPyBjb21iaW5lZFR5cGVzIDogY29tYmluZWRUeXBlc1swXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGFsbE9mOiBbIC4uLnNjaGVtYXMgXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3VuaXF1ZUl0ZW1zJzpcbiAgICAgICAgICAgIC8vIFNldCB0cnVlIGlmIGVpdGhlciB0cnVlXG4gICAgICAgICAgICBjb21iaW5lZFNjaGVtYS51bmlxdWVJdGVtcyA9ICEhY29tYmluZWRWYWx1ZSB8fCAhIXNjaGVtYVZhbHVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4geyBhbGxPZjogWyAuLi5zY2hlbWFzIF0gfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29tYmluZWRTY2hlbWE7XG59XG4iXX0=