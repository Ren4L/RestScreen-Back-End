const request = require("supertest");
const userValidator = require('./userValidator');

describe('Проверка валидации', () => {
    //Проверка типов данных
    test('Проверка типа string', () => {
        let obj = 1;
        expect(new userValidator({ obj }, {
            obj:["string"]
        })).toEqual({"checks": {"obj": ["string"]}, "data": {"obj": obj}, "errors": ["Error.notString"]});
        obj = "1";
        expect(new userValidator({ obj }, {
            obj:["string"]
        })).toEqual({"checks": {"obj": ["string"]}, "data": {"obj": obj}, "errors": []});
        obj = true;
        expect(new userValidator({ obj }, {
            obj:["string"]
        })).toEqual({"checks": {"obj": ["string"]}, "data": {"obj": obj}, "errors": ["Error.notString"]});
        obj = null;
        expect(new userValidator({ obj }, {
            obj:["string"]
        })).toEqual({"checks": {"obj": ["string"]}, "data": {"obj": obj}, "errors": ["Error.notString"]});
        let obj1;
        expect(new userValidator({ obj: obj1 }, {
            obj:["string"]
        })).toEqual({"checks": {"obj": ["string"]}, "data": {"obj": obj1}, "errors": ["Error.notString"]});
    });

    test('Проверка типа number', () => {
        let obj = 1;
        expect(new userValidator({ obj }, {
            obj:["number"]
        })).toEqual({"checks": {"obj": ["number"]}, "data": {"obj": obj}, "errors": []});
        obj = "1";
        expect(new userValidator({ obj }, {
            obj:["number"]
        })).toEqual({"checks": {"obj": ["number"]}, "data": {"obj": obj}, "errors": ["Error.notNumber"]});
        obj = true;
        expect(new userValidator({ obj }, {
            obj:["number"]
        })).toEqual({"checks": {"obj": ["number"]}, "data": {"obj": obj}, "errors": ["Error.notNumber"]});
        obj = null;
        expect(new userValidator({ obj }, {
            obj:["number"]
        })).toEqual({"checks": {"obj": ["number"]}, "data": {"obj": obj}, "errors": ["Error.notNumber"]});
        let obj1;
        expect(new userValidator({ obj: obj1 }, {
            obj:["number"]
        })).toEqual({"checks": {"obj": ["number"]}, "data": {"obj": obj1}, "errors": ["Error.notNumber"]});
    });


    test('Проверка типа boolean', () => {
        let obj = true;
        expect(new userValidator({ obj }, {
            obj:["boolean"]
        })).toEqual({"checks": {"obj": ["boolean"]}, "data": {"obj": obj}, "errors": []});
        obj = "1";
        expect(new userValidator({ obj }, {
            obj:["boolean"]
        })).toEqual({"checks": {"obj": ["boolean"]}, "data": {"obj": obj}, "errors": ["Error.notBoolean"]});
        obj = 1;
        expect(new userValidator({ obj }, {
            obj:["boolean"]
        })).toEqual({"checks": {"obj": ["boolean"]}, "data": {"obj": obj}, "errors": ["Error.notBoolean"]});
        obj = null;
        expect(new userValidator({ obj }, {
            obj:["boolean"]
        })).toEqual({"checks": {"obj": ["boolean"]}, "data": {"obj": obj}, "errors": ["Error.notBoolean"]});
        let obj1;
        expect(new userValidator({ obj: obj1 }, {
            obj:["boolean"]
        })).toEqual({"checks": {"obj": ["boolean"]}, "data": {"obj": obj1}, "errors": ["Error.notBoolean"]});
    });

    test('Проверка на null', () => {
        let obj = true;
        expect(new userValidator({ obj }, {
            obj:["null"]
        })).toEqual({"checks": {"obj": ["null"]}, "data": {"obj": obj}, "errors": ["Error.notNull"]});
        obj = "1";
        expect(new userValidator({ obj }, {
            obj:["null"]
        })).toEqual({"checks": {"obj": ["null"]}, "data": {"obj": obj}, "errors": ["Error.notNull"]});
        obj = 1;
        expect(new userValidator({ obj }, {
            obj:["null"]
        })).toEqual({"checks": {"obj": ["null"]}, "data": {"obj": obj}, "errors": ["Error.notNull"]});
        obj = null;
        expect(new userValidator({ obj }, {
            obj:["null"]
        })).toEqual({"checks": {"obj": ["null"]}, "data": {"obj": obj}, "errors": []});
        let obj1;
        expect(new userValidator({ obj: obj1 }, {
            obj:["null"]
        })).toEqual({"checks": {"obj": ["null"]}, "data": {"obj": obj1}, "errors": []});
    });

    test('Проверка на not null', () => {
        let obj = true;
        expect(new userValidator({ obj }, {
            obj:["notNull"]
        })).toEqual({"checks": {"obj": ["notNull"]}, "data": {"obj": obj}, "errors": []});
        obj = "1";
        expect(new userValidator({ obj }, {
            obj:["notNull"]
        })).toEqual({"checks": {"obj": ["notNull"]}, "data": {"obj": obj}, "errors": []});
        obj = 1;
        expect(new userValidator({ obj }, {
            obj:["notNull"]
        })).toEqual({"checks": {"obj": ["notNull"]}, "data": {"obj": obj}, "errors": []});
        obj = null;
        expect(new userValidator({ obj }, {
            obj:["notNull"]
        })).toEqual({"checks": {"obj": ["notNull"]}, "data": {"obj": obj}, "errors": ["Error.Null"]});
        let obj1;
        expect(new userValidator({ obj: obj1 }, {
            obj:["notNull"]
        })).toEqual({"checks": {"obj": ["notNull"]}, "data": {"obj": obj1}, "errors": ["Error.Null"]});
    });

    test('Проверка на min', () =>{
        let element = 12;
        expect(new userValidator({ element }, {
            element:["min-10"]
        })).toEqual({"checks": {"element": ["min-10"]}, "data": {"element": element}, "errors": []});
        element = 9;
        expect(new userValidator({ element }, {
            element:["min-10"]
        })).toEqual({"checks": {"element": ["min-10"]}, "data": {"element": element}, "errors": ["Error.incorrectLength"]});
        element = 10;
        expect(new userValidator({ element }, {
            element:["min-10"]
        })).toEqual({"checks": {"element": ["min-10"]}, "data": {"element": element}, "errors": []});
        element = '9';
        expect(new userValidator({ element }, {
            element:["min-1"]
        })).toEqual({"checks": {"element": ["min-1"]}, "data": {"element": element}, "errors": []});
        element = "asdasd";
        expect(new userValidator({ element }, {
            element:["min-10"]
        })).toEqual({"checks": {"element": ["min-10"]}, "data": {"element": element}, "errors": ["Error.incorrectLength"]});
        element = true;
        expect(new userValidator({ element }, {
            element:["min-10"]
        })).toEqual({"checks": {"element": ["min-10"]}, "data": {"element": element}, "errors": ["Error.incorrectType"]});
        element = 1233n;
        expect(new userValidator({ element }, {
            element:["min-10"]
        })).toEqual({"checks": {"element": ["min-10"]}, "data": {"element": element}, "errors": []});
        element = undefined;
        expect(new userValidator({ element }, {
            element:["min-10"]
        })).toEqual({"checks": {"element": ["min-10"]}, "data": {"element": element}, "errors": ["Error.incorrectType"]});
    })

    test('Проверка на max', () =>{
        let element = 9;
        expect(new userValidator({ element }, {
            element:["max-10"]
        })).toEqual({"checks": {"element": ["max-10"]}, "data": {"element": element}, "errors": []});
        element = 11;
        expect(new userValidator({ element }, {
            element:["max-10"]
        })).toEqual({"checks": {"element": ["max-10"]}, "data": {"element": element}, "errors": ["Error.incorrectLength"]});
        element = 10;
        expect(new userValidator({ element }, {
            element:["max-10"]
        })).toEqual({"checks": {"element": ["max-10"]}, "data": {"element": element}, "errors": []});
        element = '9';
        expect(new userValidator({ element }, {
            element:["max-2"]
        })).toEqual({"checks": {"element": ["max-2"]}, "data": {"element": element}, "errors": []});
        element = "asdasd";
        expect(new userValidator({ element }, {
            element:["max-3"]
        })).toEqual({"checks": {"element": ["max-3"]}, "data": {"element": element}, "errors": ["Error.incorrectLength"]});
        element = true;
        expect(new userValidator({ element }, {
            element:["max-10"]
        })).toEqual({"checks": {"element": ["max-10"]}, "data": {"element": element}, "errors": ["Error.incorrectType"]});
        element = 1233n;
        expect(new userValidator({ element }, {
            element:["max-10"]
        })).toEqual({"checks": {"element": ["max-10"]}, "data": {"element": element}, "errors": ["Error.incorrectLength"]});
        element = undefined;
        expect(new userValidator({ element }, {
            element:["max-10"]
        })).toEqual({"checks": {"element": ["max-10"]}, "data": {"element": element}, "errors": ["Error.incorrectType"]});
    })
    //Проверка почты
    test('Проверка почты', () => {
        let email = "vladisakov@gmail.com";
        expect(new userValidator({
            email: email
        }, {
            email:["email"]
        })).toEqual({"checks": {"email": ["email"]}, "data": {"email": email}, "errors": []})
        expect(new userValidator({
            email: email
        }, {
            email:["email"]
        })).toEqual({"checks": {"email": ["email"]}, "data": {"email": email}, "errors": []})
        email = "vladisakovgmail.com";
        expect(new userValidator({
            email: email
        }, {
            email:["email"]
        })).toEqual({"checks": {"email": ["email"]}, "data": {"email": email}, "errors": ["Error.emailNotCorrect"]})
        email = "vladi@sakov@gmail.com";
        expect(new userValidator({
            email: email
        }, {
            email:["email"]
        })).toEqual({"checks": {"email": ["email"]}, "data": {"email": email}, "errors": ["Error.emailNotCorrect"]})
    });
    //Проверка url
    test('Проверка url', () => {
        let url = "http://webref.ru?qwe=123&sadas=asd%20";
        expect(new userValidator({
            url
        }, {
            url:["url"]
        })).toEqual({"checks": {"url": ["url"]}, "data": {"url": url}, "errors": []})
        url = "https://www.belstu.by/";
        expect(new userValidator({
            url
        }, {
            url:["url"]
        })).toEqual({"checks": {"url": ["url"]}, "data": {"url": url}, "errors": []})
        url = "http://localhost:8080/Profile/19";
        expect(new userValidator({
            url
        }, {
            url:["url"]
        })).toEqual({"checks": {"url": ["url"]}, "data": {"url": url}, "errors": ["Error.urlNotCorrect"]})
        url = 1;
        expect(new userValidator({
            url
        }, {
            url:["url"]
        })).toEqual({"checks": {"url": ["url"]}, "data": {"url": url}, "errors": ["Error.notString"]})
    });
});