import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import map from 'lodash/map';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { forEach, hasOwn } from './utility.functions';
import { getControlValidators, removeRecursiveReferences } from './json-schema.functions';
import { hasValue, inArray, isArray, isDate, isDefined, isEmpty, isObject, isPrimitive, toJavaScriptType, toSchemaType } from './validator.functions';
import { JsonPointer } from './jsonpointer.functions';
import { JsonValidators } from './json.validators';
/**
 * FormGroup function library:
 *
 * buildFormGroupTemplate:  Builds a FormGroupTemplate from schema
 *
 * buildFormGroup:          Builds an Angular FormGroup from a FormGroupTemplate
 *
 * mergeValues:
 *
 * setRequiredFields:
 *
 * formatFormData:
 *
 * getControl:
 *
 * ---- TODO: ----
 * TODO: add buildFormGroupTemplateFromLayout function
 * buildFormGroupTemplateFromLayout: Builds a FormGroupTemplate from a form layout
 */
/**
 * 'buildFormGroupTemplate' function
 *
 * Builds a template for an Angular FormGroup from a JSON Schema.
 *
 * TODO: add support for pattern properties
 * https://spacetelescope.github.io/understanding-json-schema/reference/object.html
 *
 * //  {any} jsf -
 * //  {any = null} nodeValue -
 * //  {boolean = true} mapArrays -
 * //  {string = ''} schemaPointer -
 * //  {string = ''} dataPointer -
 * //  {any = ''} templatePointer -
 * // {any} -
 */
export function buildFormGroupTemplate(jsf, nodeValue = null, setValues = true, schemaPointer = '', dataPointer = '', templatePointer = '') {
    const schema = JsonPointer.get(jsf.schema, schemaPointer);
    if (setValues) {
        if (!isDefined(nodeValue) && (jsf.formOptions.setSchemaDefaults === true ||
            (jsf.formOptions.setSchemaDefaults === 'auto' && isEmpty(jsf.formValues)))) {
            nodeValue = JsonPointer.get(jsf.schema, schemaPointer + '/default');
        }
    }
    else {
        nodeValue = null;
    }
    // TODO: If nodeValue still not set, check layout for default value
    const schemaType = JsonPointer.get(schema, '/type');
    const controlType = (hasOwn(schema, 'properties') || hasOwn(schema, 'additionalProperties')) &&
        schemaType === 'object' ? 'FormGroup' :
        (hasOwn(schema, 'items') || hasOwn(schema, 'additionalItems')) &&
            schemaType === 'array' ? 'FormArray' :
            !schemaType && hasOwn(schema, '$ref') ? '$ref' : 'FormControl';
    const shortDataPointer = removeRecursiveReferences(dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
    if (!jsf.dataMap.has(shortDataPointer)) {
        jsf.dataMap.set(shortDataPointer, new Map());
    }
    const nodeOptions = jsf.dataMap.get(shortDataPointer);
    if (!nodeOptions.has('schemaType')) {
        nodeOptions.set('schemaPointer', schemaPointer);
        nodeOptions.set('schemaType', schema.type);
        if (schema.format) {
            nodeOptions.set('schemaFormat', schema.format);
            if (!schema.type) {
                nodeOptions.set('schemaType', 'string');
            }
        }
        if (controlType) {
            nodeOptions.set('templatePointer', templatePointer);
            nodeOptions.set('templateType', controlType);
        }
    }
    let controls;
    const validators = getControlValidators(schema);
    switch (controlType) {
        case 'FormGroup':
            controls = {};
            if (hasOwn(schema, 'ui:order') || hasOwn(schema, 'properties')) {
                const propertyKeys = schema['ui:order'] || Object.keys(schema.properties);
                if (propertyKeys.includes('*') && !hasOwn(schema.properties, '*')) {
                    const unnamedKeys = Object.keys(schema.properties)
                        .filter(key => !propertyKeys.includes(key));
                    for (let i = propertyKeys.length - 1; i >= 0; i--) {
                        if (propertyKeys[i] === '*') {
                            propertyKeys.splice(i, 1, ...unnamedKeys);
                        }
                    }
                }
                propertyKeys
                    .filter(key => hasOwn(schema.properties, key) ||
                    hasOwn(schema, 'additionalProperties'))
                    .forEach(key => controls[key] = buildFormGroupTemplate(jsf, JsonPointer.get(nodeValue, [key]), setValues, schemaPointer + (hasOwn(schema.properties, key) ?
                    '/properties/' + key : '/additionalProperties'), dataPointer + '/' + key, templatePointer + '/controls/' + key));
                jsf.formOptions.fieldsRequired = setRequiredFields(schema, controls);
            }
            return { controlType, controls, validators };
        case 'FormArray':
            controls = [];
            const minItems = Math.max(schema.minItems || 0, nodeOptions.get('minItems') || 0);
            const maxItems = Math.min(schema.maxItems || 1000, nodeOptions.get('maxItems') || 1000);
            let additionalItemsPointer = null;
            if (isArray(schema.items)) { // 'items' is an array = tuple items
                const tupleItems = nodeOptions.get('tupleItems') ||
                    (isArray(schema.items) ? Math.min(schema.items.length, maxItems) : 0);
                for (let i = 0; i < tupleItems; i++) {
                    if (i < minItems) {
                        controls.push(buildFormGroupTemplate(jsf, isArray(nodeValue) ? nodeValue[i] : nodeValue, setValues, schemaPointer + '/items/' + i, dataPointer + '/' + i, templatePointer + '/controls/' + i));
                    }
                    else {
                        const schemaRefPointer = removeRecursiveReferences(schemaPointer + '/items/' + i, jsf.schemaRecursiveRefMap);
                        const itemRefPointer = removeRecursiveReferences(shortDataPointer + '/' + i, jsf.dataRecursiveRefMap, jsf.arrayMap);
                        const itemRecursive = itemRefPointer !== shortDataPointer + '/' + i;
                        if (!hasOwn(jsf.templateRefLibrary, itemRefPointer)) {
                            jsf.templateRefLibrary[itemRefPointer] = null;
                            jsf.templateRefLibrary[itemRefPointer] = buildFormGroupTemplate(jsf, null, setValues, schemaRefPointer, itemRefPointer, templatePointer + '/controls/' + i);
                        }
                        controls.push(isArray(nodeValue) ?
                            buildFormGroupTemplate(jsf, nodeValue[i], setValues, schemaPointer + '/items/' + i, dataPointer + '/' + i, templatePointer + '/controls/' + i) :
                            itemRecursive ?
                                null : cloneDeep(jsf.templateRefLibrary[itemRefPointer]));
                    }
                }
                // If 'additionalItems' is an object = additional list items (after tuple items)
                if (schema.items.length < maxItems && isObject(schema.additionalItems)) {
                    additionalItemsPointer = schemaPointer + '/additionalItems';
                }
                // If 'items' is an object = list items only (no tuple items)
            }
            else {
                additionalItemsPointer = schemaPointer + '/items';
            }
            if (additionalItemsPointer) {
                const schemaRefPointer = removeRecursiveReferences(additionalItemsPointer, jsf.schemaRecursiveRefMap);
                const itemRefPointer = removeRecursiveReferences(shortDataPointer + '/-', jsf.dataRecursiveRefMap, jsf.arrayMap);
                const itemRecursive = itemRefPointer !== shortDataPointer + '/-';
                if (!hasOwn(jsf.templateRefLibrary, itemRefPointer)) {
                    jsf.templateRefLibrary[itemRefPointer] = null;
                    jsf.templateRefLibrary[itemRefPointer] = buildFormGroupTemplate(jsf, null, setValues, schemaRefPointer, itemRefPointer, templatePointer + '/controls/-');
                }
                // const itemOptions = jsf.dataMap.get(itemRefPointer) || new Map();
                const itemOptions = nodeOptions;
                if (!itemRecursive || hasOwn(validators, 'required')) {
                    const arrayLength = Math.min(Math.max(itemRecursive ? 0 :
                        (itemOptions.get('tupleItems') + itemOptions.get('listItems')) || 0, isArray(nodeValue) ? nodeValue.length : 0), maxItems);
                    for (let i = controls.length; i < arrayLength; i++) {
                        controls.push(isArray(nodeValue) ?
                            buildFormGroupTemplate(jsf, nodeValue[i], setValues, schemaRefPointer, dataPointer + '/-', templatePointer + '/controls/-') :
                            itemRecursive ?
                                null : cloneDeep(jsf.templateRefLibrary[itemRefPointer]));
                    }
                }
            }
            return { controlType, controls, validators };
        case '$ref':
            const schemaRef = JsonPointer.compile(schema.$ref);
            const dataRef = JsonPointer.toDataPointer(schemaRef, schema);
            const refPointer = removeRecursiveReferences(dataRef, jsf.dataRecursiveRefMap, jsf.arrayMap);
            if (refPointer && !hasOwn(jsf.templateRefLibrary, refPointer)) {
                // Set to null first to prevent recursive reference from causing endless loop
                jsf.templateRefLibrary[refPointer] = null;
                const newTemplate = buildFormGroupTemplate(jsf, setValues, setValues, schemaRef);
                if (newTemplate) {
                    jsf.templateRefLibrary[refPointer] = newTemplate;
                }
                else {
                    delete jsf.templateRefLibrary[refPointer];
                }
            }
            return null;
        case 'FormControl':
            const value = {
                value: setValues && isPrimitive(nodeValue) ? nodeValue : null,
                disabled: nodeOptions.get('disabled') || false
            };
            return { controlType, value, validators };
        default:
            return null;
    }
}
/**
 * 'buildFormGroup' function
 *
 * // {any} template -
 * // {AbstractControl}
*/
export function buildFormGroup(template) {
    const validatorFns = [];
    let validatorFn = null;
    if (hasOwn(template, 'validators')) {
        forEach(template.validators, (parameters, validator) => {
            if (typeof JsonValidators[validator] === 'function') {
                validatorFns.push(JsonValidators[validator].apply(null, parameters));
            }
        });
        if (validatorFns.length &&
            inArray(template.controlType, ['FormGroup', 'FormArray'])) {
            validatorFn = validatorFns.length > 1 ?
                JsonValidators.compose(validatorFns) : validatorFns[0];
        }
    }
    if (hasOwn(template, 'controlType')) {
        switch (template.controlType) {
            case 'FormGroup':
                const groupControls = {};
                forEach(template.controls, (controls, key) => {
                    const newControl = buildFormGroup(controls);
                    if (newControl) {
                        groupControls[key] = newControl;
                    }
                });
                return new UntypedFormGroup(groupControls, validatorFn);
            case 'FormArray':
                return new UntypedFormArray(filter(map(template.controls, controls => buildFormGroup(controls))), validatorFn);
            case 'FormControl':
                return new UntypedFormControl(template.value, validatorFns);
        }
    }
    return null;
}
/**
 * 'mergeValues' function
 *
 * //  {any[]} ...valuesToMerge - Multiple values to merge
 * // {any} - Merged values
 */
export function mergeValues(...valuesToMerge) {
    let mergedValues = null;
    for (const currentValue of valuesToMerge) {
        if (!isEmpty(currentValue)) {
            if (typeof currentValue === 'object' &&
                (isEmpty(mergedValues) || typeof mergedValues !== 'object')) {
                if (isArray(currentValue)) {
                    mergedValues = [...currentValue];
                }
                else if (isObject(currentValue)) {
                    mergedValues = { ...currentValue };
                }
            }
            else if (typeof currentValue !== 'object') {
                mergedValues = currentValue;
            }
            else if (isObject(mergedValues) && isObject(currentValue)) {
                Object.assign(mergedValues, currentValue);
            }
            else if (isObject(mergedValues) && isArray(currentValue)) {
                const newValues = [];
                for (const value of currentValue) {
                    newValues.push(mergeValues(mergedValues, value));
                }
                mergedValues = newValues;
            }
            else if (isArray(mergedValues) && isObject(currentValue)) {
                const newValues = [];
                for (const value of mergedValues) {
                    newValues.push(mergeValues(value, currentValue));
                }
                mergedValues = newValues;
            }
            else if (isArray(mergedValues) && isArray(currentValue)) {
                const newValues = [];
                for (let i = 0; i < Math.max(mergedValues.length, currentValue.length); i++) {
                    if (i < mergedValues.length && i < currentValue.length) {
                        newValues.push(mergeValues(mergedValues[i], currentValue[i]));
                    }
                    else if (i < mergedValues.length) {
                        newValues.push(mergedValues[i]);
                    }
                    else if (i < currentValue.length) {
                        newValues.push(currentValue[i]);
                    }
                }
                mergedValues = newValues;
            }
        }
    }
    return mergedValues;
}
/**
 * 'setRequiredFields' function
 *
 * // {schema} schema - JSON Schema
 * // {object} formControlTemplate - Form Control Template object
 * // {boolean} - true if any fields have been set to required, false if not
 */
export function setRequiredFields(schema, formControlTemplate) {
    let fieldsRequired = false;
    if (hasOwn(schema, 'required') && !isEmpty(schema.required)) {
        fieldsRequired = true;
        let requiredArray = isArray(schema.required) ? schema.required : [schema.required];
        requiredArray = forEach(requiredArray, key => JsonPointer.set(formControlTemplate, '/' + key + '/validators/required', []));
    }
    return fieldsRequired;
    // TODO: Add support for patternProperties
    // https://spacetelescope.github.io/understanding-json-schema/reference/object.html#pattern-properties
}
/**
 * 'formatFormData' function
 *
 * // {any} formData - Angular FormGroup data object
 * // {Map<string, any>} dataMap -
 * // {Map<string, string>} recursiveRefMap -
 * // {Map<string, number>} arrayMap -
 * // {boolean = false} fixErrors - if TRUE, tries to fix data
 * // {any} - formatted data object
 */
export function formatFormData(formData, dataMap, recursiveRefMap, arrayMap, returnEmptyFields = false, fixErrors = false) {
    if (formData === null || typeof formData !== 'object') {
        return formData;
    }
    const formattedData = isArray(formData) ? [] : {};
    JsonPointer.forEachDeep(formData, (value, dataPointer) => {
        // If returnEmptyFields === true,
        // add empty arrays and objects to all allowed keys
        if (returnEmptyFields && isArray(value)) {
            JsonPointer.set(formattedData, dataPointer, []);
        }
        else if (returnEmptyFields && isObject(value) && !isDate(value)) {
            JsonPointer.set(formattedData, dataPointer, {});
        }
        else {
            const genericPointer = JsonPointer.has(dataMap, [dataPointer, 'schemaType']) ? dataPointer :
                removeRecursiveReferences(dataPointer, recursiveRefMap, arrayMap);
            if (JsonPointer.has(dataMap, [genericPointer, 'schemaType'])) {
                const schemaType = dataMap.get(genericPointer).get('schemaType');
                if (schemaType === 'null') {
                    JsonPointer.set(formattedData, dataPointer, null);
                }
                else if ((hasValue(value) || returnEmptyFields) &&
                    inArray(schemaType, ['string', 'integer', 'number', 'boolean'])) {
                    const newValue = (fixErrors || (value === null && returnEmptyFields)) ?
                        toSchemaType(value, schemaType) : toJavaScriptType(value, schemaType);
                    if (isDefined(newValue) || returnEmptyFields) {
                        JsonPointer.set(formattedData, dataPointer, newValue);
                    }
                }
                // Finish incomplete 'date-time' entries
                if (dataMap.get(genericPointer).get('schemaFormat') === 'date-time') {
                    // "2000-03-14T01:59:26.535" -> "2000-03-14T01:59:26.535Z" (add "Z")
                    if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, `${value}Z`);
                        // "2000-03-14T01:59" -> "2000-03-14T01:59:00Z" (add ":00Z")
                    }
                    else if (/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s][0-2]\d:[0-5]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, `${value}:00Z`);
                        // "2000-03-14" -> "2000-03-14T00:00:00Z" (add "T00:00:00Z")
                    }
                    else if (fixErrors && /^\d\d\d\d-[0-1]\d-[0-3]\d$/i.test(value)) {
                        JsonPointer.set(formattedData, dataPointer, `${value}:00:00:00Z`);
                    }
                }
            }
            else if (typeof value !== 'object' || isDate(value) ||
                (value === null && returnEmptyFields)) {
                console.error('formatFormData error: ' +
                    `Schema type not found for form value at ${genericPointer}`);
                console.error('dataMap', dataMap);
                console.error('recursiveRefMap', recursiveRefMap);
                console.error('genericPointer', genericPointer);
            }
        }
    });
    return formattedData;
}
/**
 * 'getControl' function
 *
 * Uses a JSON Pointer for a data object to retrieve a control from
 * an Angular formGroup or formGroup template. (Note: though a formGroup
 * template is much simpler, its basic structure is idential to a formGroup).
 *
 * If the optional third parameter 'returnGroup' is set to TRUE, the group
 * containing the control is returned, rather than the control itself.
 *
 * // {FormGroup} formGroup - Angular FormGroup to get value from
 * // {Pointer} dataPointer - JSON Pointer (string or array)
 * // {boolean = false} returnGroup - If true, return group containing control
 * // {group} - Located value (or null, if no control found)
 */
export function getControl(formGroup, dataPointer, returnGroup = false) {
    if (!isObject(formGroup) || !JsonPointer.isJsonPointer(dataPointer)) {
        if (!JsonPointer.isJsonPointer(dataPointer)) {
            // If dataPointer input is not a valid JSON pointer, check to
            // see if it is instead a valid object path, using dot notaion
            if (typeof dataPointer === 'string') {
                const formControl = formGroup.get(dataPointer);
                if (formControl) {
                    return formControl;
                }
            }
            console.error(`getControl error: Invalid JSON Pointer: ${dataPointer}`);
        }
        if (!isObject(formGroup)) {
            console.error(`getControl error: Invalid formGroup: ${formGroup}`);
        }
        return null;
    }
    let dataPointerArray = JsonPointer.parse(dataPointer);
    if (returnGroup) {
        dataPointerArray = dataPointerArray.slice(0, -1);
    }
    // If formGroup input is a real formGroup (not a formGroup template)
    // try using formGroup.get() to return the control
    if (typeof formGroup.get === 'function' &&
        dataPointerArray.every(key => key.indexOf('.') === -1)) {
        const formControl = formGroup.get(dataPointerArray.join('.'));
        if (formControl) {
            return formControl;
        }
    }
    // If formGroup input is a formGroup template,
    // or formGroup.get() failed to return the control,
    // search the formGroup object for dataPointer's control
    let subGroup = formGroup;
    for (const key of dataPointerArray) {
        if (hasOwn(subGroup, 'controls')) {
            subGroup = subGroup.controls;
        }
        if (isArray(subGroup) && (key === '-')) {
            subGroup = subGroup[subGroup.length - 1];
        }
        else if (hasOwn(subGroup, key)) {
            subGroup = subGroup[key];
        }
        else {
            console.error(`getControl error: Unable to find "${key}" item in FormGroup.`);
            console.error(dataPointer);
            console.error(formGroup);
            return;
        }
    }
    return subGroup;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1ncm91cC5mdW5jdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1mb3Jtd29ya3MtY29yZS9zcmMvbGliL3NoYXJlZC9mb3JtLWdyb3VwLmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsTUFBTSxrQkFBa0IsQ0FBQztBQUN6QyxPQUFPLE1BQU0sTUFBTSxlQUFlLENBQUM7QUFDbkMsT0FBTyxHQUFHLE1BQU0sWUFBWSxDQUFDO0FBQzdCLE9BQU8sRUFFTCxnQkFBZ0IsRUFDaEIsa0JBQWtCLEVBQ2xCLGdCQUFnQixFQUVqQixNQUFNLGdCQUFnQixDQUFDO0FBQ3hCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLHlCQUF5QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDMUYsT0FBTyxFQUNMLFFBQVEsRUFDUixPQUFPLEVBQ1AsT0FBTyxFQUNQLE1BQU0sRUFDTixTQUFTLEVBQ1QsT0FBTyxFQUNQLFFBQVEsRUFDUixXQUFXLEVBRVgsZ0JBQWdCLEVBQ2hCLFlBQVksRUFDYixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBRSxXQUFXLEVBQVcsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFJbkQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUVIOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE1BQU0sVUFBVSxzQkFBc0IsQ0FDcEMsR0FBUSxFQUFFLFlBQWlCLElBQUksRUFBRSxTQUFTLEdBQUcsSUFBSSxFQUNqRCxhQUFhLEdBQUcsRUFBRSxFQUFFLFdBQVcsR0FBRyxFQUFFLEVBQUUsZUFBZSxHQUFHLEVBQUU7SUFFMUQsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLEdBQUcs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LFFBQVEsR0FBRyxTQUFTLENBQUM7SUFDekIsS0FBSyxNQUFNLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRTtRQUNsQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLEVBQUU7WUFBRSxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztTQUFFO1FBQ25FLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ3RDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztTQUMxQzthQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUNoQyxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzFCO2FBQU07WUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxHQUFHLHNCQUFzQixDQUFDLENBQUM7WUFDOUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzQixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3pCLE9BQU87U0FDUjtLQUNGO0lBQ0QsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbG9uZURlZXAgZnJvbSAnbG9kYXNoL2Nsb25lRGVlcCc7XG5pbXBvcnQgZmlsdGVyIGZyb20gJ2xvZGFzaC9maWx0ZXInO1xuaW1wb3J0IG1hcCBmcm9tICdsb2Rhc2gvbWFwJztcbmltcG9ydCB7XG4gIEFic3RyYWN0Q29udHJvbCxcbiAgVW50eXBlZEZvcm1BcnJheSxcbiAgVW50eXBlZEZvcm1Db250cm9sLFxuICBVbnR5cGVkRm9ybUdyb3VwLFxuICBWYWxpZGF0b3JGblxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBmb3JFYWNoLCBoYXNPd24gfSBmcm9tICcuL3V0aWxpdHkuZnVuY3Rpb25zJztcbmltcG9ydCB7IGdldENvbnRyb2xWYWxpZGF0b3JzLCByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzIH0gZnJvbSAnLi9qc29uLXNjaGVtYS5mdW5jdGlvbnMnO1xuaW1wb3J0IHtcbiAgaGFzVmFsdWUsXG4gIGluQXJyYXksXG4gIGlzQXJyYXksXG4gIGlzRGF0ZSxcbiAgaXNEZWZpbmVkLFxuICBpc0VtcHR5LFxuICBpc09iamVjdCxcbiAgaXNQcmltaXRpdmUsXG4gIFNjaGVtYVByaW1pdGl2ZVR5cGUsXG4gIHRvSmF2YVNjcmlwdFR5cGUsXG4gIHRvU2NoZW1hVHlwZVxufSBmcm9tICcuL3ZhbGlkYXRvci5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgSnNvblBvaW50ZXIsIFBvaW50ZXIgfSBmcm9tICcuL2pzb25wb2ludGVyLmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBKc29uVmFsaWRhdG9ycyB9IGZyb20gJy4vanNvbi52YWxpZGF0b3JzJztcblxuXG5cbi8qKlxuICogRm9ybUdyb3VwIGZ1bmN0aW9uIGxpYnJhcnk6XG4gKlxuICogYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZTogIEJ1aWxkcyBhIEZvcm1Hcm91cFRlbXBsYXRlIGZyb20gc2NoZW1hXG4gKlxuICogYnVpbGRGb3JtR3JvdXA6ICAgICAgICAgIEJ1aWxkcyBhbiBBbmd1bGFyIEZvcm1Hcm91cCBmcm9tIGEgRm9ybUdyb3VwVGVtcGxhdGVcbiAqXG4gKiBtZXJnZVZhbHVlczpcbiAqXG4gKiBzZXRSZXF1aXJlZEZpZWxkczpcbiAqXG4gKiBmb3JtYXRGb3JtRGF0YTpcbiAqXG4gKiBnZXRDb250cm9sOlxuICpcbiAqIC0tLS0gVE9ETzogLS0tLVxuICogVE9ETzogYWRkIGJ1aWxkRm9ybUdyb3VwVGVtcGxhdGVGcm9tTGF5b3V0IGZ1bmN0aW9uXG4gKiBidWlsZEZvcm1Hcm91cFRlbXBsYXRlRnJvbUxheW91dDogQnVpbGRzIGEgRm9ybUdyb3VwVGVtcGxhdGUgZnJvbSBhIGZvcm0gbGF5b3V0XG4gKi9cblxuLyoqXG4gKiAnYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZScgZnVuY3Rpb25cbiAqXG4gKiBCdWlsZHMgYSB0ZW1wbGF0ZSBmb3IgYW4gQW5ndWxhciBGb3JtR3JvdXAgZnJvbSBhIEpTT04gU2NoZW1hLlxuICpcbiAqIFRPRE86IGFkZCBzdXBwb3J0IGZvciBwYXR0ZXJuIHByb3BlcnRpZXNcbiAqIGh0dHBzOi8vc3BhY2V0ZWxlc2NvcGUuZ2l0aHViLmlvL3VuZGVyc3RhbmRpbmctanNvbi1zY2hlbWEvcmVmZXJlbmNlL29iamVjdC5odG1sXG4gKlxuICogLy8gIHthbnl9IGpzZiAtXG4gKiAvLyAge2FueSA9IG51bGx9IG5vZGVWYWx1ZSAtXG4gKiAvLyAge2Jvb2xlYW4gPSB0cnVlfSBtYXBBcnJheXMgLVxuICogLy8gIHtzdHJpbmcgPSAnJ30gc2NoZW1hUG9pbnRlciAtXG4gKiAvLyAge3N0cmluZyA9ICcnfSBkYXRhUG9pbnRlciAtXG4gKiAvLyAge2FueSA9ICcnfSB0ZW1wbGF0ZVBvaW50ZXIgLVxuICogLy8ge2FueX0gLVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAganNmOiBhbnksIG5vZGVWYWx1ZTogYW55ID0gbnVsbCwgc2V0VmFsdWVzID0gdHJ1ZSxcbiAgc2NoZW1hUG9pbnRlciA9ICcnLCBkYXRhUG9pbnRlciA9ICcnLCB0ZW1wbGF0ZVBvaW50ZXIgPSAnJ1xuKSB7XG4gIGNvbnN0IHNjaGVtYSA9IEpzb25Qb2ludGVyLmdldChqc2Yuc2NoZW1hLCBzY2hlbWFQb2ludGVyKTtcbiAgaWYgKHNldFZhbHVlcykge1xuICAgIGlmICghaXNEZWZpbmVkKG5vZGVWYWx1ZSkgJiYgKFxuICAgICAganNmLmZvcm1PcHRpb25zLnNldFNjaGVtYURlZmF1bHRzID09PSB0cnVlIHx8XG4gICAgICAoanNmLmZvcm1PcHRpb25zLnNldFNjaGVtYURlZmF1bHRzID09PSAnYXV0bycgJiYgaXNFbXB0eShqc2YuZm9ybVZhbHVlcykpXG4gICAgKSkge1xuICAgICAgbm9kZVZhbHVlID0gSnNvblBvaW50ZXIuZ2V0KGpzZi5zY2hlbWEsIHNjaGVtYVBvaW50ZXIgKyAnL2RlZmF1bHQnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbm9kZVZhbHVlID0gbnVsbDtcbiAgfVxuICAvLyBUT0RPOiBJZiBub2RlVmFsdWUgc3RpbGwgbm90IHNldCwgY2hlY2sgbGF5b3V0IGZvciBkZWZhdWx0IHZhbHVlXG4gIGNvbnN0IHNjaGVtYVR5cGU6IHN0cmluZyB8IHN0cmluZ1tdID0gSnNvblBvaW50ZXIuZ2V0KHNjaGVtYSwgJy90eXBlJyk7XG4gIGNvbnN0IGNvbnRyb2xUeXBlID1cbiAgICAoaGFzT3duKHNjaGVtYSwgJ3Byb3BlcnRpZXMnKSB8fCBoYXNPd24oc2NoZW1hLCAnYWRkaXRpb25hbFByb3BlcnRpZXMnKSkgJiZcbiAgICAgIHNjaGVtYVR5cGUgPT09ICdvYmplY3QnID8gJ0Zvcm1Hcm91cCcgOlxuICAgICAgKGhhc093bihzY2hlbWEsICdpdGVtcycpIHx8IGhhc093bihzY2hlbWEsICdhZGRpdGlvbmFsSXRlbXMnKSkgJiZcbiAgICAgICAgc2NoZW1hVHlwZSA9PT0gJ2FycmF5JyA/ICdGb3JtQXJyYXknIDpcbiAgICAgICAgIXNjaGVtYVR5cGUgJiYgaGFzT3duKHNjaGVtYSwgJyRyZWYnKSA/ICckcmVmJyA6ICdGb3JtQ29udHJvbCc7XG4gIGNvbnN0IHNob3J0RGF0YVBvaW50ZXIgPVxuICAgIHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoZGF0YVBvaW50ZXIsIGpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLCBqc2YuYXJyYXlNYXApO1xuICBpZiAoIWpzZi5kYXRhTWFwLmhhcyhzaG9ydERhdGFQb2ludGVyKSkge1xuICAgIGpzZi5kYXRhTWFwLnNldChzaG9ydERhdGFQb2ludGVyLCBuZXcgTWFwKCkpO1xuICB9XG4gIGNvbnN0IG5vZGVPcHRpb25zID0ganNmLmRhdGFNYXAuZ2V0KHNob3J0RGF0YVBvaW50ZXIpO1xuICBpZiAoIW5vZGVPcHRpb25zLmhhcygnc2NoZW1hVHlwZScpKSB7XG4gICAgbm9kZU9wdGlvbnMuc2V0KCdzY2hlbWFQb2ludGVyJywgc2NoZW1hUG9pbnRlcik7XG4gICAgbm9kZU9wdGlvbnMuc2V0KCdzY2hlbWFUeXBlJywgc2NoZW1hLnR5cGUpO1xuICAgIGlmIChzY2hlbWEuZm9ybWF0KSB7XG4gICAgICBub2RlT3B0aW9ucy5zZXQoJ3NjaGVtYUZvcm1hdCcsIHNjaGVtYS5mb3JtYXQpO1xuICAgICAgaWYgKCFzY2hlbWEudHlwZSkgeyBub2RlT3B0aW9ucy5zZXQoJ3NjaGVtYVR5cGUnLCAnc3RyaW5nJyk7IH1cbiAgICB9XG4gICAgaWYgKGNvbnRyb2xUeXBlKSB7XG4gICAgICBub2RlT3B0aW9ucy5zZXQoJ3RlbXBsYXRlUG9pbnRlcicsIHRlbXBsYXRlUG9pbnRlcik7XG4gICAgICBub2RlT3B0aW9ucy5zZXQoJ3RlbXBsYXRlVHlwZScsIGNvbnRyb2xUeXBlKTtcbiAgICB9XG4gIH1cbiAgbGV0IGNvbnRyb2xzOiBhbnk7XG4gIGNvbnN0IHZhbGlkYXRvcnMgPSBnZXRDb250cm9sVmFsaWRhdG9ycyhzY2hlbWEpO1xuICBzd2l0Y2ggKGNvbnRyb2xUeXBlKSB7XG5cbiAgICBjYXNlICdGb3JtR3JvdXAnOlxuICAgICAgY29udHJvbHMgPSB7fTtcbiAgICAgIGlmIChoYXNPd24oc2NoZW1hLCAndWk6b3JkZXInKSB8fCBoYXNPd24oc2NoZW1hLCAncHJvcGVydGllcycpKSB7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5S2V5cyA9IHNjaGVtYVsndWk6b3JkZXInXSB8fCBPYmplY3Qua2V5cyhzY2hlbWEucHJvcGVydGllcyk7XG4gICAgICAgIGlmIChwcm9wZXJ0eUtleXMuaW5jbHVkZXMoJyonKSAmJiAhaGFzT3duKHNjaGVtYS5wcm9wZXJ0aWVzLCAnKicpKSB7XG4gICAgICAgICAgY29uc3QgdW5uYW1lZEtleXMgPSBPYmplY3Qua2V5cyhzY2hlbWEucHJvcGVydGllcylcbiAgICAgICAgICAgIC5maWx0ZXIoa2V5ID0+ICFwcm9wZXJ0eUtleXMuaW5jbHVkZXMoa2V5KSk7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IHByb3BlcnR5S2V5cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5S2V5c1tpXSA9PT0gJyonKSB7XG4gICAgICAgICAgICAgIHByb3BlcnR5S2V5cy5zcGxpY2UoaSwgMSwgLi4udW5uYW1lZEtleXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcm9wZXJ0eUtleXNcbiAgICAgICAgICAuZmlsdGVyKGtleSA9PiBoYXNPd24oc2NoZW1hLnByb3BlcnRpZXMsIGtleSkgfHxcbiAgICAgICAgICAgIGhhc093bihzY2hlbWEsICdhZGRpdGlvbmFsUHJvcGVydGllcycpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5mb3JFYWNoKGtleSA9PiBjb250cm9sc1trZXldID0gYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgIGpzZiwgSnNvblBvaW50ZXIuZ2V0KG5vZGVWYWx1ZSwgWzxzdHJpbmc+a2V5XSksIHNldFZhbHVlcyxcbiAgICAgICAgICAgIHNjaGVtYVBvaW50ZXIgKyAoaGFzT3duKHNjaGVtYS5wcm9wZXJ0aWVzLCBrZXkpID9cbiAgICAgICAgICAgICAgJy9wcm9wZXJ0aWVzLycgKyBrZXkgOiAnL2FkZGl0aW9uYWxQcm9wZXJ0aWVzJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGRhdGFQb2ludGVyICsgJy8nICsga2V5LFxuICAgICAgICAgICAgdGVtcGxhdGVQb2ludGVyICsgJy9jb250cm9scy8nICsga2V5XG4gICAgICAgICAgKSk7XG4gICAgICAgIGpzZi5mb3JtT3B0aW9ucy5maWVsZHNSZXF1aXJlZCA9IHNldFJlcXVpcmVkRmllbGRzKHNjaGVtYSwgY29udHJvbHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgY29udHJvbFR5cGUsIGNvbnRyb2xzLCB2YWxpZGF0b3JzIH07XG5cbiAgICBjYXNlICdGb3JtQXJyYXknOlxuICAgICAgY29udHJvbHMgPSBbXTtcbiAgICAgIGNvbnN0IG1pbkl0ZW1zID1cbiAgICAgICAgTWF0aC5tYXgoc2NoZW1hLm1pbkl0ZW1zIHx8IDAsIG5vZGVPcHRpb25zLmdldCgnbWluSXRlbXMnKSB8fCAwKTtcbiAgICAgIGNvbnN0IG1heEl0ZW1zID1cbiAgICAgICAgTWF0aC5taW4oc2NoZW1hLm1heEl0ZW1zIHx8IDEwMDAsIG5vZGVPcHRpb25zLmdldCgnbWF4SXRlbXMnKSB8fCAxMDAwKTtcbiAgICAgIGxldCBhZGRpdGlvbmFsSXRlbXNQb2ludGVyOiBzdHJpbmcgPSBudWxsO1xuICAgICAgaWYgKGlzQXJyYXkoc2NoZW1hLml0ZW1zKSkgeyAvLyAnaXRlbXMnIGlzIGFuIGFycmF5ID0gdHVwbGUgaXRlbXNcbiAgICAgICAgY29uc3QgdHVwbGVJdGVtcyA9IG5vZGVPcHRpb25zLmdldCgndHVwbGVJdGVtcycpIHx8XG4gICAgICAgICAgKGlzQXJyYXkoc2NoZW1hLml0ZW1zKSA/IE1hdGgubWluKHNjaGVtYS5pdGVtcy5sZW5ndGgsIG1heEl0ZW1zKSA6IDApO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHR1cGxlSXRlbXM7IGkrKykge1xuICAgICAgICAgIGlmIChpIDwgbWluSXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnRyb2xzLnB1c2goYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgICAganNmLCBpc0FycmF5KG5vZGVWYWx1ZSkgPyBub2RlVmFsdWVbaV0gOiBub2RlVmFsdWUsIHNldFZhbHVlcyxcbiAgICAgICAgICAgICAgc2NoZW1hUG9pbnRlciArICcvaXRlbXMvJyArIGksXG4gICAgICAgICAgICAgIGRhdGFQb2ludGVyICsgJy8nICsgaSxcbiAgICAgICAgICAgICAgdGVtcGxhdGVQb2ludGVyICsgJy9jb250cm9scy8nICsgaVxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHNjaGVtYVJlZlBvaW50ZXIgPSByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKFxuICAgICAgICAgICAgICBzY2hlbWFQb2ludGVyICsgJy9pdGVtcy8nICsgaSwganNmLnNjaGVtYVJlY3Vyc2l2ZVJlZk1hcFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1SZWZQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhcbiAgICAgICAgICAgICAgc2hvcnREYXRhUG9pbnRlciArICcvJyArIGksIGpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLCBqc2YuYXJyYXlNYXBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBpdGVtUmVjdXJzaXZlID0gaXRlbVJlZlBvaW50ZXIgIT09IHNob3J0RGF0YVBvaW50ZXIgKyAnLycgKyBpO1xuICAgICAgICAgICAgaWYgKCFoYXNPd24oanNmLnRlbXBsYXRlUmVmTGlicmFyeSwgaXRlbVJlZlBvaW50ZXIpKSB7XG4gICAgICAgICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdID0gbnVsbDtcbiAgICAgICAgICAgICAganNmLnRlbXBsYXRlUmVmTGlicmFyeVtpdGVtUmVmUG9pbnRlcl0gPSBidWlsZEZvcm1Hcm91cFRlbXBsYXRlKFxuICAgICAgICAgICAgICAgIGpzZiwgbnVsbCwgc2V0VmFsdWVzLFxuICAgICAgICAgICAgICAgIHNjaGVtYVJlZlBvaW50ZXIsXG4gICAgICAgICAgICAgICAgaXRlbVJlZlBvaW50ZXIsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVQb2ludGVyICsgJy9jb250cm9scy8nICsgaVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udHJvbHMucHVzaChcbiAgICAgICAgICAgICAgaXNBcnJheShub2RlVmFsdWUpID9cbiAgICAgICAgICAgICAgICBidWlsZEZvcm1Hcm91cFRlbXBsYXRlKFxuICAgICAgICAgICAgICAgICAganNmLCBub2RlVmFsdWVbaV0sIHNldFZhbHVlcyxcbiAgICAgICAgICAgICAgICAgIHNjaGVtYVBvaW50ZXIgKyAnL2l0ZW1zLycgKyBpLFxuICAgICAgICAgICAgICAgICAgZGF0YVBvaW50ZXIgKyAnLycgKyBpLFxuICAgICAgICAgICAgICAgICAgdGVtcGxhdGVQb2ludGVyICsgJy9jb250cm9scy8nICsgaVxuICAgICAgICAgICAgICAgICkgOlxuICAgICAgICAgICAgICAgIGl0ZW1SZWN1cnNpdmUgP1xuICAgICAgICAgICAgICAgICAgbnVsbCA6IGNsb25lRGVlcChqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgJ2FkZGl0aW9uYWxJdGVtcycgaXMgYW4gb2JqZWN0ID0gYWRkaXRpb25hbCBsaXN0IGl0ZW1zIChhZnRlciB0dXBsZSBpdGVtcylcbiAgICAgICAgaWYgKHNjaGVtYS5pdGVtcy5sZW5ndGggPCBtYXhJdGVtcyAmJiBpc09iamVjdChzY2hlbWEuYWRkaXRpb25hbEl0ZW1zKSkge1xuICAgICAgICAgIGFkZGl0aW9uYWxJdGVtc1BvaW50ZXIgPSBzY2hlbWFQb2ludGVyICsgJy9hZGRpdGlvbmFsSXRlbXMnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgJ2l0ZW1zJyBpcyBhbiBvYmplY3QgPSBsaXN0IGl0ZW1zIG9ubHkgKG5vIHR1cGxlIGl0ZW1zKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkaXRpb25hbEl0ZW1zUG9pbnRlciA9IHNjaGVtYVBvaW50ZXIgKyAnL2l0ZW1zJztcbiAgICAgIH1cblxuICAgICAgaWYgKGFkZGl0aW9uYWxJdGVtc1BvaW50ZXIpIHtcbiAgICAgICAgY29uc3Qgc2NoZW1hUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgYWRkaXRpb25hbEl0ZW1zUG9pbnRlciwganNmLnNjaGVtYVJlY3Vyc2l2ZVJlZk1hcFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBpdGVtUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgc2hvcnREYXRhUG9pbnRlciArICcvLScsIGpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLCBqc2YuYXJyYXlNYXBcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgaXRlbVJlY3Vyc2l2ZSA9IGl0ZW1SZWZQb2ludGVyICE9PSBzaG9ydERhdGFQb2ludGVyICsgJy8tJztcbiAgICAgICAgaWYgKCFoYXNPd24oanNmLnRlbXBsYXRlUmVmTGlicmFyeSwgaXRlbVJlZlBvaW50ZXIpKSB7XG4gICAgICAgICAganNmLnRlbXBsYXRlUmVmTGlicmFyeVtpdGVtUmVmUG9pbnRlcl0gPSBudWxsO1xuICAgICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdID0gYnVpbGRGb3JtR3JvdXBUZW1wbGF0ZShcbiAgICAgICAgICAgIGpzZiwgbnVsbCwgc2V0VmFsdWVzLFxuICAgICAgICAgICAgc2NoZW1hUmVmUG9pbnRlcixcbiAgICAgICAgICAgIGl0ZW1SZWZQb2ludGVyLFxuICAgICAgICAgICAgdGVtcGxhdGVQb2ludGVyICsgJy9jb250cm9scy8tJ1xuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc3QgaXRlbU9wdGlvbnMgPSBqc2YuZGF0YU1hcC5nZXQoaXRlbVJlZlBvaW50ZXIpIHx8IG5ldyBNYXAoKTtcbiAgICAgICAgY29uc3QgaXRlbU9wdGlvbnMgPSBub2RlT3B0aW9ucztcbiAgICAgICAgaWYgKCFpdGVtUmVjdXJzaXZlIHx8IGhhc093bih2YWxpZGF0b3JzLCAncmVxdWlyZWQnKSkge1xuICAgICAgICAgIGNvbnN0IGFycmF5TGVuZ3RoID0gTWF0aC5taW4oTWF0aC5tYXgoXG4gICAgICAgICAgICBpdGVtUmVjdXJzaXZlID8gMCA6XG4gICAgICAgICAgICAgIChpdGVtT3B0aW9ucy5nZXQoJ3R1cGxlSXRlbXMnKSArIGl0ZW1PcHRpb25zLmdldCgnbGlzdEl0ZW1zJykpIHx8IDAsXG4gICAgICAgICAgICBpc0FycmF5KG5vZGVWYWx1ZSkgPyBub2RlVmFsdWUubGVuZ3RoIDogMFxuICAgICAgICAgICksIG1heEl0ZW1zKTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gY29udHJvbHMubGVuZ3RoOyBpIDwgYXJyYXlMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29udHJvbHMucHVzaChcbiAgICAgICAgICAgICAgaXNBcnJheShub2RlVmFsdWUpID9cbiAgICAgICAgICAgICAgICBidWlsZEZvcm1Hcm91cFRlbXBsYXRlKFxuICAgICAgICAgICAgICAgICAganNmLCBub2RlVmFsdWVbaV0sIHNldFZhbHVlcyxcbiAgICAgICAgICAgICAgICAgIHNjaGVtYVJlZlBvaW50ZXIsXG4gICAgICAgICAgICAgICAgICBkYXRhUG9pbnRlciArICcvLScsXG4gICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVBvaW50ZXIgKyAnL2NvbnRyb2xzLy0nXG4gICAgICAgICAgICAgICAgKSA6XG4gICAgICAgICAgICAgICAgaXRlbVJlY3Vyc2l2ZSA/XG4gICAgICAgICAgICAgICAgICBudWxsIDogY2xvbmVEZWVwKGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7IGNvbnRyb2xUeXBlLCBjb250cm9scywgdmFsaWRhdG9ycyB9O1xuXG4gICAgY2FzZSAnJHJlZic6XG4gICAgICBjb25zdCBzY2hlbWFSZWYgPSBKc29uUG9pbnRlci5jb21waWxlKHNjaGVtYS4kcmVmKTtcbiAgICAgIGNvbnN0IGRhdGFSZWYgPSBKc29uUG9pbnRlci50b0RhdGFQb2ludGVyKHNjaGVtYVJlZiwgc2NoZW1hKTtcbiAgICAgIGNvbnN0IHJlZlBvaW50ZXIgPSByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKFxuICAgICAgICBkYXRhUmVmLCBqc2YuZGF0YVJlY3Vyc2l2ZVJlZk1hcCwganNmLmFycmF5TWFwXG4gICAgICApO1xuICAgICAgaWYgKHJlZlBvaW50ZXIgJiYgIWhhc093bihqc2YudGVtcGxhdGVSZWZMaWJyYXJ5LCByZWZQb2ludGVyKSkge1xuICAgICAgICAvLyBTZXQgdG8gbnVsbCBmaXJzdCB0byBwcmV2ZW50IHJlY3Vyc2l2ZSByZWZlcmVuY2UgZnJvbSBjYXVzaW5nIGVuZGxlc3MgbG9vcFxuICAgICAgICBqc2YudGVtcGxhdGVSZWZMaWJyYXJ5W3JlZlBvaW50ZXJdID0gbnVsbDtcbiAgICAgICAgY29uc3QgbmV3VGVtcGxhdGUgPSBidWlsZEZvcm1Hcm91cFRlbXBsYXRlKGpzZiwgc2V0VmFsdWVzLCBzZXRWYWx1ZXMsIHNjaGVtYVJlZik7XG4gICAgICAgIGlmIChuZXdUZW1wbGF0ZSkge1xuICAgICAgICAgIGpzZi50ZW1wbGF0ZVJlZkxpYnJhcnlbcmVmUG9pbnRlcl0gPSBuZXdUZW1wbGF0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUganNmLnRlbXBsYXRlUmVmTGlicmFyeVtyZWZQb2ludGVyXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICBjYXNlICdGb3JtQ29udHJvbCc6XG4gICAgICBjb25zdCB2YWx1ZSA9IHtcbiAgICAgICAgdmFsdWU6IHNldFZhbHVlcyAmJiBpc1ByaW1pdGl2ZShub2RlVmFsdWUpID8gbm9kZVZhbHVlIDogbnVsbCxcbiAgICAgICAgZGlzYWJsZWQ6IG5vZGVPcHRpb25zLmdldCgnZGlzYWJsZWQnKSB8fCBmYWxzZVxuICAgICAgfTtcbiAgICAgIHJldHVybiB7IGNvbnRyb2xUeXBlLCB2YWx1ZSwgdmFsaWRhdG9ycyB9O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogJ2J1aWxkRm9ybUdyb3VwJyBmdW5jdGlvblxuICpcbiAqIC8vIHthbnl9IHRlbXBsYXRlIC1cbiAqIC8vIHtBYnN0cmFjdENvbnRyb2x9XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRm9ybUdyb3VwKHRlbXBsYXRlOiBhbnkpOiBBYnN0cmFjdENvbnRyb2wge1xuICBjb25zdCB2YWxpZGF0b3JGbnM6IFZhbGlkYXRvckZuW10gPSBbXTtcbiAgbGV0IHZhbGlkYXRvckZuOiBWYWxpZGF0b3JGbiA9IG51bGw7XG4gIGlmIChoYXNPd24odGVtcGxhdGUsICd2YWxpZGF0b3JzJykpIHtcbiAgICBmb3JFYWNoKHRlbXBsYXRlLnZhbGlkYXRvcnMsIChwYXJhbWV0ZXJzLCB2YWxpZGF0b3IpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgSnNvblZhbGlkYXRvcnNbdmFsaWRhdG9yXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YWxpZGF0b3JGbnMucHVzaChKc29uVmFsaWRhdG9yc1t2YWxpZGF0b3JdLmFwcGx5KG51bGwsIHBhcmFtZXRlcnMpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodmFsaWRhdG9yRm5zLmxlbmd0aCAmJlxuICAgICAgaW5BcnJheSh0ZW1wbGF0ZS5jb250cm9sVHlwZSwgWydGb3JtR3JvdXAnLCAnRm9ybUFycmF5J10pXG4gICAgKSB7XG4gICAgICB2YWxpZGF0b3JGbiA9IHZhbGlkYXRvckZucy5sZW5ndGggPiAxID9cbiAgICAgICAgSnNvblZhbGlkYXRvcnMuY29tcG9zZSh2YWxpZGF0b3JGbnMpIDogdmFsaWRhdG9yRm5zWzBdO1xuICAgIH1cbiAgfVxuICBpZiAoaGFzT3duKHRlbXBsYXRlLCAnY29udHJvbFR5cGUnKSkge1xuICAgIHN3aXRjaCAodGVtcGxhdGUuY29udHJvbFR5cGUpIHtcbiAgICAgIGNhc2UgJ0Zvcm1Hcm91cCc6XG4gICAgICAgIGNvbnN0IGdyb3VwQ29udHJvbHM6IHsgW2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sIH0gPSB7fTtcbiAgICAgICAgZm9yRWFjaCh0ZW1wbGF0ZS5jb250cm9scywgKGNvbnRyb2xzLCBrZXkpID0+IHtcbiAgICAgICAgICBjb25zdCBuZXdDb250cm9sOiBBYnN0cmFjdENvbnRyb2wgPSBidWlsZEZvcm1Hcm91cChjb250cm9scyk7XG4gICAgICAgICAgaWYgKG5ld0NvbnRyb2wpIHsgZ3JvdXBDb250cm9sc1trZXldID0gbmV3Q29udHJvbDsgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG5ldyBVbnR5cGVkRm9ybUdyb3VwKGdyb3VwQ29udHJvbHMsIHZhbGlkYXRvckZuKTtcbiAgICAgIGNhc2UgJ0Zvcm1BcnJheSc6XG4gICAgICAgIHJldHVybiBuZXcgVW50eXBlZEZvcm1BcnJheShmaWx0ZXIobWFwKHRlbXBsYXRlLmNvbnRyb2xzLFxuICAgICAgICAgIGNvbnRyb2xzID0+IGJ1aWxkRm9ybUdyb3VwKGNvbnRyb2xzKVxuICAgICAgICApKSwgdmFsaWRhdG9yRm4pO1xuICAgICAgY2FzZSAnRm9ybUNvbnRyb2wnOlxuICAgICAgICByZXR1cm4gbmV3IFVudHlwZWRGb3JtQ29udHJvbCh0ZW1wbGF0ZS52YWx1ZSwgdmFsaWRhdG9yRm5zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogJ21lcmdlVmFsdWVzJyBmdW5jdGlvblxuICpcbiAqIC8vICB7YW55W119IC4uLnZhbHVlc1RvTWVyZ2UgLSBNdWx0aXBsZSB2YWx1ZXMgdG8gbWVyZ2VcbiAqIC8vIHthbnl9IC0gTWVyZ2VkIHZhbHVlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VWYWx1ZXMoLi4udmFsdWVzVG9NZXJnZSkge1xuICBsZXQgbWVyZ2VkVmFsdWVzOiBhbnkgPSBudWxsO1xuICBmb3IgKGNvbnN0IGN1cnJlbnRWYWx1ZSBvZiB2YWx1ZXNUb01lcmdlKSB7XG4gICAgaWYgKCFpc0VtcHR5KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgIGlmICh0eXBlb2YgY3VycmVudFZhbHVlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAoaXNFbXB0eShtZXJnZWRWYWx1ZXMpIHx8IHR5cGVvZiBtZXJnZWRWYWx1ZXMgIT09ICdvYmplY3QnKVxuICAgICAgKSB7XG4gICAgICAgIGlmIChpc0FycmF5KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgICBtZXJnZWRWYWx1ZXMgPSBbLi4uY3VycmVudFZhbHVlXTtcbiAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgICAgbWVyZ2VkVmFsdWVzID0geyAuLi5jdXJyZW50VmFsdWUgfTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY3VycmVudFZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBtZXJnZWRWYWx1ZXMgPSBjdXJyZW50VmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG1lcmdlZFZhbHVlcykgJiYgaXNPYmplY3QoY3VycmVudFZhbHVlKSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKG1lcmdlZFZhbHVlcywgY3VycmVudFZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QobWVyZ2VkVmFsdWVzKSAmJiBpc0FycmF5KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgbmV3VmFsdWVzLnB1c2gobWVyZ2VWYWx1ZXMobWVyZ2VkVmFsdWVzLCB2YWx1ZSkpO1xuICAgICAgICB9XG4gICAgICAgIG1lcmdlZFZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShtZXJnZWRWYWx1ZXMpICYmIGlzT2JqZWN0KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgY29uc3QgbmV3VmFsdWVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgbWVyZ2VkVmFsdWVzKSB7XG4gICAgICAgICAgbmV3VmFsdWVzLnB1c2gobWVyZ2VWYWx1ZXModmFsdWUsIGN1cnJlbnRWYWx1ZSkpO1xuICAgICAgICB9XG4gICAgICAgIG1lcmdlZFZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShtZXJnZWRWYWx1ZXMpICYmIGlzQXJyYXkoY3VycmVudFZhbHVlKSkge1xuICAgICAgICBjb25zdCBuZXdWYWx1ZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1heChtZXJnZWRWYWx1ZXMubGVuZ3RoLCBjdXJyZW50VmFsdWUubGVuZ3RoKTsgaSsrKSB7XG4gICAgICAgICAgaWYgKGkgPCBtZXJnZWRWYWx1ZXMubGVuZ3RoICYmIGkgPCBjdXJyZW50VmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZXMucHVzaChtZXJnZVZhbHVlcyhtZXJnZWRWYWx1ZXNbaV0sIGN1cnJlbnRWYWx1ZVtpXSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaSA8IG1lcmdlZFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlcy5wdXNoKG1lcmdlZFZhbHVlc1tpXSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpIDwgY3VycmVudFZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgbmV3VmFsdWVzLnB1c2goY3VycmVudFZhbHVlW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWVyZ2VkVmFsdWVzID0gbmV3VmFsdWVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWVyZ2VkVmFsdWVzO1xufVxuXG4vKipcbiAqICdzZXRSZXF1aXJlZEZpZWxkcycgZnVuY3Rpb25cbiAqXG4gKiAvLyB7c2NoZW1hfSBzY2hlbWEgLSBKU09OIFNjaGVtYVxuICogLy8ge29iamVjdH0gZm9ybUNvbnRyb2xUZW1wbGF0ZSAtIEZvcm0gQ29udHJvbCBUZW1wbGF0ZSBvYmplY3RcbiAqIC8vIHtib29sZWFufSAtIHRydWUgaWYgYW55IGZpZWxkcyBoYXZlIGJlZW4gc2V0IHRvIHJlcXVpcmVkLCBmYWxzZSBpZiBub3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFJlcXVpcmVkRmllbGRzKHNjaGVtYTogYW55LCBmb3JtQ29udHJvbFRlbXBsYXRlOiBhbnkpOiBib29sZWFuIHtcbiAgbGV0IGZpZWxkc1JlcXVpcmVkID0gZmFsc2U7XG4gIGlmIChoYXNPd24oc2NoZW1hLCAncmVxdWlyZWQnKSAmJiAhaXNFbXB0eShzY2hlbWEucmVxdWlyZWQpKSB7XG4gICAgZmllbGRzUmVxdWlyZWQgPSB0cnVlO1xuICAgIGxldCByZXF1aXJlZEFycmF5ID0gaXNBcnJheShzY2hlbWEucmVxdWlyZWQpID8gc2NoZW1hLnJlcXVpcmVkIDogW3NjaGVtYS5yZXF1aXJlZF07XG4gICAgcmVxdWlyZWRBcnJheSA9IGZvckVhY2gocmVxdWlyZWRBcnJheSxcbiAgICAgIGtleSA9PiBKc29uUG9pbnRlci5zZXQoZm9ybUNvbnRyb2xUZW1wbGF0ZSwgJy8nICsga2V5ICsgJy92YWxpZGF0b3JzL3JlcXVpcmVkJywgW10pXG4gICAgKTtcbiAgfVxuICByZXR1cm4gZmllbGRzUmVxdWlyZWQ7XG5cbiAgLy8gVE9ETzogQWRkIHN1cHBvcnQgZm9yIHBhdHRlcm5Qcm9wZXJ0aWVzXG4gIC8vIGh0dHBzOi8vc3BhY2V0ZWxlc2NvcGUuZ2l0aHViLmlvL3VuZGVyc3RhbmRpbmctanNvbi1zY2hlbWEvcmVmZXJlbmNlL29iamVjdC5odG1sI3BhdHRlcm4tcHJvcGVydGllc1xufVxuXG4vKipcbiAqICdmb3JtYXRGb3JtRGF0YScgZnVuY3Rpb25cbiAqXG4gKiAvLyB7YW55fSBmb3JtRGF0YSAtIEFuZ3VsYXIgRm9ybUdyb3VwIGRhdGEgb2JqZWN0XG4gKiAvLyB7TWFwPHN0cmluZywgYW55Pn0gZGF0YU1hcCAtXG4gKiAvLyB7TWFwPHN0cmluZywgc3RyaW5nPn0gcmVjdXJzaXZlUmVmTWFwIC1cbiAqIC8vIHtNYXA8c3RyaW5nLCBudW1iZXI+fSBhcnJheU1hcCAtXG4gKiAvLyB7Ym9vbGVhbiA9IGZhbHNlfSBmaXhFcnJvcnMgLSBpZiBUUlVFLCB0cmllcyB0byBmaXggZGF0YVxuICogLy8ge2FueX0gLSBmb3JtYXR0ZWQgZGF0YSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEZvcm1EYXRhKFxuICBmb3JtRGF0YTogYW55LCBkYXRhTWFwOiBNYXA8c3RyaW5nLCBhbnk+LFxuICByZWN1cnNpdmVSZWZNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4sIGFycmF5TWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+LFxuICByZXR1cm5FbXB0eUZpZWxkcyA9IGZhbHNlLCBmaXhFcnJvcnMgPSBmYWxzZVxuKTogYW55IHtcbiAgaWYgKGZvcm1EYXRhID09PSBudWxsIHx8IHR5cGVvZiBmb3JtRGF0YSAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIGZvcm1EYXRhOyB9XG4gIGNvbnN0IGZvcm1hdHRlZERhdGEgPSBpc0FycmF5KGZvcm1EYXRhKSA/IFtdIDoge307XG4gIEpzb25Qb2ludGVyLmZvckVhY2hEZWVwKGZvcm1EYXRhLCAodmFsdWUsIGRhdGFQb2ludGVyKSA9PiB7XG5cbiAgICAvLyBJZiByZXR1cm5FbXB0eUZpZWxkcyA9PT0gdHJ1ZSxcbiAgICAvLyBhZGQgZW1wdHkgYXJyYXlzIGFuZCBvYmplY3RzIHRvIGFsbCBhbGxvd2VkIGtleXNcbiAgICBpZiAocmV0dXJuRW1wdHlGaWVsZHMgJiYgaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwgW10pO1xuICAgIH0gZWxzZSBpZiAocmV0dXJuRW1wdHlGaWVsZHMgJiYgaXNPYmplY3QodmFsdWUpICYmICFpc0RhdGUodmFsdWUpKSB7XG4gICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIHt9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZ2VuZXJpY1BvaW50ZXIgPVxuICAgICAgICBKc29uUG9pbnRlci5oYXMoZGF0YU1hcCwgW2RhdGFQb2ludGVyLCAnc2NoZW1hVHlwZSddKSA/IGRhdGFQb2ludGVyIDpcbiAgICAgICAgICByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKGRhdGFQb2ludGVyLCByZWN1cnNpdmVSZWZNYXAsIGFycmF5TWFwKTtcbiAgICAgIGlmIChKc29uUG9pbnRlci5oYXMoZGF0YU1hcCwgW2dlbmVyaWNQb2ludGVyLCAnc2NoZW1hVHlwZSddKSkge1xuICAgICAgICBjb25zdCBzY2hlbWFUeXBlOiBTY2hlbWFQcmltaXRpdmVUeXBlIHwgU2NoZW1hUHJpbWl0aXZlVHlwZVtdID1cbiAgICAgICAgICBkYXRhTWFwLmdldChnZW5lcmljUG9pbnRlcikuZ2V0KCdzY2hlbWFUeXBlJyk7XG4gICAgICAgIGlmIChzY2hlbWFUeXBlID09PSAnbnVsbCcpIHtcbiAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIG51bGwpO1xuICAgICAgICB9IGVsc2UgaWYgKChoYXNWYWx1ZSh2YWx1ZSkgfHwgcmV0dXJuRW1wdHlGaWVsZHMpICYmXG4gICAgICAgICAgaW5BcnJheShzY2hlbWFUeXBlLCBbJ3N0cmluZycsICdpbnRlZ2VyJywgJ251bWJlcicsICdib29sZWFuJ10pXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gKGZpeEVycm9ycyB8fCAodmFsdWUgPT09IG51bGwgJiYgcmV0dXJuRW1wdHlGaWVsZHMpKSA/XG4gICAgICAgICAgICB0b1NjaGVtYVR5cGUodmFsdWUsIHNjaGVtYVR5cGUpIDogdG9KYXZhU2NyaXB0VHlwZSh2YWx1ZSwgc2NoZW1hVHlwZSk7XG4gICAgICAgICAgaWYgKGlzRGVmaW5lZChuZXdWYWx1ZSkgfHwgcmV0dXJuRW1wdHlGaWVsZHMpIHtcbiAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwgbmV3VmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmlzaCBpbmNvbXBsZXRlICdkYXRlLXRpbWUnIGVudHJpZXNcbiAgICAgICAgaWYgKGRhdGFNYXAuZ2V0KGdlbmVyaWNQb2ludGVyKS5nZXQoJ3NjaGVtYUZvcm1hdCcpID09PSAnZGF0ZS10aW1lJykge1xuICAgICAgICAgIC8vIFwiMjAwMC0wMy0xNFQwMTo1OToyNi41MzVcIiAtPiBcIjIwMDAtMDMtMTRUMDE6NTk6MjYuNTM1WlwiIChhZGQgXCJaXCIpXG4gICAgICAgICAgaWYgKC9eXFxkXFxkXFxkXFxkLVswLTFdXFxkLVswLTNdXFxkW3RcXHNdWzAtMl1cXGQ6WzAtNV1cXGQ6WzAtNV1cXGQoPzpcXC5cXGQrKT8kL2kudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIEpzb25Qb2ludGVyLnNldChmb3JtYXR0ZWREYXRhLCBkYXRhUG9pbnRlciwgYCR7dmFsdWV9WmApO1xuICAgICAgICAgICAgLy8gXCIyMDAwLTAzLTE0VDAxOjU5XCIgLT4gXCIyMDAwLTAzLTE0VDAxOjU5OjAwWlwiIChhZGQgXCI6MDBaXCIpXG4gICAgICAgICAgfSBlbHNlIGlmICgvXlxcZFxcZFxcZFxcZC1bMC0xXVxcZC1bMC0zXVxcZFt0XFxzXVswLTJdXFxkOlswLTVdXFxkJC9pLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIGAke3ZhbHVlfTowMFpgKTtcbiAgICAgICAgICAgIC8vIFwiMjAwMC0wMy0xNFwiIC0+IFwiMjAwMC0wMy0xNFQwMDowMDowMFpcIiAoYWRkIFwiVDAwOjAwOjAwWlwiKVxuICAgICAgICAgIH0gZWxzZSBpZiAoZml4RXJyb3JzICYmIC9eXFxkXFxkXFxkXFxkLVswLTFdXFxkLVswLTNdXFxkJC9pLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICBKc29uUG9pbnRlci5zZXQoZm9ybWF0dGVkRGF0YSwgZGF0YVBvaW50ZXIsIGAke3ZhbHVlfTowMDowMDowMFpgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCBpc0RhdGUodmFsdWUpIHx8XG4gICAgICAgICh2YWx1ZSA9PT0gbnVsbCAmJiByZXR1cm5FbXB0eUZpZWxkcylcbiAgICAgICkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdmb3JtYXRGb3JtRGF0YSBlcnJvcjogJyArXG4gICAgICAgICAgYFNjaGVtYSB0eXBlIG5vdCBmb3VuZCBmb3IgZm9ybSB2YWx1ZSBhdCAke2dlbmVyaWNQb2ludGVyfWApO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdkYXRhTWFwJywgZGF0YU1hcCk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlY3Vyc2l2ZVJlZk1hcCcsIHJlY3Vyc2l2ZVJlZk1hcCk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2dlbmVyaWNQb2ludGVyJywgZ2VuZXJpY1BvaW50ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmb3JtYXR0ZWREYXRhO1xufVxuXG4vKipcbiAqICdnZXRDb250cm9sJyBmdW5jdGlvblxuICpcbiAqIFVzZXMgYSBKU09OIFBvaW50ZXIgZm9yIGEgZGF0YSBvYmplY3QgdG8gcmV0cmlldmUgYSBjb250cm9sIGZyb21cbiAqIGFuIEFuZ3VsYXIgZm9ybUdyb3VwIG9yIGZvcm1Hcm91cCB0ZW1wbGF0ZS4gKE5vdGU6IHRob3VnaCBhIGZvcm1Hcm91cFxuICogdGVtcGxhdGUgaXMgbXVjaCBzaW1wbGVyLCBpdHMgYmFzaWMgc3RydWN0dXJlIGlzIGlkZW50aWFsIHRvIGEgZm9ybUdyb3VwKS5cbiAqXG4gKiBJZiB0aGUgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyICdyZXR1cm5Hcm91cCcgaXMgc2V0IHRvIFRSVUUsIHRoZSBncm91cFxuICogY29udGFpbmluZyB0aGUgY29udHJvbCBpcyByZXR1cm5lZCwgcmF0aGVyIHRoYW4gdGhlIGNvbnRyb2wgaXRzZWxmLlxuICpcbiAqIC8vIHtGb3JtR3JvdXB9IGZvcm1Hcm91cCAtIEFuZ3VsYXIgRm9ybUdyb3VwIHRvIGdldCB2YWx1ZSBmcm9tXG4gKiAvLyB7UG9pbnRlcn0gZGF0YVBvaW50ZXIgLSBKU09OIFBvaW50ZXIgKHN0cmluZyBvciBhcnJheSlcbiAqIC8vIHtib29sZWFuID0gZmFsc2V9IHJldHVybkdyb3VwIC0gSWYgdHJ1ZSwgcmV0dXJuIGdyb3VwIGNvbnRhaW5pbmcgY29udHJvbFxuICogLy8ge2dyb3VwfSAtIExvY2F0ZWQgdmFsdWUgKG9yIG51bGwsIGlmIG5vIGNvbnRyb2wgZm91bmQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sKFxuICBmb3JtR3JvdXA6IGFueSwgZGF0YVBvaW50ZXI6IFBvaW50ZXIsIHJldHVybkdyb3VwID0gZmFsc2Vcbik6IGFueSB7XG4gIGlmICghaXNPYmplY3QoZm9ybUdyb3VwKSB8fCAhSnNvblBvaW50ZXIuaXNKc29uUG9pbnRlcihkYXRhUG9pbnRlcikpIHtcbiAgICBpZiAoIUpzb25Qb2ludGVyLmlzSnNvblBvaW50ZXIoZGF0YVBvaW50ZXIpKSB7XG4gICAgICAvLyBJZiBkYXRhUG9pbnRlciBpbnB1dCBpcyBub3QgYSB2YWxpZCBKU09OIHBvaW50ZXIsIGNoZWNrIHRvXG4gICAgICAvLyBzZWUgaWYgaXQgaXMgaW5zdGVhZCBhIHZhbGlkIG9iamVjdCBwYXRoLCB1c2luZyBkb3Qgbm90YWlvblxuICAgICAgaWYgKHR5cGVvZiBkYXRhUG9pbnRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgZm9ybUNvbnRyb2wgPSBmb3JtR3JvdXAuZ2V0KGRhdGFQb2ludGVyKTtcbiAgICAgICAgaWYgKGZvcm1Db250cm9sKSB7IHJldHVybiBmb3JtQ29udHJvbDsgfVxuICAgICAgfVxuICAgICAgY29uc29sZS5lcnJvcihgZ2V0Q29udHJvbCBlcnJvcjogSW52YWxpZCBKU09OIFBvaW50ZXI6ICR7ZGF0YVBvaW50ZXJ9YCk7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3QoZm9ybUdyb3VwKSkge1xuICAgICAgY29uc29sZS5lcnJvcihgZ2V0Q29udHJvbCBlcnJvcjogSW52YWxpZCBmb3JtR3JvdXA6ICR7Zm9ybUdyb3VwfWApO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBsZXQgZGF0YVBvaW50ZXJBcnJheSA9IEpzb25Qb2ludGVyLnBhcnNlKGRhdGFQb2ludGVyKTtcbiAgaWYgKHJldHVybkdyb3VwKSB7IGRhdGFQb2ludGVyQXJyYXkgPSBkYXRhUG9pbnRlckFycmF5LnNsaWNlKDAsIC0xKTsgfVxuXG4gIC8vIElmIGZvcm1Hcm91cCBpbnB1dCBpcyBhIHJlYWwgZm9ybUdyb3VwIChub3QgYSBmb3JtR3JvdXAgdGVtcGxhdGUpXG4gIC8vIHRyeSB1c2luZyBmb3JtR3JvdXAuZ2V0KCkgdG8gcmV0dXJuIHRoZSBjb250cm9sXG4gIGlmICh0eXBlb2YgZm9ybUdyb3VwLmdldCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIGRhdGFQb2ludGVyQXJyYXkuZXZlcnkoa2V5ID0+IGtleS5pbmRleE9mKCcuJykgPT09IC0xKVxuICApIHtcbiAgICBjb25zdCBmb3JtQ29udHJvbCA9IGZvcm1Hcm91cC5nZXQoZGF0YVBvaW50ZXJBcnJheS5qb2luKCcuJykpO1xuICAgIGlmIChmb3JtQ29udHJvbCkgeyByZXR1cm4gZm9ybUNvbnRyb2w7IH1cbiAgfVxuXG4gIC8vIElmIGZvcm1Hcm91cCBpbnB1dCBpcyBhIGZvcm1Hcm91cCB0ZW1wbGF0ZSxcbiAgLy8gb3IgZm9ybUdyb3VwLmdldCgpIGZhaWxlZCB0byByZXR1cm4gdGhlIGNvbnRyb2wsXG4gIC8vIHNlYXJjaCB0aGUgZm9ybUdyb3VwIG9iamVjdCBmb3IgZGF0YVBvaW50ZXIncyBjb250cm9sXG4gIGxldCBzdWJHcm91cCA9IGZvcm1Hcm91cDtcbiAgZm9yIChjb25zdCBrZXkgb2YgZGF0YVBvaW50ZXJBcnJheSkge1xuICAgIGlmIChoYXNPd24oc3ViR3JvdXAsICdjb250cm9scycpKSB7IHN1Ykdyb3VwID0gc3ViR3JvdXAuY29udHJvbHM7IH1cbiAgICBpZiAoaXNBcnJheShzdWJHcm91cCkgJiYgKGtleSA9PT0gJy0nKSkge1xuICAgICAgc3ViR3JvdXAgPSBzdWJHcm91cFtzdWJHcm91cC5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2UgaWYgKGhhc093bihzdWJHcm91cCwga2V5KSkge1xuICAgICAgc3ViR3JvdXAgPSBzdWJHcm91cFtrZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBnZXRDb250cm9sIGVycm9yOiBVbmFibGUgdG8gZmluZCBcIiR7a2V5fVwiIGl0ZW0gaW4gRm9ybUdyb3VwLmApO1xuICAgICAgY29uc29sZS5lcnJvcihkYXRhUG9pbnRlcik7XG4gICAgICBjb25zb2xlLmVycm9yKGZvcm1Hcm91cCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHJldHVybiBzdWJHcm91cDtcbn1cbiJdfQ==