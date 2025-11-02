import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Package,
  DollarSign,
  Star,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { productsAPI, customerAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { GlowingEffect } from "@/components/ui/glowing-effect";

type TabType = "products" | "projects";

const CRMPage: React.FC = () => {
  const { user, userType } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const isCustomer = userType === "customer";

  // Fetch products based on user type
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>(
    ["products", isCustomer],
    () =>
      isCustomer
        ? productsAPI.getCustomerProducts().then((res) => res.data)
        : productsAPI.getPublicProducts().then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      enabled: activeTab === "products" || !isCustomer,
    }
  );

  // Fetch customer projects/enquiries
  const { data: projects } = useQuery(
    "customer-projects",
    () => customerAPI.getProjects().then((res) => res.data.projects),
    {
      enabled: isCustomer && activeTab === "projects",
    }
  );

  // Filter products based on search term
  const filteredProducts =
    products?.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleProductClick = async (productId: string) => {
    try {
      const response = isCustomer
        ? await productsAPI.getCustomerProductById(productId)
        : await productsAPI.getPublicProductById(productId);
      setSelectedProduct(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <Package className="w-12 h-12 mx-auto mb-2 text-red-400" />
          <p className="text-lg font-semibold text-white">
            Failed to load products
          </p>
        </div>
        <p className="text-gray-300">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isCustomer ? "Customer Portal" : "Public Products"}
            </h1>
            <p className="text-gray-300 mt-2">
              {isCustomer
                ? "Browse products and track your project status"
                : "Discover our products. Sign in as a customer to see detailed information and pricing"}
            </p>
          </div>
          {!user && (
            <div className="mt-4 sm:mt-0">
              <a href="/login" className="btn btn-primary">
                Sign In for More Details
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Customer Tabs */}
      {isCustomer && (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 mb-6">
          <nav className="flex space-x-8 px-6" aria-label="Customer Tabs">
            <button
              onClick={() => setActiveTab("products")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === "products"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === "projects"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>My Projects</span>
            </button>
          </nav>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "products" && (
        <>
          {/* Filters and Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-300">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No products available at the moment"}
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isCustomer={isCustomer}
                  viewMode={viewMode}
                  onClick={() => handleProductClick(product._id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Projects Section */}
      {activeTab === "projects" && isCustomer && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">My Projects</h2>
            <div className="text-sm text-gray-400">
              {projects?.length || 0} project
              {(projects?.length || 0) !== 1 ? "s" : ""}
            </div>
          </div>

          {!projects || projects.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No projects yet
              </h3>
              <p className="text-gray-300">
                Your submitted enquiries and project requests will appear here
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {projects.map((project: any) => {
                const getStatusIcon = (status: string) => {
                  switch (status) {
                    case "pending":
                      return <Clock className="w-5 h-5 text-yellow-500" />;
                    case "in-progress":
                      return <AlertCircle className="w-5 h-5 text-blue-500" />;
                    case "completed":
                      return <CheckCircle className="w-5 h-5 text-green-500" />;
                    case "cancelled":
                      return <XCircle className="w-5 h-5 text-red-500" />;
                    default:
                      return <Clock className="w-5 h-5 text-gray-500" />;
                  }
                };

                const getStatusColor = (status: string) => {
                  switch (status) {
                    case "pending":
                      return "bg-yellow-900 text-yellow-200";
                    case "in-progress":
                      return "bg-blue-900 text-blue-200";
                    case "completed":
                      return "bg-green-900 text-green-200";
                    case "cancelled":
                      return "bg-red-900 text-red-200";
                    default:
                      return "bg-gray-700 text-gray-200";
                  }
                };

                return (
                  <div key={project._id} className="relative">
                    <GlowingEffect
                      spread={40}
                      glow={true}
                      disabled={false}
                      proximity={64}
                      inactiveZone={0.01}
                      borderWidth={3}
                      className="rounded-lg"
                    />
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {project.title || "Project Request"}
                          </h3>
                          <p className="text-gray-300 text-sm mb-3">
                            {project.description}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {getStatusIcon(project.status)}
                          <span className="ml-2 capitalize">
                            {project.status}
                          </span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Product:</span>
                          <div className="text-white font-medium">
                            {project.product?.name || "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Submitted:</span>
                          <div className="text-white">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Last Updated:</span>
                          <div className="text-white">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {project.attachments &&
                        project.attachments.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <span className="text-gray-400 text-sm">
                              Attachments:
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.attachments.map(
                                (attachment: any, index: number) => (
                                  <a
                                    key={index}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600 transition-colors"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    {attachment.filename}
                                  </a>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isCustomer={isCustomer}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default CRMPage;
