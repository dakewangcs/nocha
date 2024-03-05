const { expect } = require("chai");
const hosts_data = require("./res/hosts.res");
const test_utils = require("../lib/test_utils");

const example_testcases = {
    TestSuite: "Testing SASE Hosts",

    testcases: [{
        description: "Security > Hosts: able to get hosts info",
        url: "/resource-api/v2/security/hosts",
        status: 200,
        data: hosts_data.get_host_data,
        method: async function () {
            let res = await test_utils.url_get(this.url, null, this.status);
            test_utils.only_compare_keys(res.body, this.data);
        },
    },

    {
        description: "Security > Host Groups: able to get host group info",
        url: "/resource-api/v2/security/host-groups",
        status: 200,
        data: hosts_data.get_host_group_data,
        method: async function () {
            let res = await test_utils.url_get(this.url, null, this.status);
            test_utils.only_compare_keys(res.body, this.data);
        },
    },

    {
        description: "Security > Host: able to get default security hosts",
        url: "/resource-api/v2/default/security/hosts",
        status: 200,
        data: hosts_data.get_default_host_data,
        method: async function () {
            let res = await test_utils.url_get(this.url, null, this.status);
            test_utils.only_compare_keys(res.body, this.data);
        },
    },
    
    {
        description: "Security > Host: able to create hosts using valid input",
        url: "/resource-api/v2/security/hosts",
        status: 200,
        data: hosts_data.post_with_valid_data_for_host,
        expected: {"primaryKey": "api_test", "code": 200},
        method: async function () {
            await test_utils.url_post(this.url, this.data, this.status, this.expected);
        }
    },

    {
        description: "Security > Host: able to get new host",
        url: "/resource-api/v2/security/hosts/api_test",
        status: 200,
        data: hosts_data.get_added_host,
        method: async function () {
            let res = await test_utils.url_get(this.url, null, this.status);
            test_utils.expect_fun(this.data, res.body, ["uuid"]);
        }
    },

    {
        description: "Security > Host: able to edit new host",
        url: `/resource-api/v2/security/hosts/<host_name>`,
        status: 200,
        data: hosts_data.put_valid_host,
        previous_data: hosts_data.post_with_valid_data_for_host,
        expected: {"primaryKey": "api_test", "code": 200},
        method: async function () {
            let new_url = this.url.replace("<host_name>", this.previous_data[0].name)
            await test_utils.url_put(new_url, this.data, this.status, this.expected);

            let sec_url = this.url.replace("<host_name>", this.data.name)
            let res = await test_utils.url_get(sec_url, null, this.status);
            expect(res.body.data[0].name).to.be.deep.equal(this.data.name);
        }
    },

    {
        description: "Security > Host: able to delete new host",
        url: `/resource-api/v2/security/hosts/${hosts_data.put_valid_host.name}`,
        status: 200,
        method: async function () {
            await test_utils.url_delete(this.url, null, this.status);
        }
    },

    {
        description: "Security > Host: not able to get a not existed host",
        url: `/resource-api/v2/security/hosts/-1`,
        status: 400,
        method: async function () {
            await test_utils.url_get(this.url, null, this.status);
        }
    },

    {
        description: "Security > Host Groups: able to get host group schema",
        url: "/resource-api/v2/schema/security/host-groups",
        status: 200,
        data: hosts_data.get_host_group_shema,
        method: async function () {
            let res = await test_utils.url_get(this.url, null, this.status);
            test_utils.only_compare_keys(res.body, this.data);
        },
    },

]};

module.exports = example_testcases;