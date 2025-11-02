import React from "react";
import { Eye, Package, DollarSign, Star, Calendar } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Product } from "@/types";
import { format } from "date-fns";
import { IMAGE_BASE_URL } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  isCustomer: boolean;
  viewMode: "grid" | "list";
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isCustomer,
  viewMode,
  onClick,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (viewMode === "list") {
    return (
      <div className="relative">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
          className="rounded-lg"
        />
        <div
          className="card hover:shadow-md transition-shadow cursor-pointer bg-gray-800 border-gray-700"
          onClick={onClick}
        >
          <div className="card-content">
            <div className="flex items-center space-x-4">
              {/* Image */}
              <div className="w-20 h-20 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src={`${IMAGE_BASE_URL}${product.image || product.images?.[0] || "/images/dish 1.jpg"}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `${IMAGE_BASE_URL}/images/dish 1.jpg`;
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    {isCustomer && (
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                        {product.category && (
                          <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-200">
                            {product.category}
                          </span>
                        )}
                        {product.stock !== undefined && (
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              product.stock > 0
                                ? "bg-green-900/20 text-green-200"
                                : "bg-red-900/20 text-red-200"
                            }`}
                          >
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    {isCustomer && product.price && (
                      <div className="text-lg font-bold text-primary-600">
                        {formatPrice(product.price)}
                      </div>
                    )}
                    <button className="btn btn-outline btn-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
        className="rounded-lg"
      />
      <div
        className="card hover:shadow-md transition-shadow cursor-pointer bg-gray-800 border-gray-700"
        onClick={onClick}
      >
        {/* Image */}
        <div className="aspect-square bg-gray-700 rounded-t-lg overflow-hidden">
          <img
            src={`${IMAGE_BASE_URL}${product.image || product.images?.[0] || "/images/dish 1.jpg"}`}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `${IMAGE_BASE_URL}/images/dish 1.jpg`;
            }}
          />
        </div>

        <div className="card-content">
          <div className="space-y-3">
            {/* Title */}
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-gray-300 text-sm line-clamp-3">
              {product.description}
            </p>

            {/* Customer-specific information */}
            {isCustomer && (
              <div className="space-y-2">
                {/* Price */}
                {product.price && (
                  <div className="text-xl font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </div>
                )}

                {/* Category and Stock */}
                <div className="flex items-center justify-between text-sm">
                  {product.category && (
                    <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs">
                      {product.category}
                    </span>
                  )}
                  {product.stock !== undefined && (
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.stock > 0
                          ? "bg-green-900/20 text-green-200"
                          : "bg-red-900/20 text-red-200"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* View Details Button */}
            <button className="w-full btn btn-outline btn-sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </button>

            {/* Created Date (for logged users) */}
            {isCustomer && product.createdAt && (
              <div className="text-xs text-gray-400 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Added {format(new Date(product.createdAt), "MMM dd, yyyy")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
