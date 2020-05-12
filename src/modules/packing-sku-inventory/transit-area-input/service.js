import { RestService } from '../../../utils/rest-service';
const serviceUri = 'input-transit';
const ccServiceUri = 'sales/finishing-printing-cost-calculations';
export class Service extends RestService {

    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "packing-inventory");
    }

    search(info) {
        var endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    getById(id) {
        var endpoint = `${serviceUri}/${id}`;
        return super.get(endpoint);
    }

    create(data) {
        var endpoint = `${serviceUri}`;
        return super.post(endpoint, data);
    }

    update(data) {
        var endpoint = `${serviceUri}/${data.id}`;
        return super.put(endpoint, data);
    }

    delete(data) {
        var endpoint = `${serviceUri}/${data.id}`;
        return super.delete(endpoint, data);
    }

    getPdfById(id) {
        var endpoint = `${serviceUri}/pdf/${id}`;
        return super.getPdf(endpoint);
    }

    getProductionOrderOutput(){
        var endpoint = `${serviceUri}/output-production-orders`;

        return super.get(endpoint);
    }

    // getSPPbySC(no, select) {
    //     var config = Container.instance.get(Config);
    //     var _endpoint = config.getEndpoint("production");
    //     var _serviceUri = `/sales/production-order-by-sales-contract-numbers/${no}`;

    //     return _endpoint.find(_serviceUri)
    //         .then(result => {
    //             return result.data;
    //         });
    // }
}