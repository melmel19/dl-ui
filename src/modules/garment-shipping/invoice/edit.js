import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';


@inject(Router, Service)
export class Edit {
    hasCancel = true;
    hasSave = true;

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    bind() {
        this.error = {};
    }

    async activate(params) {
        var id = params.id;
        this.data = await this.service.getById(id);
        // this.dataUnitDO=await this.service.getUnitDOId(this.data.UnitDOId);
        // this.data.RoJob=this.dataUnitDO.RONo;
        // this.unitDeliveryOrder = { UnitDONo:this.data.UnitDONo};
        // this.data.Storage.toString = function () {
        //     return [this.code, this.name]
        //         .filter((item, index) => {
        //             return item && item.toString().trim().length > 0;
        //         }).join(" - ");
        // }

        // if (this.data.Items) {
        //     for (let item of this.data.Items) {
        //         item.IsSave = true;
        //         item.IsDisabled = false;
        //     }
        // }

    }

    cancel(event) {
        this.router.navigateToRoute('view', { id: this.data.id });
    }

    save(event) {
        this.service.update(this.data).then(result => {
            this.cancel();
        }).catch(e => {
            this.error = e;
        })
    }
}

