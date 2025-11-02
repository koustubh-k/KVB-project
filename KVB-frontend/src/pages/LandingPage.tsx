import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Package, BarChart3, Shield } from "lucide-react";
import { motion } from "motion/react";
import { ImagesSlider } from "../components/ui/images-slider";

const LandingPage: React.FC = () => {
  const images = [
    "/images/dish 1.jpg",
    "/images/dish 2.jpg",
    "/images/dish 3.webp",
    "/images/dish 4.png",
    "/images/dish 5.jpg",
    "/images/dryer 1.jpg",
    "/images/dryer 2.jpg",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ImagesSlider
        className="h-[40rem] w-full"
        images={images}
        overlayClassName="bg-black/60"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: -80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="z-50 flex flex-col justify-center items-center container mx-auto px-4 text-center text-white"
        >
          <h1 className="text-5xl font-bold mb-6">KVB Management System</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Streamline your business operations with our comprehensive
            management solution. Manage products, customers, workers, and tasks
            all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/crm"
              className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100"
            >
              View Products <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/signup"
              className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      </ImagesSlider>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything You Need to Manage Your Business
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our platform provides powerful tools for different user roles to
              collaborate effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Customer Portal */}
            <div className="card text-center">
              <div className="card-content">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Customer Portal
                </h3>
                <p className="text-gray-300">
                  Browse products, view detailed information, and manage your
                  account.
                </p>
              </div>
            </div>

            {/* Product Management */}
            <div className="card text-center">
              <div className="card-content">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Product Management
                </h3>
                <p className="text-gray-300">
                  Comprehensive product catalog with inventory tracking and
                  specifications.
                </p>
              </div>
            </div>

            {/* Task Management */}
            <div className="card text-center">
              <div className="card-content">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Task Management
                </h3>
                <p className="text-gray-300">
                  Jira-style task tracking with progress monitoring and team
                  collaboration.
                </p>
              </div>
            </div>

            {/* Admin Dashboard */}
            <div className="card text-center">
              <div className="card-content">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Admin Dashboard
                </h3>
                <p className="text-gray-300">
                  Complete control over users, products, and system-wide
                  settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using our platform to
            streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Create Account
            </Link>
            <Link to="/crm" className="btn btn-outline btn-lg">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
