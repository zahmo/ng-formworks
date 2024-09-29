import cloneDeep from 'lodash/cloneDeep';
import _isArray from 'lodash/isArray';
import _isPlainObject from 'lodash/isPlainObject';
import uniqueId from 'lodash/uniqueId';
import { checkInlineType, getFromSchema, getInputType, isInputRequired, removeRecursiveReferences, updateInputOptions } from './json-schema.functions';
import { JsonPointer } from './jsonpointer.functions';
import { copy, fixTitle, forEach, hasOwn } from './utility.functions';
import { inArray, isArray, isDefined, isEmpty, isNumber, isObject, isString } from './validator.functions';
/**
 * Layout function library:
 *
 * buildLayout:            Builds a complete layout from an input layout and schema
 *
 * buildLayoutFromSchema:  Builds a complete layout entirely from an input schema
 *
 * mapLayout:
 *
 * getLayoutNode:
 *
 * buildTitleMap:
 */
/**
 * 'buildLayout' function
 *
 * //   jsf
 * //   widgetLibrary
 * //
 */
export function buildLayout_original(jsf, widgetLibrary) {
    let hasSubmitButton = !JsonPointer.get(jsf, '/formOptions/addSubmit');
    const formLayout = mapLayout(jsf.layout, (layoutItem, index, layoutPointer) => {
        const newNode = {
            _id: uniqueId(),
            options: {},
        };
        if (isObject(layoutItem)) {
            Object.assign(newNode, layoutItem);
            Object.keys(newNode)
                .filter(option => !inArray(option, [
                '_id', '$ref', 'arrayItem', 'arrayItemType', 'dataPointer', 'dataType',
                'items', 'key', 'name', 'options', 'recursiveReference', 'type', 'widget'
            ]))
                .forEach(option => {
                newNode.options[option] = newNode[option];
                delete newNode[option];
            });
            if (!hasOwn(newNode, 'type') && isString(newNode.widget)) {
                newNode.type = newNode.widget;
                delete newNode.widget;
            }
            if (!hasOwn(newNode.options, 'title')) {
                if (hasOwn(newNode.options, 'legend')) {
                    newNode.options.title = newNode.options.legend;
                    delete newNode.options.legend;
                }
            }
            if (!hasOwn(newNode.options, 'validationMessages')) {
                if (hasOwn(newNode.options, 'errorMessages')) {
                    newNode.options.validationMessages = newNode.options.errorMessages;
                    delete newNode.options.errorMessages;
                    // Convert Angular Schema Form (AngularJS) 'validationMessage' to
                    // Angular JSON Schema Form 'validationMessages'
                    // TV4 codes from https://github.com/geraintluff/tv4/blob/master/source/api.js
                }
                else if (hasOwn(newNode.options, 'validationMessage')) {
                    if (typeof newNode.options.validationMessage === 'string') {
                        newNode.options.validationMessages = newNode.options.validationMessage;
                    }
                    else {
                        newNode.options.validationMessages = {};
                        Object.keys(newNode.options.validationMessage).forEach(key => {
                            const code = key + '';
                            const newKey = code === '0' ? 'type' :
                                code === '1' ? 'enum' :
                                    code === '100' ? 'multipleOf' :
                                        code === '101' ? 'minimum' :
                                            code === '102' ? 'exclusiveMinimum' :
                                                code === '103' ? 'maximum' :
                                                    code === '104' ? 'exclusiveMaximum' :
                                                        code === '200' ? 'minLength' :
                                                            code === '201' ? 'maxLength' :
                                                                code === '202' ? 'pattern' :
                                                                    code === '300' ? 'minProperties' :
                                                                        code === '301' ? 'maxProperties' :
                                                                            code === '302' ? 'required' :
                                                                                code === '304' ? 'dependencies' :
                                                                                    code === '400' ? 'minItems' :
                                                                                        code === '401' ? 'maxItems' :
                                                                                            code === '402' ? 'uniqueItems' :
                                                                                                code === '500' ? 'format' : code + '';
                            newNode.options.validationMessages[newKey] = newNode.options.validationMessage[key];
                        });
                    }
                    delete newNode.options.validationMessage;
                }
            }
        }
        else if (JsonPointer.isJsonPointer(layoutItem)) {
            newNode.dataPointer = layoutItem;
        }
        else if (isString(layoutItem)) {
            newNode.key = layoutItem;
        }
        else {
            console.error('buildLayout error: Form layout element not recognized:');
            console.error(layoutItem);
            return null;
        }
        let nodeSchema = null;
        // If newNode does not have a dataPointer, try to find an equivalent
        if (!hasOwn(newNode, 'dataPointer')) {
            // If newNode has a key, change it to a dataPointer
            if (hasOwn(newNode, 'key')) {
                newNode.dataPointer = newNode.key === '*' ? newNode.key :
                    JsonPointer.compile(JsonPointer.parseObjectPath(newNode.key), '-');
                delete newNode.key;
                // If newNode is an array, search for dataPointer in child nodes
            }
            else if (hasOwn(newNode, 'type') && newNode.type.slice(-5) === 'array') {
                const findDataPointer = (items) => {
                    if (items === null || typeof items !== 'object') {
                        return;
                    }
                    if (hasOwn(items, 'dataPointer')) {
                        return items.dataPointer;
                    }
                    if (isArray(items.items)) {
                        for (const item of items.items) {
                            if (hasOwn(item, 'dataPointer') && item.dataPointer.indexOf('/-') !== -1) {
                                return item.dataPointer;
                            }
                            if (hasOwn(item, 'items')) {
                                const searchItem = findDataPointer(item);
                                if (searchItem) {
                                    return searchItem;
                                }
                            }
                        }
                    }
                };
                const childDataPointer = findDataPointer(newNode);
                if (childDataPointer) {
                    newNode.dataPointer =
                        childDataPointer.slice(0, childDataPointer.lastIndexOf('/-'));
                }
            }
        }
        if (hasOwn(newNode, 'dataPointer')) {
            if (newNode.dataPointer === '*') {
                return buildLayoutFromSchema(jsf, widgetLibrary, jsf.formValues);
            }
            const nodeValue = JsonPointer.get(jsf.formValues, newNode.dataPointer.replace(/\/-/g, '/1'));
            // TODO: Create function getFormValues(jsf, dataPointer, forRefLibrary)
            // check formOptions.setSchemaDefaults and formOptions.setLayoutDefaults
            // then set apropriate values from initialVaues, schema, or layout
            newNode.dataPointer =
                JsonPointer.toGenericPointer(newNode.dataPointer, jsf.arrayMap);
            const LastKey = JsonPointer.toKey(newNode.dataPointer);
            if (!newNode.name && isString(LastKey) && LastKey !== '-') {
                newNode.name = LastKey;
            }
            const shortDataPointer = removeRecursiveReferences(newNode.dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
            const recursive = !shortDataPointer.length ||
                shortDataPointer !== newNode.dataPointer;
            let schemaPointer;
            if (!jsf.dataMap.has(shortDataPointer)) {
                jsf.dataMap.set(shortDataPointer, new Map());
            }
            const nodeDataMap = jsf.dataMap.get(shortDataPointer);
            if (nodeDataMap.has('schemaPointer')) {
                schemaPointer = nodeDataMap.get('schemaPointer');
            }
            else {
                schemaPointer = JsonPointer.toSchemaPointer(shortDataPointer, jsf.schema);
                nodeDataMap.set('schemaPointer', schemaPointer);
            }
            nodeDataMap.set('disabled', !!newNode.options.disabled);
            nodeSchema = JsonPointer.get(jsf.schema, schemaPointer);
            if (nodeSchema) {
                if (!hasOwn(newNode, 'type')) {
                    newNode.type = getInputType(nodeSchema, newNode);
                }
                else if (!widgetLibrary.hasWidget(newNode.type)) {
                    const oldWidgetType = newNode.type;
                    newNode.type = getInputType(nodeSchema, newNode);
                    console.error(`error: widget type "${oldWidgetType}" ` +
                        `not found in library. Replacing with "${newNode.type}".`);
                }
                else {
                    newNode.type = checkInlineType(newNode.type, nodeSchema, newNode);
                }
                if (nodeSchema.type === 'object' && isArray(nodeSchema.required)) {
                    nodeDataMap.set('required', nodeSchema.required);
                }
                newNode.dataType =
                    nodeSchema.type || (hasOwn(nodeSchema, '$ref') ? '$ref' : null);
                updateInputOptions(newNode, nodeSchema, jsf);
                // Present checkboxes as single control, rather than array
                if (newNode.type === 'checkboxes' && hasOwn(nodeSchema, 'items')) {
                    updateInputOptions(newNode, nodeSchema.items, jsf);
                }
                else if (newNode.dataType === 'array') {
                    newNode.options.maxItems = Math.min(nodeSchema.maxItems || 1000, newNode.options.maxItems || 1000);
                    newNode.options.minItems = Math.max(nodeSchema.minItems || 0, newNode.options.minItems || 0);
                    newNode.options.listItems = Math.max(newNode.options.listItems || 0, isArray(nodeValue) ? nodeValue.length : 0);
                    newNode.options.tupleItems =
                        isArray(nodeSchema.items) ? nodeSchema.items.length : 0;
                    if (newNode.options.maxItems < newNode.options.tupleItems) {
                        newNode.options.tupleItems = newNode.options.maxItems;
                        newNode.options.listItems = 0;
                    }
                    else if (newNode.options.maxItems <
                        newNode.options.tupleItems + newNode.options.listItems) {
                        newNode.options.listItems =
                            newNode.options.maxItems - newNode.options.tupleItems;
                    }
                    else if (newNode.options.minItems >
                        newNode.options.tupleItems + newNode.options.listItems) {
                        newNode.options.listItems =
                            newNode.options.minItems - newNode.options.tupleItems;
                    }
                    if (!nodeDataMap.has('maxItems')) {
                        nodeDataMap.set('maxItems', newNode.options.maxItems);
                        nodeDataMap.set('minItems', newNode.options.minItems);
                        nodeDataMap.set('tupleItems', newNode.options.tupleItems);
                        nodeDataMap.set('listItems', newNode.options.listItems);
                    }
                    if (!jsf.arrayMap.has(shortDataPointer)) {
                        jsf.arrayMap.set(shortDataPointer, newNode.options.tupleItems);
                    }
                }
                if (isInputRequired(jsf.schema, schemaPointer)) {
                    newNode.options.required = true;
                    jsf.fieldsRequired = true;
                }
            }
            else {
                // TODO: create item in FormGroup model from layout key (?)
                updateInputOptions(newNode, {}, jsf);
            }
            if (!newNode.options.title && !/^\d+$/.test(newNode.name)) {
                newNode.options.title = fixTitle(newNode.name);
            }
            if (hasOwn(newNode.options, 'copyValueTo')) {
                if (typeof newNode.options.copyValueTo === 'string') {
                    newNode.options.copyValueTo = [newNode.options.copyValueTo];
                }
                if (isArray(newNode.options.copyValueTo)) {
                    newNode.options.copyValueTo = newNode.options.copyValueTo.map(item => JsonPointer.compile(JsonPointer.parseObjectPath(item), '-'));
                }
            }
            newNode.widget = widgetLibrary.getWidget(newNode.type);
            nodeDataMap.set('inputType', newNode.type);
            nodeDataMap.set('widget', newNode.widget);
            if (newNode.dataType === 'array' &&
                (hasOwn(newNode, 'items') || hasOwn(newNode, 'additionalItems'))) {
                const itemRefPointer = removeRecursiveReferences(newNode.dataPointer + '/-', jsf.dataRecursiveRefMap, jsf.arrayMap);
                if (!jsf.dataMap.has(itemRefPointer)) {
                    jsf.dataMap.set(itemRefPointer, new Map());
                }
                jsf.dataMap.get(itemRefPointer).set('inputType', 'section');
                // Fix insufficiently nested array item groups
                if (newNode.items.length > 1) {
                    const arrayItemGroup = [];
                    for (let i = newNode.items.length - 1; i >= 0; i--) {
                        const subItem = newNode.items[i];
                        if (hasOwn(subItem, 'dataPointer') &&
                            subItem.dataPointer.slice(0, itemRefPointer.length) === itemRefPointer) {
                            const arrayItem = newNode.items.splice(i, 1)[0];
                            arrayItem.dataPointer = newNode.dataPointer + '/-' +
                                arrayItem.dataPointer.slice(itemRefPointer.length);
                            arrayItemGroup.unshift(arrayItem);
                        }
                        else {
                            subItem.arrayItem = true;
                            // TODO: Check schema to get arrayItemType and removable
                            subItem.arrayItemType = 'list';
                            subItem.removable = newNode.options.removable !== false;
                        }
                    }
                    if (arrayItemGroup.length) {
                        newNode.items.push({
                            _id: uniqueId(),
                            arrayItem: true,
                            arrayItemType: newNode.options.tupleItems > newNode.items.length ?
                                'tuple' : 'list',
                            items: arrayItemGroup,
                            options: { removable: newNode.options.removable !== false, },
                            dataPointer: newNode.dataPointer + '/-',
                            type: 'section',
                            widget: widgetLibrary.getWidget('section'),
                        });
                    }
                }
                else {
                    // TODO: Fix to hndle multiple items
                    newNode.items[0].arrayItem = true;
                    if (!newNode.items[0].dataPointer) {
                        newNode.items[0].dataPointer =
                            JsonPointer.toGenericPointer(itemRefPointer, jsf.arrayMap);
                    }
                    if (!JsonPointer.has(newNode, '/items/0/options/removable')) {
                        newNode.items[0].options.removable = true;
                    }
                    if (newNode.options.orderable === false) {
                        newNode.items[0].options.orderable = false;
                    }
                    newNode.items[0].arrayItemType =
                        newNode.options.tupleItems ? 'tuple' : 'list';
                }
                if (isArray(newNode.items)) {
                    const arrayListItems = newNode.items.filter(item => item.type !== '$ref').length -
                        newNode.options.tupleItems;
                    if (arrayListItems > newNode.options.listItems) {
                        newNode.options.listItems = arrayListItems;
                        nodeDataMap.set('listItems', arrayListItems);
                    }
                }
                if (!hasOwn(jsf.layoutRefLibrary, itemRefPointer)) {
                    jsf.layoutRefLibrary[itemRefPointer] =
                        cloneDeep(newNode.items[newNode.items.length - 1]);
                    if (recursive) {
                        jsf.layoutRefLibrary[itemRefPointer].recursiveReference = true;
                    }
                    forEach(jsf.layoutRefLibrary[itemRefPointer], (item, key) => {
                        if (hasOwn(item, '_id')) {
                            item._id = null;
                        }
                        if (recursive) {
                            if (hasOwn(item, 'dataPointer')) {
                                item.dataPointer = item.dataPointer.slice(itemRefPointer.length);
                            }
                        }
                    }, 'top-down');
                }
                // Add any additional default items
                if (!newNode.recursiveReference || newNode.options.required) {
                    const arrayLength = Math.min(Math.max(newNode.options.tupleItems + newNode.options.listItems, isArray(nodeValue) ? nodeValue.length : 0), newNode.options.maxItems);
                    for (let i = newNode.items.length; i < arrayLength; i++) {
                        newNode.items.push(getLayoutNode({
                            $ref: itemRefPointer,
                            dataPointer: newNode.dataPointer,
                            recursiveReference: newNode.recursiveReference,
                        }, jsf, widgetLibrary));
                    }
                }
                // If needed, add button to add items to array
                if (newNode.options.addable !== false &&
                    newNode.options.minItems < newNode.options.maxItems &&
                    (newNode.items[newNode.items.length - 1] || {}).type !== '$ref') {
                    let buttonText = 'Add';
                    if (newNode.options.title) {
                        if (/^add\b/i.test(newNode.options.title)) {
                            buttonText = newNode.options.title;
                        }
                        else {
                            buttonText += ' ' + newNode.options.title;
                        }
                    }
                    else if (newNode.name && !/^\d+$/.test(newNode.name)) {
                        if (/^add\b/i.test(newNode.name)) {
                            buttonText += ' ' + fixTitle(newNode.name);
                        }
                        else {
                            buttonText = fixTitle(newNode.name);
                        }
                        // If newNode doesn't have a title, look for title of parent array item
                    }
                    else {
                        const parentSchema = getFromSchema(jsf.schema, newNode.dataPointer, 'parentSchema');
                        if (hasOwn(parentSchema, 'title')) {
                            buttonText += ' to ' + parentSchema.title;
                        }
                        else {
                            const pointerArray = JsonPointer.parse(newNode.dataPointer);
                            buttonText += ' to ' + fixTitle(pointerArray[pointerArray.length - 2]);
                        }
                    }
                    newNode.items.push({
                        _id: uniqueId(),
                        arrayItem: true,
                        arrayItemType: 'list',
                        dataPointer: newNode.dataPointer + '/-',
                        options: {
                            listItems: newNode.options.listItems,
                            maxItems: newNode.options.maxItems,
                            minItems: newNode.options.minItems,
                            removable: false,
                            title: buttonText,
                            tupleItems: newNode.options.tupleItems,
                        },
                        recursiveReference: recursive,
                        type: '$ref',
                        widget: widgetLibrary.getWidget('$ref'),
                        $ref: itemRefPointer,
                    });
                    if (isString(JsonPointer.get(newNode, '/style/add'))) {
                        newNode.items[newNode.items.length - 1].options.fieldStyle =
                            newNode.style.add;
                        delete newNode.style.add;
                        if (isEmpty(newNode.style)) {
                            delete newNode.style;
                        }
                    }
                }
            }
            else {
                newNode.arrayItem = false;
            }
        }
        else if (hasOwn(newNode, 'type') || hasOwn(newNode, 'items')) {
            const parentType = JsonPointer.get(jsf.layout, layoutPointer, 0, -2).type;
            if (!hasOwn(newNode, 'type')) {
                newNode.type =
                    inArray(parentType, ['tabs', 'tabarray']) ? 'tab' : 'array';
            }
            newNode.arrayItem = parentType === 'array';
            newNode.widget = widgetLibrary.getWidget(newNode.type);
            updateInputOptions(newNode, {}, jsf);
        }
        if (newNode.type === 'submit') {
            hasSubmitButton = true;
        }
        return newNode;
    });
    if (jsf.hasRootReference) {
        const fullLayout = cloneDeep(formLayout);
        if (fullLayout[fullLayout.length - 1].type === 'submit') {
            fullLayout.pop();
        }
        jsf.layoutRefLibrary[''] = {
            _id: null,
            dataPointer: '',
            dataType: 'object',
            items: fullLayout,
            name: '',
            options: cloneDeep(jsf.formOptions.defaultWidgetOptions),
            recursiveReference: true,
            required: false,
            type: 'section',
            widget: widgetLibrary.getWidget('section'),
        };
    }
    if (!hasSubmitButton) {
        formLayout.push({
            _id: uniqueId(),
            options: { title: 'Submit' },
            type: 'submit',
            widget: widgetLibrary.getWidget('submit'),
        });
    }
    return formLayout;
}
//TODO-review:this implements a quick 'post' fix rather than an
//integrared ideal fix
export function buildLayout(jsf, widgetLibrary) {
    let layout = buildLayout_original(jsf, widgetLibrary);
    if (jsf.formValues) {
        let fixedLayout = fixNestedArrayLayout({
            builtLayout: layout,
            formData: jsf.formValues
        });
    }
    return layout;
}
function fixNestedArrayLayout(options) {
    let { builtLayout, formData } = options;
    let arrLengths = {};
    let traverseObj = function (obj, path, onValue) {
        if (_isArray(obj)) {
            onValue && onValue(obj, path);
            obj.forEach((item, ind) => {
                onValue && onValue(item, path + "/" + ind);
                traverseObj(item, path + "/" + ind, onValue);
            });
            return;
        }
        if (_isPlainObject(obj)) {
            onValue && onValue(obj, path);
            Object.keys(obj).forEach(key => {
                onValue && onValue(obj[key], path + "/" + key);
                traverseObj(obj[key], path + "/" + key, onValue);
            });
            return;
        }
    };
    traverseObj(formData, "", (value, path) => {
        if (_isArray(value)) {
            arrLengths[path] = arrLengths[path] || value.length;
        }
    });
    let getDataSize = (options) => {
        let { data, dataPointer, indexArray } = options;
        let dashCount = 0;
        let dpInstance = dataPointer.substring(1).split("/").map((part, pind) => {
            if (part == "-" && indexArray[dashCount] != undefined) {
                return indexArray[dashCount++];
            }
            return part;
        })
            .join("/");
        dpInstance = "/" + dpInstance;
        let arrSize = arrLengths[dpInstance];
        return arrSize;
    };
    //still too buggy
    let createNonRefItem = (nodeWithRef) => {
        let templateNode = {
            "type": "section",
            "recursiveReference": false,
            "items": []
        };
        let clone = cloneDeep(nodeWithRef);
        //commented out for now so that it behaves as ususal
        //_.merge(clone,templateNode);
        return clone;
    };
    let rebuildLayout = (options) => {
        let { builtLayout, indices, parentDataPointer, indexPos } = options;
        indices = indices || [];
        indexPos = indexPos == undefined ? indexPos = -1 : indexPos;
        if (_isArray(builtLayout)) {
            builtLayout.forEach((item, index) => {
                rebuildLayout({
                    builtLayout: item,
                    indices: indices,
                    indexPos: indexPos,
                    parentDataPointer: builtLayout.dataPointer || parentDataPointer
                });
            });
            return;
        }
        let dataTypes = ["array"]; //check only array for now
        //for now added condition to ignore recursive references
        if (builtLayout.items && dataTypes.indexOf(builtLayout.dataType) >= 0
            && builtLayout.dataPointer
            && !builtLayout.recursiveReference) {
            let numDataItems = getDataSize({
                data: formData,
                dataPointer: builtLayout.dataPointer,
                indexArray: indices
            });
            let numActualItems = builtLayout.items.length;
            //check if there's ref items, if so ignore it and therefore
            //decrement the item count
            builtLayout.items.forEach(item => {
                if (item.type && item.type == "$ref") {
                    numActualItems--;
                }
            });
            numActualItems = Math.max(numActualItems, 0); //avoid dealing with negatives
            if (numActualItems < numDataItems) {
                let numItemsNeeded = numDataItems - numActualItems;
                //added to ignore recursive references
                if (numActualItems == 0 && builtLayout.items[0].recursiveReference) {
                    numItemsNeeded = 0;
                }
                for (let i = 0; i < numItemsNeeded; i++) {
                    //node must not be of type "type": "$ref"
                    //if it is then manufacture our own
                    let isRefNode = builtLayout.items[0].type && builtLayout.items[0].type == "$ref";
                    let newItem = isRefNode
                        ? createNonRefItem(builtLayout.items[0])
                        : cloneDeep(builtLayout.items[0]); //copy first
                    newItem._id = uniqueId("new_");
                    builtLayout.items.unshift(newItem);
                }
                if (builtLayout.options.listItems) {
                    builtLayout.options.listItems = numDataItems;
                }
            }
            indices[builtLayout.dataPointer] = indices[builtLayout.dataPointer] || -1;
            indexPos++;
            builtLayout.items.forEach((item, index) => {
                indices[indexPos] = index;
                rebuildLayout({
                    builtLayout: item,
                    indices: indices,
                    parentDataPointer: builtLayout.dataPointer,
                    indexPos: indexPos
                });
            });
            indexPos--;
        }
        else {
            if (builtLayout.items) {
                builtLayout.items.forEach((item, index) => {
                    rebuildLayout({
                        builtLayout: item,
                        indices: indices,
                        parentDataPointer: parentDataPointer,
                        indexPos: indexPos
                    });
                });
            }
        }
    };
    rebuildLayout({
        builtLayout: builtLayout
    });
    //NB original is mutated
    let fixedLayout = builtLayout;
    return fixedLayout;
}
/**
 * 'buildLayoutFromSchema' function
 *
 * //   jsf -
 * //   widgetLibrary -
 * //   nodeValue -
 * //  { string = '' } schemaPointer -
 * //  { string = '' } dataPointer -
 * //  { boolean = false } arrayItem -
 * //  { string = null } arrayItemType -
 * //  { boolean = null } removable -
 * //  { boolean = false } forRefLibrary -
 * //  { string = '' } dataPointerPrefix -
 * //
 */
export function buildLayoutFromSchema(jsf, widgetLibrary, nodeValue = null, schemaPointer = '', dataPointer = '', arrayItem = false, arrayItemType = null, removable = null, forRefLibrary = false, dataPointerPrefix = '') {
    const schema = JsonPointer.get(jsf.schema, schemaPointer);
    if (!hasOwn(schema, 'type') && !hasOwn(schema, '$ref') &&
        !hasOwn(schema, 'x-schema-form')) {
        return null;
    }
    const newNodeType = getInputType(schema);
    if (!isDefined(nodeValue) && (jsf.formOptions.setSchemaDefaults === true ||
        (jsf.formOptions.setSchemaDefaults === 'auto' && isEmpty(jsf.formValues)))) {
        nodeValue = JsonPointer.get(jsf.schema, schemaPointer + '/default');
    }
    let newNode = {
        _id: forRefLibrary ? null : uniqueId(),
        arrayItem: arrayItem,
        dataPointer: JsonPointer.toGenericPointer(dataPointer, jsf.arrayMap),
        dataType: schema.type || (hasOwn(schema, '$ref') ? '$ref' : null),
        options: {},
        required: isInputRequired(jsf.schema, schemaPointer),
        type: newNodeType,
        widget: widgetLibrary.getWidget(newNodeType),
    };
    const lastDataKey = JsonPointer.toKey(newNode.dataPointer);
    if (lastDataKey !== '-') {
        newNode.name = lastDataKey;
    }
    if (newNode.arrayItem) {
        newNode.arrayItemType = arrayItemType;
        newNode.options.removable = removable !== false;
    }
    const shortDataPointer = removeRecursiveReferences(dataPointerPrefix + dataPointer, jsf.dataRecursiveRefMap, jsf.arrayMap);
    const recursive = !shortDataPointer.length ||
        shortDataPointer !== dataPointerPrefix + dataPointer;
    if (!jsf.dataMap.has(shortDataPointer)) {
        jsf.dataMap.set(shortDataPointer, new Map());
    }
    const nodeDataMap = jsf.dataMap.get(shortDataPointer);
    if (!nodeDataMap.has('inputType')) {
        nodeDataMap.set('schemaPointer', schemaPointer);
        nodeDataMap.set('inputType', newNode.type);
        nodeDataMap.set('widget', newNode.widget);
        nodeDataMap.set('disabled', !!newNode.options.disabled);
    }
    updateInputOptions(newNode, schema, jsf);
    if (!newNode.options.title && newNode.name && !/^\d+$/.test(newNode.name)) {
        newNode.options.title = fixTitle(newNode.name);
    }
    if (newNode.dataType === 'object') {
        if (isArray(schema.required) && !nodeDataMap.has('required')) {
            nodeDataMap.set('required', schema.required);
        }
        if (isObject(schema.properties)) {
            const newSection = [];
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
                .forEach(key => {
                const keySchemaPointer = hasOwn(schema.properties, key) ?
                    '/properties/' + key : '/additionalProperties';
                const innerItem = buildLayoutFromSchema(jsf, widgetLibrary, isObject(nodeValue) ? nodeValue[key] : null, schemaPointer + keySchemaPointer, dataPointer + '/' + key, false, null, null, forRefLibrary, dataPointerPrefix);
                if (innerItem) {
                    if (isInputRequired(schema, '/' + key)) {
                        innerItem.options.required = true;
                        jsf.fieldsRequired = true;
                    }
                    newSection.push(innerItem);
                }
            });
            if (dataPointer === '' && !forRefLibrary) {
                newNode = newSection;
            }
            else {
                newNode.items = newSection;
            }
        }
        // TODO: Add patternProperties and additionalProperties inputs?
        // ... possibly provide a way to enter both key names and values?
        // if (isObject(schema.patternProperties)) { }
        // if (isObject(schema.additionalProperties)) { }
    }
    else if (newNode.dataType === 'array') {
        newNode.items = [];
        newNode.options.maxItems = Math.min(schema.maxItems || 1000, newNode.options.maxItems || 1000);
        newNode.options.minItems = Math.max(schema.minItems || 0, newNode.options.minItems || 0);
        if (!newNode.options.minItems && isInputRequired(jsf.schema, schemaPointer)) {
            newNode.options.minItems = 1;
        }
        if (!hasOwn(newNode.options, 'listItems')) {
            newNode.options.listItems = 1;
        }
        newNode.options.tupleItems = isArray(schema.items) ? schema.items.length : 0;
        if (newNode.options.maxItems <= newNode.options.tupleItems) {
            newNode.options.tupleItems = newNode.options.maxItems;
            newNode.options.listItems = 0;
        }
        else if (newNode.options.maxItems <
            newNode.options.tupleItems + newNode.options.listItems) {
            newNode.options.listItems = newNode.options.maxItems - newNode.options.tupleItems;
        }
        else if (newNode.options.minItems >
            newNode.options.tupleItems + newNode.options.listItems) {
            newNode.options.listItems = newNode.options.minItems - newNode.options.tupleItems;
        }
        if (!nodeDataMap.has('maxItems')) {
            nodeDataMap.set('maxItems', newNode.options.maxItems);
            nodeDataMap.set('minItems', newNode.options.minItems);
            nodeDataMap.set('tupleItems', newNode.options.tupleItems);
            nodeDataMap.set('listItems', newNode.options.listItems);
        }
        if (!jsf.arrayMap.has(shortDataPointer)) {
            jsf.arrayMap.set(shortDataPointer, newNode.options.tupleItems);
        }
        removable = newNode.options.removable !== false;
        let additionalItemsSchemaPointer = null;
        // If 'items' is an array = tuple items
        if (isArray(schema.items)) {
            newNode.items = [];
            for (let i = 0; i < newNode.options.tupleItems; i++) {
                let newItem;
                const itemRefPointer = removeRecursiveReferences(shortDataPointer + '/' + i, jsf.dataRecursiveRefMap, jsf.arrayMap);
                const itemRecursive = !itemRefPointer.length ||
                    itemRefPointer !== shortDataPointer + '/' + i;
                // If removable, add tuple item layout to layoutRefLibrary
                if (removable && i >= newNode.options.minItems) {
                    if (!hasOwn(jsf.layoutRefLibrary, itemRefPointer)) {
                        // Set to null first to prevent recursive reference from causing endless loop
                        jsf.layoutRefLibrary[itemRefPointer] = null;
                        jsf.layoutRefLibrary[itemRefPointer] = buildLayoutFromSchema(jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null, schemaPointer + '/items/' + i, itemRecursive ? '' : dataPointer + '/' + i, true, 'tuple', true, true, itemRecursive ? dataPointer + '/' + i : '');
                        if (itemRecursive) {
                            jsf.layoutRefLibrary[itemRefPointer].recursiveReference = true;
                        }
                    }
                    newItem = getLayoutNode({
                        $ref: itemRefPointer,
                        dataPointer: dataPointer + '/' + i,
                        recursiveReference: itemRecursive,
                    }, jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null);
                }
                else {
                    newItem = buildLayoutFromSchema(jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null, schemaPointer + '/items/' + i, dataPointer + '/' + i, true, 'tuple', false, forRefLibrary, dataPointerPrefix);
                }
                if (newItem) {
                    newNode.items.push(newItem);
                }
            }
            // If 'additionalItems' is an object = additional list items, after tuple items
            if (isObject(schema.additionalItems)) {
                additionalItemsSchemaPointer = schemaPointer + '/additionalItems';
            }
            // If 'items' is an object = list items only (no tuple items)
        }
        else if (isObject(schema.items)) {
            additionalItemsSchemaPointer = schemaPointer + '/items';
        }
        if (additionalItemsSchemaPointer) {
            const itemRefPointer = removeRecursiveReferences(shortDataPointer + '/-', jsf.dataRecursiveRefMap, jsf.arrayMap);
            const itemRecursive = !itemRefPointer.length ||
                itemRefPointer !== shortDataPointer + '/-';
            const itemSchemaPointer = removeRecursiveReferences(additionalItemsSchemaPointer, jsf.schemaRecursiveRefMap, jsf.arrayMap);
            // Add list item layout to layoutRefLibrary
            if (itemRefPointer.length && !hasOwn(jsf.layoutRefLibrary, itemRefPointer)) {
                // Set to null first to prevent recursive reference from causing endless loop
                jsf.layoutRefLibrary[itemRefPointer] = null;
                jsf.layoutRefLibrary[itemRefPointer] = buildLayoutFromSchema(jsf, widgetLibrary, null, itemSchemaPointer, itemRecursive ? '' : dataPointer + '/-', true, 'list', removable, true, itemRecursive ? dataPointer + '/-' : '');
                if (itemRecursive) {
                    jsf.layoutRefLibrary[itemRefPointer].recursiveReference = true;
                }
            }
            // Add any additional default items
            if (!itemRecursive || newNode.options.required) {
                const arrayLength = Math.min(Math.max(itemRecursive ? 0 :
                    newNode.options.tupleItems + newNode.options.listItems, isArray(nodeValue) ? nodeValue.length : 0), newNode.options.maxItems);
                if (newNode.items.length < arrayLength) {
                    for (let i = newNode.items.length; i < arrayLength; i++) {
                        newNode.items.push(getLayoutNode({
                            $ref: itemRefPointer,
                            dataPointer: dataPointer + '/-',
                            recursiveReference: itemRecursive,
                        }, jsf, widgetLibrary, isArray(nodeValue) ? nodeValue[i] : null));
                    }
                }
            }
            // If needed, add button to add items to array
            if (newNode.options.addable !== false &&
                newNode.options.minItems < newNode.options.maxItems &&
                (newNode.items[newNode.items.length - 1] || {}).type !== '$ref') {
                let buttonText = ((jsf.layoutRefLibrary[itemRefPointer] || {}).options || {}).title;
                const prefix = buttonText ? 'Add ' : 'Add to ';
                if (!buttonText) {
                    buttonText = schema.title || fixTitle(JsonPointer.toKey(dataPointer));
                }
                if (!/^add\b/i.test(buttonText)) {
                    buttonText = prefix + buttonText;
                }
                newNode.items.push({
                    _id: uniqueId(),
                    arrayItem: true,
                    arrayItemType: 'list',
                    dataPointer: newNode.dataPointer + '/-',
                    options: {
                        listItems: newNode.options.listItems,
                        maxItems: newNode.options.maxItems,
                        minItems: newNode.options.minItems,
                        removable: false,
                        title: buttonText,
                        tupleItems: newNode.options.tupleItems,
                    },
                    recursiveReference: itemRecursive,
                    type: '$ref',
                    widget: widgetLibrary.getWidget('$ref'),
                    $ref: itemRefPointer,
                });
            }
        }
    }
    else if (newNode.dataType === '$ref') {
        const schemaRef = JsonPointer.compile(schema.$ref);
        const dataRef = JsonPointer.toDataPointer(schemaRef, jsf.schema);
        let buttonText = '';
        // Get newNode title
        if (newNode.options.add) {
            buttonText = newNode.options.add;
        }
        else if (newNode.name && !/^\d+$/.test(newNode.name)) {
            buttonText =
                (/^add\b/i.test(newNode.name) ? '' : 'Add ') + fixTitle(newNode.name);
            // If newNode doesn't have a title, look for title of parent array item
        }
        else {
            const parentSchema = JsonPointer.get(jsf.schema, schemaPointer, 0, -1);
            if (hasOwn(parentSchema, 'title')) {
                buttonText = 'Add to ' + parentSchema.title;
            }
            else {
                const pointerArray = JsonPointer.parse(newNode.dataPointer);
                buttonText = 'Add to ' + fixTitle(pointerArray[pointerArray.length - 2]);
            }
        }
        Object.assign(newNode, {
            recursiveReference: true,
            widget: widgetLibrary.getWidget('$ref'),
            $ref: dataRef,
        });
        Object.assign(newNode.options, {
            removable: false,
            title: buttonText,
        });
        if (isNumber(JsonPointer.get(jsf.schema, schemaPointer, 0, -1).maxItems)) {
            newNode.options.maxItems =
                JsonPointer.get(jsf.schema, schemaPointer, 0, -1).maxItems;
        }
        // Add layout template to layoutRefLibrary
        if (dataRef.length) {
            if (!hasOwn(jsf.layoutRefLibrary, dataRef)) {
                // Set to null first to prevent recursive reference from causing endless loop
                jsf.layoutRefLibrary[dataRef] = null;
                const newLayout = buildLayoutFromSchema(jsf, widgetLibrary, null, schemaRef, '', newNode.arrayItem, newNode.arrayItemType, true, true, dataPointer);
                if (newLayout) {
                    newLayout.recursiveReference = true;
                    jsf.layoutRefLibrary[dataRef] = newLayout;
                }
                else {
                    delete jsf.layoutRefLibrary[dataRef];
                }
            }
            else if (!jsf.layoutRefLibrary[dataRef].recursiveReference) {
                jsf.layoutRefLibrary[dataRef].recursiveReference = true;
            }
        }
    }
    return newNode;
}
/**
 * 'mapLayout' function
 *
 * Creates a new layout by running each element in an existing layout through
 * an iteratee. Recursively maps within array elements 'items' and 'tabs'.
 * The iteratee is invoked with four arguments: (value, index, layout, path)
 *
 * The returned layout may be longer (or shorter) then the source layout.
 *
 * If an item from the source layout returns multiple items (as '*' usually will),
 * this function will keep all returned items in-line with the surrounding items.
 *
 * If an item from the source layout causes an error and returns null, it is
 * skipped without error, and the function will still return all non-null items.
 *
 * //   layout - the layout to map
 * //  { (v: any, i?: number, l?: any, p?: string) => any }
 *   function - the funciton to invoke on each element
 * //  { string|string[] = '' } layoutPointer - the layoutPointer to layout, inside rootLayout
 * //  { any[] = layout } rootLayout - the root layout, which conatins layout
 * //
 */
export function mapLayout(layout, fn, layoutPointer = '', rootLayout = layout) {
    let indexPad = 0;
    let newLayout = [];
    forEach(layout, (item, index) => {
        const realIndex = +index + indexPad;
        const newLayoutPointer = layoutPointer + '/' + realIndex;
        let newNode = copy(item);
        let itemsArray = [];
        if (isObject(item)) {
            if (hasOwn(item, 'tabs')) {
                item.items = item.tabs;
                delete item.tabs;
            }
            if (hasOwn(item, 'items')) {
                itemsArray = isArray(item.items) ? item.items : [item.items];
            }
        }
        if (itemsArray.length) {
            newNode.items = mapLayout(itemsArray, fn, newLayoutPointer + '/items', rootLayout);
        }
        newNode = fn(newNode, realIndex, newLayoutPointer, rootLayout);
        if (!isDefined(newNode)) {
            indexPad--;
        }
        else {
            if (isArray(newNode)) {
                indexPad += newNode.length - 1;
            }
            newLayout = newLayout.concat(newNode);
        }
    });
    return newLayout;
}
/**
 * 'getLayoutNode' function
 * Copy a new layoutNode from layoutRefLibrary
 *
 * //   refNode -
 * //   layoutRefLibrary -
 * //  { any = null } widgetLibrary -
 * //  { any = null } nodeValue -
 * //  copied layoutNode
 */
export function getLayoutNode(refNode, jsf, widgetLibrary = null, nodeValue = null) {
    // If recursive reference and building initial layout, return Add button
    if (refNode.recursiveReference && widgetLibrary) {
        const newLayoutNode = cloneDeep(refNode);
        if (!newLayoutNode.options) {
            newLayoutNode.options = {};
        }
        Object.assign(newLayoutNode, {
            recursiveReference: true,
            widget: widgetLibrary.getWidget('$ref'),
        });
        Object.assign(newLayoutNode.options, {
            removable: false,
            title: 'Add ' + newLayoutNode.$ref,
        });
        return newLayoutNode;
        // Otherwise, return referenced layout
    }
    else {
        let newLayoutNode = jsf.layoutRefLibrary[refNode.$ref];
        // If value defined, build new node from schema (to set array lengths)
        if (isDefined(nodeValue)) {
            newLayoutNode = buildLayoutFromSchema(jsf, widgetLibrary, nodeValue, JsonPointer.toSchemaPointer(refNode.$ref, jsf.schema), refNode.$ref, newLayoutNode.arrayItem, newLayoutNode.arrayItemType, newLayoutNode.options.removable, false);
        }
        else {
            // If value not defined, copy node from layoutRefLibrary
            newLayoutNode = cloneDeep(newLayoutNode);
            JsonPointer.forEachDeep(newLayoutNode, (subNode, pointer) => {
                // Reset all _id's in newLayoutNode to unique values
                if (hasOwn(subNode, '_id')) {
                    subNode._id = uniqueId();
                }
                // If adding a recursive item, prefix current dataPointer
                // to all dataPointers in new layoutNode
                if (refNode.recursiveReference && hasOwn(subNode, 'dataPointer')) {
                    subNode.dataPointer = refNode.dataPointer + subNode.dataPointer;
                }
            });
        }
        return newLayoutNode;
    }
}
/**
 * 'buildTitleMap' function
 *
 * //   titleMap -
 * //   enumList -
 * //  { boolean = true } fieldRequired -
 * //  { boolean = true } flatList -
 * // { TitleMapItem[] }
 */
export function buildTitleMap(titleMap, enumList, fieldRequired = true, flatList = true) {
    let newTitleMap = [];
    let hasEmptyValue = false;
    if (titleMap) {
        if (isArray(titleMap)) {
            if (enumList) {
                for (const i of Object.keys(titleMap)) {
                    if (isObject(titleMap[i])) { // JSON Form style
                        const value = titleMap[i].value;
                        if (enumList.includes(value)) {
                            const name = titleMap[i].name;
                            newTitleMap.push({ name, value });
                            if (value === undefined || value === null) {
                                hasEmptyValue = true;
                            }
                        }
                    }
                    else if (isString(titleMap[i])) { // React Jsonschema Form style
                        if (i < enumList.length) {
                            const name = titleMap[i];
                            const value = enumList[i];
                            newTitleMap.push({ name, value });
                            if (value === undefined || value === null) {
                                hasEmptyValue = true;
                            }
                        }
                    }
                }
            }
            else { // If array titleMap and no enum list, just return the titleMap - Angular Schema Form style
                newTitleMap = titleMap;
                if (!fieldRequired) {
                    hasEmptyValue = !!newTitleMap
                        .filter(i => i.value === undefined || i.value === null)
                        .length;
                }
            }
        }
        else if (enumList) { // Alternate JSON Form style, with enum list
            for (const i of Object.keys(enumList)) {
                const value = enumList[i];
                if (hasOwn(titleMap, value)) {
                    const name = titleMap[value];
                    newTitleMap.push({ name, value });
                    if (value === undefined || value === null) {
                        hasEmptyValue = true;
                    }
                }
            }
        }
        else { // Alternate JSON Form style, without enum list
            for (const value of Object.keys(titleMap)) {
                const name = titleMap[value];
                newTitleMap.push({ name, value });
                if (value === undefined || value === null) {
                    hasEmptyValue = true;
                }
            }
        }
    }
    else if (enumList) { // Build map from enum list alone
        for (const i of Object.keys(enumList)) {
            const name = enumList[i];
            const value = enumList[i];
            newTitleMap.push({ name, value });
            if (value === undefined || value === null) {
                hasEmptyValue = true;
            }
        }
    }
    else { // If no titleMap and no enum list, return default map of boolean values
        newTitleMap = [{ name: 'True', value: true }, { name: 'False', value: false }];
    }
    // Does titleMap have groups?
    if (newTitleMap.some(title => hasOwn(title, 'group'))) {
        hasEmptyValue = false;
        // If flatList = true, flatten items & update name to group: name
        if (flatList) {
            newTitleMap = newTitleMap.reduce((groupTitleMap, title) => {
                if (hasOwn(title, 'group')) {
                    if (isArray(title.items)) {
                        groupTitleMap = [
                            ...groupTitleMap,
                            ...title.items.map(item => ({ ...item, ...{ name: `${title.group}: ${item.name}` } }))
                        ];
                        if (title.items.some(item => item.value === undefined || item.value === null)) {
                            hasEmptyValue = true;
                        }
                    }
                    if (hasOwn(title, 'name') && hasOwn(title, 'value')) {
                        title.name = `${title.group}: ${title.name}`;
                        delete title.group;
                        groupTitleMap.push(title);
                        if (title.value === undefined || title.value === null) {
                            hasEmptyValue = true;
                        }
                    }
                }
                else {
                    groupTitleMap.push(title);
                    if (title.value === undefined || title.value === null) {
                        hasEmptyValue = true;
                    }
                }
                return groupTitleMap;
            }, []);
            // If flatList = false, combine items from matching groups
        }
        else {
            newTitleMap = newTitleMap.reduce((groupTitleMap, title) => {
                if (hasOwn(title, 'group')) {
                    if (title.group !== (groupTitleMap[groupTitleMap.length - 1] || {}).group) {
                        groupTitleMap.push({ group: title.group, items: title.items || [] });
                    }
                    if (hasOwn(title, 'name') && hasOwn(title, 'value')) {
                        groupTitleMap[groupTitleMap.length - 1].items
                            .push({ name: title.name, value: title.value });
                        if (title.value === undefined || title.value === null) {
                            hasEmptyValue = true;
                        }
                    }
                }
                else {
                    groupTitleMap.push(title);
                    if (title.value === undefined || title.value === null) {
                        hasEmptyValue = true;
                    }
                }
                return groupTitleMap;
            }, []);
        }
    }
    if (!fieldRequired && !hasEmptyValue) {
        newTitleMap.unshift({ name: '<em>None</em>', value: null });
    }
    return newTitleMap;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmZ1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWZvcm13b3Jrcy1jb3JlL3NyYy9saWIvc2hhcmVkL2xheW91dC5mdW5jdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxTQUFTLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxRQUFRLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEMsT0FBTyxjQUFjLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxRQUFRLE1BQU0saUJBQWlCLENBQUM7QUFFdkMsT0FBTyxFQUNMLGVBQWUsRUFDZixhQUFhLEVBQ2IsWUFBWSxFQUNaLGVBQWUsRUFDZix5QkFBeUIsRUFDekIsa0JBQWtCLEVBQ25CLE1BQU0seUJBQXlCLENBQUM7QUFDakMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3RELE9BQU8sRUFDTCxJQUFJLEVBQ0osUUFBUSxFQUNSLE9BQU8sRUFDUCxNQUFNLEVBQ1AsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQ0wsT0FBTyxFQUNQLE9BQU8sRUFDUCxTQUFTLEVBQ1QsT0FBTyxFQUNQLFFBQVEsRUFDUixRQUFRLEVBQ1IsUUFBUSxFQUNULE1BQU0sdUJBQXVCLENBQUM7QUFLL0I7Ozs7Ozs7Ozs7OztHQVlHO0FBRUg7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxhQUFhO0lBQ3JELElBQUksZUFBZSxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztJQUN0RSxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEVBQUU7UUFDNUUsTUFBTSxPQUFPLEdBQVE7WUFDbkIsR0FBRyxF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QUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUN0RTtvQkFDRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBRTt3QkFDbkQsYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSzs2QkFDMUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUNsRCxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFOzRCQUNyRCxhQUFhLEdBQUcsSUFBSSxDQUFDO3lCQUN0QjtxQkFDRjtpQkFDRjtxQkFBTTtvQkFDTCxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMxQixJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO3dCQUNyRCxhQUFhLEdBQUcsSUFBSSxDQUFDO3FCQUN0QjtpQkFDRjtnQkFDRCxPQUFPLGFBQWEsQ0FBQztZQUN2QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDUjtLQUNGO0lBQ0QsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLGFBQWEsRUFBRTtRQUNwQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUM3RDtJQUNELE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xvbmVEZWVwIGZyb20gJ2xvZGFzaC9jbG9uZURlZXAnO1xuaW1wb3J0IF9pc0FycmF5IGZyb20gJ2xvZGFzaC9pc0FycmF5JztcbmltcG9ydCBfaXNQbGFpbk9iamVjdCBmcm9tICdsb2Rhc2gvaXNQbGFpbk9iamVjdCc7XG5pbXBvcnQgdW5pcXVlSWQgZnJvbSAnbG9kYXNoL3VuaXF1ZUlkJztcbmltcG9ydCB7IFRpdGxlTWFwSXRlbSB9IGZyb20gJy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5pbXBvcnQge1xuICBjaGVja0lubGluZVR5cGUsXG4gIGdldEZyb21TY2hlbWEsXG4gIGdldElucHV0VHlwZSxcbiAgaXNJbnB1dFJlcXVpcmVkLFxuICByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzLFxuICB1cGRhdGVJbnB1dE9wdGlvbnNcbn0gZnJvbSAnLi9qc29uLXNjaGVtYS5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgSnNvblBvaW50ZXIgfSBmcm9tICcuL2pzb25wb2ludGVyLmZ1bmN0aW9ucyc7XG5pbXBvcnQge1xuICBjb3B5LFxuICBmaXhUaXRsZSxcbiAgZm9yRWFjaCxcbiAgaGFzT3duXG59IGZyb20gJy4vdXRpbGl0eS5mdW5jdGlvbnMnO1xuaW1wb3J0IHtcbiAgaW5BcnJheSxcbiAgaXNBcnJheSxcbiAgaXNEZWZpbmVkLFxuICBpc0VtcHR5LFxuICBpc051bWJlcixcbiAgaXNPYmplY3QsXG4gIGlzU3RyaW5nXG59IGZyb20gJy4vdmFsaWRhdG9yLmZ1bmN0aW9ucyc7XG5cblxuXG5cbi8qKlxuICogTGF5b3V0IGZ1bmN0aW9uIGxpYnJhcnk6XG4gKlxuICogYnVpbGRMYXlvdXQ6ICAgICAgICAgICAgQnVpbGRzIGEgY29tcGxldGUgbGF5b3V0IGZyb20gYW4gaW5wdXQgbGF5b3V0IGFuZCBzY2hlbWFcbiAqXG4gKiBidWlsZExheW91dEZyb21TY2hlbWE6ICBCdWlsZHMgYSBjb21wbGV0ZSBsYXlvdXQgZW50aXJlbHkgZnJvbSBhbiBpbnB1dCBzY2hlbWFcbiAqXG4gKiBtYXBMYXlvdXQ6XG4gKlxuICogZ2V0TGF5b3V0Tm9kZTpcbiAqXG4gKiBidWlsZFRpdGxlTWFwOlxuICovXG5cbi8qKlxuICogJ2J1aWxkTGF5b3V0JyBmdW5jdGlvblxuICpcbiAqIC8vICAganNmXG4gKiAvLyAgIHdpZGdldExpYnJhcnlcbiAqIC8vXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExheW91dF9vcmlnaW5hbChqc2YsIHdpZGdldExpYnJhcnkpIHtcbiAgbGV0IGhhc1N1Ym1pdEJ1dHRvbiA9ICFKc29uUG9pbnRlci5nZXQoanNmLCAnL2Zvcm1PcHRpb25zL2FkZFN1Ym1pdCcpO1xuICBjb25zdCBmb3JtTGF5b3V0ID0gbWFwTGF5b3V0KGpzZi5sYXlvdXQsIChsYXlvdXRJdGVtLCBpbmRleCwgbGF5b3V0UG9pbnRlcikgPT4ge1xuICAgIGNvbnN0IG5ld05vZGU6IGFueSA9IHtcbiAgICAgIF9pZDogdW5pcXVlSWQoKSxcbiAgICAgIG9wdGlvbnM6IHt9LFxuICAgIH07XG4gICAgaWYgKGlzT2JqZWN0KGxheW91dEl0ZW0pKSB7XG4gICAgICBPYmplY3QuYXNzaWduKG5ld05vZGUsIGxheW91dEl0ZW0pO1xuICAgICAgT2JqZWN0LmtleXMobmV3Tm9kZSlcbiAgICAgICAgLmZpbHRlcihvcHRpb24gPT4gIWluQXJyYXkob3B0aW9uLCBbXG4gICAgICAgICAgJ19pZCcsICckcmVmJywgJ2FycmF5SXRlbScsICdhcnJheUl0ZW1UeXBlJywgJ2RhdGFQb2ludGVyJywgJ2RhdGFUeXBlJyxcbiAgICAgICAgICAnaXRlbXMnLCAna2V5JywgJ25hbWUnLCAnb3B0aW9ucycsICdyZWN1cnNpdmVSZWZlcmVuY2UnLCAndHlwZScsICd3aWRnZXQnXG4gICAgICAgIF0pKVxuICAgICAgICAuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgICAgIG5ld05vZGUub3B0aW9uc1tvcHRpb25dID0gbmV3Tm9kZVtvcHRpb25dO1xuICAgICAgICAgIGRlbGV0ZSBuZXdOb2RlW29wdGlvbl07XG4gICAgICAgIH0pO1xuICAgICAgaWYgKCFoYXNPd24obmV3Tm9kZSwgJ3R5cGUnKSAmJiBpc1N0cmluZyhuZXdOb2RlLndpZGdldCkpIHtcbiAgICAgICAgbmV3Tm9kZS50eXBlID0gbmV3Tm9kZS53aWRnZXQ7XG4gICAgICAgIGRlbGV0ZSBuZXdOb2RlLndpZGdldDtcbiAgICAgIH1cbiAgICAgIGlmICghaGFzT3duKG5ld05vZGUub3B0aW9ucywgJ3RpdGxlJykpIHtcbiAgICAgICAgaWYgKGhhc093bihuZXdOb2RlLm9wdGlvbnMsICdsZWdlbmQnKSkge1xuICAgICAgICAgIG5ld05vZGUub3B0aW9ucy50aXRsZSA9IG5ld05vZGUub3B0aW9ucy5sZWdlbmQ7XG4gICAgICAgICAgZGVsZXRlIG5ld05vZGUub3B0aW9ucy5sZWdlbmQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghaGFzT3duKG5ld05vZGUub3B0aW9ucywgJ3ZhbGlkYXRpb25NZXNzYWdlcycpKSB7XG4gICAgICAgIGlmIChoYXNPd24obmV3Tm9kZS5vcHRpb25zLCAnZXJyb3JNZXNzYWdlcycpKSB7XG4gICAgICAgICAgbmV3Tm9kZS5vcHRpb25zLnZhbGlkYXRpb25NZXNzYWdlcyA9IG5ld05vZGUub3B0aW9ucy5lcnJvck1lc3NhZ2VzO1xuICAgICAgICAgIGRlbGV0ZSBuZXdOb2RlLm9wdGlvbnMuZXJyb3JNZXNzYWdlcztcblxuICAgICAgICAgIC8vIENvbnZlcnQgQW5ndWxhciBTY2hlbWEgRm9ybSAoQW5ndWxhckpTKSAndmFsaWRhdGlvbk1lc3NhZ2UnIHRvXG4gICAgICAgICAgLy8gQW5ndWxhciBKU09OIFNjaGVtYSBGb3JtICd2YWxpZGF0aW9uTWVzc2FnZXMnXG4gICAgICAgICAgLy8gVFY0IGNvZGVzIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2dlcmFpbnRsdWZmL3R2NC9ibG9iL21hc3Rlci9zb3VyY2UvYXBpLmpzXG4gICAgICAgIH0gZWxzZSBpZiAoaGFzT3duKG5ld05vZGUub3B0aW9ucywgJ3ZhbGlkYXRpb25NZXNzYWdlJykpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIG5ld05vZGUub3B0aW9ucy52YWxpZGF0aW9uTWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG5ld05vZGUub3B0aW9ucy52YWxpZGF0aW9uTWVzc2FnZXMgPSBuZXdOb2RlLm9wdGlvbnMudmFsaWRhdGlvbk1lc3NhZ2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld05vZGUub3B0aW9ucy52YWxpZGF0aW9uTWVzc2FnZXMgPSB7fTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG5ld05vZGUub3B0aW9ucy52YWxpZGF0aW9uTWVzc2FnZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBjb2RlID0ga2V5ICsgJyc7XG4gICAgICAgICAgICAgIGNvbnN0IG5ld0tleSA9XG4gICAgICAgICAgICAgICAgY29kZSA9PT0gJzAnID8gJ3R5cGUnIDpcbiAgICAgICAgICAgICAgICAgIGNvZGUgPT09ICcxJyA/ICdlbnVtJyA6XG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPT09ICcxMDAnID8gJ211bHRpcGxlT2YnIDpcbiAgICAgICAgICAgICAgICAgICAgICBjb2RlID09PSAnMTAxJyA/ICdtaW5pbXVtJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlID09PSAnMTAyJyA/ICdleGNsdXNpdmVNaW5pbXVtJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgPT09ICcxMDMnID8gJ21heGltdW0nIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlID09PSAnMTA0JyA/ICdleGNsdXNpdmVNYXhpbXVtJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlID09PSAnMjAwJyA/ICdtaW5MZW5ndGgnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZSA9PT0gJzIwMScgPyAnbWF4TGVuZ3RoJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZSA9PT0gJzIwMicgPyAncGF0dGVybicgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZSA9PT0gJzMwMCcgPyAnbWluUHJvcGVydGllcycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlID09PSAnMzAxJyA/ICdtYXhQcm9wZXJ0aWVzJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZSA9PT0gJzMwMicgPyAncmVxdWlyZWQnIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgPT09ICczMDQnID8gJ2RlcGVuZGVuY2llcycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlID09PSAnNDAwJyA/ICdtaW5JdGVtcycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUgPT09ICc0MDEnID8gJ21heEl0ZW1zJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlID09PSAnNDAyJyA/ICd1bmlxdWVJdGVtcycgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlID09PSAnNTAwJyA/ICdmb3JtYXQnIDogY29kZSArICcnO1xuICAgICAgICAgICAgICBuZXdOb2RlLm9wdGlvbnMudmFsaWRhdGlvbk1lc3NhZ2VzW25ld0tleV0gPSBuZXdOb2RlLm9wdGlvbnMudmFsaWRhdGlvbk1lc3NhZ2Vba2V5XTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgbmV3Tm9kZS5vcHRpb25zLnZhbGlkYXRpb25NZXNzYWdlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChKc29uUG9pbnRlci5pc0pzb25Qb2ludGVyKGxheW91dEl0ZW0pKSB7XG4gICAgICBuZXdOb2RlLmRhdGFQb2ludGVyID0gbGF5b3V0SXRlbTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKGxheW91dEl0ZW0pKSB7XG4gICAgICBuZXdOb2RlLmtleSA9IGxheW91dEl0ZW07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2J1aWxkTGF5b3V0IGVycm9yOiBGb3JtIGxheW91dCBlbGVtZW50IG5vdCByZWNvZ25pemVkOicpO1xuICAgICAgY29uc29sZS5lcnJvcihsYXlvdXRJdGVtKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgbm9kZVNjaGVtYTogYW55ID0gbnVsbDtcblxuICAgIC8vIElmIG5ld05vZGUgZG9lcyBub3QgaGF2ZSBhIGRhdGFQb2ludGVyLCB0cnkgdG8gZmluZCBhbiBlcXVpdmFsZW50XG4gICAgaWYgKCFoYXNPd24obmV3Tm9kZSwgJ2RhdGFQb2ludGVyJykpIHtcblxuICAgICAgLy8gSWYgbmV3Tm9kZSBoYXMgYSBrZXksIGNoYW5nZSBpdCB0byBhIGRhdGFQb2ludGVyXG4gICAgICBpZiAoaGFzT3duKG5ld05vZGUsICdrZXknKSkge1xuICAgICAgICBuZXdOb2RlLmRhdGFQb2ludGVyID0gbmV3Tm9kZS5rZXkgPT09ICcqJyA/IG5ld05vZGUua2V5IDpcbiAgICAgICAgICBKc29uUG9pbnRlci5jb21waWxlKEpzb25Qb2ludGVyLnBhcnNlT2JqZWN0UGF0aChuZXdOb2RlLmtleSksICctJyk7XG4gICAgICAgIGRlbGV0ZSBuZXdOb2RlLmtleTtcblxuICAgICAgICAvLyBJZiBuZXdOb2RlIGlzIGFuIGFycmF5LCBzZWFyY2ggZm9yIGRhdGFQb2ludGVyIGluIGNoaWxkIG5vZGVzXG4gICAgICB9IGVsc2UgaWYgKGhhc093bihuZXdOb2RlLCAndHlwZScpICYmIG5ld05vZGUudHlwZS5zbGljZSgtNSkgPT09ICdhcnJheScpIHtcbiAgICAgICAgY29uc3QgZmluZERhdGFQb2ludGVyID0gKGl0ZW1zKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW1zID09PSBudWxsIHx8IHR5cGVvZiBpdGVtcyAhPT0gJ29iamVjdCcpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgaWYgKGhhc093bihpdGVtcywgJ2RhdGFQb2ludGVyJykpIHsgcmV0dXJuIGl0ZW1zLmRhdGFQb2ludGVyOyB9XG4gICAgICAgICAgaWYgKGlzQXJyYXkoaXRlbXMuaXRlbXMpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgaWYgKGhhc093bihpdGVtLCAnZGF0YVBvaW50ZXInKSAmJiBpdGVtLmRhdGFQb2ludGVyLmluZGV4T2YoJy8tJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZGF0YVBvaW50ZXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGhhc093bihpdGVtLCAnaXRlbXMnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlYXJjaEl0ZW0gPSBmaW5kRGF0YVBvaW50ZXIoaXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaEl0ZW0pIHsgcmV0dXJuIHNlYXJjaEl0ZW07IH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2hpbGREYXRhUG9pbnRlciA9IGZpbmREYXRhUG9pbnRlcihuZXdOb2RlKTtcbiAgICAgICAgaWYgKGNoaWxkRGF0YVBvaW50ZXIpIHtcbiAgICAgICAgICBuZXdOb2RlLmRhdGFQb2ludGVyID1cbiAgICAgICAgICAgIGNoaWxkRGF0YVBvaW50ZXIuc2xpY2UoMCwgY2hpbGREYXRhUG9pbnRlci5sYXN0SW5kZXhPZignLy0nKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzT3duKG5ld05vZGUsICdkYXRhUG9pbnRlcicpKSB7XG4gICAgICBpZiAobmV3Tm9kZS5kYXRhUG9pbnRlciA9PT0gJyonKSB7XG4gICAgICAgIHJldHVybiBidWlsZExheW91dEZyb21TY2hlbWEoanNmLCB3aWRnZXRMaWJyYXJ5LCBqc2YuZm9ybVZhbHVlcyk7XG4gICAgICB9XG4gICAgICBjb25zdCBub2RlVmFsdWUgPVxuICAgICAgICBKc29uUG9pbnRlci5nZXQoanNmLmZvcm1WYWx1ZXMsIG5ld05vZGUuZGF0YVBvaW50ZXIucmVwbGFjZSgvXFwvLS9nLCAnLzEnKSk7XG5cbiAgICAgIC8vIFRPRE86IENyZWF0ZSBmdW5jdGlvbiBnZXRGb3JtVmFsdWVzKGpzZiwgZGF0YVBvaW50ZXIsIGZvclJlZkxpYnJhcnkpXG4gICAgICAvLyBjaGVjayBmb3JtT3B0aW9ucy5zZXRTY2hlbWFEZWZhdWx0cyBhbmQgZm9ybU9wdGlvbnMuc2V0TGF5b3V0RGVmYXVsdHNcbiAgICAgIC8vIHRoZW4gc2V0IGFwcm9wcmlhdGUgdmFsdWVzIGZyb20gaW5pdGlhbFZhdWVzLCBzY2hlbWEsIG9yIGxheW91dFxuXG4gICAgICBuZXdOb2RlLmRhdGFQb2ludGVyID1cbiAgICAgICAgSnNvblBvaW50ZXIudG9HZW5lcmljUG9pbnRlcihuZXdOb2RlLmRhdGFQb2ludGVyLCBqc2YuYXJyYXlNYXApO1xuICAgICAgY29uc3QgTGFzdEtleSA9IEpzb25Qb2ludGVyLnRvS2V5KG5ld05vZGUuZGF0YVBvaW50ZXIpO1xuICAgICAgaWYgKCFuZXdOb2RlLm5hbWUgJiYgaXNTdHJpbmcoTGFzdEtleSkgJiYgTGFzdEtleSAhPT0gJy0nKSB7XG4gICAgICAgIG5ld05vZGUubmFtZSA9IExhc3RLZXk7XG4gICAgICB9XG4gICAgICBjb25zdCBzaG9ydERhdGFQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhcbiAgICAgICAgbmV3Tm9kZS5kYXRhUG9pbnRlciwganNmLmRhdGFSZWN1cnNpdmVSZWZNYXAsIGpzZi5hcnJheU1hcFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlY3Vyc2l2ZSA9ICFzaG9ydERhdGFQb2ludGVyLmxlbmd0aCB8fFxuICAgICAgICBzaG9ydERhdGFQb2ludGVyICE9PSBuZXdOb2RlLmRhdGFQb2ludGVyO1xuICAgICAgbGV0IHNjaGVtYVBvaW50ZXI6IHN0cmluZztcbiAgICAgIGlmICghanNmLmRhdGFNYXAuaGFzKHNob3J0RGF0YVBvaW50ZXIpKSB7XG4gICAgICAgIGpzZi5kYXRhTWFwLnNldChzaG9ydERhdGFQb2ludGVyLCBuZXcgTWFwKCkpO1xuICAgICAgfVxuICAgICAgY29uc3Qgbm9kZURhdGFNYXAgPSBqc2YuZGF0YU1hcC5nZXQoc2hvcnREYXRhUG9pbnRlcik7XG4gICAgICBpZiAobm9kZURhdGFNYXAuaGFzKCdzY2hlbWFQb2ludGVyJykpIHtcbiAgICAgICAgc2NoZW1hUG9pbnRlciA9IG5vZGVEYXRhTWFwLmdldCgnc2NoZW1hUG9pbnRlcicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NoZW1hUG9pbnRlciA9IEpzb25Qb2ludGVyLnRvU2NoZW1hUG9pbnRlcihzaG9ydERhdGFQb2ludGVyLCBqc2Yuc2NoZW1hKTtcbiAgICAgICAgbm9kZURhdGFNYXAuc2V0KCdzY2hlbWFQb2ludGVyJywgc2NoZW1hUG9pbnRlcik7XG4gICAgICB9XG4gICAgICBub2RlRGF0YU1hcC5zZXQoJ2Rpc2FibGVkJywgISFuZXdOb2RlLm9wdGlvbnMuZGlzYWJsZWQpO1xuICAgICAgbm9kZVNjaGVtYSA9IEpzb25Qb2ludGVyLmdldChqc2Yuc2NoZW1hLCBzY2hlbWFQb2ludGVyKTtcbiAgICAgIGlmIChub2RlU2NoZW1hKSB7XG4gICAgICAgIGlmICghaGFzT3duKG5ld05vZGUsICd0eXBlJykpIHtcbiAgICAgICAgICBuZXdOb2RlLnR5cGUgPSBnZXRJbnB1dFR5cGUobm9kZVNjaGVtYSwgbmV3Tm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXdpZGdldExpYnJhcnkuaGFzV2lkZ2V0KG5ld05vZGUudHlwZSkpIHtcbiAgICAgICAgICBjb25zdCBvbGRXaWRnZXRUeXBlID0gbmV3Tm9kZS50eXBlO1xuICAgICAgICAgIG5ld05vZGUudHlwZSA9IGdldElucHV0VHlwZShub2RlU2NoZW1hLCBuZXdOb2RlKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBlcnJvcjogd2lkZ2V0IHR5cGUgXCIke29sZFdpZGdldFR5cGV9XCIgYCArXG4gICAgICAgICAgICBgbm90IGZvdW5kIGluIGxpYnJhcnkuIFJlcGxhY2luZyB3aXRoIFwiJHtuZXdOb2RlLnR5cGV9XCIuYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3Tm9kZS50eXBlID0gY2hlY2tJbmxpbmVUeXBlKG5ld05vZGUudHlwZSwgbm9kZVNjaGVtYSwgbmV3Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGVTY2hlbWEudHlwZSA9PT0gJ29iamVjdCcgJiYgaXNBcnJheShub2RlU2NoZW1hLnJlcXVpcmVkKSkge1xuICAgICAgICAgIG5vZGVEYXRhTWFwLnNldCgncmVxdWlyZWQnLCBub2RlU2NoZW1hLnJlcXVpcmVkKTtcbiAgICAgICAgfVxuICAgICAgICBuZXdOb2RlLmRhdGFUeXBlID1cbiAgICAgICAgICBub2RlU2NoZW1hLnR5cGUgfHwgKGhhc093bihub2RlU2NoZW1hLCAnJHJlZicpID8gJyRyZWYnIDogbnVsbCk7XG4gICAgICAgIHVwZGF0ZUlucHV0T3B0aW9ucyhuZXdOb2RlLCBub2RlU2NoZW1hLCBqc2YpO1xuXG4gICAgICAgIC8vIFByZXNlbnQgY2hlY2tib3hlcyBhcyBzaW5nbGUgY29udHJvbCwgcmF0aGVyIHRoYW4gYXJyYXlcbiAgICAgICAgaWYgKG5ld05vZGUudHlwZSA9PT0gJ2NoZWNrYm94ZXMnICYmIGhhc093bihub2RlU2NoZW1hLCAnaXRlbXMnKSkge1xuICAgICAgICAgIHVwZGF0ZUlucHV0T3B0aW9ucyhuZXdOb2RlLCBub2RlU2NoZW1hLml0ZW1zLCBqc2YpO1xuICAgICAgICB9IGVsc2UgaWYgKG5ld05vZGUuZGF0YVR5cGUgPT09ICdhcnJheScpIHtcbiAgICAgICAgICBuZXdOb2RlLm9wdGlvbnMubWF4SXRlbXMgPSBNYXRoLm1pbihcbiAgICAgICAgICAgIG5vZGVTY2hlbWEubWF4SXRlbXMgfHwgMTAwMCwgbmV3Tm9kZS5vcHRpb25zLm1heEl0ZW1zIHx8IDEwMDBcbiAgICAgICAgICApO1xuICAgICAgICAgIG5ld05vZGUub3B0aW9ucy5taW5JdGVtcyA9IE1hdGgubWF4KFxuICAgICAgICAgICAgbm9kZVNjaGVtYS5taW5JdGVtcyB8fCAwLCBuZXdOb2RlLm9wdGlvbnMubWluSXRlbXMgfHwgMFxuICAgICAgICAgICk7XG4gICAgICAgICAgbmV3Tm9kZS5vcHRpb25zLmxpc3RJdGVtcyA9IE1hdGgubWF4KFxuICAgICAgICAgICAgbmV3Tm9kZS5vcHRpb25zLmxpc3RJdGVtcyB8fCAwLCBpc0FycmF5KG5vZGVWYWx1ZSkgPyBub2RlVmFsdWUubGVuZ3RoIDogMFxuICAgICAgICAgICk7XG4gICAgICAgICAgbmV3Tm9kZS5vcHRpb25zLnR1cGxlSXRlbXMgPVxuICAgICAgICAgICAgaXNBcnJheShub2RlU2NoZW1hLml0ZW1zKSA/IG5vZGVTY2hlbWEuaXRlbXMubGVuZ3RoIDogMDtcbiAgICAgICAgICBpZiAobmV3Tm9kZS5vcHRpb25zLm1heEl0ZW1zIDwgbmV3Tm9kZS5vcHRpb25zLnR1cGxlSXRlbXMpIHtcbiAgICAgICAgICAgIG5ld05vZGUub3B0aW9ucy50dXBsZUl0ZW1zID0gbmV3Tm9kZS5vcHRpb25zLm1heEl0ZW1zO1xuICAgICAgICAgICAgbmV3Tm9kZS5vcHRpb25zLmxpc3RJdGVtcyA9IDA7XG4gICAgICAgICAgfSBlbHNlIGlmIChuZXdOb2RlLm9wdGlvbnMubWF4SXRlbXMgPFxuICAgICAgICAgICAgbmV3Tm9kZS5vcHRpb25zLnR1cGxlSXRlbXMgKyBuZXdOb2RlLm9wdGlvbnMubGlzdEl0ZW1zXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBuZXdOb2RlLm9wdGlvbnMubGlzdEl0ZW1zID1cbiAgICAgICAgICAgICAgbmV3Tm9kZS5vcHRpb25zLm1heEl0ZW1zIC0gbmV3Tm9kZS5vcHRpb25zLnR1cGxlSXRlbXM7XG4gICAgICAgICAgfSBlbHNlIGlmIChuZXdOb2RlLm9wdGlvbnMubWluSXRlbXMgPlxuICAgICAgICAgICAgbmV3Tm9kZS5vcHRpb25zLnR1cGxlSXRlbXMgKyBuZXdOb2RlLm9wdGlvbnMubGlzdEl0ZW1zXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBuZXdOb2RlLm9wdGlvbnMubGlzdEl0ZW1zID1cbiAgICAgICAgICAgICAgbmV3Tm9kZS5vcHRpb25zLm1pbkl0ZW1zIC0gbmV3Tm9kZS5vcHRpb25zLnR1cGxlSXRlbXM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghbm9kZURhdGFNYXAuaGFzKCdtYXhJdGVtcycpKSB7XG4gICAgICAgICAgICBub2RlRGF0YU1hcC5zZXQoJ21heEl0ZW1zJywgbmV3Tm9kZS5vcHRpb25zLm1heEl0ZW1zKTtcbiAgICAgICAgICAgIG5vZGVEYXRhTWFwLnNldCgnbWluSXRlbXMnLCBuZXdOb2RlLm9wdGlvbnMubWluSXRlbXMpO1xuICAgICAgICAgICAgbm9kZURhdGFNYXAuc2V0KCd0dXBsZUl0ZW1zJywgbmV3Tm9kZS5vcHRpb25zLnR1cGxlSXRlbXMpO1xuICAgICAgICAgICAgbm9kZURhdGFNYXAuc2V0KCdsaXN0SXRlbXMnLCBuZXdOb2RlLm9wdGlvbnMubGlzdEl0ZW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFqc2YuYXJyYXlNYXAuaGFzKHNob3J0RGF0YVBvaW50ZXIpKSB7XG4gICAgICAgICAgICBqc2YuYXJyYXlNYXAuc2V0KHNob3J0RGF0YVBvaW50ZXIsIG5ld05vZGUub3B0aW9ucy50dXBsZUl0ZW1zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzSW5wdXRSZXF1aXJlZChqc2Yuc2NoZW1hLCBzY2hlbWFQb2ludGVyKSkge1xuICAgICAgICAgIG5ld05vZGUub3B0aW9ucy5yZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAganNmLmZpZWxkc1JlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogY3JlYXRlIGl0ZW0gaW4gRm9ybUdyb3VwIG1vZGVsIGZyb20gbGF5b3V0IGtleSAoPylcbiAgICAgICAgdXBkYXRlSW5wdXRPcHRpb25zKG5ld05vZGUsIHt9LCBqc2YpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW5ld05vZGUub3B0aW9ucy50aXRsZSAmJiAhL15cXGQrJC8udGVzdChuZXdOb2RlLm5hbWUpKSB7XG4gICAgICAgIG5ld05vZGUub3B0aW9ucy50aXRsZSA9IGZpeFRpdGxlKG5ld05vZGUubmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNPd24obmV3Tm9kZS5vcHRpb25zLCAnY29weVZhbHVlVG8nKSkge1xuICAgICAgICBpZiAodHlwZW9mIG5ld05vZGUub3B0aW9ucy5jb3B5VmFsdWVUbyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBuZXdOb2RlLm9wdGlvbnMuY29weVZhbHVlVG8gPSBbbmV3Tm9kZS5vcHRpb25zLmNvcHlWYWx1ZVRvXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBcnJheShuZXdOb2RlLm9wdGlvbnMuY29weVZhbHVlVG8pKSB7XG4gICAgICAgICAgbmV3Tm9kZS5vcHRpb25zLmNvcHlWYWx1ZVRvID0gbmV3Tm9kZS5vcHRpb25zLmNvcHlWYWx1ZVRvLm1hcChpdGVtID0+XG4gICAgICAgICAgICBKc29uUG9pbnRlci5jb21waWxlKEpzb25Qb2ludGVyLnBhcnNlT2JqZWN0UGF0aChpdGVtKSwgJy0nKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbmV3Tm9kZS53aWRnZXQgPSB3aWRnZXRMaWJyYXJ5LmdldFdpZGdldChuZXdOb2RlLnR5cGUpO1xuICAgICAgbm9kZURhdGFNYXAuc2V0KCdpbnB1dFR5cGUnLCBuZXdOb2RlLnR5cGUpO1xuICAgICAgbm9kZURhdGFNYXAuc2V0KCd3aWRnZXQnLCBuZXdOb2RlLndpZGdldCk7XG5cbiAgICAgIGlmIChuZXdOb2RlLmRhdGFUeXBlID09PSAnYXJyYXknICYmXG4gICAgICAgIChoYXNPd24obmV3Tm9kZSwgJ2l0ZW1zJykgfHwgaGFzT3duKG5ld05vZGUsICdhZGRpdGlvbmFsSXRlbXMnKSlcbiAgICAgICkge1xuICAgICAgICBjb25zdCBpdGVtUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgbmV3Tm9kZS5kYXRhUG9pbnRlciArICcvLScsIGpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLCBqc2YuYXJyYXlNYXBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFqc2YuZGF0YU1hcC5oYXMoaXRlbVJlZlBvaW50ZXIpKSB7XG4gICAgICAgICAganNmLmRhdGFNYXAuc2V0KGl0ZW1SZWZQb2ludGVyLCBuZXcgTWFwKCkpO1xuICAgICAgICB9XG4gICAgICAgIGpzZi5kYXRhTWFwLmdldChpdGVtUmVmUG9pbnRlcikuc2V0KCdpbnB1dFR5cGUnLCAnc2VjdGlvbicpO1xuXG4gICAgICAgIC8vIEZpeCBpbnN1ZmZpY2llbnRseSBuZXN0ZWQgYXJyYXkgaXRlbSBncm91cHNcbiAgICAgICAgaWYgKG5ld05vZGUuaXRlbXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGNvbnN0IGFycmF5SXRlbUdyb3VwID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaSA9IG5ld05vZGUuaXRlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHN1Ykl0ZW0gPSBuZXdOb2RlLml0ZW1zW2ldO1xuICAgICAgICAgICAgaWYgKGhhc093bihzdWJJdGVtLCAnZGF0YVBvaW50ZXInKSAmJlxuICAgICAgICAgICAgICBzdWJJdGVtLmRhdGFQb2ludGVyLnNsaWNlKDAsIGl0ZW1SZWZQb2ludGVyLmxlbmd0aCkgPT09IGl0ZW1SZWZQb2ludGVyXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgY29uc3QgYXJyYXlJdGVtID0gbmV3Tm9kZS5pdGVtcy5zcGxpY2UoaSwgMSlbMF07XG4gICAgICAgICAgICAgIGFycmF5SXRlbS5kYXRhUG9pbnRlciA9IG5ld05vZGUuZGF0YVBvaW50ZXIgKyAnLy0nICtcbiAgICAgICAgICAgICAgICBhcnJheUl0ZW0uZGF0YVBvaW50ZXIuc2xpY2UoaXRlbVJlZlBvaW50ZXIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgYXJyYXlJdGVtR3JvdXAudW5zaGlmdChhcnJheUl0ZW0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3ViSXRlbS5hcnJheUl0ZW0gPSB0cnVlO1xuICAgICAgICAgICAgICAvLyBUT0RPOiBDaGVjayBzY2hlbWEgdG8gZ2V0IGFycmF5SXRlbVR5cGUgYW5kIHJlbW92YWJsZVxuICAgICAgICAgICAgICBzdWJJdGVtLmFycmF5SXRlbVR5cGUgPSAnbGlzdCc7XG4gICAgICAgICAgICAgIHN1Ykl0ZW0ucmVtb3ZhYmxlID0gbmV3Tm9kZS5vcHRpb25zLnJlbW92YWJsZSAhPT0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhcnJheUl0ZW1Hcm91cC5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5ld05vZGUuaXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgIF9pZDogdW5pcXVlSWQoKSxcbiAgICAgICAgICAgICAgYXJyYXlJdGVtOiB0cnVlLFxuICAgICAgICAgICAgICBhcnJheUl0ZW1UeXBlOiBuZXdOb2RlLm9wdGlvbnMudHVwbGVJdGVtcyA+IG5ld05vZGUuaXRlbXMubGVuZ3RoID9cbiAgICAgICAgICAgICAgICAndHVwbGUnIDogJ2xpc3QnLFxuICAgICAgICAgICAgICBpdGVtczogYXJyYXlJdGVtR3JvdXAsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IHsgcmVtb3ZhYmxlOiBuZXdOb2RlLm9wdGlvbnMucmVtb3ZhYmxlICE9PSBmYWxzZSwgfSxcbiAgICAgICAgICAgICAgZGF0YVBvaW50ZXI6IG5ld05vZGUuZGF0YVBvaW50ZXIgKyAnLy0nLFxuICAgICAgICAgICAgICB0eXBlOiAnc2VjdGlvbicsXG4gICAgICAgICAgICAgIHdpZGdldDogd2lkZ2V0TGlicmFyeS5nZXRXaWRnZXQoJ3NlY3Rpb24nKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUT0RPOiBGaXggdG8gaG5kbGUgbXVsdGlwbGUgaXRlbXNcbiAgICAgICAgICBuZXdOb2RlLml0ZW1zWzBdLmFycmF5SXRlbSA9IHRydWU7XG4gICAgICAgICAgaWYgKCFuZXdOb2RlLml0ZW1zWzBdLmRhdGFQb2ludGVyKSB7XG4gICAgICAgICAgICBuZXdOb2RlLml0ZW1zWzBdLmRhdGFQb2ludGVyID1cbiAgICAgICAgICAgICAgSnNvblBvaW50ZXIudG9HZW5lcmljUG9pbnRlcihpdGVtUmVmUG9pbnRlciwganNmLmFycmF5TWFwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFKc29uUG9pbnRlci5oYXMobmV3Tm9kZSwgJy9pdGVtcy8wL29wdGlvbnMvcmVtb3ZhYmxlJykpIHtcbiAgICAgICAgICAgIG5ld05vZGUuaXRlbXNbMF0ub3B0aW9ucy5yZW1vdmFibGUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobmV3Tm9kZS5vcHRpb25zLm9yZGVyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIG5ld05vZGUuaXRlbXNbMF0ub3B0aW9ucy5vcmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV3Tm9kZS5pdGVtc1swXS5hcnJheUl0ZW1UeXBlID1cbiAgICAgICAgICAgIG5ld05vZGUub3B0aW9ucy50dXBsZUl0ZW1zID8gJ3R1cGxlJyA6ICdsaXN0JztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0FycmF5KG5ld05vZGUuaXRlbXMpKSB7XG4gICAgICAgICAgY29uc3QgYXJyYXlMaXN0SXRlbXMgPVxuICAgICAgICAgICAgbmV3Tm9kZS5pdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnR5cGUgIT09ICckcmVmJykubGVuZ3RoIC1cbiAgICAgICAgICAgIG5ld05vZGUub3B0aW9ucy50dXBsZUl0ZW1zO1xuICAgICAgICAgIGlmIChhcnJheUxpc3RJdGVtcyA+IG5ld05vZGUub3B0aW9ucy5saXN0SXRlbXMpIHtcbiAgICAgICAgICAgIG5ld05vZGUub3B0aW9ucy5saXN0SXRlbXMgPSBhcnJheUxpc3RJdGVtcztcbiAgICAgICAgICAgIG5vZGVEYXRhTWFwLnNldCgnbGlzdEl0ZW1zJywgYXJyYXlMaXN0SXRlbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaGFzT3duKGpzZi5sYXlvdXRSZWZMaWJyYXJ5LCBpdGVtUmVmUG9pbnRlcikpIHtcbiAgICAgICAgICBqc2YubGF5b3V0UmVmTGlicmFyeVtpdGVtUmVmUG9pbnRlcl0gPVxuICAgICAgICAgICAgY2xvbmVEZWVwKG5ld05vZGUuaXRlbXNbbmV3Tm9kZS5pdGVtcy5sZW5ndGggLSAxXSk7XG4gICAgICAgICAgaWYgKHJlY3Vyc2l2ZSkge1xuICAgICAgICAgICAganNmLmxheW91dFJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdLnJlY3Vyc2l2ZVJlZmVyZW5jZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvckVhY2goanNmLmxheW91dFJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdLCAoaXRlbSwga2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoaGFzT3duKGl0ZW0sICdfaWQnKSkgeyBpdGVtLl9pZCA9IG51bGw7IH1cbiAgICAgICAgICAgIGlmIChyZWN1cnNpdmUpIHtcbiAgICAgICAgICAgICAgaWYgKGhhc093bihpdGVtLCAnZGF0YVBvaW50ZXInKSkge1xuICAgICAgICAgICAgICAgIGl0ZW0uZGF0YVBvaW50ZXIgPSBpdGVtLmRhdGFQb2ludGVyLnNsaWNlKGl0ZW1SZWZQb2ludGVyLmxlbmd0aCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCAndG9wLWRvd24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBhbnkgYWRkaXRpb25hbCBkZWZhdWx0IGl0ZW1zXG4gICAgICAgIGlmICghbmV3Tm9kZS5yZWN1cnNpdmVSZWZlcmVuY2UgfHwgbmV3Tm9kZS5vcHRpb25zLnJlcXVpcmVkKSB7XG4gICAgICAgICAgY29uc3QgYXJyYXlMZW5ndGggPSBNYXRoLm1pbihNYXRoLm1heChcbiAgICAgICAgICAgIG5ld05vZGUub3B0aW9ucy50dXBsZUl0ZW1zICsgbmV3Tm9kZS5vcHRpb25zLmxpc3RJdGVtcyxcbiAgICAgICAgICAgIGlzQXJyYXkobm9kZVZhbHVlKSA/IG5vZGVWYWx1ZS5sZW5ndGggOiAwXG4gICAgICAgICAgKSwgbmV3Tm9kZS5vcHRpb25zLm1heEl0ZW1zKTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gbmV3Tm9kZS5pdGVtcy5sZW5ndGg7IGkgPCBhcnJheUxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBuZXdOb2RlLml0ZW1zLnB1c2goZ2V0TGF5b3V0Tm9kZSh7XG4gICAgICAgICAgICAgICRyZWY6IGl0ZW1SZWZQb2ludGVyLFxuICAgICAgICAgICAgICBkYXRhUG9pbnRlcjogbmV3Tm9kZS5kYXRhUG9pbnRlcixcbiAgICAgICAgICAgICAgcmVjdXJzaXZlUmVmZXJlbmNlOiBuZXdOb2RlLnJlY3Vyc2l2ZVJlZmVyZW5jZSxcbiAgICAgICAgICAgIH0sIGpzZiwgd2lkZ2V0TGlicmFyeSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG5lZWRlZCwgYWRkIGJ1dHRvbiB0byBhZGQgaXRlbXMgdG8gYXJyYXlcbiAgICAgICAgaWYgKG5ld05vZGUub3B0aW9ucy5hZGRhYmxlICE9PSBmYWxzZSAmJlxuICAgICAgICAgIG5ld05vZGUub3B0aW9ucy5taW5JdGVtcyA8IG5ld05vZGUub3B0aW9ucy5tYXhJdGVtcyAmJlxuICAgICAgICAgIChuZXdOb2RlLml0ZW1zW25ld05vZGUuaXRlbXMubGVuZ3RoIC0gMV0gfHwge30pLnR5cGUgIT09ICckcmVmJ1xuICAgICAgICApIHtcbiAgICAgICAgICBsZXQgYnV0dG9uVGV4dCA9ICdBZGQnO1xuICAgICAgICAgIGlmIChuZXdOb2RlLm9wdGlvbnMudGl0bGUpIHtcbiAgICAgICAgICAgIGlmICgvXmFkZFxcYi9pLnRlc3QobmV3Tm9kZS5vcHRpb25zLnRpdGxlKSkge1xuICAgICAgICAgICAgICBidXR0b25UZXh0ID0gbmV3Tm9kZS5vcHRpb25zLnRpdGxlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnV0dG9uVGV4dCArPSAnICcgKyBuZXdOb2RlLm9wdGlvbnMudGl0bGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChuZXdOb2RlLm5hbWUgJiYgIS9eXFxkKyQvLnRlc3QobmV3Tm9kZS5uYW1lKSkge1xuICAgICAgICAgICAgaWYgKC9eYWRkXFxiL2kudGVzdChuZXdOb2RlLm5hbWUpKSB7XG4gICAgICAgICAgICAgIGJ1dHRvblRleHQgKz0gJyAnICsgZml4VGl0bGUobmV3Tm9kZS5uYW1lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJ1dHRvblRleHQgPSBmaXhUaXRsZShuZXdOb2RlLm5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBuZXdOb2RlIGRvZXNuJ3QgaGF2ZSBhIHRpdGxlLCBsb29rIGZvciB0aXRsZSBvZiBwYXJlbnQgYXJyYXkgaXRlbVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRTY2hlbWEgPVxuICAgICAgICAgICAgICBnZXRGcm9tU2NoZW1hKGpzZi5zY2hlbWEsIG5ld05vZGUuZGF0YVBvaW50ZXIsICdwYXJlbnRTY2hlbWEnKTtcbiAgICAgICAgICAgIGlmIChoYXNPd24ocGFyZW50U2NoZW1hLCAndGl0bGUnKSkge1xuICAgICAgICAgICAgICBidXR0b25UZXh0ICs9ICcgdG8gJyArIHBhcmVudFNjaGVtYS50aXRsZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IHBvaW50ZXJBcnJheSA9IEpzb25Qb2ludGVyLnBhcnNlKG5ld05vZGUuZGF0YVBvaW50ZXIpO1xuICAgICAgICAgICAgICBidXR0b25UZXh0ICs9ICcgdG8gJyArIGZpeFRpdGxlKHBvaW50ZXJBcnJheVtwb2ludGVyQXJyYXkubGVuZ3RoIC0gMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBuZXdOb2RlLml0ZW1zLnB1c2goe1xuICAgICAgICAgICAgX2lkOiB1bmlxdWVJZCgpLFxuICAgICAgICAgICAgYXJyYXlJdGVtOiB0cnVlLFxuICAgICAgICAgICAgYXJyYXlJdGVtVHlwZTogJ2xpc3QnLFxuICAgICAgICAgICAgZGF0YVBvaW50ZXI6IG5ld05vZGUuZGF0YVBvaW50ZXIgKyAnLy0nLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBsaXN0SXRlbXM6IG5ld05vZGUub3B0aW9ucy5saXN0SXRlbXMsXG4gICAgICAgICAgICAgIG1heEl0ZW1zOiBuZXdOb2RlLm9wdGlvbnMubWF4SXRlbXMsXG4gICAgICAgICAgICAgIG1pbkl0ZW1zOiBuZXdOb2RlLm9wdGlvbnMubWluSXRlbXMsXG4gICAgICAgICAgICAgIHJlbW92YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgIHRpdGxlOiBidXR0b25UZXh0LFxuICAgICAgICAgICAgICB0dXBsZUl0ZW1zOiBuZXdOb2RlLm9wdGlvbnMudHVwbGVJdGVtcyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWN1cnNpdmVSZWZlcmVuY2U6IHJlY3Vyc2l2ZSxcbiAgICAgICAgICAgIHR5cGU6ICckcmVmJyxcbiAgICAgICAgICAgIHdpZGdldDogd2lkZ2V0TGlicmFyeS5nZXRXaWRnZXQoJyRyZWYnKSxcbiAgICAgICAgICAgICRyZWY6IGl0ZW1SZWZQb2ludGVyLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChpc1N0cmluZyhKc29uUG9pbnRlci5nZXQobmV3Tm9kZSwgJy9zdHlsZS9hZGQnKSkpIHtcbiAgICAgICAgICAgIG5ld05vZGUuaXRlbXNbbmV3Tm9kZS5pdGVtcy5sZW5ndGggLSAxXS5vcHRpb25zLmZpZWxkU3R5bGUgPVxuICAgICAgICAgICAgICBuZXdOb2RlLnN0eWxlLmFkZDtcbiAgICAgICAgICAgIGRlbGV0ZSBuZXdOb2RlLnN0eWxlLmFkZDtcbiAgICAgICAgICAgIGlmIChpc0VtcHR5KG5ld05vZGUuc3R5bGUpKSB7IGRlbGV0ZSBuZXdOb2RlLnN0eWxlOyB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdOb2RlLmFycmF5SXRlbSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaGFzT3duKG5ld05vZGUsICd0eXBlJykgfHwgaGFzT3duKG5ld05vZGUsICdpdGVtcycpKSB7XG4gICAgICBjb25zdCBwYXJlbnRUeXBlOiBzdHJpbmcgPVxuICAgICAgICBKc29uUG9pbnRlci5nZXQoanNmLmxheW91dCwgbGF5b3V0UG9pbnRlciwgMCwgLTIpLnR5cGU7XG4gICAgICBpZiAoIWhhc093bihuZXdOb2RlLCAndHlwZScpKSB7XG4gICAgICAgIG5ld05vZGUudHlwZSA9XG4gICAgICAgICAgaW5BcnJheShwYXJlbnRUeXBlLCBbJ3RhYnMnLCAndGFiYXJyYXknXSkgPyAndGFiJyA6ICdhcnJheSc7XG4gICAgICB9XG4gICAgICBuZXdOb2RlLmFycmF5SXRlbSA9IHBhcmVudFR5cGUgPT09ICdhcnJheSc7XG4gICAgICBuZXdOb2RlLndpZGdldCA9IHdpZGdldExpYnJhcnkuZ2V0V2lkZ2V0KG5ld05vZGUudHlwZSk7XG4gICAgICB1cGRhdGVJbnB1dE9wdGlvbnMobmV3Tm9kZSwge30sIGpzZik7XG4gICAgfVxuICAgIGlmIChuZXdOb2RlLnR5cGUgPT09ICdzdWJtaXQnKSB7IGhhc1N1Ym1pdEJ1dHRvbiA9IHRydWU7IH1cbiAgICByZXR1cm4gbmV3Tm9kZTtcbiAgfSk7XG4gIGlmIChqc2YuaGFzUm9vdFJlZmVyZW5jZSkge1xuICAgIGNvbnN0IGZ1bGxMYXlvdXQgPSBjbG9uZURlZXAoZm9ybUxheW91dCk7XG4gICAgaWYgKGZ1bGxMYXlvdXRbZnVsbExheW91dC5sZW5ndGggLSAxXS50eXBlID09PSAnc3VibWl0JykgeyBmdWxsTGF5b3V0LnBvcCgpOyB9XG4gICAganNmLmxheW91dFJlZkxpYnJhcnlbJyddID0ge1xuICAgICAgX2lkOiBudWxsLFxuICAgICAgZGF0YVBvaW50ZXI6ICcnLFxuICAgICAgZGF0YVR5cGU6ICdvYmplY3QnLFxuICAgICAgaXRlbXM6IGZ1bGxMYXlvdXQsXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIG9wdGlvbnM6IGNsb25lRGVlcChqc2YuZm9ybU9wdGlvbnMuZGVmYXVsdFdpZGdldE9wdGlvbnMpLFxuICAgICAgcmVjdXJzaXZlUmVmZXJlbmNlOiB0cnVlLFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgdHlwZTogJ3NlY3Rpb24nLFxuICAgICAgd2lkZ2V0OiB3aWRnZXRMaWJyYXJ5LmdldFdpZGdldCgnc2VjdGlvbicpLFxuICAgIH07XG4gIH1cbiAgaWYgKCFoYXNTdWJtaXRCdXR0b24pIHtcbiAgICBmb3JtTGF5b3V0LnB1c2goe1xuICAgICAgX2lkOiB1bmlxdWVJZCgpLFxuICAgICAgb3B0aW9uczogeyB0aXRsZTogJ1N1Ym1pdCcgfSxcbiAgICAgIHR5cGU6ICdzdWJtaXQnLFxuICAgICAgd2lkZ2V0OiB3aWRnZXRMaWJyYXJ5LmdldFdpZGdldCgnc3VibWl0JyksXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGZvcm1MYXlvdXQ7XG59XG5cbi8vVE9ETy1yZXZpZXc6dGhpcyBpbXBsZW1lbnRzIGEgcXVpY2sgJ3Bvc3QnIGZpeCByYXRoZXIgdGhhbiBhblxuLy9pbnRlZ3JhcmVkIGlkZWFsIGZpeFxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTGF5b3V0KGpzZiwgd2lkZ2V0TGlicmFyeSkge1xuICBsZXQgbGF5b3V0PWJ1aWxkTGF5b3V0X29yaWdpbmFsKGpzZiwgd2lkZ2V0TGlicmFyeSk7XG4gIGlmIChqc2YuZm9ybVZhbHVlcykge1xuICAgIGxldCBmaXhlZExheW91dCA9IGZpeE5lc3RlZEFycmF5TGF5b3V0KHtcbiAgICAgIGJ1aWx0TGF5b3V0OiBsYXlvdXQsXG4gICAgICBmb3JtRGF0YToganNmLmZvcm1WYWx1ZXNcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gbGF5b3V0O1xufVxuXG5cblxuZnVuY3Rpb24gZml4TmVzdGVkQXJyYXlMYXlvdXQob3B0aW9uczogYW55KSB7XG4gIGxldCB7IGJ1aWx0TGF5b3V0LCBmb3JtRGF0YSB9ID0gb3B0aW9ucztcbiAgbGV0IGFyckxlbmd0aHMgPSB7fTtcbiAgbGV0IHRyYXZlcnNlT2JqID0gZnVuY3Rpb24gKG9iaiwgcGF0aCwgb25WYWx1ZT8pIHtcbiAgICBpZiAoX2lzQXJyYXkob2JqKSkge1xuICAgICAgb25WYWx1ZSAmJiBvblZhbHVlKG9iaiwgcGF0aCk7XG4gICAgICBvYmouZm9yRWFjaCgoaXRlbSwgaW5kKSA9PiB7XG4gICAgICAgIG9uVmFsdWUgJiYgb25WYWx1ZShpdGVtLCBwYXRoICsgXCIvXCIgKyBpbmQpO1xuICAgICAgICB0cmF2ZXJzZU9iaihpdGVtLCBwYXRoICsgXCIvXCIgKyBpbmQsIG9uVmFsdWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChfaXNQbGFpbk9iamVjdChvYmopKSB7XG4gICAgICBvblZhbHVlICYmIG9uVmFsdWUob2JqLCBwYXRoKTtcbiAgICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBvblZhbHVlICYmIG9uVmFsdWUob2JqW2tleV0sIHBhdGggKyBcIi9cIiArIGtleSk7XG4gICAgICAgIHRyYXZlcnNlT2JqKG9ialtrZXldLCBwYXRoICsgXCIvXCIgKyBrZXksIG9uVmFsdWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm5cbiAgICB9XG4gIH1cbiAgdHJhdmVyc2VPYmooZm9ybURhdGEsIFwiXCIsICh2YWx1ZSwgcGF0aCkgPT4ge1xuICAgIGlmIChfaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGFyckxlbmd0aHNbcGF0aF0gPSBhcnJMZW5ndGhzW3BhdGhdIHx8IHZhbHVlLmxlbmd0aDtcbiAgICB9XG4gIH0pO1xuXG4gIGxldCBnZXREYXRhU2l6ZSA9IChvcHRpb25zOiBhbnkpID0+IHtcbiAgICBsZXQgeyBkYXRhLCBkYXRhUG9pbnRlciwgaW5kZXhBcnJheSB9ID0gb3B0aW9ucztcbiAgICBsZXQgZGFzaENvdW50ID0gMDtcbiAgICBsZXQgZHBJbnN0YW5jZSA9IGRhdGFQb2ludGVyLnN1YnN0cmluZygxKS5zcGxpdChcIi9cIikubWFwKChwYXJ0LCBwaW5kKSA9PiB7XG4gICAgICBpZiAocGFydCA9PSBcIi1cIiAmJiBpbmRleEFycmF5W2Rhc2hDb3VudF0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBpbmRleEFycmF5W2Rhc2hDb3VudCsrXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJ0O1xuICAgIH0pXG4gICAgICAuam9pbihcIi9cIik7XG4gICAgZHBJbnN0YW5jZSA9IFwiL1wiICsgZHBJbnN0YW5jZTtcbiAgICBsZXQgYXJyU2l6ZSA9IGFyckxlbmd0aHNbZHBJbnN0YW5jZV07XG4gICAgcmV0dXJuIGFyclNpemU7XG4gIH1cbiAgLy9zdGlsbCB0b28gYnVnZ3lcbiAgbGV0IGNyZWF0ZU5vblJlZkl0ZW0gPSAobm9kZVdpdGhSZWY6IGFueSkgPT4ge1xuICAgIGxldCB0ZW1wbGF0ZU5vZGUgPSB7XG4gICAgICBcInR5cGVcIjogXCJzZWN0aW9uXCIsIC8vY2hlY2sgdGhpcyBjb3VsZCBhbHNvIGJlIGFycmF5P1xuICAgICAgXCJyZWN1cnNpdmVSZWZlcmVuY2VcIjogZmFsc2UsLy9jaGVjayB0aGlzIFxuICAgICAgXCJpdGVtc1wiOiBbXVxuICAgIH1cbiAgICBsZXQgY2xvbmUgPSBjbG9uZURlZXAobm9kZVdpdGhSZWYpO1xuICAgIC8vY29tbWVudGVkIG91dCBmb3Igbm93IHNvIHRoYXQgaXQgYmVoYXZlcyBhcyB1c3VzYWxcbiAgICAvL18ubWVyZ2UoY2xvbmUsdGVtcGxhdGVOb2RlKTtcbiAgICByZXR1cm4gY2xvbmU7XG4gIH1cblxuICBsZXQgcmVidWlsZExheW91dCA9IChvcHRpb25zOiBhbnkpID0+IHtcbiAgICBsZXQgeyBidWlsdExheW91dCwgaW5kaWNlcywgcGFyZW50RGF0YVBvaW50ZXIsIGluZGV4UG9zIH0gPSBvcHRpb25zO1xuICAgIGluZGljZXMgPSBpbmRpY2VzIHx8IFtdO1xuICAgIGluZGV4UG9zID0gaW5kZXhQb3MgPT0gdW5kZWZpbmVkID8gaW5kZXhQb3MgPSAtMSA6IGluZGV4UG9zO1xuICAgIGlmIChfaXNBcnJheShidWlsdExheW91dCkpIHtcbiAgICAgIGJ1aWx0TGF5b3V0LmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIHJlYnVpbGRMYXlvdXQoe1xuICAgICAgICAgIGJ1aWx0TGF5b3V0OiBpdGVtLFxuICAgICAgICAgIGluZGljZXM6IGluZGljZXMsXG4gICAgICAgICAgaW5kZXhQb3M6IGluZGV4UG9zLFxuICAgICAgICAgIHBhcmVudERhdGFQb2ludGVyOiBidWlsdExheW91dC5kYXRhUG9pbnRlciB8fCBwYXJlbnREYXRhUG9pbnRlclxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIFxuICAgIGxldCBkYXRhVHlwZXM9W1wiYXJyYXlcIl07Ly9jaGVjayBvbmx5IGFycmF5IGZvciBub3dcbiAgICAgLy9mb3Igbm93IGFkZGVkIGNvbmRpdGlvbiB0byBpZ25vcmUgcmVjdXJzaXZlIHJlZmVyZW5jZXNcbiAgICBpZiAoYnVpbHRMYXlvdXQuaXRlbXMgJiYgZGF0YVR5cGVzLmluZGV4T2YoYnVpbHRMYXlvdXQuZGF0YVR5cGUpPj0wXG4gICAgICAmJiBidWlsdExheW91dC5kYXRhUG9pbnRlclxuICAgICAgJiYgIWJ1aWx0TGF5b3V0LnJlY3Vyc2l2ZVJlZmVyZW5jZVxuICAgICkge1xuICAgICAgbGV0IG51bURhdGFJdGVtczogYW55ID0gZ2V0RGF0YVNpemUoe1xuICAgICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgICAgZGF0YVBvaW50ZXI6IGJ1aWx0TGF5b3V0LmRhdGFQb2ludGVyLFxuICAgICAgICBpbmRleEFycmF5OiBpbmRpY2VzXG4gICAgICB9KTtcbiAgICAgIGxldCBudW1BY3R1YWxJdGVtcyA9IGJ1aWx0TGF5b3V0Lml0ZW1zLmxlbmd0aDtcbiAgICAgIC8vY2hlY2sgaWYgdGhlcmUncyByZWYgaXRlbXMsIGlmIHNvIGlnbm9yZSBpdCBhbmQgdGhlcmVmb3JlXG4gICAgICAvL2RlY3JlbWVudCB0aGUgaXRlbSBjb3VudFxuICAgICAgYnVpbHRMYXlvdXQuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaWYgKGl0ZW0udHlwZSAmJiBpdGVtLnR5cGUgPT0gXCIkcmVmXCIpIHtcbiAgICAgICAgICBudW1BY3R1YWxJdGVtcy0tO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG51bUFjdHVhbEl0ZW1zID0gTWF0aC5tYXgobnVtQWN0dWFsSXRlbXMsIDApOy8vYXZvaWQgZGVhbGluZyB3aXRoIG5lZ2F0aXZlc1xuICAgICAgaWYgKG51bUFjdHVhbEl0ZW1zIDwgbnVtRGF0YUl0ZW1zKSB7XG5cbiAgICAgICAgbGV0IG51bUl0ZW1zTmVlZGVkID0gbnVtRGF0YUl0ZW1zIC0gbnVtQWN0dWFsSXRlbXM7XG4gICAgICAgIC8vYWRkZWQgdG8gaWdub3JlIHJlY3Vyc2l2ZSByZWZlcmVuY2VzXG4gICAgICAgIGlmIChudW1BY3R1YWxJdGVtcyA9PSAwICYmIGJ1aWx0TGF5b3V0Lml0ZW1zWzBdLnJlY3Vyc2l2ZVJlZmVyZW5jZSkge1xuICAgICAgICAgIG51bUl0ZW1zTmVlZGVkID0gMFxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtSXRlbXNOZWVkZWQ7IGkrKykge1xuICAgICAgICAgIC8vbm9kZSBtdXN0IG5vdCBiZSBvZiB0eXBlIFwidHlwZVwiOiBcIiRyZWZcIlxuICAgICAgICAgIC8vaWYgaXQgaXMgdGhlbiBtYW51ZmFjdHVyZSBvdXIgb3duXG4gICAgICAgICAgbGV0IGlzUmVmTm9kZSA9IGJ1aWx0TGF5b3V0Lml0ZW1zWzBdLnR5cGUgJiYgYnVpbHRMYXlvdXQuaXRlbXNbMF0udHlwZSA9PSBcIiRyZWZcIjtcbiAgICAgICAgICBsZXQgbmV3SXRlbSA9IGlzUmVmTm9kZVxuICAgICAgICAgICAgPyBjcmVhdGVOb25SZWZJdGVtKGJ1aWx0TGF5b3V0Lml0ZW1zWzBdKVxuICAgICAgICAgICAgOiBjbG9uZURlZXAoYnVpbHRMYXlvdXQuaXRlbXNbMF0pOy8vY29weSBmaXJzdFxuICAgICAgICAgIG5ld0l0ZW0uX2lkID0gdW5pcXVlSWQoXCJuZXdfXCIpO1xuICAgICAgICAgIGJ1aWx0TGF5b3V0Lml0ZW1zLnVuc2hpZnQobmV3SXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJ1aWx0TGF5b3V0Lm9wdGlvbnMubGlzdEl0ZW1zKSB7XG4gICAgICAgICAgYnVpbHRMYXlvdXQub3B0aW9ucy5saXN0SXRlbXMgPSBudW1EYXRhSXRlbXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGluZGljZXNbYnVpbHRMYXlvdXQuZGF0YVBvaW50ZXJdID0gaW5kaWNlc1tidWlsdExheW91dC5kYXRhUG9pbnRlcl0gfHwgLTE7XG4gICAgICBpbmRleFBvcysrO1xuICAgICAgYnVpbHRMYXlvdXQuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgaW5kaWNlc1tpbmRleFBvc10gPSBpbmRleFxuICAgICAgICByZWJ1aWxkTGF5b3V0KHtcbiAgICAgICAgICBidWlsdExheW91dDogaXRlbSxcbiAgICAgICAgICBpbmRpY2VzOiBpbmRpY2VzLFxuICAgICAgICAgIHBhcmVudERhdGFQb2ludGVyOiBidWlsdExheW91dC5kYXRhUG9pbnRlcixcbiAgICAgICAgICBpbmRleFBvczogaW5kZXhQb3NcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBpbmRleFBvcy0tO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoYnVpbHRMYXlvdXQuaXRlbXMpIHtcbiAgICAgICAgYnVpbHRMYXlvdXQuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICByZWJ1aWxkTGF5b3V0KHtcbiAgICAgICAgICAgIGJ1aWx0TGF5b3V0OiBpdGVtLFxuICAgICAgICAgICAgaW5kaWNlczogaW5kaWNlcyxcbiAgICAgICAgICAgIHBhcmVudERhdGFQb2ludGVyOiBwYXJlbnREYXRhUG9pbnRlcixcbiAgICAgICAgICAgIGluZGV4UG9zOiBpbmRleFBvc1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICB9XG5cblxuICB9XG4gIHJlYnVpbGRMYXlvdXQoe1xuICAgIGJ1aWx0TGF5b3V0OiBidWlsdExheW91dFxuICB9KTtcbiAgLy9OQiBvcmlnaW5hbCBpcyBtdXRhdGVkXG4gIGxldCBmaXhlZExheW91dCA9IGJ1aWx0TGF5b3V0O1xuICByZXR1cm4gZml4ZWRMYXlvdXQ7XG59XG5cbi8qKlxuICogJ2J1aWxkTGF5b3V0RnJvbVNjaGVtYScgZnVuY3Rpb25cbiAqXG4gKiAvLyAgIGpzZiAtXG4gKiAvLyAgIHdpZGdldExpYnJhcnkgLVxuICogLy8gICBub2RlVmFsdWUgLVxuICogLy8gIHsgc3RyaW5nID0gJycgfSBzY2hlbWFQb2ludGVyIC1cbiAqIC8vICB7IHN0cmluZyA9ICcnIH0gZGF0YVBvaW50ZXIgLVxuICogLy8gIHsgYm9vbGVhbiA9IGZhbHNlIH0gYXJyYXlJdGVtIC1cbiAqIC8vICB7IHN0cmluZyA9IG51bGwgfSBhcnJheUl0ZW1UeXBlIC1cbiAqIC8vICB7IGJvb2xlYW4gPSBudWxsIH0gcmVtb3ZhYmxlIC1cbiAqIC8vICB7IGJvb2xlYW4gPSBmYWxzZSB9IGZvclJlZkxpYnJhcnkgLVxuICogLy8gIHsgc3RyaW5nID0gJycgfSBkYXRhUG9pbnRlclByZWZpeCAtXG4gKiAvL1xuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMYXlvdXRGcm9tU2NoZW1hKFxuICBqc2YsIHdpZGdldExpYnJhcnksIG5vZGVWYWx1ZSA9IG51bGwsIHNjaGVtYVBvaW50ZXIgPSAnJyxcbiAgZGF0YVBvaW50ZXIgPSAnJywgYXJyYXlJdGVtID0gZmFsc2UsIGFycmF5SXRlbVR5cGU6IHN0cmluZyA9IG51bGwsXG4gIHJlbW92YWJsZTogYm9vbGVhbiA9IG51bGwsIGZvclJlZkxpYnJhcnkgPSBmYWxzZSwgZGF0YVBvaW50ZXJQcmVmaXggPSAnJ1xuKSB7XG4gIGNvbnN0IHNjaGVtYSA9IEpzb25Qb2ludGVyLmdldChqc2Yuc2NoZW1hLCBzY2hlbWFQb2ludGVyKTtcbiAgaWYgKCFoYXNPd24oc2NoZW1hLCAndHlwZScpICYmICFoYXNPd24oc2NoZW1hLCAnJHJlZicpICYmXG4gICAgIWhhc093bihzY2hlbWEsICd4LXNjaGVtYS1mb3JtJylcbiAgKSB7IHJldHVybiBudWxsOyB9XG4gIGNvbnN0IG5ld05vZGVUeXBlOiBzdHJpbmcgPSBnZXRJbnB1dFR5cGUoc2NoZW1hKTtcbiAgaWYgKCFpc0RlZmluZWQobm9kZVZhbHVlKSAmJiAoXG4gICAganNmLmZvcm1PcHRpb25zLnNldFNjaGVtYURlZmF1bHRzID09PSB0cnVlIHx8XG4gICAgKGpzZi5mb3JtT3B0aW9ucy5zZXRTY2hlbWFEZWZhdWx0cyA9PT0gJ2F1dG8nICYmIGlzRW1wdHkoanNmLmZvcm1WYWx1ZXMpKVxuICApKSB7XG4gICAgbm9kZVZhbHVlID0gSnNvblBvaW50ZXIuZ2V0KGpzZi5zY2hlbWEsIHNjaGVtYVBvaW50ZXIgKyAnL2RlZmF1bHQnKTtcbiAgfVxuICBsZXQgbmV3Tm9kZTogYW55ID0ge1xuICAgIF9pZDogZm9yUmVmTGlicmFyeSA/IG51bGwgOiB1bmlxdWVJZCgpLFxuICAgIGFycmF5SXRlbTogYXJyYXlJdGVtLFxuICAgIGRhdGFQb2ludGVyOiBKc29uUG9pbnRlci50b0dlbmVyaWNQb2ludGVyKGRhdGFQb2ludGVyLCBqc2YuYXJyYXlNYXApLFxuICAgIGRhdGFUeXBlOiBzY2hlbWEudHlwZSB8fCAoaGFzT3duKHNjaGVtYSwgJyRyZWYnKSA/ICckcmVmJyA6IG51bGwpLFxuICAgIG9wdGlvbnM6IHt9LFxuICAgIHJlcXVpcmVkOiBpc0lucHV0UmVxdWlyZWQoanNmLnNjaGVtYSwgc2NoZW1hUG9pbnRlciksXG4gICAgdHlwZTogbmV3Tm9kZVR5cGUsXG4gICAgd2lkZ2V0OiB3aWRnZXRMaWJyYXJ5LmdldFdpZGdldChuZXdOb2RlVHlwZSksXG4gIH07XG4gIGNvbnN0IGxhc3REYXRhS2V5ID0gSnNvblBvaW50ZXIudG9LZXkobmV3Tm9kZS5kYXRhUG9pbnRlcik7XG4gIGlmIChsYXN0RGF0YUtleSAhPT0gJy0nKSB7IG5ld05vZGUubmFtZSA9IGxhc3REYXRhS2V5OyB9XG4gIGlmIChuZXdOb2RlLmFycmF5SXRlbSkge1xuICAgIG5ld05vZGUuYXJyYXlJdGVtVHlwZSA9IGFycmF5SXRlbVR5cGU7XG4gICAgbmV3Tm9kZS5vcHRpb25zLnJlbW92YWJsZSA9IHJlbW92YWJsZSAhPT0gZmFsc2U7XG4gIH1cbiAgY29uc3Qgc2hvcnREYXRhUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgZGF0YVBvaW50ZXJQcmVmaXggKyBkYXRhUG9pbnRlciwganNmLmRhdGFSZWN1cnNpdmVSZWZNYXAsIGpzZi5hcnJheU1hcFxuICApO1xuICBjb25zdCByZWN1cnNpdmUgPSAhc2hvcnREYXRhUG9pbnRlci5sZW5ndGggfHxcbiAgICBzaG9ydERhdGFQb2ludGVyICE9PSBkYXRhUG9pbnRlclByZWZpeCArIGRhdGFQb2ludGVyO1xuICBpZiAoIWpzZi5kYXRhTWFwLmhhcyhzaG9ydERhdGFQb2ludGVyKSkge1xuICAgIGpzZi5kYXRhTWFwLnNldChzaG9ydERhdGFQb2ludGVyLCBuZXcgTWFwKCkpO1xuICB9XG4gIGNvbnN0IG5vZGVEYXRhTWFwID0ganNmLmRhdGFNYXAuZ2V0KHNob3J0RGF0YVBvaW50ZXIpO1xuICBpZiAoIW5vZGVEYXRhTWFwLmhhcygnaW5wdXRUeXBlJykpIHtcbiAgICBub2RlRGF0YU1hcC5zZXQoJ3NjaGVtYVBvaW50ZXInLCBzY2hlbWFQb2ludGVyKTtcbiAgICBub2RlRGF0YU1hcC5zZXQoJ2lucHV0VHlwZScsIG5ld05vZGUudHlwZSk7XG4gICAgbm9kZURhdGFNYXAuc2V0KCd3aWRnZXQnLCBuZXdOb2RlLndpZGdldCk7XG4gICAgbm9kZURhdGFNYXAuc2V0KCdkaXNhYmxlZCcsICEhbmV3Tm9kZS5vcHRpb25zLmRpc2FibGVkKTtcbiAgfVxuICB1cGRhdGVJbnB1dE9wdGlvbnMobmV3Tm9kZSwgc2NoZW1hLCBqc2YpO1xuICBpZiAoIW5ld05vZGUub3B0aW9ucy50aXRsZSAmJiBuZXdOb2RlLm5hbWUgJiYgIS9eXFxkKyQvLnRlc3QobmV3Tm9kZS5uYW1lKSkge1xuICAgIG5ld05vZGUub3B0aW9ucy50aXRsZSA9IGZpeFRpdGxlKG5ld05vZGUubmFtZSk7XG4gIH1cblxuICBpZiAobmV3Tm9kZS5kYXRhVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAoaXNBcnJheShzY2hlbWEucmVxdWlyZWQpICYmICFub2RlRGF0YU1hcC5oYXMoJ3JlcXVpcmVkJykpIHtcbiAgICAgIG5vZGVEYXRhTWFwLnNldCgncmVxdWlyZWQnLCBzY2hlbWEucmVxdWlyZWQpO1xuICAgIH1cbiAgICBpZiAoaXNPYmplY3Qoc2NoZW1hLnByb3BlcnRpZXMpKSB7XG4gICAgICBjb25zdCBuZXdTZWN0aW9uOiBhbnlbXSA9IFtdO1xuICAgICAgY29uc3QgcHJvcGVydHlLZXlzID0gc2NoZW1hWyd1aTpvcmRlciddIHx8IE9iamVjdC5rZXlzKHNjaGVtYS5wcm9wZXJ0aWVzKTtcbiAgICAgIGlmIChwcm9wZXJ0eUtleXMuaW5jbHVkZXMoJyonKSAmJiAhaGFzT3duKHNjaGVtYS5wcm9wZXJ0aWVzLCAnKicpKSB7XG4gICAgICAgIGNvbnN0IHVubmFtZWRLZXlzID0gT2JqZWN0LmtleXMoc2NoZW1hLnByb3BlcnRpZXMpXG4gICAgICAgICAgLmZpbHRlcihrZXkgPT4gIXByb3BlcnR5S2V5cy5pbmNsdWRlcyhrZXkpKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHByb3BlcnR5S2V5cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChwcm9wZXJ0eUtleXNbaV0gPT09ICcqJykge1xuICAgICAgICAgICAgcHJvcGVydHlLZXlzLnNwbGljZShpLCAxLCAuLi51bm5hbWVkS2V5cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwcm9wZXJ0eUtleXNcbiAgICAgICAgLmZpbHRlcihrZXkgPT4gaGFzT3duKHNjaGVtYS5wcm9wZXJ0aWVzLCBrZXkpIHx8XG4gICAgICAgICAgaGFzT3duKHNjaGVtYSwgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJylcbiAgICAgICAgKVxuICAgICAgICAuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIGNvbnN0IGtleVNjaGVtYVBvaW50ZXIgPSBoYXNPd24oc2NoZW1hLnByb3BlcnRpZXMsIGtleSkgP1xuICAgICAgICAgICAgJy9wcm9wZXJ0aWVzLycgKyBrZXkgOiAnL2FkZGl0aW9uYWxQcm9wZXJ0aWVzJztcbiAgICAgICAgICBjb25zdCBpbm5lckl0ZW0gPSBidWlsZExheW91dEZyb21TY2hlbWEoXG4gICAgICAgICAgICBqc2YsIHdpZGdldExpYnJhcnksIGlzT2JqZWN0KG5vZGVWYWx1ZSkgPyBub2RlVmFsdWVba2V5XSA6IG51bGwsXG4gICAgICAgICAgICBzY2hlbWFQb2ludGVyICsga2V5U2NoZW1hUG9pbnRlcixcbiAgICAgICAgICAgIGRhdGFQb2ludGVyICsgJy8nICsga2V5LFxuICAgICAgICAgICAgZmFsc2UsIG51bGwsIG51bGwsIGZvclJlZkxpYnJhcnksIGRhdGFQb2ludGVyUHJlZml4XG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoaW5uZXJJdGVtKSB7XG4gICAgICAgICAgICBpZiAoaXNJbnB1dFJlcXVpcmVkKHNjaGVtYSwgJy8nICsga2V5KSkge1xuICAgICAgICAgICAgICBpbm5lckl0ZW0ub3B0aW9ucy5yZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgIGpzZi5maWVsZHNSZXF1aXJlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdTZWN0aW9uLnB1c2goaW5uZXJJdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgaWYgKGRhdGFQb2ludGVyID09PSAnJyAmJiAhZm9yUmVmTGlicmFyeSkge1xuICAgICAgICBuZXdOb2RlID0gbmV3U2VjdGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld05vZGUuaXRlbXMgPSBuZXdTZWN0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBUT0RPOiBBZGQgcGF0dGVyblByb3BlcnRpZXMgYW5kIGFkZGl0aW9uYWxQcm9wZXJ0aWVzIGlucHV0cz9cbiAgICAvLyAuLi4gcG9zc2libHkgcHJvdmlkZSBhIHdheSB0byBlbnRlciBib3RoIGtleSBuYW1lcyBhbmQgdmFsdWVzP1xuICAgIC8vIGlmIChpc09iamVjdChzY2hlbWEucGF0dGVyblByb3BlcnRpZXMpKSB7IH1cbiAgICAvLyBpZiAoaXNPYmplY3Qoc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKSkgeyB9XG5cbiAgfSBlbHNlIGlmIChuZXdOb2RlLmRhdGFUeXBlID09PSAnYXJyYXknKSB7XG4gICAgbmV3Tm9kZS5pdGVtcyA9IFtdO1xuICAgIG5ld05vZGUub3B0aW9ucy5tYXhJdGVtcyA9IE1hdGgubWluKFxuICAgICAgc2NoZW1hLm1heEl0ZW1zIHx8IDEwMDAsIG5ld05vZGUub3B0aW9ucy5tYXhJdGVtcyB8fCAxMDAwXG4gICAgKTtcbiAgICBuZXdOb2RlLm9wdGlvbnMubWluSXRlbXMgPSBNYXRoLm1heChcbiAgICAgIHNjaGVtYS5taW5JdGVtcyB8fCAwLCBuZXdOb2RlLm9wdGlvbnMubWluSXRlbXMgfHwgMFxuICAgICk7XG4gICAgaWYgKCFuZXdOb2RlLm9wdGlvbnMubWluSXRlbXMgJiYgaXNJbnB1dFJlcXVpcmVkKGpzZi5zY2hlbWEsIHNjaGVtYVBvaW50ZXIpKSB7XG4gICAgICBuZXdOb2RlLm9wdGlvbnMubWluSXRlbXMgPSAxO1xuICAgIH1cbiAgICBpZiAoIWhhc093bihuZXdOb2RlLm9wdGlvbnMsICdsaXN0SXRlbXMnKSkgeyBuZXdOb2RlLm9wdGlvbnMubGlzdEl0ZW1zID0gMTsgfVxuICAgIG5ld05vZGUub3B0aW9ucy50dXBsZUl0ZW1zID0gaXNBcnJheShzY2hlbWEuaXRlbXMpID8gc2NoZW1hLml0ZW1zLmxlbmd0aCA6IDA7XG4gICAgaWYgKG5ld05vZGUub3B0aW9ucy5tYXhJdGVtcyA8PSBuZXdOb2RlLm9wdGlvbnMudHVwbGVJdGVtcykge1xuICAgICAgbmV3Tm9kZS5vcHRpb25zLnR1cGxlSXRlbXMgPSBuZXdOb2RlLm9wdGlvbnMubWF4SXRlbXM7XG4gICAgICBuZXdOb2RlLm9wdGlvbnMubGlzdEl0ZW1zID0gMDtcbiAgICB9IGVsc2UgaWYgKG5ld05vZGUub3B0aW9ucy5tYXhJdGVtcyA8XG4gICAgICBuZXdOb2RlLm9wdGlvbnMudHVwbGVJdGVtcyArIG5ld05vZGUub3B0aW9ucy5saXN0SXRlbXNcbiAgICApIHtcbiAgICAgIG5ld05vZGUub3B0aW9ucy5saXN0SXRlbXMgPSBuZXdOb2RlLm9wdGlvbnMubWF4SXRlbXMgLSBuZXdOb2RlLm9wdGlvbnMudHVwbGVJdGVtcztcbiAgICB9IGVsc2UgaWYgKG5ld05vZGUub3B0aW9ucy5taW5JdGVtcyA+XG4gICAgICBuZXdOb2RlLm9wdGlvbnMudHVwbGVJdGVtcyArIG5ld05vZGUub3B0aW9ucy5saXN0SXRlbXNcbiAgICApIHtcbiAgICAgIG5ld05vZGUub3B0aW9ucy5saXN0SXRlbXMgPSBuZXdOb2RlLm9wdGlvbnMubWluSXRlbXMgLSBuZXdOb2RlLm9wdGlvbnMudHVwbGVJdGVtcztcbiAgICB9XG4gICAgaWYgKCFub2RlRGF0YU1hcC5oYXMoJ21heEl0ZW1zJykpIHtcbiAgICAgIG5vZGVEYXRhTWFwLnNldCgnbWF4SXRlbXMnLCBuZXdOb2RlLm9wdGlvbnMubWF4SXRlbXMpO1xuICAgICAgbm9kZURhdGFNYXAuc2V0KCdtaW5JdGVtcycsIG5ld05vZGUub3B0aW9ucy5taW5JdGVtcyk7XG4gICAgICBub2RlRGF0YU1hcC5zZXQoJ3R1cGxlSXRlbXMnLCBuZXdOb2RlLm9wdGlvbnMudHVwbGVJdGVtcyk7XG4gICAgICBub2RlRGF0YU1hcC5zZXQoJ2xpc3RJdGVtcycsIG5ld05vZGUub3B0aW9ucy5saXN0SXRlbXMpO1xuICAgIH1cbiAgICBpZiAoIWpzZi5hcnJheU1hcC5oYXMoc2hvcnREYXRhUG9pbnRlcikpIHtcbiAgICAgIGpzZi5hcnJheU1hcC5zZXQoc2hvcnREYXRhUG9pbnRlciwgbmV3Tm9kZS5vcHRpb25zLnR1cGxlSXRlbXMpO1xuICAgIH1cbiAgICByZW1vdmFibGUgPSBuZXdOb2RlLm9wdGlvbnMucmVtb3ZhYmxlICE9PSBmYWxzZTtcbiAgICBsZXQgYWRkaXRpb25hbEl0ZW1zU2NoZW1hUG9pbnRlcjogc3RyaW5nID0gbnVsbDtcblxuICAgIC8vIElmICdpdGVtcycgaXMgYW4gYXJyYXkgPSB0dXBsZSBpdGVtc1xuICAgIGlmIChpc0FycmF5KHNjaGVtYS5pdGVtcykpIHtcbiAgICAgIG5ld05vZGUuaXRlbXMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3Tm9kZS5vcHRpb25zLnR1cGxlSXRlbXM7IGkrKykge1xuICAgICAgICBsZXQgbmV3SXRlbTogYW55O1xuICAgICAgICBjb25zdCBpdGVtUmVmUG9pbnRlciA9IHJlbW92ZVJlY3Vyc2l2ZVJlZmVyZW5jZXMoXG4gICAgICAgICAgc2hvcnREYXRhUG9pbnRlciArICcvJyArIGksIGpzZi5kYXRhUmVjdXJzaXZlUmVmTWFwLCBqc2YuYXJyYXlNYXBcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgaXRlbVJlY3Vyc2l2ZSA9ICFpdGVtUmVmUG9pbnRlci5sZW5ndGggfHxcbiAgICAgICAgICBpdGVtUmVmUG9pbnRlciAhPT0gc2hvcnREYXRhUG9pbnRlciArICcvJyArIGk7XG5cbiAgICAgICAgLy8gSWYgcmVtb3ZhYmxlLCBhZGQgdHVwbGUgaXRlbSBsYXlvdXQgdG8gbGF5b3V0UmVmTGlicmFyeVxuICAgICAgICBpZiAocmVtb3ZhYmxlICYmIGkgPj0gbmV3Tm9kZS5vcHRpb25zLm1pbkl0ZW1zKSB7XG4gICAgICAgICAgaWYgKCFoYXNPd24oanNmLmxheW91dFJlZkxpYnJhcnksIGl0ZW1SZWZQb2ludGVyKSkge1xuICAgICAgICAgICAgLy8gU2V0IHRvIG51bGwgZmlyc3QgdG8gcHJldmVudCByZWN1cnNpdmUgcmVmZXJlbmNlIGZyb20gY2F1c2luZyBlbmRsZXNzIGxvb3BcbiAgICAgICAgICAgIGpzZi5sYXlvdXRSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSA9IG51bGw7XG4gICAgICAgICAgICBqc2YubGF5b3V0UmVmTGlicmFyeVtpdGVtUmVmUG9pbnRlcl0gPSBidWlsZExheW91dEZyb21TY2hlbWEoXG4gICAgICAgICAgICAgIGpzZiwgd2lkZ2V0TGlicmFyeSwgaXNBcnJheShub2RlVmFsdWUpID8gbm9kZVZhbHVlW2ldIDogbnVsbCxcbiAgICAgICAgICAgICAgc2NoZW1hUG9pbnRlciArICcvaXRlbXMvJyArIGksXG4gICAgICAgICAgICAgIGl0ZW1SZWN1cnNpdmUgPyAnJyA6IGRhdGFQb2ludGVyICsgJy8nICsgaSxcbiAgICAgICAgICAgICAgdHJ1ZSwgJ3R1cGxlJywgdHJ1ZSwgdHJ1ZSwgaXRlbVJlY3Vyc2l2ZSA/IGRhdGFQb2ludGVyICsgJy8nICsgaSA6ICcnXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGl0ZW1SZWN1cnNpdmUpIHtcbiAgICAgICAgICAgICAganNmLmxheW91dFJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdLnJlY3Vyc2l2ZVJlZmVyZW5jZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIG5ld0l0ZW0gPSBnZXRMYXlvdXROb2RlKHtcbiAgICAgICAgICAgICRyZWY6IGl0ZW1SZWZQb2ludGVyLFxuICAgICAgICAgICAgZGF0YVBvaW50ZXI6IGRhdGFQb2ludGVyICsgJy8nICsgaSxcbiAgICAgICAgICAgIHJlY3Vyc2l2ZVJlZmVyZW5jZTogaXRlbVJlY3Vyc2l2ZSxcbiAgICAgICAgICB9LCBqc2YsIHdpZGdldExpYnJhcnksIGlzQXJyYXkobm9kZVZhbHVlKSA/IG5vZGVWYWx1ZVtpXSA6IG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0l0ZW0gPSBidWlsZExheW91dEZyb21TY2hlbWEoXG4gICAgICAgICAgICBqc2YsIHdpZGdldExpYnJhcnksIGlzQXJyYXkobm9kZVZhbHVlKSA/IG5vZGVWYWx1ZVtpXSA6IG51bGwsXG4gICAgICAgICAgICBzY2hlbWFQb2ludGVyICsgJy9pdGVtcy8nICsgaSxcbiAgICAgICAgICAgIGRhdGFQb2ludGVyICsgJy8nICsgaSxcbiAgICAgICAgICAgIHRydWUsICd0dXBsZScsIGZhbHNlLCBmb3JSZWZMaWJyYXJ5LCBkYXRhUG9pbnRlclByZWZpeFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5ld0l0ZW0pIHsgbmV3Tm9kZS5pdGVtcy5wdXNoKG5ld0l0ZW0pOyB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmICdhZGRpdGlvbmFsSXRlbXMnIGlzIGFuIG9iamVjdCA9IGFkZGl0aW9uYWwgbGlzdCBpdGVtcywgYWZ0ZXIgdHVwbGUgaXRlbXNcbiAgICAgIGlmIChpc09iamVjdChzY2hlbWEuYWRkaXRpb25hbEl0ZW1zKSkge1xuICAgICAgICBhZGRpdGlvbmFsSXRlbXNTY2hlbWFQb2ludGVyID0gc2NoZW1hUG9pbnRlciArICcvYWRkaXRpb25hbEl0ZW1zJztcbiAgICAgIH1cblxuICAgICAgLy8gSWYgJ2l0ZW1zJyBpcyBhbiBvYmplY3QgPSBsaXN0IGl0ZW1zIG9ubHkgKG5vIHR1cGxlIGl0ZW1zKVxuICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qoc2NoZW1hLml0ZW1zKSkge1xuICAgICAgYWRkaXRpb25hbEl0ZW1zU2NoZW1hUG9pbnRlciA9IHNjaGVtYVBvaW50ZXIgKyAnL2l0ZW1zJztcbiAgICB9XG5cbiAgICBpZiAoYWRkaXRpb25hbEl0ZW1zU2NoZW1hUG9pbnRlcikge1xuICAgICAgY29uc3QgaXRlbVJlZlBvaW50ZXIgPSByZW1vdmVSZWN1cnNpdmVSZWZlcmVuY2VzKFxuICAgICAgICBzaG9ydERhdGFQb2ludGVyICsgJy8tJywganNmLmRhdGFSZWN1cnNpdmVSZWZNYXAsIGpzZi5hcnJheU1hcFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGl0ZW1SZWN1cnNpdmUgPSAhaXRlbVJlZlBvaW50ZXIubGVuZ3RoIHx8XG4gICAgICAgIGl0ZW1SZWZQb2ludGVyICE9PSBzaG9ydERhdGFQb2ludGVyICsgJy8tJztcbiAgICAgIGNvbnN0IGl0ZW1TY2hlbWFQb2ludGVyID0gcmVtb3ZlUmVjdXJzaXZlUmVmZXJlbmNlcyhcbiAgICAgICAgYWRkaXRpb25hbEl0ZW1zU2NoZW1hUG9pbnRlciwganNmLnNjaGVtYVJlY3Vyc2l2ZVJlZk1hcCwganNmLmFycmF5TWFwXG4gICAgICApO1xuICAgICAgLy8gQWRkIGxpc3QgaXRlbSBsYXlvdXQgdG8gbGF5b3V0UmVmTGlicmFyeVxuICAgICAgaWYgKGl0ZW1SZWZQb2ludGVyLmxlbmd0aCAmJiAhaGFzT3duKGpzZi5sYXlvdXRSZWZMaWJyYXJ5LCBpdGVtUmVmUG9pbnRlcikpIHtcbiAgICAgICAgLy8gU2V0IHRvIG51bGwgZmlyc3QgdG8gcHJldmVudCByZWN1cnNpdmUgcmVmZXJlbmNlIGZyb20gY2F1c2luZyBlbmRsZXNzIGxvb3BcbiAgICAgICAganNmLmxheW91dFJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdID0gbnVsbDtcbiAgICAgICAganNmLmxheW91dFJlZkxpYnJhcnlbaXRlbVJlZlBvaW50ZXJdID0gYnVpbGRMYXlvdXRGcm9tU2NoZW1hKFxuICAgICAgICAgIGpzZiwgd2lkZ2V0TGlicmFyeSwgbnVsbCxcbiAgICAgICAgICBpdGVtU2NoZW1hUG9pbnRlcixcbiAgICAgICAgICBpdGVtUmVjdXJzaXZlID8gJycgOiBkYXRhUG9pbnRlciArICcvLScsXG4gICAgICAgICAgdHJ1ZSwgJ2xpc3QnLCByZW1vdmFibGUsIHRydWUsIGl0ZW1SZWN1cnNpdmUgPyBkYXRhUG9pbnRlciArICcvLScgOiAnJ1xuICAgICAgICApO1xuICAgICAgICBpZiAoaXRlbVJlY3Vyc2l2ZSkge1xuICAgICAgICAgIGpzZi5sYXlvdXRSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXS5yZWN1cnNpdmVSZWZlcmVuY2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBhbnkgYWRkaXRpb25hbCBkZWZhdWx0IGl0ZW1zXG4gICAgICBpZiAoIWl0ZW1SZWN1cnNpdmUgfHwgbmV3Tm9kZS5vcHRpb25zLnJlcXVpcmVkKSB7XG4gICAgICAgIGNvbnN0IGFycmF5TGVuZ3RoID0gTWF0aC5taW4oTWF0aC5tYXgoXG4gICAgICAgICAgaXRlbVJlY3Vyc2l2ZSA/IDAgOlxuICAgICAgICAgICAgbmV3Tm9kZS5vcHRpb25zLnR1cGxlSXRlbXMgKyBuZXdOb2RlLm9wdGlvbnMubGlzdEl0ZW1zLFxuICAgICAgICAgIGlzQXJyYXkobm9kZVZhbHVlKSA/IG5vZGVWYWx1ZS5sZW5ndGggOiAwXG4gICAgICAgICksIG5ld05vZGUub3B0aW9ucy5tYXhJdGVtcyk7XG4gICAgICAgIGlmIChuZXdOb2RlLml0ZW1zLmxlbmd0aCA8IGFycmF5TGVuZ3RoKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IG5ld05vZGUuaXRlbXMubGVuZ3RoOyBpIDwgYXJyYXlMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbmV3Tm9kZS5pdGVtcy5wdXNoKGdldExheW91dE5vZGUoe1xuICAgICAgICAgICAgICAkcmVmOiBpdGVtUmVmUG9pbnRlcixcbiAgICAgICAgICAgICAgZGF0YVBvaW50ZXI6IGRhdGFQb2ludGVyICsgJy8tJyxcbiAgICAgICAgICAgICAgcmVjdXJzaXZlUmVmZXJlbmNlOiBpdGVtUmVjdXJzaXZlLFxuICAgICAgICAgICAgfSwganNmLCB3aWRnZXRMaWJyYXJ5LCBpc0FycmF5KG5vZGVWYWx1ZSkgPyBub2RlVmFsdWVbaV0gOiBudWxsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmIG5lZWRlZCwgYWRkIGJ1dHRvbiB0byBhZGQgaXRlbXMgdG8gYXJyYXlcbiAgICAgIGlmIChuZXdOb2RlLm9wdGlvbnMuYWRkYWJsZSAhPT0gZmFsc2UgJiZcbiAgICAgICAgbmV3Tm9kZS5vcHRpb25zLm1pbkl0ZW1zIDwgbmV3Tm9kZS5vcHRpb25zLm1heEl0ZW1zICYmXG4gICAgICAgIChuZXdOb2RlLml0ZW1zW25ld05vZGUuaXRlbXMubGVuZ3RoIC0gMV0gfHwge30pLnR5cGUgIT09ICckcmVmJ1xuICAgICAgKSB7XG4gICAgICAgIGxldCBidXR0b25UZXh0ID1cbiAgICAgICAgICAoKGpzZi5sYXlvdXRSZWZMaWJyYXJ5W2l0ZW1SZWZQb2ludGVyXSB8fCB7fSkub3B0aW9ucyB8fCB7fSkudGl0bGU7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IGJ1dHRvblRleHQgPyAnQWRkICcgOiAnQWRkIHRvICc7XG4gICAgICAgIGlmICghYnV0dG9uVGV4dCkge1xuICAgICAgICAgIGJ1dHRvblRleHQgPSBzY2hlbWEudGl0bGUgfHwgZml4VGl0bGUoSnNvblBvaW50ZXIudG9LZXkoZGF0YVBvaW50ZXIpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIS9eYWRkXFxiL2kudGVzdChidXR0b25UZXh0KSkgeyBidXR0b25UZXh0ID0gcHJlZml4ICsgYnV0dG9uVGV4dDsgfVxuICAgICAgICBuZXdOb2RlLml0ZW1zLnB1c2goe1xuICAgICAgICAgIF9pZDogdW5pcXVlSWQoKSxcbiAgICAgICAgICBhcnJheUl0ZW06IHRydWUsXG4gICAgICAgICAgYXJyYXlJdGVtVHlwZTogJ2xpc3QnLFxuICAgICAgICAgIGRhdGFQb2ludGVyOiBuZXdOb2RlLmRhdGFQb2ludGVyICsgJy8tJyxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBsaXN0SXRlbXM6IG5ld05vZGUub3B0aW9ucy5saXN0SXRlbXMsXG4gICAgICAgICAgICBtYXhJdGVtczogbmV3Tm9kZS5vcHRpb25zLm1heEl0ZW1zLFxuICAgICAgICAgICAgbWluSXRlbXM6IG5ld05vZGUub3B0aW9ucy5taW5JdGVtcyxcbiAgICAgICAgICAgIHJlbW92YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0aXRsZTogYnV0dG9uVGV4dCxcbiAgICAgICAgICAgIHR1cGxlSXRlbXM6IG5ld05vZGUub3B0aW9ucy50dXBsZUl0ZW1zLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVjdXJzaXZlUmVmZXJlbmNlOiBpdGVtUmVjdXJzaXZlLFxuICAgICAgICAgIHR5cGU6ICckcmVmJyxcbiAgICAgICAgICB3aWRnZXQ6IHdpZGdldExpYnJhcnkuZ2V0V2lkZ2V0KCckcmVmJyksXG4gICAgICAgICAgJHJlZjogaXRlbVJlZlBvaW50ZXIsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICB9IGVsc2UgaWYgKG5ld05vZGUuZGF0YVR5cGUgPT09ICckcmVmJykge1xuICAgIGNvbnN0IHNjaGVtYVJlZiA9IEpzb25Qb2ludGVyLmNvbXBpbGUoc2NoZW1hLiRyZWYpO1xuICAgIGNvbnN0IGRhdGFSZWYgPSBKc29uUG9pbnRlci50b0RhdGFQb2ludGVyKHNjaGVtYVJlZiwganNmLnNjaGVtYSk7XG4gICAgbGV0IGJ1dHRvblRleHQgPSAnJztcblxuICAgIC8vIEdldCBuZXdOb2RlIHRpdGxlXG4gICAgaWYgKG5ld05vZGUub3B0aW9ucy5hZGQpIHtcbiAgICAgIGJ1dHRvblRleHQgPSBuZXdOb2RlLm9wdGlvbnMuYWRkO1xuICAgIH0gZWxzZSBpZiAobmV3Tm9kZS5uYW1lICYmICEvXlxcZCskLy50ZXN0KG5ld05vZGUubmFtZSkpIHtcbiAgICAgIGJ1dHRvblRleHQgPVxuICAgICAgICAoL15hZGRcXGIvaS50ZXN0KG5ld05vZGUubmFtZSkgPyAnJyA6ICdBZGQgJykgKyBmaXhUaXRsZShuZXdOb2RlLm5hbWUpO1xuXG4gICAgICAvLyBJZiBuZXdOb2RlIGRvZXNuJ3QgaGF2ZSBhIHRpdGxlLCBsb29rIGZvciB0aXRsZSBvZiBwYXJlbnQgYXJyYXkgaXRlbVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwYXJlbnRTY2hlbWEgPVxuICAgICAgICBKc29uUG9pbnRlci5nZXQoanNmLnNjaGVtYSwgc2NoZW1hUG9pbnRlciwgMCwgLTEpO1xuICAgICAgaWYgKGhhc093bihwYXJlbnRTY2hlbWEsICd0aXRsZScpKSB7XG4gICAgICAgIGJ1dHRvblRleHQgPSAnQWRkIHRvICcgKyBwYXJlbnRTY2hlbWEudGl0bGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwb2ludGVyQXJyYXkgPSBKc29uUG9pbnRlci5wYXJzZShuZXdOb2RlLmRhdGFQb2ludGVyKTtcbiAgICAgICAgYnV0dG9uVGV4dCA9ICdBZGQgdG8gJyArIGZpeFRpdGxlKHBvaW50ZXJBcnJheVtwb2ludGVyQXJyYXkubGVuZ3RoIC0gMl0pO1xuICAgICAgfVxuICAgIH1cbiAgICBPYmplY3QuYXNzaWduKG5ld05vZGUsIHtcbiAgICAgIHJlY3Vyc2l2ZVJlZmVyZW5jZTogdHJ1ZSxcbiAgICAgIHdpZGdldDogd2lkZ2V0TGlicmFyeS5nZXRXaWRnZXQoJyRyZWYnKSxcbiAgICAgICRyZWY6IGRhdGFSZWYsXG4gICAgfSk7XG4gICAgT2JqZWN0LmFzc2lnbihuZXdOb2RlLm9wdGlvbnMsIHtcbiAgICAgIHJlbW92YWJsZTogZmFsc2UsXG4gICAgICB0aXRsZTogYnV0dG9uVGV4dCxcbiAgICB9KTtcbiAgICBpZiAoaXNOdW1iZXIoSnNvblBvaW50ZXIuZ2V0KGpzZi5zY2hlbWEsIHNjaGVtYVBvaW50ZXIsIDAsIC0xKS5tYXhJdGVtcykpIHtcbiAgICAgIG5ld05vZGUub3B0aW9ucy5tYXhJdGVtcyA9XG4gICAgICAgIEpzb25Qb2ludGVyLmdldChqc2Yuc2NoZW1hLCBzY2hlbWFQb2ludGVyLCAwLCAtMSkubWF4SXRlbXM7XG4gICAgfVxuXG4gICAgLy8gQWRkIGxheW91dCB0ZW1wbGF0ZSB0byBsYXlvdXRSZWZMaWJyYXJ5XG4gICAgaWYgKGRhdGFSZWYubGVuZ3RoKSB7XG4gICAgICBpZiAoIWhhc093bihqc2YubGF5b3V0UmVmTGlicmFyeSwgZGF0YVJlZikpIHtcbiAgICAgICAgLy8gU2V0IHRvIG51bGwgZmlyc3QgdG8gcHJldmVudCByZWN1cnNpdmUgcmVmZXJlbmNlIGZyb20gY2F1c2luZyBlbmRsZXNzIGxvb3BcbiAgICAgICAganNmLmxheW91dFJlZkxpYnJhcnlbZGF0YVJlZl0gPSBudWxsO1xuICAgICAgICBjb25zdCBuZXdMYXlvdXQgPSBidWlsZExheW91dEZyb21TY2hlbWEoXG4gICAgICAgICAganNmLCB3aWRnZXRMaWJyYXJ5LCBudWxsLCBzY2hlbWFSZWYsICcnLFxuICAgICAgICAgIG5ld05vZGUuYXJyYXlJdGVtLCBuZXdOb2RlLmFycmF5SXRlbVR5cGUsIHRydWUsIHRydWUsIGRhdGFQb2ludGVyXG4gICAgICAgICk7XG4gICAgICAgIGlmIChuZXdMYXlvdXQpIHtcbiAgICAgICAgICBuZXdMYXlvdXQucmVjdXJzaXZlUmVmZXJlbmNlID0gdHJ1ZTtcbiAgICAgICAgICBqc2YubGF5b3V0UmVmTGlicmFyeVtkYXRhUmVmXSA9IG5ld0xheW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUganNmLmxheW91dFJlZkxpYnJhcnlbZGF0YVJlZl07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIWpzZi5sYXlvdXRSZWZMaWJyYXJ5W2RhdGFSZWZdLnJlY3Vyc2l2ZVJlZmVyZW5jZSkge1xuICAgICAgICBqc2YubGF5b3V0UmVmTGlicmFyeVtkYXRhUmVmXS5yZWN1cnNpdmVSZWZlcmVuY2UgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3Tm9kZTtcbn1cblxuLyoqXG4gKiAnbWFwTGF5b3V0JyBmdW5jdGlvblxuICpcbiAqIENyZWF0ZXMgYSBuZXcgbGF5b3V0IGJ5IHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIGFuIGV4aXN0aW5nIGxheW91dCB0aHJvdWdoXG4gKiBhbiBpdGVyYXRlZS4gUmVjdXJzaXZlbHkgbWFwcyB3aXRoaW4gYXJyYXkgZWxlbWVudHMgJ2l0ZW1zJyBhbmQgJ3RhYnMnLlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCBmb3VyIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleCwgbGF5b3V0LCBwYXRoKVxuICpcbiAqIFRoZSByZXR1cm5lZCBsYXlvdXQgbWF5IGJlIGxvbmdlciAob3Igc2hvcnRlcikgdGhlbiB0aGUgc291cmNlIGxheW91dC5cbiAqXG4gKiBJZiBhbiBpdGVtIGZyb20gdGhlIHNvdXJjZSBsYXlvdXQgcmV0dXJucyBtdWx0aXBsZSBpdGVtcyAoYXMgJyonIHVzdWFsbHkgd2lsbCksXG4gKiB0aGlzIGZ1bmN0aW9uIHdpbGwga2VlcCBhbGwgcmV0dXJuZWQgaXRlbXMgaW4tbGluZSB3aXRoIHRoZSBzdXJyb3VuZGluZyBpdGVtcy5cbiAqXG4gKiBJZiBhbiBpdGVtIGZyb20gdGhlIHNvdXJjZSBsYXlvdXQgY2F1c2VzIGFuIGVycm9yIGFuZCByZXR1cm5zIG51bGwsIGl0IGlzXG4gKiBza2lwcGVkIHdpdGhvdXQgZXJyb3IsIGFuZCB0aGUgZnVuY3Rpb24gd2lsbCBzdGlsbCByZXR1cm4gYWxsIG5vbi1udWxsIGl0ZW1zLlxuICpcbiAqIC8vICAgbGF5b3V0IC0gdGhlIGxheW91dCB0byBtYXBcbiAqIC8vICB7ICh2OiBhbnksIGk/OiBudW1iZXIsIGw/OiBhbnksIHA/OiBzdHJpbmcpID0+IGFueSB9XG4gKiAgIGZ1bmN0aW9uIC0gdGhlIGZ1bmNpdG9uIHRvIGludm9rZSBvbiBlYWNoIGVsZW1lbnRcbiAqIC8vICB7IHN0cmluZ3xzdHJpbmdbXSA9ICcnIH0gbGF5b3V0UG9pbnRlciAtIHRoZSBsYXlvdXRQb2ludGVyIHRvIGxheW91dCwgaW5zaWRlIHJvb3RMYXlvdXRcbiAqIC8vICB7IGFueVtdID0gbGF5b3V0IH0gcm9vdExheW91dCAtIHRoZSByb290IGxheW91dCwgd2hpY2ggY29uYXRpbnMgbGF5b3V0XG4gKiAvL1xuICovXG5leHBvcnQgZnVuY3Rpb24gbWFwTGF5b3V0KGxheW91dCwgZm4sIGxheW91dFBvaW50ZXIgPSAnJywgcm9vdExheW91dCA9IGxheW91dCkge1xuICBsZXQgaW5kZXhQYWQgPSAwO1xuICBsZXQgbmV3TGF5b3V0OiBhbnlbXSA9IFtdO1xuICBmb3JFYWNoKGxheW91dCwgKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgY29uc3QgcmVhbEluZGV4ID0gK2luZGV4ICsgaW5kZXhQYWQ7XG4gICAgY29uc3QgbmV3TGF5b3V0UG9pbnRlciA9IGxheW91dFBvaW50ZXIgKyAnLycgKyByZWFsSW5kZXg7XG4gICAgbGV0IG5ld05vZGU6IGFueSA9IGNvcHkoaXRlbSk7XG4gICAgbGV0IGl0ZW1zQXJyYXk6IGFueVtdID0gW107XG4gICAgaWYgKGlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBpZiAoaGFzT3duKGl0ZW0sICd0YWJzJykpIHtcbiAgICAgICAgaXRlbS5pdGVtcyA9IGl0ZW0udGFicztcbiAgICAgICAgZGVsZXRlIGl0ZW0udGFicztcbiAgICAgIH1cbiAgICAgIGlmIChoYXNPd24oaXRlbSwgJ2l0ZW1zJykpIHtcbiAgICAgICAgaXRlbXNBcnJheSA9IGlzQXJyYXkoaXRlbS5pdGVtcykgPyBpdGVtLml0ZW1zIDogW2l0ZW0uaXRlbXNdO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXRlbXNBcnJheS5sZW5ndGgpIHtcbiAgICAgIG5ld05vZGUuaXRlbXMgPSBtYXBMYXlvdXQoaXRlbXNBcnJheSwgZm4sIG5ld0xheW91dFBvaW50ZXIgKyAnL2l0ZW1zJywgcm9vdExheW91dCk7XG4gICAgfVxuICAgIG5ld05vZGUgPSBmbihuZXdOb2RlLCByZWFsSW5kZXgsIG5ld0xheW91dFBvaW50ZXIsIHJvb3RMYXlvdXQpO1xuICAgIGlmICghaXNEZWZpbmVkKG5ld05vZGUpKSB7XG4gICAgICBpbmRleFBhZC0tO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNBcnJheShuZXdOb2RlKSkgeyBpbmRleFBhZCArPSBuZXdOb2RlLmxlbmd0aCAtIDE7IH1cbiAgICAgIG5ld0xheW91dCA9IG5ld0xheW91dC5jb25jYXQobmV3Tm9kZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG5ld0xheW91dDtcbn1cblxuLyoqXG4gKiAnZ2V0TGF5b3V0Tm9kZScgZnVuY3Rpb25cbiAqIENvcHkgYSBuZXcgbGF5b3V0Tm9kZSBmcm9tIGxheW91dFJlZkxpYnJhcnlcbiAqXG4gKiAvLyAgIHJlZk5vZGUgLVxuICogLy8gICBsYXlvdXRSZWZMaWJyYXJ5IC1cbiAqIC8vICB7IGFueSA9IG51bGwgfSB3aWRnZXRMaWJyYXJ5IC1cbiAqIC8vICB7IGFueSA9IG51bGwgfSBub2RlVmFsdWUgLVxuICogLy8gIGNvcGllZCBsYXlvdXROb2RlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMYXlvdXROb2RlKFxuICByZWZOb2RlLCBqc2YsIHdpZGdldExpYnJhcnk6IGFueSA9IG51bGwsIG5vZGVWYWx1ZTogYW55ID0gbnVsbFxuKSB7XG5cbiAgLy8gSWYgcmVjdXJzaXZlIHJlZmVyZW5jZSBhbmQgYnVpbGRpbmcgaW5pdGlhbCBsYXlvdXQsIHJldHVybiBBZGQgYnV0dG9uXG4gIGlmIChyZWZOb2RlLnJlY3Vyc2l2ZVJlZmVyZW5jZSAmJiB3aWRnZXRMaWJyYXJ5KSB7XG4gICAgY29uc3QgbmV3TGF5b3V0Tm9kZSA9IGNsb25lRGVlcChyZWZOb2RlKTtcbiAgICBpZiAoIW5ld0xheW91dE5vZGUub3B0aW9ucykgeyBuZXdMYXlvdXROb2RlLm9wdGlvbnMgPSB7fTsgfVxuICAgIE9iamVjdC5hc3NpZ24obmV3TGF5b3V0Tm9kZSwge1xuICAgICAgcmVjdXJzaXZlUmVmZXJlbmNlOiB0cnVlLFxuICAgICAgd2lkZ2V0OiB3aWRnZXRMaWJyYXJ5LmdldFdpZGdldCgnJHJlZicpLFxuICAgIH0pO1xuICAgIE9iamVjdC5hc3NpZ24obmV3TGF5b3V0Tm9kZS5vcHRpb25zLCB7XG4gICAgICByZW1vdmFibGU6IGZhbHNlLFxuICAgICAgdGl0bGU6ICdBZGQgJyArIG5ld0xheW91dE5vZGUuJHJlZixcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3TGF5b3V0Tm9kZTtcblxuICAgIC8vIE90aGVyd2lzZSwgcmV0dXJuIHJlZmVyZW5jZWQgbGF5b3V0XG4gIH0gZWxzZSB7XG4gICAgbGV0IG5ld0xheW91dE5vZGUgPSBqc2YubGF5b3V0UmVmTGlicmFyeVtyZWZOb2RlLiRyZWZdO1xuICAgIC8vIElmIHZhbHVlIGRlZmluZWQsIGJ1aWxkIG5ldyBub2RlIGZyb20gc2NoZW1hICh0byBzZXQgYXJyYXkgbGVuZ3RocylcbiAgICBpZiAoaXNEZWZpbmVkKG5vZGVWYWx1ZSkpIHtcbiAgICAgIG5ld0xheW91dE5vZGUgPSBidWlsZExheW91dEZyb21TY2hlbWEoXG4gICAgICAgIGpzZiwgd2lkZ2V0TGlicmFyeSwgbm9kZVZhbHVlLFxuICAgICAgICBKc29uUG9pbnRlci50b1NjaGVtYVBvaW50ZXIocmVmTm9kZS4kcmVmLCBqc2Yuc2NoZW1hKSxcbiAgICAgICAgcmVmTm9kZS4kcmVmLCBuZXdMYXlvdXROb2RlLmFycmF5SXRlbSxcbiAgICAgICAgbmV3TGF5b3V0Tm9kZS5hcnJheUl0ZW1UeXBlLCBuZXdMYXlvdXROb2RlLm9wdGlvbnMucmVtb3ZhYmxlLCBmYWxzZVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdmFsdWUgbm90IGRlZmluZWQsIGNvcHkgbm9kZSBmcm9tIGxheW91dFJlZkxpYnJhcnlcbiAgICAgIG5ld0xheW91dE5vZGUgPSBjbG9uZURlZXAobmV3TGF5b3V0Tm9kZSk7XG4gICAgICBKc29uUG9pbnRlci5mb3JFYWNoRGVlcChuZXdMYXlvdXROb2RlLCAoc3ViTm9kZSwgcG9pbnRlcikgPT4ge1xuXG4gICAgICAgIC8vIFJlc2V0IGFsbCBfaWQncyBpbiBuZXdMYXlvdXROb2RlIHRvIHVuaXF1ZSB2YWx1ZXNcbiAgICAgICAgaWYgKGhhc093bihzdWJOb2RlLCAnX2lkJykpIHsgc3ViTm9kZS5faWQgPSB1bmlxdWVJZCgpOyB9XG5cbiAgICAgICAgLy8gSWYgYWRkaW5nIGEgcmVjdXJzaXZlIGl0ZW0sIHByZWZpeCBjdXJyZW50IGRhdGFQb2ludGVyXG4gICAgICAgIC8vIHRvIGFsbCBkYXRhUG9pbnRlcnMgaW4gbmV3IGxheW91dE5vZGVcbiAgICAgICAgaWYgKHJlZk5vZGUucmVjdXJzaXZlUmVmZXJlbmNlICYmIGhhc093bihzdWJOb2RlLCAnZGF0YVBvaW50ZXInKSkge1xuICAgICAgICAgIHN1Yk5vZGUuZGF0YVBvaW50ZXIgPSByZWZOb2RlLmRhdGFQb2ludGVyICsgc3ViTm9kZS5kYXRhUG9pbnRlcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdMYXlvdXROb2RlO1xuICB9XG59XG5cbi8qKlxuICogJ2J1aWxkVGl0bGVNYXAnIGZ1bmN0aW9uXG4gKlxuICogLy8gICB0aXRsZU1hcCAtXG4gKiAvLyAgIGVudW1MaXN0IC1cbiAqIC8vICB7IGJvb2xlYW4gPSB0cnVlIH0gZmllbGRSZXF1aXJlZCAtXG4gKiAvLyAgeyBib29sZWFuID0gdHJ1ZSB9IGZsYXRMaXN0IC1cbiAqIC8vIHsgVGl0bGVNYXBJdGVtW10gfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRUaXRsZU1hcChcbiAgdGl0bGVNYXAsIGVudW1MaXN0LCBmaWVsZFJlcXVpcmVkID0gdHJ1ZSwgZmxhdExpc3QgPSB0cnVlXG4pIHtcbiAgbGV0IG5ld1RpdGxlTWFwOiBUaXRsZU1hcEl0ZW1bXSA9IFtdO1xuICBsZXQgaGFzRW1wdHlWYWx1ZSA9IGZhbHNlO1xuICBpZiAodGl0bGVNYXApIHtcbiAgICBpZiAoaXNBcnJheSh0aXRsZU1hcCkpIHtcbiAgICAgIGlmIChlbnVtTGlzdCkge1xuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgT2JqZWN0LmtleXModGl0bGVNYXApKSB7XG4gICAgICAgICAgaWYgKGlzT2JqZWN0KHRpdGxlTWFwW2ldKSkgeyAvLyBKU09OIEZvcm0gc3R5bGVcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGl0bGVNYXBbaV0udmFsdWU7XG4gICAgICAgICAgICBpZiAoZW51bUxpc3QuaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB0aXRsZU1hcFtpXS5uYW1lO1xuICAgICAgICAgICAgICBuZXdUaXRsZU1hcC5wdXNoKHsgbmFtZSwgdmFsdWUgfSk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7IGhhc0VtcHR5VmFsdWUgPSB0cnVlOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChpc1N0cmluZyh0aXRsZU1hcFtpXSkpIHsgLy8gUmVhY3QgSnNvbnNjaGVtYSBGb3JtIHN0eWxlXG4gICAgICAgICAgICBpZiAoaSA8IGVudW1MaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gdGl0bGVNYXBbaV07XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZW51bUxpc3RbaV07XG4gICAgICAgICAgICAgIG5ld1RpdGxlTWFwLnB1c2goeyBuYW1lLCB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHsgaGFzRW1wdHlWYWx1ZSA9IHRydWU7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7IC8vIElmIGFycmF5IHRpdGxlTWFwIGFuZCBubyBlbnVtIGxpc3QsIGp1c3QgcmV0dXJuIHRoZSB0aXRsZU1hcCAtIEFuZ3VsYXIgU2NoZW1hIEZvcm0gc3R5bGVcbiAgICAgICAgbmV3VGl0bGVNYXAgPSB0aXRsZU1hcDtcbiAgICAgICAgaWYgKCFmaWVsZFJlcXVpcmVkKSB7XG4gICAgICAgICAgaGFzRW1wdHlWYWx1ZSA9ICEhbmV3VGl0bGVNYXBcbiAgICAgICAgICAgIC5maWx0ZXIoaSA9PiBpLnZhbHVlID09PSB1bmRlZmluZWQgfHwgaS52YWx1ZSA9PT0gbnVsbClcbiAgICAgICAgICAgIC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVudW1MaXN0KSB7IC8vIEFsdGVybmF0ZSBKU09OIEZvcm0gc3R5bGUsIHdpdGggZW51bSBsaXN0XG4gICAgICBmb3IgKGNvbnN0IGkgb2YgT2JqZWN0LmtleXMoZW51bUxpc3QpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZW51bUxpc3RbaV07XG4gICAgICAgIGlmIChoYXNPd24odGl0bGVNYXAsIHZhbHVlKSkge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSB0aXRsZU1hcFt2YWx1ZV07XG4gICAgICAgICAgbmV3VGl0bGVNYXAucHVzaCh7IG5hbWUsIHZhbHVlIH0pO1xuICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7IGhhc0VtcHR5VmFsdWUgPSB0cnVlOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBBbHRlcm5hdGUgSlNPTiBGb3JtIHN0eWxlLCB3aXRob3V0IGVudW0gbGlzdFxuICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiBPYmplY3Qua2V5cyh0aXRsZU1hcCkpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHRpdGxlTWFwW3ZhbHVlXTtcbiAgICAgICAgbmV3VGl0bGVNYXAucHVzaCh7IG5hbWUsIHZhbHVlIH0pO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkgeyBoYXNFbXB0eVZhbHVlID0gdHJ1ZTsgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChlbnVtTGlzdCkgeyAvLyBCdWlsZCBtYXAgZnJvbSBlbnVtIGxpc3QgYWxvbmVcbiAgICBmb3IgKGNvbnN0IGkgb2YgT2JqZWN0LmtleXMoZW51bUxpc3QpKSB7XG4gICAgICBjb25zdCBuYW1lID0gZW51bUxpc3RbaV07XG4gICAgICBjb25zdCB2YWx1ZSA9IGVudW1MaXN0W2ldO1xuICAgICAgbmV3VGl0bGVNYXAucHVzaCh7IG5hbWUsIHZhbHVlIH0pO1xuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHsgaGFzRW1wdHlWYWx1ZSA9IHRydWU7IH1cbiAgICB9XG4gIH0gZWxzZSB7IC8vIElmIG5vIHRpdGxlTWFwIGFuZCBubyBlbnVtIGxpc3QsIHJldHVybiBkZWZhdWx0IG1hcCBvZiBib29sZWFuIHZhbHVlc1xuICAgIG5ld1RpdGxlTWFwID0gW3sgbmFtZTogJ1RydWUnLCB2YWx1ZTogdHJ1ZSB9LCB7IG5hbWU6ICdGYWxzZScsIHZhbHVlOiBmYWxzZSB9XTtcbiAgfVxuXG4gIC8vIERvZXMgdGl0bGVNYXAgaGF2ZSBncm91cHM/XG4gIGlmIChuZXdUaXRsZU1hcC5zb21lKHRpdGxlID0+IGhhc093bih0aXRsZSwgJ2dyb3VwJykpKSB7XG4gICAgaGFzRW1wdHlWYWx1ZSA9IGZhbHNlO1xuXG4gICAgLy8gSWYgZmxhdExpc3QgPSB0cnVlLCBmbGF0dGVuIGl0ZW1zICYgdXBkYXRlIG5hbWUgdG8gZ3JvdXA6IG5hbWVcbiAgICBpZiAoZmxhdExpc3QpIHtcbiAgICAgIG5ld1RpdGxlTWFwID0gbmV3VGl0bGVNYXAucmVkdWNlKChncm91cFRpdGxlTWFwLCB0aXRsZSkgPT4ge1xuICAgICAgICBpZiAoaGFzT3duKHRpdGxlLCAnZ3JvdXAnKSkge1xuICAgICAgICAgIGlmIChpc0FycmF5KHRpdGxlLml0ZW1zKSkge1xuICAgICAgICAgICAgZ3JvdXBUaXRsZU1hcCA9IFtcbiAgICAgICAgICAgICAgLi4uZ3JvdXBUaXRsZU1hcCxcbiAgICAgICAgICAgICAgLi4udGl0bGUuaXRlbXMubWFwKGl0ZW0gPT5cbiAgICAgICAgICAgICAgICAoeyAuLi5pdGVtLCAuLi57IG5hbWU6IGAke3RpdGxlLmdyb3VwfTogJHtpdGVtLm5hbWV9YCB9IH0pXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBpZiAodGl0bGUuaXRlbXMuc29tZShpdGVtID0+IGl0ZW0udmFsdWUgPT09IHVuZGVmaW5lZCB8fCBpdGVtLnZhbHVlID09PSBudWxsKSkge1xuICAgICAgICAgICAgICBoYXNFbXB0eVZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGhhc093bih0aXRsZSwgJ25hbWUnKSAmJiBoYXNPd24odGl0bGUsICd2YWx1ZScpKSB7XG4gICAgICAgICAgICB0aXRsZS5uYW1lID0gYCR7dGl0bGUuZ3JvdXB9OiAke3RpdGxlLm5hbWV9YDtcbiAgICAgICAgICAgIGRlbGV0ZSB0aXRsZS5ncm91cDtcbiAgICAgICAgICAgIGdyb3VwVGl0bGVNYXAucHVzaCh0aXRsZSk7XG4gICAgICAgICAgICBpZiAodGl0bGUudmFsdWUgPT09IHVuZGVmaW5lZCB8fCB0aXRsZS52YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICBoYXNFbXB0eVZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ3JvdXBUaXRsZU1hcC5wdXNoKHRpdGxlKTtcbiAgICAgICAgICBpZiAodGl0bGUudmFsdWUgPT09IHVuZGVmaW5lZCB8fCB0aXRsZS52YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgaGFzRW1wdHlWYWx1ZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBncm91cFRpdGxlTWFwO1xuICAgICAgfSwgW10pO1xuXG4gICAgICAvLyBJZiBmbGF0TGlzdCA9IGZhbHNlLCBjb21iaW5lIGl0ZW1zIGZyb20gbWF0Y2hpbmcgZ3JvdXBzXG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1RpdGxlTWFwID0gbmV3VGl0bGVNYXAucmVkdWNlKChncm91cFRpdGxlTWFwLCB0aXRsZSkgPT4ge1xuICAgICAgICBpZiAoaGFzT3duKHRpdGxlLCAnZ3JvdXAnKSkge1xuICAgICAgICAgIGlmICh0aXRsZS5ncm91cCAhPT0gKGdyb3VwVGl0bGVNYXBbZ3JvdXBUaXRsZU1hcC5sZW5ndGggLSAxXSB8fCB7fSkuZ3JvdXApIHtcbiAgICAgICAgICAgIGdyb3VwVGl0bGVNYXAucHVzaCh7IGdyb3VwOiB0aXRsZS5ncm91cCwgaXRlbXM6IHRpdGxlLml0ZW1zIHx8IFtdIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaGFzT3duKHRpdGxlLCAnbmFtZScpICYmIGhhc093bih0aXRsZSwgJ3ZhbHVlJykpIHtcbiAgICAgICAgICAgIGdyb3VwVGl0bGVNYXBbZ3JvdXBUaXRsZU1hcC5sZW5ndGggLSAxXS5pdGVtc1xuICAgICAgICAgICAgICAucHVzaCh7IG5hbWU6IHRpdGxlLm5hbWUsIHZhbHVlOiB0aXRsZS52YWx1ZSB9KTtcbiAgICAgICAgICAgIGlmICh0aXRsZS52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHRpdGxlLnZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIGhhc0VtcHR5VmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncm91cFRpdGxlTWFwLnB1c2godGl0bGUpO1xuICAgICAgICAgIGlmICh0aXRsZS52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHRpdGxlLnZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICBoYXNFbXB0eVZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdyb3VwVGl0bGVNYXA7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuICB9XG4gIGlmICghZmllbGRSZXF1aXJlZCAmJiAhaGFzRW1wdHlWYWx1ZSkge1xuICAgIG5ld1RpdGxlTWFwLnVuc2hpZnQoeyBuYW1lOiAnPGVtPk5vbmU8L2VtPicsIHZhbHVlOiBudWxsIH0pO1xuICB9XG4gIHJldHVybiBuZXdUaXRsZU1hcDtcbn1cbiJdfQ==