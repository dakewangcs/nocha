const request = require("../utils").request;
const expect = require("chai").expect;
const assert = require("chai").assert;
const addContext = require('mochawesome/addContext');
const utils = require("../utils");
const config = require('../config');

let expect_fun = function (expected, actual, exclude_fields = [], regex = []) {
    if ("body" in actual) {
        actual = actual.body;
    }
    if (exclude_fields.length > 0) {
        for (const field of exclude_fields) {
            let pattern = new RegExp(`\"${field}\":[^,\\}\\]]+`, 'g');
            let tmp_e_json = JSON.stringify(expected).replaceAll(pattern, `\"${field}\": null`);
            let tmp_a_json = JSON.stringify(actual).replaceAll(pattern, `\"${field}\": null`);
            expected = JSON.parse(tmp_e_json);
            actual = JSON.parse(tmp_a_json);
        }
    }
    if (regex.length > 0) {
        for (const reg of regex) {
            let pattern = new RegExp(reg, 'g');
            let tmp_e_json = JSON.stringify(expected).replaceAll(pattern, ``).replace(/\,(?!\s*?[\{\[\"\'\w])/g, '');
            let tmp_a_json = JSON.stringify(actual).replaceAll(pattern, ``).replace(/\,(?!\s*?[\{\[\"\'\w])/g, '');
            expected = JSON.parse(tmp_e_json);
            actual = JSON.parse(tmp_a_json);
        }
    }
    if (Array.isArray(expected) && Array.isArray(actual)) {
        expect(actual).to.have.deep.members(expected);
    } else if (Object.keys(expected) == Object.keys(actual)) {
        expect(actual).to.be.deep.equal(expected);
    } else if ("results" in actual) {
        for (let key in expected) {
            expect(actual.results.map(e => ({[key]: e[key]}))).to.deep.include({[key]: expected[key]});
        }
    } else {
        for (let key in expected) {
            if (typeof(actual[key]) == typeof(expected[key])) {
                expect(actual[key]).to.be.deep.equal(expected[key]);
            }
            else {
                assert.include(JSON.stringify(actual[key]), JSON.stringify(expected[key]));
            }
        }
    }
};

let get_response_keys = function (object){
    let paths = [];
    let stack = [[object, '']];
    while (stack.length > 0) {
        let [currentObject, currentPath] = stack.pop();
        for (let key in currentObject) {
            let value = currentObject[key];
            let newPath = `${currentPath}.${key}`;
            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                stack.push([value, newPath]);
            } else if (Array.isArray(value)) {
                if (value.length===0 || Number.isInteger(value[0])){
                    paths.push(newPath);
                }
                else {
                    value.forEach((v, index) => {
                        if (typeof v === 'object' ) {
                            stack.push([v, `${newPath}.${index}`]);
                        } else {
                            paths.push(`${newPath}`);
                        }
                    });
                }
            } else {
                paths.push(newPath);
            }
        }
    }
    paths = paths.filter((value, index) => {
        return paths.indexOf(value) === index;
    });
    return paths;
}

let get_key_only = function (key_object){
    key_object.forEach((key_value,index)=>{
        key_value = key_value.split(".").filter((value) =>{
            return value !== "";
        })
        key_value = key_value.filter(value => isNaN(value))
        key_object[index] = key_value;
    });
    let uniqueKey = [...new Set(key_object.map(JSON.stringify))].map(JSON.parse);
    return uniqueKey;
}

let update_response_value = function (keysToModify,actual_key, actual, object){
    actual_key.forEach((key_value,index)=>{
        key_value = key_value.split(".").filter((value) =>{
            return value !== "";
        });
        actual_key[index] = key_value;
        if(Number.isInteger(key_value[key_value.length-1])){
            key_value.pop()
        }
        keysToModify.forEach((key)=>{
            if(key == key_value[key_value.length-1]){
                let actual_res = actual;
                let object_res = object;
                for (let i = 0; i < key_value.length - 1; i++) {
                    actual_res = actual_res[key_value[i]];
                    if(object_res[key_value[i]]==null){
                        object_res = actual_res[key_value[i]]
                    }
                    else {
                        object_res = object_res[key_value[i]]
                    };
                }
                object_res[key_value[key_value.length-1]]= actual_res[key_value[key_value.length-1]]
            }
        })
    })
}

let ignore_keys = function (expectResponse, responseJson, ignoreKeys) {
    const expectCopy = JSON.parse(JSON.stringify(expectResponse));
    const responseCopy = JSON.parse(JSON.stringify(responseJson));

    ignoreKeys.forEach(key => {
        delete expectCopy[key];
        delete responseCopy[key];
    });

    return {
        expectRes: expectCopy,
        responseRes:responseCopy
    }
}

let it_msg = function(method, url, data, status, with_cookies = true) {
    return (data !== null && data !== undefined) ? `${method} url: ${url}, data: ${JSON.stringify(data)} with `.concat(with_cookies ? "cookies" : "no cookies", " and status ", status) :
    `${method} url: ${url} with `.concat(with_cookies ? "cookies" : "no cookies", " and status ", status);
}

let url_get = async function (url, data, status, retry_count = 1, redirect = false) {
    let response = null;
    
    if (redirect === true) {
        response = await request.get(url)
        .redirects(1)
        .retry(retry_count);
    } else {
        response = await request.get(url);
    }

    utils.setFixture("res_body", {...response.body});
    expect(response.status).to.eql(status);
    if (data !== null) {
        expect_fun(data, response);
    }
    return response;
};

let url_post = async function (url, data, status, expected, retry_count = 1, redirect = false) {
    let response = null;
    
    if (redirect === true) {
        response = await request.post(url).send(data)
        .redirects(1)
        .retry(retry_count);
    } else {
        response = await request.post(url).send(data);
    }

    utils.setFixture("res_body", {...response.body});
    if (response.body.hasOwnProperty("id")) {
        if (response.body.id !== null && response.body.id !== undefined) {
            let post_id = utils.getFixture("post_id") !== undefined ? utils.getFixture("post_id") : [];
            post_id.push(response.body.id);
            utils.setFixture("post_id", [...post_id]);
        }
    }

    expect(response.status).to.eql(status);
    if (expected !== null) {
        expect_fun(expected, response);
    }

    return response;
}

let url_put = async function (url, data, status, expected, retry_count = 1, redirect = false) {
    let response = null;
    
    if (redirect === true) {
        response = await request.put(url).send(data)
        .redirects(1)
        .retry(retry_count);
    } else {
        response = await request.put(url).send(data);
    }

    utils.setFixture("res_body", {...response.body});

    expect(response.status).to.eql(status);
    if (expected !== null) {
        expect_fun(expected, response);
    }

    return response;
}

let url_patch = async function (url, data, status, expected, retry_count = 1, redirect = false) {
    let response = null;
    
    if (redirect === true) {
        response = await request.patch(url).send(data)
        .redirects(1)
        .retry(retry_count);
    } else {
        response = await request.patch(url).send(data);
    }

    utils.setFixture("res_body", {...response.body});

    expect(response.status).to.eql(status);
    if (expected !== null) {
        expect_fun(expected, response);
    }

    return response;
}

let url_delete = async function (url, data, status, redirect = false) {
    let response = null;
    
    if (redirect === true) {
        response = await request.delete(url).send(data)
        .redirects(1);
    } else {
        response = await request.delete(url).send(data);
    }

    if (response.body !== null && response.body !== undefined) {
        utils.setFixture("res_body", {...response.body});
    }
    else {
        utils.setFixture("res_body", {});
    }

    expect(response.status).to.eql(status);

    return response;
};

let add_res_body = function (context) {
    let ctx = utils.getFixture("res_body");
    addContext(context, `Response body: ${(ctx !== null && ctx !== undefined && typeof ctx == 'object') ? JSON.stringify(ctx): ""}`);
    utils.setFixture("res_body", {});
}

let cases_execute = async function (cases) {
    cases.forEach((tc) => {
        it(it_msg(tc.description, tc.url, null, tc.status), async function () {
            this.timeout(config.timeout);

            if (typeof tc.method === "string") {
                await eval(tc.method);
            } else {
                await tc.method();
            }
            
            if ("assertion" in tc) {
                if (typeof tc.assertion === "string") {
                    await eval(tc.assertion);
                } else {
                    await tc.assertion();
                }
            }
        });
    });
}

let only_compare_keys = function (actual, expected) {
    expect(actual).to.include.all.keys(Object.keys(expected));
}

let section_run = function (description, testcases) {
    describe(description, function () {
        afterEach(function (done) {
            add_res_body(this);
            done();
        });

        cases_execute(testcases);
    });
}

module.exports = {
    expect_fun: expect_fun,
    get_response_keys:get_response_keys,
    update_response_value:update_response_value,
    get_key_only:get_key_only,
    ignore_keys:ignore_keys,
    it_msg: it_msg,
    url_get: url_get,
    url_post: url_post,
    url_put: url_put,
    url_patch: url_patch,
    url_delete: url_delete,
    add_res_body: add_res_body,
    cases_execute: cases_execute,
    only_compare_keys: only_compare_keys,
    section_run: section_run
};
