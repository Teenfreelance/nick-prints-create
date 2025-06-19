
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Bring Your Ideas to Life?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Whether you need a custom design or want to browse our premade collection, 
          we're here to help you create something amazing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Get Started Today
          </Link>
          <Link
            to="/premade-designs"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
          >
            View Our Designs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
