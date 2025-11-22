const mongoose = require('mongoose');
const Product = require('../model/productSchema');
const transporter = require('../config/mailer.js');

const UniversalSchema = new mongoose.Schema({
    title: String,
    name: String,
    image: String,
    description: String,
    price: Number,
});


// This function returns a model for a specific collection name
const getModelForCollection = (collectionName) => {
    // If a model for this collection already exists, return it
    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName];
    }

    // Otherwise, create a new model bound to this collection name
    return mongoose.model(collectionName, UniversalSchema, collectionName);
};


module.exports.getindex = (req, res) => {
    res.render('index');
}

module.exports.getproducts = async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();

        const allCollections = [];

        for (const coll of collections) {
            const collectionName = coll.name;

            // Get a model for this collection
            const Model = getModelForCollection(collectionName);

            // Fetch all items from that collection
            const items = await Model.find();

            if (items.length > 0) {
                allCollections.push({
                    collection: collectionName,
                    collectionName: collectionName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    items,
                });
            }
        }

        res.render("products", { allCollections });
    } catch (err) {
        console.error("Error displaying sections:", err);
        res.status(500).send("Server Error");
    }
};

module.exports.getproductdetails = async (req, res) => {
    try {
        const { item, collection } = req.params;

        // Get the model for the specific collection
        const Model = getModelForCollection(collection);

        const product = await Model.findById(item);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        req.session.collection = collection;
        req.session.productName = product.name;
        res.render('productDetails', { product });

    } catch (err) {
        console.error('Error fetching product details:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports.buyProduct = async (req, res) => {
    console.log(req.session.collection, req.session.productName);
    productcollection = req.session.collection;
    productName = req.session.productName;
    res.render('buypage', { productcollection, productName });
};


module.exports.sendFormDataEmail = async (req, res) => {
    try {
        // defensive check: ensure transporter is a valid nodemailer transport
        if (!transporter || typeof transporter.sendMail !== 'function') {
            console.error('Email transporter is not configured correctly:', transporter);
            return res.status(500).json({ error: 'Email transporter not configured' });
        }

        const formData = req.body;
        console.log("Form Data Received:", formData);

        const formattedData = Object.entries(formData)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        console.log("Formatted Data:", formattedData);

        const mailOptions = {
            from: `"Website Form" <${process.env.MY_EMAIL}>`,
            to: process.env.MY_EMAIL,
            subject: "New Form Submission",
            text: `New form submitted:\n\n${formattedData}`,
        };

        console.log("Sending email with options:", mailOptions);
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");

        // FIX: Return JSON response instead of redirect for API calls
        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Email sending failed" });
    }
};

module.exports.getorderconfirmed = (req, res) => {
    res.render('OrderConfirmed');
}
