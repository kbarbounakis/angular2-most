# angular2-most (beta)
[MOST Web Framework](https://github.com/kbarbounakis/most-web) Client Library for [Angular 2](https://github.com/angular/angular)

![MOST Web Framework Logo](https://www.themost.io/assets/images/most_logo_sw_240.png)

## Installation

    npm install angular2-most

## Usage

    import {ClientDataContext} from './angular2-most/client';

    export class OrderList {

        public orders:Array;

        ngOnInit() {
            this.getOrders();
        }

        constructor(private context: ClientDataContext) { }

        getOrders(): {
            this.context.model("Order")
            .where("orderStatus/alternateName").equal("OrderProcessing")
            .orderByDescending("orderDate")
            .take(10)
            .items().subscribe(
                result => {
                    this.orders = result;
                },
                err => { console.log(err); }
            );
        }
    }


### ClientDataContext Class

#### model(name)

Gets an instance of ClientDataModel class based on the given name.

    this.context.model("Order").where("orderStatus").equal(1)
    .items().subscribe(
        result => {
            this.items = result;
        },
        err => { console.log(err); }
    );

#### getService()

Gets the instance of ClientDataService associated with this data context.

    console.log(context.getService().getBase());

### ClientDataModel Class

#### asQueryable()

Returns an instance of ClientDataQueryable class associated with this model.

    this.context.model("Order")
        .asQueryable()
        .select("id","customer/description as customerDescription", "orderDate", "orderedItem/name as orderedItemName")
        .where("paymentMethod/alternateName").equal("DirectDebit")
        .orderByDescending("orderDate")
        .take(10)
        .items().subscribe(
                result => {
                    this.items = result;
                },
                err => { console.log(err); }
            );
    });

#### getName()

Gets a string which represents the name of this data model.

#### getService()

Gets the instance of ClientDataService associated with this data model.

#### remove(obj)

Removes the given item or array of items.

    var order = {
        id:1
    };
    this.context.model("Order").remove(order)
    .subscribe(
        result => {
            //
        },
        err => { console.log(err); }
    );

#### save(obj)

Creates or updates the given item or array of items.

    var order = {
        id:1,
        orderStatus:7
    };
    this.context.model("Order").save(order)
    .subscribe(
        result => {
            //
        },
        err => { console.log(err); }
    );

#### schema()

Returns the JSON schema of this data model.

    this.context.model("Order").schema()
    .subscribe(
        result => {
            //
        },
        err => { console.log(err); }
    );


#### select(...attr)

Initializes and returns an instance of ClientDataQueryable class by selecting an attribute or a collection of attributes.

    this.context.model("Order")
        .select("id","customer","orderedItem","orderStatus")
        .orderBy("orderDate")
        .take(25)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

#### skip(num)

Initializes and returns an instance of ClientDataQueryable class by specifying the number of records to be skipped.

    this.context.model("Order")
        .skip(10)
        .take(10)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

#### take(num)

Initializes and returns an instance of ClientDataQueryable class by specifying the number of records to be taken.

    this.context.model("Order")
        .take(10)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

#### where(attr)

Initializes a comparison expression by using the given attribute as left operand
and returns an instance of ClientDataQueryable class.

    this.context.model("Order")
        .where("orderedItem/category").equal("Laptops")
        .take(10)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

### ClientDataQueryable Class

ClientDataQueryable class enables developers to perform simple and extended queries against data models.
The ClienDataQueryable class follows [DataQueryable](https://docs.themost.io/most-data/DataQueryable.html)
which is introduced by [MOST Web Framework ORM server-side module](https://github.com/kbarbounakis/most-data).

#### Logical Operators

Or:

    this.context.model("Product")
        .where("category").equal("Desktops")
        .or("category").equal("Laptops")
        .orderBy("price")
        .take(5)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

And:

    this.context.model("Product")
        .where("category").equal("Laptops")
        .and("price").between(200,750)
        .orderBy("price")
        .take(5)
        .items()
        .subscribe(
        result => {
            this.items = result;
        },
        err => { console.log(err); }
    );

#### Comparison Operators

Equal:

    this.context.model("Order")
            .where("id").equal(10)
            .first()
            .subscribe(
            result => {
                this.item = result;
            },
            err => { console.log(err); }
        );

Not equal:

    this.context.model("Order")
            .where("orderStatus/alternateName").notEqual("OrderProblem")
            orderByDescending("orderDate")
            .take(10)
            .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Greater than:

    this.context.model("Order")
        .where("orderedItem/price").greaterThan(968)
        .and("orderedItem/category").equal("Laptops")
        .and("orderStatus/alternateName").notEqual("OrderCancelled")
        .select("id",
            "orderStatus/name as orderStatusName",
            "customer/description as customerDescription",
            "orderedItem")
        .orderByDescending("orderDate")
        .take(10)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Greater or equal:

    this.context.model("Product")
        .where("price").greaterOrEqual(1395.9)
        .orderByDescending("price")
        .take(10)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Lower than:

    this.context.model("Product")
        .where("price").lowerThan(263.56)
        .orderBy("price")
        .take(10)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Lower or equal:

    this.context.model("Product")
        .where("price").lowerOrEqual(263.56)
        .and("price").greaterOrEqual(224.52)
        .orderBy("price")
        .take(5)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Contains:

    this.context.model("Product")
        .where("name").contains("Book")
        .and("category").equal("Laptops")
        .orderBy("price")
        .take(5)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Between:

    this.context.model("Product")
        .where("category").equal("Laptops")
        .or("category").equal("Desktops")
        .andAlso("price").between(200,750)
        .orderBy("price")
        .take(5)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );
#### Aggregate Functions

Count:

    this.context.model("Product")
        .select("category", "count(id) as total")
        .groupBy("category")
        .orderByDescending("count(id)")
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Min:

    this.context.model("Product")
        .select("category", "min(price) as minimumPrice")
        .where("category").equal("Laptops")
        .or("category").equal("Desktops")
        .groupBy("category")
        .orderByDescending("min(price)")
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );
    });

Max:

    this.context.model("Product")
        .select("category", "max(price) as maximumPrice")
        .where("category").equal("Laptops")
        .items()
        .subscribe(
        result => {
            this.items = result;
        },
        err => { console.log(err); }
    );

### String Functions:

Index Of:

    this.context.model("Product")
        .where("name").indexOf("Intel")
        .greaterOrEqual(0)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Substring:

    this.context.model("Product")
        .where("name").substr(6,4)
        .equal("Core")
        .items()
        .subscribe(
        result => {
            this.items = result;
        },
        err => { console.log(err); }
    );

Starts with:

    this.context.model("Product")
        .where("name").startsWith("Intel Core")
        .equal(true)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Ends with:

    this.context.model("Product")
        .where("name").endsWith("Edition")
        .equal(true)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Lower case:

    this.context.model("Product")
        .where("category").toLowerCase()
        .equal("laptops")
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Upper case:

    this.context.model("Product")
        .where("category").toUpperCase()
        .equal("LAPTOPS")
        .take(10)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

#### Date Functions:

Date:

    this.context.model("Order")
        .where("orderDate").getDate()
        .equal("2015-04-18")
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Month:

    this.context.model("Order")
        .where("orderDate").getMonth()
        .equal(4)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Day:

    this.context.model("Order")
        .where("orderDate").getMonth().equal(4)
        .and("orderDate").getDay().lowerThan(15)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Year:

    this.context.model("Order")
        .where("orderDate").getMonth().equal(5)
        .and("orderDate").getDay().lowerOrEqual(10)
        .and("orderDate").getFullYear().equal(2015)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Hours:

    this.context.model("Order")
        .where("orderDate").getMonth().equal(5)
        .and("orderDate").getDay().lowerOrEqual(10)
        .and("orderDate").getHours().between(10,18)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Minutes:

    this.context.model("Order")
        .where("orderDate").getMonth().equal(5)
        .and("orderDate").getHours().between(9,17)
        .and("orderDate").getMinutes().between(1,30)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Seconds:

    this.context.model("Order")
        .where("orderDate").getMonth().equal(5)
        .and("orderDate").getHours().between(9,17)
        .and("orderDate").getMinutes().between(1,30)
        .and("orderDate").getSeconds().between(1,45)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

#### Math Functions

Round:

    this.context.model("Product")
        .where("price").round().lowerOrEqual(177)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Floor:

    this.context.model("Product")
        .where("price").floor().lowerOrEqual(177)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

Ceiling:

    this.context.model("Product")
        .where("price").ceil().greaterOrEqual(177)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

#### Methods

##### and(name)

Prepares a logical AND expression.

Parameters:
- name: The name of field that is going to be used in this expression

##### andAlso(name)

Prepares a logical AND expression.
If an expression is already defined, it will be wrapped with the new AND expression

Parameters:
- name: The name of field that is going to be used in this expression

        this.context.model("Product")
            .where("category").equal("Laptops")
            .or("category").equal("Desktops")
            .andAlso("price").floor().lowerOrEqual(177)
            .items()
            .subscribe(
                result => {
                    this.items = result;
                },
                err => { console.log(err); }
            );

##### expand(...attr)

Parameters:
- attr: A param array of strings which represents the field or the array of fields that are going to be expanded.
If attr is missing then all the previously defined expandable fields will be removed

Defines an attribute or an array of attributes to be expanded in the final result. This operation should be used
when a non-expandable attribute is required to be expanded in the final result.

    this.context.model("Order")
        .where("customer").equal(337)
        .orderByDescending("orderDate")
        .expand("customer")
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

##### first()

Executes the specified query and returns the first item.

    this.context.model("User")
        .where("name").equal("alexis.rees@example.com")
        .first()
        .subscribe(
            result => {
                this.item = result;
            },
            err => { console.log(err); }
        );

##### item()

Executes the specified query and returns the first item.

    this.context.model("User")
        .where("name").equal("alexis.rees@example.com")
        .item()
        .subscribe(
            result => {
                this.item = result;
            },
            err => { console.log(err); }
        );

##### items()

Executes the specified query and returns an array of items.

    this.context.model("Product")
        .where("category").equal("Laptops")
        .take(10)
        .items()
        .subscribe(
            result => {
                this.items = result;
            },
            err => { console.log(err); }
        );

##### list()

Executes the underlying query and returns a result set based on the specified paging parameters. The result set
contains the following attributes:

- total (number): The total number of records
- skip (number): The number of skipped records
- records (Array): An array of objects which represents the query results.

        this.context.model("Product")
            .where("category").equal("Laptops")
            .skip(10)
            .take(10)
            .list()
            .subscribe(
                result => {
                    this.items = result;
                },
                err => { console.log(err); }
            );

##### skip(val)

Prepares a paging operation by skipping the specified number of records

Parameters:
- val: The number of records to be skipped

         this.context.model("Product")
                 .where("category").equal("Laptops")
                 .skip(10)
                 .take(10)
                 .list()
                 .subscribe(
                     result => {
                         this.items = result;
                     },
                     err => { console.log(err); }
                 );

##### take(val)

Prepares a data paging operation by taking the specified number of records

Parameters:
- val: The number of records to take

         this.context.model("Product")
                 .where("category").equal("Laptops")
                 .skip(10)
                 .take(10)
                 .list()
                 .subscribe(
                     result => {
                         this.items = result;
                     },
                     err => { console.log(err); }
                 );

##### groupBy(...attr)

Prepares a group by expression

    this.context.model("Order")
     .select("orderedItem/model as productModel", "orderedItem/name as productName","count(id) as orderCount")
     .where("orderDate').getFullYear().equal(2015)
     .groupBy("orderedItem")
     .orderByDescending("count(id)")
     .take(5).items().subscribe(
                  result => {
                      this.items = result;
                  },
                  err => { console.log(err); }
              );

##### orderBy(...attr)

Prepares an ascending sorting operation

    this.context.model("Product")
         .orderBy("category","name")
         .take(25).items().subscribe(
                    result => {
                        this.items = result;
                    },
                    err => { console.log(err); }
                );

##### thenBy(...attr)

 Continues a descending sorting operation

     this.context.model("Product")
          .orderBy("category")
          .thenBy("name")
          .take(25).items().subscribe(
                 result => {
                     this.items = result;
                 },
                 err => { console.log(err); }
             );

##### orderByDescending(...attr)

 Prepares an descending sorting operation

     this.context.model("Product")
          .orderByDescending("price")
          .take(25).items().subscribe(
                result => {
                    this.items = result;
                },
                err => { console.log(err); }
            );

##### thenByDescending(...attr)

 Continues a descending sorting operation

     this.context.model("Product")
          .orderBy("category")
          .thenByDescending("price")
          .take(25).items().subscribe(
                result => {
                    this.items = result;
                },
                err => { console.log(err); }
            );
