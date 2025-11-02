import React, { useState } from "react";
import {
  X,
  Package,
  DollarSign,
  Calendar,
  Tag,
  Layers,
  Info,
  Send,
  Upload,
  File,
  X as XIcon,
} from "lucide-react";
import { Product } from "@/types";
import { format } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from "@/contexts/AuthContext";
import { customerAPI } from "@/lib/api";

interface ProductModalProps {
  product: Product;
  isCustomer: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isCustomer,
  onClose,
}) => {
  const { user } = useAuth();
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    message: "",
    region: (user as any)?.region || "Central",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const images =
    product.images ||
    (product.image ? [product.image] : ["/images/dish 1.jpg"]);
  const displayImages = images.length > 0 ? images : ["/images/dish 1.jpg"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + attachments.length > 5) {
      alert("Maximum 5 files allowed");
      return;
    }
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryData.message.trim()) {
      alert("Please enter a message");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("productId", product._id);
      formData.append("message", enquiryData.message);
      formData.append("region", enquiryData.region);

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await customerAPI.submitEnquiry(formData);

      setSubmitSuccess(true);
      setTimeout(() => {
        setShowEnquiryForm(false);
        setSubmitSuccess(false);
        setEnquiryData({
          message: "",
          region: (user as any)?.region || "Central",
        });
        setAttachments([]);
      }, 2000);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Images Carousel */}
            <div className="space-y-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {displayImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="eager"
                          onError={(e) => {
                            e.currentTarget.src = "/images/dish 1.jpg";
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {displayImages.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
              </Carousel>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-primary-600" />
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Customer-specific details */}
              {isCustomer && (
                <>
                  {/* Price */}
                  {product.price && (
                    <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center mb-2">
                        <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          Price
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-primary-600">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  )}

                  {/* Category and Stock */}
                  <div className="border-t pt-4 border-gray-200 dark:border-gray-700 space-y-3">
                    {product.category && (
                      <div className="flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Category:
                        </span>
                        <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                          {product.category}
                        </span>
                      </div>
                    )}

                    {product.stock !== undefined && (
                      <div className="flex items-center">
                        <Layers className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Stock:
                        </span>
                        <span
                          className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                            product.stock > 0
                              ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                              : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} available`
                            : "Out of stock"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Specifications */}
                  {product.specifications &&
                    Object.keys(product.specifications).length > 0 && (
                      <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Specifications
                        </h3>
                        <div className="grid grid-cols-1 gap-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          {Object.entries(product.specifications).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-600 last:border-0"
                              >
                                <span className="text-gray-600 dark:text-gray-400 font-medium capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:
                                </span>
                                <span className="text-gray-900 dark:text-white">
                                  {value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Dates */}
                  <div className="border-t pt-4 border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    {product.createdAt && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Added: {format(new Date(product.createdAt), "PPP")}
                        </span>
                      </div>
                    )}
                    {product.updatedAt &&
                      product.updatedAt !== product.createdAt && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            Updated:{" "}
                            {format(new Date(product.updatedAt), "PPP")}
                          </span>
                        </div>
                      )}
                  </div>
                </>
              )}

              {/* Call to action for non-customers */}
              {!isCustomer && (
                <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
                      Want to see more details?
                    </h4>
                    <p className="text-primary-700 dark:text-primary-300 text-sm mb-3">
                      Sign in as a customer to view pricing, specifications, and
                      availability.
                    </p>
                    <a href="/login" className="btn btn-primary btn-sm">
                      Sign In
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        {showEnquiryForm && isCustomer && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Submit Enquiry
            </h3>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="text-green-600 dark:text-green-400 mb-2">
                  <Send className="w-12 h-12 mx-auto" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Enquiry Submitted Successfully!
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                {/* Region Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    value={enquiryData.region}
                    onChange={(e) =>
                      setEnquiryData({ ...enquiryData, region: e.target.value })
                    }
                    className="input"
                    required
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={enquiryData.message}
                    onChange={(e) =>
                      setEnquiryData({
                        ...enquiryData,
                        message: e.target.value,
                      })
                    }
                    placeholder="Tell us about your requirements..."
                    className="input h-32 resize-none"
                    required
                  />
                </div>

                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload files
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Max 5 files, 10MB each
                        </p>
                      </div>
                    </label>

                    {/* Attachment List */}
                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <File className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEnquiryForm(false)}
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Enquiry
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
            {isCustomer && !showEnquiryForm && (
              <button
                onClick={() => setShowEnquiryForm(true)}
                className="btn btn-primary"
              >
                <Send className="w-4 h-4 mr-2" />
                Contact Sales
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
