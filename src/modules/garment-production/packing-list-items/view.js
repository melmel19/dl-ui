import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';

@inject(Router, Service)
export class View {

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    formOptions = {
        cancelText: "Back",
        saveText: "Unpost"
    }

    async activate(params) {
        var id = params.id;
        this.data = await this.service.getById(id);
        var idx = 0;

        if (this.data.measurements) {
            for (var i of this.data.measurements) {
                i.MeasurementIndex = idx;
                idx++;
            }
        }

        if (this.data.items) {
            for (const item of this.data.items) {
                item.buyerAgent = this.data.buyerAgent;
                item.section = this.data.section;
            }
        }

        switch (this.data.status) {
            case "CREATED":
                this.saveCallback = null;
                break;
            case "CANCELED":
            case "APPROVED_MD":
            case "APPROVED_SHIPPING":
            case "REJECTED_SHIPPING_MD":
                this.saveCallback = null;
            case "POSTED":
            case "REJECTED_MD":
            case "REVISED_MD":
            case "REJECTED_SHIPPING_UNIT":
            case "REVISED_SHIPPING":
                this.editCallback = null;
                this.deleteCallback = null;
                break;
            default:
                break;
        }

        switch (this.data.status) {
            case "REJECTED_MD":
                this.alertInfo = "<strong>Alasan Reject oleh Md:</strong> " + (this.data.statusActivities.slice(-1)[0] || {}).remark;
                break;
            case "REJECTED_SHIPPING_UNIT":
                this.alertInfo = "<strong>Alasan Reject oleh Shipping:</strong> " + (this.data.statusActivities.slice(-1)[0] || {}).remark;
                break;
            default:
                break;
        }
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    editCallback(event) {
        this.router.navigateToRoute('edit', { id: this.data.id });
    }

    // deleteCallback(event) {
    //     if (confirm("Hapus?")) {
    //         this.service.delete(this.data).then(result => {
    //             this.cancelCallback();
    //         });
    //     }
    // }

    // saveCallback() {
    //     if (confirm("Unpost?")) {
    //         this.service.unpost(this.data.id)
    //             .then(result => {
    //                 this.cancelCallback();
    //             });
    //     }
    // }
}
