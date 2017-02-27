import '../scss/styles.scss';

import $ from 'jquery';
import ko from 'knockout';

import productCategories from '../db/productCategories'

window.productCategories = productCategories;

function formatCurrency(value) {
    return "$" + value.toFixed(2);
}
window.formatCurrency = formatCurrency;

var cartItem = function() {
    var self = this;
}


var CartLine = function() {
    var self = this;
    self.category = ko.observable();
    self.product = ko.observable();
    self.quantity = ko.observable(1);
    self.subtotal = ko.computed(function() {
        return self.product() ? self.product().price * parseInt("0" + self.quantity(), 10) : 0;
    });
 
    // Whenever the category changes, reset the product selection
    self.category.subscribe(function() {
        self.product(undefined);
    });
};

var shouter = new ko.subscribable();
var selectBrandModel = function(){
    this.brandHeader = "Choose Your Favourite Brand"
    this.showBrands = ko.observable(true);    

    this.brands = ko.observableArray();
    this.selectBrand = function(event) {       
       this.brands.push({'category' : event.name, 'products' : event.products});
       console.log(this.brands);
    }.bind(this);

    this.brands.subscribe(function(newValue) {
        shouter.notifySubscribers(newValue, "productsToPublish");
        this.showBrands(false);
    }, this);
};

var selectMobileModel = function(){  
    this.showMobiles = ko.observable(false);  

    this.productsArray=ko.observableArray();
    shouter.subscribe(function(newValue) {
        this.productsArray(newValue);
        this.showMobiles(true);
    }, this, "productsToPublish");    


    // Stores an array of lines, and from these, can work out the grandTotal
    var self = this;

    self.cartQty = ko.observable(1);
    console.log(self.cartQty);
    //New code for image display cart
    self.addToCart = function(event) {
        // self.selectedItems = ko.observableArray(event);
        self.cartTotal = ko.observable(50);
    };
    self.lines = ko.observableArray([new CartLine()]); // Put one line in by default
    self.grandTotal = ko.computed(function() {
        var total = 0;
        $.each(self.lines(), function() { total += this.subtotal() })
        return total;
    });
 
    // Operations
    self.addLine = function() { 
        self.lines.push(new CartLine()); 
    };

    self.removeLine = function(line) { 
        self.lines.remove(line); 
    };

    self.save = function() {
        var dataToSave = $.map(self.lines(), function(line) {
            return line.product() ? {
                productName: line.product().name,
                quantity: line.quantity()
            } : undefined;
        });
        alert("Saved");
    };

    self.totalItems = ko.computed(function() {
        var count = 0;
        $.each(self.lines(), function() {            
            if(this.subtotal() > 0) {
                count += parseInt(this.quantity());
            }            
        });
        return count;
    });
};

var homeModel = function(){
    this.selectBrandModel =  new selectBrandModel(),
    this.selectMobileModel = new selectMobileModel();
}

ko.applyBindings( homeModel.call(window) );
