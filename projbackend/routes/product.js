const express = require("express");
const router = express.Router();

const {createProduct, getProductById, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories}= require("../controllers/product");
const {isSignedIn, isAuthenticated, isAdmin }= require("../controllers/auth");
const {getUserById }= require("../controllers/user");
const { }= require("../controllers/category");


//param
router.param("userId", getUserById);
//router.param("categoryId", getCategoryById);
router.param("productId", getProductById);


//create routes
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);

//read route
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//delete route
router.delete("/product/:productId/:userId", isSignedIn,
isAuthenticated, isAdmin, deleteProduct);

//update route
router.put("/product/:productId/:userId", isSignedIn,
isAuthenticated, isAdmin, updateProduct);

//listing route
router.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueCategories)

module.exports = router;