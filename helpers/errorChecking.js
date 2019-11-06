const dataNotNULL = (element) => {
    return element
}
const dataTypes = {
    string:'string',
    object:'object', 
    number:'number',
    boolean: 'boolean'

}
const dataValidString = (element) => {
    return (dataNotNULL(element) && typeof element === dataTypes.string)
}

const dataValidInteger = (element) => {
    return (dataNotNULL(element) && typeof element === dataTypes.number)
}

const dataValidArray = (element) => {
    return (dataNotNULL(element) && typeof element === dataTypes.object && Array.isArray(element) && element.length > 0)
}

const dataValidObject = (element) => {
    return (dataNotNULL(element) && typeof element === dataTypes.object)
}

const dataValidBoolean = (element) => {
    return (dataNotNULL(element) && typeof element === dataTypes.boolean)
}

const arrayContainsObject = (array) => {
    for (const element of array) {
        if (!dataValidObject(element)) {
            return false;
        }
    }
    return true;
}

const objectContainsKeys = (object,params) => {
    for (const key of params) {
        if (!object.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

const arrayContainsObjectsWithKeys = (array,params) => {
    if (!dataValidArray(array)) {
        return false;
    }
    for (const element of array) {
        if (!dataValidObject(element) || !objectContainsKeys(element,params)) {
            return false;
        }
    }
    return true;
}

module.exports = {
    dataValidString,
    dataValidInteger,
    dataValidBoolean, 
    dataValidArray,
    dataValidObject,
    arrayContainsObject,
    arrayContainsObjectsWithKeys
}