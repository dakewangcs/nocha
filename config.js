const test_config = {
    auto_import: '1', // whether to generate module imports automatically when doing debugging: 1: auto generate, 0: not generated
    host: process.env.IP,
    port: process.env.PORT,
    suites: process.env.SUITE,  // suite name to be executed, if there are multiple suites, the format should be: <name1>,<name2>. 
                                //if it's empty, will run all the suite.js under TCs folder 
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
    headers: {
        "Referer": "https://portal.demo.fortiguardcloud.com",
        "Authorization": `bearer ${process.env.TOKEN}`
    },
    token: "",
    timeout: 5000,
    description: `API Testing for example project`
};

module.exports = test_config;