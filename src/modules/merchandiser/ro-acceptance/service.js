
import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';

const serviceUri = "cost-calculation-garments";
// const costCalculationGarmentServiceUri = "cost-calculation-garments";

class Service extends RestService {

    constructor(http, aggregator, config, api) {
        super(http, aggregator, config, "sales");
    }

    search(info) {
        var endpoint = `${serviceUri}/ro-acceptance`;
        console.log(endpoint)
        return super.list(endpoint, info);
    }

    create(data) {
        var endpoint = `${serviceUri}/`;
        return super.post(endpoint, data);
    }

    getCostCalculationGarment(info) {
        var endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    accpeted(data){
        var endpoint = `${serviceUri}/acceptance`;
        console.log(endpoint)
        return super.post(endpoint, data);
    }
}

// const servicePurchaseRequestUri = 'garment-purchase-requests';

// class PurchaseRequestService extends RestService {
//     constructor(http, aggregator, config) {
//         super(http, aggregator, config, "purchasing-azure");
//     }

//     getProducts(info) {
//         var endpoint = `${servicePurchaseRequestUri}/dynamic`;
//         return super.list(endpoint, info);
//     }
// }

export { Service }