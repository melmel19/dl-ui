import { inject, BindingEngine } from 'aurelia-framework';

var SPBLoader = require('../../../../loader/vb-realization-spb-loader');

@inject(BindingEngine)
export class Item {
    constructor(bindingEngine) {
        this.bindingEngine = bindingEngine;
    }

    activate(context) {
        this.data = context.data;
        this.error = context.error;
        this.options = context.context.options;
        this.readOnly = context.options.readOnly;

        console.log(this.options);

        this.filter.epoIds = this.options.epoIds;
        this.filter.division = this.options.division
    }

    filter = {

    }

    columns = [
        { header: "Tanggal", value: "Date" },
        { header: "Keterangan", value: "Remark" },
        {
            header: "Kena PPN", value: "UseVat"
        },
        { header: "Kena PPh", value: "UseIncomeTax" },
        { header: "Total", value: "Amount" }
    ]

    get spbLoader() {
        return SPBLoader;
    }

    get total() {
        console.log(this.data)
        if (this.data.UnitPaymentOrder) {
            let result = this.data.UnitPaymentOrder.Amount;

            if (this.data.UnitPaymentOrder.UseVat)
                result += this.data.UnitPaymentOrder.Amount * 0.1;

            if (this.data.UnitPaymentOrder.UseIncomeTax && this.data.UnitPaymentOrder.IncomeTaxBy == "Supplier")
                result -= this.data.UnitPaymentOrder.Amount * (this.data.UnitPaymentOrder.IncomeTax.Rate / 100);

            return result;

        }
        return 0;
    }
}
