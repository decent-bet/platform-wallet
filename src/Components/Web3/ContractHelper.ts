import DBETToVETDepositContract from './Contracts/DBETToVETDepositContract'
import DBETV1TokenContract from './Contracts/DBETV1TokenContract'
import DBETV2TokenContract from './Contracts/DBETV2TokenContract'
import DBETVETTokenContract from './Contracts/DBETVETTokenContract'
import Web3 from 'web3';
export default class ContractHelper {
    protected web3: Web3;
    private v1TokenContract: DBETV1TokenContract;
    private v2TokenContract: DBETV2TokenContract;
    private v1TokenContract_Http: DBETV1TokenContract;
    private v2TokenContract_Http: DBETV2TokenContract;
    private depositContract: DBETToVETDepositContract;
    private vetContract: DBETVETTokenContract;
    /**
     *
     * @param {Web3} web3Param
     */
    constructor(thor: Web3) {
        // Initialize new Contracts
        this.vetContract = new DBETVETTokenContract(thor)

    }

    get V1Token() {
        return this.v1TokenContract
    }

    get V2Token() {
        return this.v2TokenContract
    }

    get V1TokenHttp() {
        return this.v1TokenContract_Http
    }

    get V2TokenHttp() {
        return this.v2TokenContract_Http
    }


    get DepositToVET() {
        return this.depositContract
    }

    get VETToken() {
        return this.vetContract
    }
}
