const utils = require("./utils");
const fs = require('fs');
const path = require('path');
const config = require('./config');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = config.NODE_TLS_REJECT_UNAUTHORIZED;
let tSuites = config.suites;
let TEXT_SUITE_DIR = "./TCs";
const API_ADD = path.join(process.cwd(), TEXT_SUITE_DIR, "api.add.js");
const API_TC = path.join(process.cwd(), TEXT_SUITE_DIR, "api.tc.js");


function basicTests(url, module, request) {
    // add basic assertion functions here
    utils.isUrlExists(url, module, request);
}

function skipForAdding(url, module) {
    it.skip(url.concat(" has no test cases added"), function() {});
}

function generate_import(sub_suites) {
    
    console.log(sub_suites);
    console.log(process.cwd());

    sub_suites.forEach(suite => {
        const suite_path = path.join(process.cwd(), TEXT_SUITE_DIR, suite.replace(".js", ""));
        const content = require(suite_path);
        const suite_name = suite.replace(".suite.js", "");
        const suite_folder = path.join(process.cwd(), TEXT_SUITE_DIR, suite_name)
        const add_file = path.join(suite_folder, suite_name.concat(".add.js"));
        const tc_file = path.join(suite_folder, suite_name.concat(".tc.js"));

        if(!fs.existsSync(suite_path.concat(".js"))) {
            console.log(`${suite_path} not exists`);
            return;
        }
        // if folder not exists
        if(!fs.existsSync(suite_folder)) {
            console.log(`${suite_folder} making`);
            fs.mkdirSync(suite_folder);
        }

        let suite_title = "";
        console.log(`${content["TestSuite"]}`);
        if (content) {
            suite_title = content["TestSuite"];
        }
        
        let add_js_template = `const Added = new Map([
    ["${suite_title}", [
        "${suite_name}"
    ]]
]);
module.exports = Added;`;

        let tc_js_template = `const ${suite_name}_test_cases = require("${suite_path}");
const test_utils = require("${process.cwd()}").test_utils;
var ${suite_name} = function () {
    test_utils.section_run("${suite_title}", ${suite_name}_test_cases.testcases);
}
module.exports = {
    ${suite_name}: ${suite_name}
}`;

        try {
            fs.writeFileSync(add_file, add_js_template)
        } catch (err) {
            console.log(err);
        }

        try {
            fs.writeFileSync(tc_file, tc_js_template)
        } catch (err) {
            console.log(err);
        }
    });

    let require_add_strs = sub_suites.map((suite) => `let ${suite.replace(".suite.js", "")} = require(\"./${suite.replace(".suite.js", "")}/${suite.replace(".suite.js", "")}.add\");`).join("\n");
    console.log(require_add_strs);
    let add_map_strs = sub_suites.map((suite) => `...${suite.replace(".suite.js", "")},`).join("\n")
    let gen_add_js_template = `${require_add_strs}
const Added = new Map([
${add_map_strs}
]);
module.exports = Added;`;

    let require_tc_strs = require_add_strs.replaceAll(".add", ".tc");
    let tc_export_strs = sub_suites.map((suite) => `${suite.replace(".suite.js", "")}: ${suite.replace(".suite.js", "")}.${suite.replace(".suite.js", "")},`).join("\n");
    let gen_tc_js_template = `
${require_tc_strs}
module.exports = {
${tc_export_strs}
}`;

    try {
        fs.writeFileSync(API_ADD, gen_add_js_template);
    } catch (err) {
        console.log(err);
    }

    try {
        fs.writeFileSync(API_TC, gen_tc_js_template);
    } catch (err) {
        console.log(err);
    }
}

function run() {
    describe(config.description, function(){
        const testcases = require(API_TC.replace(".js", ""))
        const Added = require(API_ADD.replace(".js", ""))
        let debug_tc = [];
            let is_debug = false;
            Added.forEach((value, key, map) => {
                for (let v of value) {
                    if (is_debug === true && v !== "end") {
                        debug_tc.push(v);
                    }
                    if (v === "start") {
                        is_debug = true;
                    } else if (v === "end") {
                        is_debug = false;
                    }
                }
            });

            if (debug_tc.length > 0) {
                debug_tc.forEach((tc) => {testcases[tc]();});
            } else {
                Added.forEach((value, key, map) => {
                    console.log(key, value, map);
                    utils.executeTests(key, map, testcases);
                });
            }
    })
}

// setup
if(!fs.existsSync(TEXT_SUITE_DIR)) {
    console.log(`Create test folder ${TEXT_SUITE_DIR}`);
    fs.mkdirSync(TEXT_SUITE_DIR);
}

let dir_files = fs.readdirSync(TEXT_SUITE_DIR);

if (tSuites) {
    tSuites = tSuites.split(",").map((suite) => suite.trim().concat(".suite.js"));
}

console.log(tSuites);
let sub_suites = [];

if (!tSuites) {
    sub_suites = dir_files.filter((file) => file.toString().endsWith(".suite.js"));
} else {
    sub_suites = tSuites
}

if (config.auto_import === '1') {
    generate_import(sub_suites);
}
run();
