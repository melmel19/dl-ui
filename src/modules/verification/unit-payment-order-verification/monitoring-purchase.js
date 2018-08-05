import { inject } from 'aurelia-framework';
import { Service, MongoService } from "./service";
import { Router } from 'aurelia-router';
var moment = require('moment');
var UnitLoader = require('../../../loader/unit-loader');
var BudgetLoader = require('../../../loader/budget-loader');
var CategoryLoader = require('../../../loader/category-loader');
var SupplierLoader = require('../../../loader/supplier-loader');
var PurchaseOrderLoader = require('../../../loader/purchase-order-by-user-loader');

@inject(Router, Service, MongoService)
export class List {

    poStates = [
        {
            "name": "",
            "value": -1
        }, {
            "name": "Dibatalkan",
            "value": 0
        }, {
            "name": "PO Internal belum diorder",
            "value": 1
        }, {
            "name": "Sudah dibuat PO Eksternal",
            "value": 2
        }, {
            "name": "Sudah diorder ke Supplier",
            "value": 3
        }, {
            "name": "Barang sudah datang parsial",
            "value": 4
        }, {
            "name": "Barang sudah datang",
            "value": 5
        }, {
            "name": "Barang sudah diterima Unit parsial",
            "value": 6
        }, {
            "name": "Barang sudah diterima Unit",
            "value": 7
        }, {
            "name": "Sebagian sudah dibuat SPB",
            "value": 8
        }, {
            "name": "Complete",
            "value": 9
        }];

    constructor(router, service, mongoService) {
        this.service = service;
        this.router = router;
        this.mongoService = mongoService;
        this.today = new Date();
        this.poStates = this.poStates.map(poState => {
            poState.toString = function () {
                return this.name;
            }
            return poState;
        })
        this.data = [];
    }
    attached() {

    }

    activate(param) {
        var no = param.no;
        this.purchaseOrder = decodeURIComponent(no);
        this.search();

    }

    search() {
        var dateFormat = "DD MMM YYYY";
        var locale = 'id-ID';
        var moment = require('moment');
        moment.locale(locale);
        if (!this.poState)
            this.poState = this.poStates[0];
        this.mongoService.search(this.unit ? this.unit._id : "", this.category ? this.category._id : "", this.PODLNo, this.purchaseOrder ? this.purchaseOrder : "", this.supplier ? this.supplier._id : "", this.dateFrom, this.dateTo, this.poState.value, this.budget ? this.budget._id : "")
            .then(data => {
                this.isVerified(data).then(result => {
                    var dataPR = [];
                    var temp = {};
                    for (var i of result) {
                        for (var PR of data) {
                            temp = PR;
                            if (i.UnitPaymentOrderNo == PR["No Nota Intern"]) {
                                temp.Position = i.Position;
                            } else {
                                temp.Position = 0;
                            }
                            dataPR.push(temp)
                        }
                    }
                    this.data = dataPR
                })
            })
    }

    isVerified(data) {
        return new Promise((resolve, reject) => {
            var isVerified = [];

            for (var item of data) {
                var arg = {
                    filter: JSON.stringify({ UnitPaymentOrderNo: item["No Nota Intern"] }),
                }
                isVerified.push(this.service.search(arg));
            }

            Promise.all(isVerified).then(res => {
                var dataVerification = [];
                for (var i of res) {
                    if (i.data[0] != undefined) {
                        dataVerification.push(i.data[0])
                    }
                }
                resolve(dataVerification);
            })
        })
    }

    exportToXls() {
        if (!this.poState)
            this.poState = this.poStates[0];
        this.mongoService.generateExcel(this.unit ? this.unit._id : "", this.category ? this.category._id : "", this.PODLNo, this.purchaseOrder ? this.purchaseOrder : "", this.supplier ? this.supplier._id : "", this.dateFrom, this.dateTo, this.poState.value, this.budget ? this.budget._id : "");
    }

    dateFromChanged(e) {
        var _startDate = new Date(e.srcElement.value);
        var _endDate = new Date(this.dateTo);
        this.dateMin = moment(_startDate).format("YYYY-MM-DD");

        if (_startDate > _endDate || !this.dateTo) {
            this.dateTo = e.srcElement.value;
        }

    }

    get unitLoader() {
        return UnitLoader;
    }

    get budgetLoader() {
        return BudgetLoader;
    }

    get categoryLoader() {
        return CategoryLoader;
    }

    get purchaseOrderLoader() {
        return PurchaseOrderLoader;
    }

    get supplierLoader() {
        return SupplierLoader;
    }

}