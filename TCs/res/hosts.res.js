module.exports = {
    get_host_data: {
        "data": [
            {
                "primaryKey": "FortiClient",
                "name": "FortiClient",
                "uuid": "a34d1188-d4f6-51ee-465e-9cec1809492e",
                "subnet": "0.0.0.0 0.0.0.0",
                "type": "ipmask",
                "subType": "sdn",
                "interface": null,
                "fqdn": null,
                "countryId": null,
                "startIp": null,
                "endIp": null,
                "isMacBasedEmsObj": false,
                "usedByEMSProfile": false,
                "location": "unspecified",
                "isStaticObject": true,
                "references": 0,
                "isGlobalEntry": false
            }
        ],
        "code": 200
    },
    get_host_group_data: {
        "data": [
            {
                "primaryKey": "G Suite",
                "name": "G Suite",
                "uuid": "4f3b580c-d4f6-51ee-8ddc-d2eaa0329890",
                "member": [
                    {
                        "name": "gmail.com",
                        "isHostGroup": false
                    },
                    {
                        "name": "wildcard.google.com",
                        "isHostGroup": false
                    }
                ],
                "isStaticObject": false,
                "references": 0,
                "isGlobalEntry": false
            }
        ],
        "code": 200
    },
    get_default_host_data: {
        "primaryKey": "",
        "name": "",
        "uuid": "00000000-0000-0000-0000-000000000000",
        "subnet": "0 . 0 . 0 . 0   0 . 0 . 0 . 0",
        "type": "ipmask",
        "subType": "sdn",
        "interface": "",
        "fqdn": "",
        "countryId": "",
        "startIp": "0.0.0.0",
        "endIp": "0.0.0.0",
        "isMacBasedEmsObj": false,
        "usedByEMSProfile": false,
        "location": "unspecified",
        "isStaticObject": false,
        "references": 0,
        "isGlobalEntry": false
    },
    get_host_group_shema: {
        "action": "schema",
        "build": 2571,
        "http_method": "GET",
        "http_status": 200,
        "name": "addrgrp",
        "path": "firewall",
        "results": {
            "access_group": "fwgrp",
            "category": "table",
            "children": {
                "allow-routing": {
                    "category": "unitary",
                    "default": "disable",
                    "help": "Enable/disable use of this group in the static route configuration.",
                    "multiple_values": false,
                    "name": "allow-routing",
                    "options": [
                        {
                            "help": "Enable use of this group in the static route configuration.",
                            "name": "enable"
                        },
                        {
                            "help": "Disable use of this group in the static route configuration.",
                            "name": "disable"
                        }
                    ],
                    "type": "option"
                },
                "category": {
                    "category": "unitary",
                    "default": "default",
                    "help": "Address group category.",
                    "multiple_values": false,
                    "name": "category",
                    "options": [
                        {
                            "help": "Default address group category (cannot be used as ztna-ems-tag/ztna-geo-tag in policy).",
                            "name": "default"
                        },
                        {
                            "help": "Members must be ztna-ems-tag group or ems-tag address, can be used as ztna-ems-tag in policy.",
                            "name": "ztna-ems-tag"
                        },
                        {
                            "help": "Members must be ztna-geo-tag group or geographic address, can be used as ztna-geo-tag in policy.",
                            "name": "ztna-geo-tag"
                        }
                    ],
                    "type": "option"
                },
                "color": {
                    "category": "unitary",
                    "default": 0,
                    "help": "Color of icon on the GUI.",
                    "max-value": 32,
                    "min-value": 0,
                    "multiple_values": false,
                    "name": "color",
                    "type": "integer"
                },
                "comment": {
                    "category": "unitary",
                    "help": "Comment.",
                    "multiple_values": false,
                    "name": "comment",
                    "size": 255,
                    "type": "var-string"
                },
                "exclude": {
                    "category": "unitary",
                    "default": "disable",
                    "help": "Enable/disable address exclusion.",
                    "multiple_values": false,
                    "name": "exclude",
                    "options": [
                        {
                            "help": "Enable address exclusion.",
                            "name": "enable"
                        },
                        {
                            "help": "Disable address exclusion.",
                            "name": "disable"
                        }
                    ],
                    "type": "option"
                },
                "exclude-member": {
                    "category": "table",
                    "children": {
                        "name": {
                            "category": "unitary",
                            "datasource": [
                                "firewall.address.name",
                                "firewall.addrgrp.name"
                            ],
                            "default": "",
                            "help": "Address name.",
                            "multiple_values": false,
                            "name": "name",
                            "required": true,
                            "size": 79,
                            "type": "string"
                        }
                    },
                    "help": "Address exclusion member.",
                    "max_table_size_global": 0,
                    "max_table_size_item": 0,
                    "max_table_size_vdom": 0,
                    "member_table": true,
                    "mkey": "name",
                    "mkey_type": "string",
                    "name": "exclude-member",
                    "required": true
                },
                "fabric-object": {
                    "category": "unitary",
                    "default": "disable",
                    "help": "Security Fabric global object setting.",
                    "multiple_values": false,
                    "name": "fabric-object",
                    "options": [
                        {
                            "help": "Object is set as a security fabric-wide global object.",
                            "name": "enable"
                        },
                        {
                            "help": "Object is local to this security fabric member.",
                            "name": "disable"
                        }
                    ],
                    "type": "option"
                },
                "member": {
                    "category": "table",
                    "children": {
                        "name": {
                            "category": "unitary",
                            "datasource": [
                                "firewall.address.name",
                                "firewall.addrgrp.name"
                            ],
                            "default": "",
                            "help": "Address name.",
                            "multiple_values": false,
                            "name": "name",
                            "required": true,
                            "size": 79,
                            "type": "string"
                        }
                    },
                    "help": "Address objects contained within the group.",
                    "max_table_size_global": 0,
                    "max_table_size_item": 5000,
                    "max_table_size_vdom": 0,
                    "member_table": true,
                    "mkey": "name",
                    "mkey_type": "string",
                    "name": "member"
                },
                "name": {
                    "category": "unitary",
                    "default": "",
                    "help": "Address group name.",
                    "multiple_values": false,
                    "name": "name",
                    "required": true,
                    "size": 79,
                    "type": "string"
                },
                "tagging": {
                    "category": "table",
                    "children": {
                        "category": {
                            "category": "unitary",
                            "datasource": [
                                "system.object-tagging.category"
                            ],
                            "default": "",
                            "help": "Tag category.",
                            "multiple_values": false,
                            "name": "category",
                            "size": 63,
                            "type": "string"
                        },
                        "name": {
                            "category": "unitary",
                            "default": "",
                            "help": "Tagging entry name.",
                            "multiple_values": false,
                            "name": "name",
                            "size": 63,
                            "type": "string"
                        },
                        "tags": {
                            "category": "table",
                            "children": {
                                "name": {
                                    "category": "unitary",
                                    "datasource": [
                                        "system.object-tagging.tags.name"
                                    ],
                                    "default": "",
                                    "help": "Tag name.",
                                    "multiple_values": false,
                                    "name": "name",
                                    "size": 79,
                                    "type": "string"
                                }
                            },
                            "help": "Tags.",
                            "max_table_size_global": 0,
                            "max_table_size_item": 0,
                            "max_table_size_vdom": 0,
                            "member_table": true,
                            "mkey": "name",
                            "mkey_type": "string",
                            "name": "tags"
                        }
                    },
                    "help": "Config object tagging.",
                    "max_table_size_global": 0,
                    "max_table_size_item": 0,
                    "max_table_size_vdom": 0,
                    "mkey": "name",
                    "mkey_type": "string",
                    "name": "tagging"
                },
                "type": {
                    "category": "unitary",
                    "default": "default",
                    "help": "Address group type.",
                    "multiple_values": false,
                    "name": "type",
                    "options": [
                        {
                            "help": "Default address group type (address may belong to multiple groups).",
                            "name": "default"
                        },
                        {
                            "help": "Address folder group (members may not belong to any other group).",
                            "name": "folder"
                        }
                    ],
                    "type": "option"
                },
                "uuid": {
                    "category": "unitary",
                    "default": "00000000-0000-0000-0000-000000000000",
                    "help": "Universally Unique Identifier (UUID; automatically assigned but can be manually reset).",
                    "multiple_values": false,
                    "name": "uuid",
                    "type": "uuid"
                }
            },
            "help": "Configure IPv4 address groups.",
            "max_table_size_global": 30000,
            "max_table_size_item": 0,
            "max_table_size_vdom": 30000,
            "mkey": "name",
            "mkey_type": "string",
            "name": "addrgrp",
            "object_range": "vdom",
            "path": "firewall",
            "q_type": 34
        },
        "revision": "4370f1032c7fa89801d788afc245d712",
        "serial": "FGVM08TM24090160",
        "status": "success",
        "vdom": "root",
        "version": "v7.4.2"
    },
    post_with_valid_data_for_host: [
    {
        "name": "api_test",
        "primaryKey": "api_test",
        "type": "ipmask",
        "subnetStr": "8.8.8.0/24",
        "ipVersion": 4,
        "subnet": "8.8.8.0/24",
        "location": "unspecified",
        "subnetIpv4": {
        "version": 4,
        "address": {
            "groups": 4,
            "parsedAddress": [
            "8",
            "8",
            "8",
            "0"
            ],
            "parsedSubnet": "24",
            "subnet": "/24",
            "subnetMask": 24,
            "v4": true,
            "address": "8.8.8.0/24",
            "addressMinusSuffix": "8.8.8.0"
        }
        }
    }
    ],
    get_added_host: {
        "data": [
          {
            "primaryKey": "api_test",
            "name": "api_test",
            "uuid": "befb8914-d69a-51ee-1d07-268ad9f147f8",
            "subnet": "8.8.8.0 255.255.255.0",
            "type": "ipmask",
            "subType": "sdn",
            "interface": null,
            "fqdn": null,
            "countryId": null,
            "startIp": null,
            "endIp": null,
            "isMacBasedEmsObj": false,
            "usedByEMSProfile": false,
            "location": "unspecified",
            "isStaticObject": false,
            "references": 0,
            "isGlobalEntry": false
          }
        ],
        "code": 200
    },
    put_valid_host: {
        "name": "api_test1",
        "primaryKey": "api_test",
        "type": "ipmask",
        "subnetStr": "8.8.8.0/24",
        "ipVersion": 4,
        "subnet": "8.8.8.0/24",
        "location": "unspecified",
        "subnetIpv4": {
        "version": 4,
        "address": {
            "groups": 4,
            "parsedAddress": [
            "8",
            "8",
            "8",
            "0"
            ],
            "parsedSubnet": "24",
            "subnet": "/24",
            "subnetMask": 24,
            "v4": true,
            "address": "8.8.8.0/24",
            "addressMinusSuffix": "8.8.8.0"
        }
        }
    },
}