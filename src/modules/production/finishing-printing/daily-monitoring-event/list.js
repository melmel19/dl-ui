import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import numeral from 'numeral';
var moment = require('moment');
@inject(Router, Service)
export class List {
    context = ["Detail"];
    itemYears = [];
    columns = [
        {
            field: "Date", title: "Tanggal", formatter: (value, data) => {
                return moment(value).format("DD-MMM-YYYY");
            }
        },
        { field: "Machine.Name", title: "Mesin" },
        { field: "ProcessArea", title: "Area" },
        { field: "Shift", title: "Jam Kerja" },
        { field: "Group", title: "Group" },
    ];
    loader = (info) => {
        var order = {};
        if (info.sort)
            order[info.sort] = info.order;

        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order
        }

        return this.service.search(arg)
            .then(result => {
                return {
                    total: result.info.total,
                    data: result.data
                }
            });
    }

    constructor(router, service) {
        this.service = service;
        this.router = router;


    }

    contextCallback(event) {
        let arg = event.detail;
        let data = arg.data;
        switch (arg.name) {
            case "Detail":
                this.router.navigateToRoute('view', { id: data.Id });
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }
}