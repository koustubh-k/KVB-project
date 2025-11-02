import { Product } from "../models/index.js";

// For all users (registered or not)
export const getProductsPublic = async (req, res) => {
  try {
    // Select only the fields needed for the public view
    const products = await Product.find({}).select("name images description");

    const publicProducts = products.map((p) => ({
      _id: p._id,
      name: p.name,
      // Use description for the public view
      description: p.description,
      // Show only the first image
      image:
        p.images && p.images.length > 0 ? p.images[0] : "/images/dish 1.jpg",
    }));

    res.status(200).json(publicProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductByIdPublic = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select(
      "name images description"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const publicProduct = {
      _id: product._id,
      name: product.name,
      description: product.description,
      image:
        product.images && product.images.length > 0
          ? product.images[0]
          : "/images/dish 1.jpg",
    };

    res.status(200).json(publicProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// For registered customers
export const getProductsForCustomer = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// For registered customers
export const getProductByIdForCustomer = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
