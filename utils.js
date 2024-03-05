const expect = require("chai").expect;
const fs = require('fs');
const formData = require('form-data');
const fetch = require('node-fetch');
const config = require('./config');
const host = config.host; // "192.168.1.139";
const port = config.port; // "9000";
const URL = 'https://'.concat(host, ':', port);
const headers = config.headers;
let supertest = require("supertest");
global.cookies = null;
global.username = null;
global.password = null;
global.fixture = {};

const hook = (method = 'get') => (args) =>
    supertest(URL)[method](args)
    .set(headers);

const request = {
    post: hook('post'),
    get: hook('get'),
    put: hook('put'),
    patch: hook('patch'),
    delete: hook('delete'),
    del: hook('del')
};

function executeTests (url, testcase, methods) {
    // list of test cases
    TCs = testcase.get(url);
    for (let TC_idx in TCs) {
        let TC_name = TCs[TC_idx];
        try {
            methods[TC_name]();
        } catch (error) {
            console.log(error.message.concat(" => Test case: ", TC_name, " not able to execute, please check your add.js and tc.js"));
        }
    }
}

function isUrlExists(url, module, request) {
    it(url.concat(" should be a valid api"), async function() {
        const response = await request.get(url);

        expect(response.status).to.satisfy((status) => ((status === 200) || (status === 405) || (status === 401) || (status === 403) || (status === 400) || (status === 302)));
    });
}

function setFixture(key, value) {
    global.fixture[key] = value;
}

function getFixture(key = null) {
    if (key === null) {
        return global.fixture;
    }
    else {
        return global.fixture[key];
    }
}

function delFixture(key = null) {
    if (key === null) {
        global.fixture = {};
    }
    else {
        delete global.fixture[key];
    }
}

async function uploadFile(url, fpath, method="PATCH", param="logo_image") {
    const form = new formData();
    form.append(param, fs.createReadStream(fpath));
    let options = {};

    options = {
        'method': method,
        'headers': headers,
        body: form
    };

    url = `${URL}${url}`;
    let response = await fetch(url, options);
    let status = response.status;
    let body = {};
    try {
        body = await response.json();
    } catch (error) {
        body = {};
    }

    return [status, body];
}

function delay(interval)
{
   return it('should delay '.concat(interval, "ms"), done =>
   {
      setTimeout(() => done(), interval)

   }).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
}

module.exports={
    executeTests,
    isUrlExists,
    request,
    setFixture,
    getFixture,
    delFixture,
    uploadFile,
    delay
};
