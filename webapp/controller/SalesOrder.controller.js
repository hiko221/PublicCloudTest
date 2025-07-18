sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("ns.salesorder.controller.SalesOrder", {
        onInit: function () {
            console.log("SalesOrder controller initialized");
            
            // モデルの取得
            var oModel = this.getOwnerComponent().getModel();
            if (oModel) {
                console.log("Model found:", oModel);
                // データの読み込みテスト
                this._loadData();
            } else {
                console.error("Model not found");
            }
        },
        
        _loadData: function() {
            var oModel = this.getOwnerComponent().getModel();
            
            oModel.read("/A_SalesOrder", {
                urlParameters: {
                    "$top": 20  // 最初は20件のみ取得
                },
                success: function(oData) {
                    console.log("Sales orders loaded:", oData);
                    MessageToast.show("データが正常にロードされました (" + oData.results.length + "件)");
                },
                error: function(oError) {
                    console.error("Error loading sales orders:", oError);
                    MessageToast.show("データの読み込みでエラーが発生しました");
                }
            });
        },
        
        onSearch: function(oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTable = this.byId("salesOrderTable");
            var oBinding = oTable.getBinding("items");
            
            if (sQuery && sQuery.length > 0) {
                var oFilter = new Filter("SalesOrder", FilterOperator.Contains, sQuery);
                oBinding.filter([oFilter]);
            } else {
                oBinding.filter([]);
            }
        },
        
        onRefresh: function() {
            var oModel = this.getOwnerComponent().getModel();
            oModel.refresh(true);
            MessageToast.show("データを更新しました");
            
            // データ再読み込み
            this._loadData();
        },
        
        onItemPress: function(oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            
            if (oContext) {
                var sSalesOrder = oContext.getProperty("SalesOrder");
                var sCustomer = oContext.getProperty("SoldToParty");
                
                MessageToast.show("Sales Order選択: " + sSalesOrder + " (Customer: " + sCustomer + ")");
            } else {
                MessageToast.show("データが取得できませんでした");
            }
        }
    });
});