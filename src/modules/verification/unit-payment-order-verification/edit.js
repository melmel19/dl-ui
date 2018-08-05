import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service, MongoService } from './service';
import { activationStrategy } from 'aurelia-router';
import { Dialog } from '../../../components/dialog/dialog';
import { AlertView } from './custom-dialog-view/alert-view';
import moment from 'moment';
@inject(Router, Service, MongoService, Dialog)
export class Edit {

    constructor(router, service, mongoService, dialog) {
        this.router = router;
        this.service = service;
        this.dialog = dialog;
        this.mongoService = mongoService;
        this.data = {};

        this.submitContext = {
            verifiedAlert: false,
            position: 0,
        };
    }

    context = ["Rincian Purchase Request"];

    selectSPB = [
        'division.name', 'division.code',
        'supplier.name', 'supplier.code',
        'currency.code',
        'category.code', 'category.name',
        'paymentMethod',
        'invoceNo',
        'invoceDate',
        'pibNo',
        'useVat', //pph
        'useIncomeTax', //ppn
        'no',
        'date',
        'remark',
        'items.unitReceiptNote.no',
        'items.unitReceiptNote.items.product.name',
        'items.unitReceiptNote.items.deliveredQuantity',
        'items.unitReceiptNote.items.deliveredUom.unit',
        'items.unitReceiptNote.items.pricePerDealUnit',
        'items.unitReceiptNote.items.correction.correctionNo',
        'items.unitReceiptNote.items.purchaseOrder.purchaseOrderExternal.no',
        'items.unitReceiptNote.items.purchaseOrder.purchaseRequest.no',
        'items.unitReceiptNote.items.currency.code'
    ];

    async activate(params) {
        var id = params.id;
        this.dataExpedition = await this.service.getById(id);

        var arg = {
            filter: JSON.stringify({ no: this.dataExpedition.UnitPaymentOrderNo }),
            select: this.selectSPB,
        }

        var UnitPaymentOrder = await this.mongoService.searchByCode(arg);
        this.data = UnitPaymentOrder.data[0];
        this.data.VerifyDate = moment(new Date()).format("DD-MMM-YYYY");
        this.data.Id = id;
        
        this.data.useVat = this.dataExpedition.Vat;
        this.data.useIncomeTax = this.dataExpedition.IncomeTax;
        this.data.remark = this.dataExpedition.TotalPaid;
        this.SPB = this.data;
    }

    cancel(event) {
        this.router.navigateToRoute('view', { id: this.dataExpedition.Id });
    }

    Submit(context) {
        var Data = this.data;

        this.submitContext.verifiedAlert = context == "VerifiedAlert" ? true : false;
        this.submitContext.position = this.dataExpedition.Position;

        this.dialog.show(AlertView, this.submitContext)
            .then(response => {
                if (!response.wasCancelled) {
                    if (response.output.context == "Finance") {
                        Data.SubmitPosition = 5;
                    } else if (response.output.context == "Cashier") {
                        Data.SubmitPosition = 4;
                    } else {
                        Data.SubmitPosition = 6;
                        Data.Reason = response.output.Remark;
                    }
                    this.service.create(Data).then(result => {
                        alert("Data berhasil diubah");
                        this.cancel();
                    });
                }
            });
    }

    async contextCallback(event) {
        var arg = event.detail;
        var data = arg.data;

        switch (arg.name) {
            case "Rincian Purchase Request":
                window.open(`${window.location.origin}/#/verification/unit-payment-order-verification/monitoring-purchase/${encodeURIComponent(data.purchaseRequestNo)}`);
                break;
        }
    }

}