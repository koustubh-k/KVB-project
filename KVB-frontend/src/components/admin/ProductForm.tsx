import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { X, Plus, Trash2 } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { Product, ProductFormData } from "@/types";
import toast from "react-hot-toast";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const [specifications, setSpecifications] = useState<Record<string, string>>(
    product?.specifications || {}
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category || "",
      stock: product?.stock || 0,
      specifications: product?.specifications || {},
    },
  });

  const createProductMutation = useMutation(
    (data: FormData) => adminAPI.createProduct(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-products");
        toast.success("Product created successfully");
        onClose();
      },
      onError: () => {
        toast.error("Failed to create product");
      },
    }
  );

  const updateProductMutation = useMutation(
    (data: FormData) => adminAPI.updateProduct(product!._id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("admin-products");
        toast.success("Product updated successfully");
        onClose();
      },
      onError: () => {
        toast.error("Failed to update product");
      },
    }
  );

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    formData.append("stock", data.stock.toString());
    formData.append("specifications", JSON.stringify(specifications));
    if (imageFile) {
      formData.append("file", imageFile);
    }

    if (isEdit) {
      updateProductMutation.mutate(formData);
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const addSpecification = () => {
    const key = `spec${Object.keys(specifications).length + 1}`;
    setSpecifications({ ...specifications, [key]: "" });
  };

  const updateSpecification = (
    oldKey: string,
    newKey: string,
    value: string
  ) => {
    const newSpecs = { ...specifications };
    delete newSpecs[oldKey];
    newSpecs[newKey] = value;
    setSpecifications(newSpecs);
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    setSpecifications(newSpecs);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const isLoading =
    createProductMutation.isLoading || updateProductMutation.isLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">
              Basic Information
            </h3>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Product Name *
              </label>
              <input
                {...register("name", { required: "Product name is required" })}
                type="text"
                className="input"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={3}
                className="input min-h-[80px] resize-none"
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category *
              </label>
              <input
                {...register("category", { required: "Category is required" })}
                type="text"
                className="input"
                placeholder="Enter product category"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price (₹) *
                </label>
                <input
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  type="number"
                  step="0.01"
                  className="input"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Stock Quantity *
                </label>
                <input
                  {...register("stock", {
                    required: "Stock is required",
                    min: { value: 0, message: "Stock must be positive" },
                  })}
                  type="number"
                  className="input"
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Product Image</h3>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                onChange={handleImageChange}
                className="input flex-1"
              />
            </div>
            {product?.images && product.images[0] && !imageFile && (
              <div className="w-20 h-20 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {imageFile && (
              <div className="w-20 h-20 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Specifications</h3>
              <button
                type="button"
                onClick={addSpecification}
                className="btn btn-outline btn-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Spec
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={key}
                    onChange={(e) =>
                      updateSpecification(key, e.target.value, value)
                    }
                    className="input flex-1"
                    placeholder="Specification name"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      updateSpecification(key, key, e.target.value)
                    }
                    className="input flex-1"
                    placeholder="Specification value"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(key)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              {isEdit ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
