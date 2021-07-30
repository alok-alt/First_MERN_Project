const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product)=> {
        if(err || !product){
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.product = product;
        next();
    });
};

exports.createProduct = (req, res)=> {

    let form  = formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                error: "Problem with Image"
            });
        }
        //destructure the fields
        const {name, price, description, category, stock} = fields

        if(
            !name ||
            !description ||
            !price || 
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: " Please include all fields"
            })
        }

        //TODO: restriction on fields
        let product = new Product(fields);

        //handle files
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
            
        }
        // save to the db
        product.save((err,product)=> {
            if(err){

                res.status(400).json({
                    error: "Saving tshirt in DB failed"
                })
            }
            res.json(product);
            
        })
    });
};

exports.getProduct = (req, res)=> {
    req.product.photo = undefined;
    return res.json(req.product);
};


//middleware
exports.photo = (req, res, next)=> {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
};

//update controller
exports.updateProduct = (req, res)=> {

    let form  = formidable.IncomingForm();
    form.keepExtensions = true;
    
    form.parse(req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                error: "Problem with Image"
            });
        }
        //destructure the fields
        const {name, price, description, category, stock} = fields

    

       //updation code
        let product = req.product;
        product = _.extend(product, fields);

        //handle files
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
            
        }
        // save to the db
        product.save((err,product)=> {
            if(err){

                res.status(400).json({
                    error: "Saving tshirt in DB failed"
                })
            }
            res.json(product);
            
        });
    });

};

//delete controller
exports.deleteProduct = (req, res)=> {
    let product = req.product;
    product.remove((err, deletedProduct)=> {
        if(err){
            return res.status(400).json({
                error: "Failed to delete the product"
            })
        }
        res.json({
            message: "Deletion was sucess",
            deletedProduct
        })
    })
};

//product listing
exports.getAllProducts = (req, res)=> {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let sortBy =  req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products)=> {
        if(err || !products){
            return res.status(400).json({
                error: "NO product FOUND"
            })
        }
        res.json(produts)
    })
};

exports.getAllUniqueCategories = (req, res)=> {

    Product.distinct("category", {}, (err, category)=> {
        if(err){
            return res.status(400).json({
                error: "NO category found"
            });
        }
        res.json(category);
    });
};

exports.updateStock = (re, res, next)=> {

    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count }}
            }
        };
    });

    Product.bulkWrite(myOperations, {}, (err, products)=> {
        if(err){
            return res.status(400).json({
                error: "Bulk operation failed"
            })
        }
        next();
    })
};