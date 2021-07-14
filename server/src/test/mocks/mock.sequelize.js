const extend = require('extend');

module.exports = class MockSequelizeModels {

    constructor (params) {
        // default values
        var config = extend({
            orgFindAllTest: [],
            orgCreate: true
        }, params);

        this.orgFindAll = config.orgFindAllTest;
        this.validateOrg_ = config.validateOrg;
    }

    Organization = {
        async findAll(params) {
            // need to fio to send needed return value in const params
            // because this function in an object cannot read
            // variables from the class constructor
            return ["Organization {\
                dataValues: {\
                  org_id: 4,\
                  gh_id: 131524,\
                  org_name: 'mozilla',\
                  auth_token: {\
                    iv: '69e4afbe141a******2b4e522e6f6818',\
                    content: 'f67623c78f******************b80f821d6314cf878d55521b35933e8063c8d0ee48fda9db'\n\
                  },\
                  user_id: 1\
                },\
                _previousDataValues: {\
                  org_id: 4,\
                  gh_id: 131524,\
                  org_name: 'mozilla',\
                  auth_token: {\
                    iv: '69e4afbe141a******2b4e522e6f6818',\
                    content: 'f67623c78f******************b80f821d6314cf878d55521b35933e8063c8d0ee48fda9db'\
                  },\
                  user_id: 1\
                },\
                _changed: Set(0) {},\
                _options: {\
                  isNewRecord: false,\
                  _schema: null,\
                  _schemaDelimiter: '',\
                  raw: true,\
                  attributes: [Array]\
                },\
                isNewRecord: false\
            }"];
        },

        async create(params) {
            return "Organization {\
                dataValues: {\
                  org_id: 6,\
                  gh_id: 9919,\
                  org_name: 'github',\
                  auth_token: {\
                    iv: '69e4afbe141a******2b4e522e6f6818',\
                    content: 'f67623c78f******************b80f821d6314cf878d55521b35933e8063c8d0ee48fda9db'\
                  },\
                  user_id: '1'\
                },\
                _previousDataValues: {\
                  gh_id: 9919,\
                  org_name: 'github',\
                  auth_token: {\
                    iv: '69e4afbe14*****93c2b4e522e6f6818',\
                    content: 'f67623c78fcb*****************f821d6314cf878d55521b35933e8063c8d0ee48fda9db'\
                  },\
                  user_id: '1',\
                  org_id: 6\
                },\
                _changed: Set(0) {},\
                _options: {\
                  isNewRecord: true,\
                  _schema: null,\
                  _schemaDelimiter: '',\
                  attributes: undefined,\
                  include: undefined,\
                  raw: undefined,\
                  silent: undefined\
                },\
                isNewRecord: false\
              }"
        }
    }

}
/*
orgExists = true
findAll with one in db
[
  Organization {
    dataValues: {
      org_id: 4,
      gh_id: 131524,
      org_name: 'mozilla',
      auth_token: [Object],
      user_id: 1
    },
    _previousDataValues: {
      org_id: 4,
      gh_id: 131524,
      org_name: 'mozilla',
      auth_token: [Object],
      user_id: 1
    },
    _changed: Set(0) {},
    _options: {
      isNewRecord: false,
      _schema: null,
      _schemaDelimiter: '',
      raw: true,
      attributes: [Array]
    },
    isNewRecord: false
  }
]

orgExists = false
findAll with none in db
org exists
[]

another findAll
org retrieve
[
  Organization {
    dataValues: {
      org_id: 1,
      gh_id: 476009,
      org_name: 'adobe',
      auth_token: [Object],
      user_id: 1
    },
    _previousDataValues: {
      org_id: 1,
      gh_id: 476009,
      org_name: 'adobe',
      auth_token: [Object],
      user_id: 1
    },
    _changed: Set(0) {},
    _options: {
      isNewRecord: false,
      _schema: null,
      _schemaDelimiter: '',
      raw: true,
      attributes: [Array]
    },
    isNewRecord: false
  }
]


create
org create entry
Organization {
  dataValues: {
    org_id: 6,
    gh_id: 9919,
    org_name: 'github',
    auth_token: {
      iv: '69e4afbe141a******2b4e522e6f6818',
      content: 'f67623c78f******************b80f821d6314cf878d55521b35933e8063c8d0ee48fda9db'
    },
    user_id: '1'
  },
  _previousDataValues: {
    gh_id: 9919,
    org_name: 'github',
    auth_token: {
      iv: '69e4afbe14*****93c2b4e522e6f6818',
      content: 'f67623c78fcb*****************f821d6314cf878d55521b35933e8063c8d0ee48fda9db'
    },
    user_id: '1',
    org_id: 6
  },
  _changed: Set(0) {},
  _options: {
    isNewRecord: true,
    _schema: null,
    _schemaDelimiter: '',
    attributes: undefined,
    include: undefined,
    raw: undefined,
    silent: undefined
  },
  isNewRecord: false
}
*/