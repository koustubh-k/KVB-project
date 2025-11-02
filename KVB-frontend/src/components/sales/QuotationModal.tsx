import React, { useState } from "react";
import { X } from "lucide-react";
import { Lead, Product } from "@/types/sales";

interface QuotationModalProps {
  lead: Lead | null;
  onClose: () => void;
  onSubmit: (data: {
    productId: string;
    customerId: string;
    price: number;
    terms: string;
    validUntil: string;
  }) => void;
  products: Product[];
}

const QuotationModal: React.FC<QuotationModalProps> = ({
  lead,
  onClose,
  onSubmit,
  products,
}) => {
  const [formData, setFormData] = useState({
    productId: "",
    price: 0,
    terms: "",
    validUntil: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    onSubmit({
      ...formData,
      customerId: lead._id,
    });
  };

  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Create Quotation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Customer
            </label>
            <input
              type="text"
              value={lead.name}
              disabled
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Product
            </label>
            <select
              value={formData.productId}
              onChange={(e) =>
                setFormData({ ...formData, productId: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} - ₹{product.price.toLocaleString("en-IN")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Terms and Conditions
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) =>
                setFormData({ ...formData, terms: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded px-3 py-2 h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Valid Until
            </label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) =>
                setFormData({ ...formData, validUntil: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Quotation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotationModal;
