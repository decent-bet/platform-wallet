const constants = require('../../Constants')

const OldToken = require('./OldToken')
const NewToken = require('./NewToken')
const House = require('./House')
const HouseAuthorizedController = require('./HouseAuthorizedController')
const HouseFundsController = require('./HouseFundsController')
const HouseLotteryController = require('./HouseLotteryController')
const HouseSessionsController = require('./HouseSessionsController')
const TestDecentBetToken = require('./TestDecentBetToken')

const contracts = {}
contracts[constants.TOKEN_TYPE_DBET_TOKEN_OLD] = OldToken
contracts[constants.TOKEN_TYPE_DBET_TOKEN_NEW] = NewToken
contracts[constants.TYPE_HOUSE] = House
contracts[constants.TYPE_HOUSE_AUTHORIZED_CONTROLLER] = HouseAuthorizedController
contracts[constants.TYPE_HOUSE_FUNDS_CONTROLLER] = HouseFundsController
contracts[constants.TYPE_HOUSE_LOTTERY_CONTROLLER] = HouseLotteryController
contracts[constants.TYPE_HOUSE_SESSIONS_CONTROLLER] = HouseSessionsController
contracts[constants.TYPE_TEST_DECENT_BET_TOKEN] = TestDecentBetToken

module.exports = {
    OldToken,
    NewToken,
    contracts
}
