const request = require("supertest");
const userValidator = require('./userValidator');

describe('Проверка валидации пользователей', () => {
    //Проверка никнейма
    test('Проверка никнейма', () => {
        let nickname = "Ren4L";
        expect(new userValidator({
            nickname: nickname
        }, {
            nickname:["nickname"]
        })).toEqual({"checks": {"nickname": ["nickname"]}, "data": {"nickname": nickname}, "errors": []})
        nickname = "Re4L";
        expect(new userValidator({
            nickname: nickname
        }, {
            nickname:["nickname"]
        })).toEqual({"checks": {"nickname": ["nickname"]}, "data": {"nickname": nickname}, "errors": []})
        nickname = "RencheL12345";
        expect(new userValidator({
            nickname: nickname
        }, {
            nickname:["nickname"]
        })).toEqual({"checks": {"nickname": ["nickname"]}, "data": {"nickname": nickname}, "errors": []})
        nickname = "renchel";
        expect(new userValidator({
            nickname: nickname
        }, {
            nickname:["nickname"]
        })).toEqual({"checks": {"nickname": ["nickname"]}, "data": {"nickname": nickname}, "errors": []})
        nickname = "RencheL123456";
        expect(new userValidator({
            nickname: nickname
        }, {
            nickname:["nickname"]
        })).toEqual({"checks": {"nickname": ["nickname"]}, "data": {"nickname": nickname}, "errors": ["Error.nicknameNotCorrect"]})
        nickname = "Ren";
        expect(new userValidator({
            nickname: nickname
        }, {
            nickname:["nickname"]
        })).toEqual({"checks": {"nickname": ["nickname"]}, "data": {"nickname": nickname}, "errors": ["Error.nicknameNotCorrect"]})
        nickname = "Ren-4L";
        expect(new userValidator({
            nickname: nickname
        }, {
            nickname:["nickname"]
        })).toEqual({"checks": {"nickname": ["nickname"]}, "data": {"nickname": nickname}, "errors": ["Error.nicknameNotCorrect"]})
    });
    //Проверка пароля
    test('Проверка пароля', () => {
        let password = "Admin221212";
        expect(new userValidator({
            password: password
        }, {
            password:["password"]
        })).toEqual({"checks": {"password": ["password"]}, "data": {"password": password}, "errors": []})
        password = "Admin221";
        expect(new userValidator({
            password: password
        }, {
            password:["password"]
        })).toEqual({"checks": {"password": ["password"]}, "data": {"password": password}, "errors": []})
        password = "Admin2212121234d";
        expect(new userValidator({
            password: password
        }, {
            password:["password"]
        })).toEqual({"checks": {"password": ["password"]}, "data": {"password": password}, "errors": []})
        password = "12345678";
        expect(new userValidator({
            password: password
        }, {
            password:["password"]
        })).toEqual({"checks": {"password": ["password"]}, "data": {"password": password}, "errors": []})
        password = "1234567";
        expect(new userValidator({
            password: password
        }, {
            password:["password"]
        })).toEqual({"checks": {"password": ["password"]}, "data": {"password": password}, "errors": ["Error.passwordNotCorrect"]})
        password = "123456789012345678";
        expect(new userValidator({
            password: password
        }, {
            password:["password"]
        })).toEqual({"checks": {"password": ["password"]}, "data": {"password": password}, "errors": ["Error.passwordNotCorrect"]})
        password = "Admi-n221212";
        expect(new userValidator({
            password: password
        }, {
            password:["password"]
        })).toEqual({"checks": {"password": ["password"]}, "data": {"password": password}, "errors": ["Error.passwordNotCorrect"]})
    });
    //Проверка совпадения паролей
    test('Проверка совпадения паролей', () => {
        let password = "Admin221212", passwordRepeat = "Admin221212";
        expect(new userValidator({
            password: password,
            passwordRepeat, passwordRepeat
        }, {
            password: ["password", "passwordCompare:password:passwordRepeat"]
        })).toEqual({"checks": {"password": ["password", "passwordCompare:password:passwordRepeat"]}, "data": {"password": password, "passwordRepeat": passwordRepeat}, "errors": []})
        password = "Admin221212", passwordRepeat = "Admin22212";
        expect(new userValidator({
            password: password,
            passwordRepeat, passwordRepeat
        }, {
            password: ["password", "passwordCompare:password:passwordRepeat"]
        })).toEqual({"checks": {"password": ["password", "passwordCompare:password:passwordRepeat"]}, "data": {"password": password, "passwordRepeat": passwordRepeat}, "errors": ["Error.repeatPassNotCorrect"]})
    });
    //Проверка валидации нескольких данных
    test('Проверка валидации нескольких данных', () => {
        let userData = {
            nickname: "Ren4L",
            email: "vladisakov28@gmail.com",
            password: "Admin221212",
            passwordRepeat: "Admin221212"
        }
        expect(
            new userValidator(userData, {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]}))
            .toEqual({"checks": {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]}, "data": userData, "errors": []}
        )
        userData = {
            nickname: "Ren4",
            email: "vladi-sa-ko-v28@gmail.co",
            password: "Admin221",
            passwordRepeat: "Admin221"
        }
        expect(
            new userValidator(userData, {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]}))
            .toEqual({"checks": {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]}, "data": userData, "errors": []}
        )
        userData = {
            nickname: "Ren4L1234567",
            email: "vladi-sa-ko-v28@gmail.comqwe",
            password: "Admin22121212121",
            passwordRepeat: "Admin22121212121"
        }
        expect(
            new userValidator(userData, {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]}))
            .toEqual({"checks": {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]}, "data": userData, "errors": []}
        )
        userData = {
            nickname: "Ren4L1234567",
            email: "vladi-sa-ko-v28@gmail.comqwe",
            password: "Admin22121212121",
            passwordRepeat: "Admin22121212121"
        }
        expect(
            new userValidator(userData, {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]}))
            .toEqual({"checks": {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]}, "data": userData, "errors": []}
        )
        userData = {
            nickname: "Ren",
            email: "vladi-@sa-ko-v28@gmail.comqwe",
            password: "Admin22121212121122",
            passwordRepeat: "Admin22121212121"
        }
        expect(
            new userValidator(userData, {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]}))
            .toEqual({"checks": {nickname: ["nickname"], email:["email"], password: ["password", "passwordCompare:password:passwordRepeat"]}, "data": userData, "errors": ["Error.nicknameNotCorrect", "Error.emailNotCorrect", "Error.passwordNotCorrect","Error.repeatPassNotCorrect"]}
        )
    })
    //Проверка изменения описания
    test('Проверка изменения описания', () => {
        let description = "Admin22121.;:232 \n аяАЯazAZ09?!,.'\"Ёё():;";
        expect(new userValidator({
            description
        }, {
            description: ["description"]
        })).toEqual({"checks": {"description": ["description"]}, "data": {"description": description}, "errors": []})
        description = "Admi-n22121.;:232 \n аяАЯazAZ09?!,.'\"Ёё():;";
        expect(new userValidator({
            description
        }, {
            description: ["description"]
        })).toEqual({"checks": {"description": ["description"]}, "data": {"description": description}, "errors": ["Error.editDescription"]})
        description = "Admi";
        expect(new userValidator({
            description
        }, {
            description: ["description"]
        })).toEqual({"checks": {"description": ["description"]}, "data": {"description": description}, "errors": ["Error.editDescription"]})
        let obj = {
            id: 19,
            description: "21.;:232 \n аяАЯazAZ09"
        }
        expect(new userValidator(obj, {
            id: ["number"],
            description: ["string", "description"]
        })).toEqual({"checks": {"id": ["number"], "description": ["string","description"]}, "data": obj, "errors": []})
        obj = {
            id: "19",
            description: 123213
        }
        expect(new userValidator(obj, {
            id: ["number"],
            description: ["string", "description"]
        })).toEqual({"checks": {"id": ["number"], "description": ["string","description"]}, "data": obj, "errors": ["Error.notNumber", "Error.notString"]})

    });
});