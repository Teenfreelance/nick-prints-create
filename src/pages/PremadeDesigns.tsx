import { useState, useEffect } from "react";
import AdminLogin from "../components/AdminLogin";
import AdminPanel from "../components/AdminPanel";
const PremadeDesigns = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Default designs that will always be present
  const defaultDesigns = [{
    id: 1,
    name: "Robot Toy",
    price: "$24.99",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop",
    description: "Articulated robot toy with moveable joints, perfect for kids and collectors."
  }, {
    id: 2,
    name: "Modern Planter",
    price: "$18.99",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop",
    description: "Geometric planter design that adds a modern touch to any space."
  }, {
    id: 3,
    name: "Phone Stand",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=400&fit=crop",
    description: "Adjustable phone stand perfect for video calls and media viewing."
  }, {
    id: 4,
    name: "Desk Organizer",
    price: "$21.99",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop",
    description: "Multi-compartment organizer to keep your workspace tidy and efficient."
  }, {
    id: 5,
    name: "Cable Management",
    price: "$15.99",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop",
    description: "Smart cable management solution for a clean and organized setup."
  }, {
    id: 6,
    name: "Miniature Figurine",
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop",
    description: "Detailed miniature figurine perfect for gaming or display."
  }];
  const [designs, setDesigns] = useState(defaultDesigns);

  // Load designs from localStorage on component mount
  useEffect(() => {
    const savedDesigns = localStorage.getItem('premadeDesigns');
    if (savedDesigns) {
      try {
        const parsedDesigns = JSON.parse(savedDesigns);
        setDesigns(parsedDesigns);
      } catch (error) {
        console.error('Error parsing saved designs:', error);
        // If there's an error, fall back to default designs
        setDesigns(defaultDesigns);
      }
    }
  }, []);

  // Save designs to localStorage whenever designs change
  const handleUpdateDesigns = (newDesigns: typeof designs) => {
    setDesigns(newDesigns);
    localStorage.setItem('premadeDesigns', JSON.stringify(newDesigns));
  };
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  const handleOrderClick = (design: typeof designs[0]) => {
    const subject = `Order Request: ${design.name}`;
    const body = `Hi Nick,

I would like to order the following 3D print:

Product: ${design.name}
Price: ${design.price}
Description: ${design.description}

Please let me know the next steps for placing this order.

Thank you!`;
    const emailUrl = `mailto:grovesn094@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
  };
  return <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Premade Designs
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Browse our collection of ready-to-print designs. All items are professionally crafted and ready within 2-3 business days.</p>
        </div>

        {/* Admin Section */}
        {!isLoggedIn ? <div className="mb-8">
            <details className="max-w-md mx-auto">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 text-center">
                Owner Access
              </summary>
              <AdminLogin onLogin={handleLogin} />
            </details>
          </div> : <AdminPanel designs={designs} onUpdateDesigns={handleUpdateDesigns} onLogout={handleLogout} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {designs.map(design => <div key={design.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-square overflow-hidden">
                <img src={design.image} alt={design.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {design.name}
                  </h3>
                  <span className="text-2xl font-bold text-blue-600">
                    {design.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  {design.description}
                </p>
                <button onClick={() => handleOrderClick(design)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Order Now
                </button>
              </div>
            </div>)}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Don't see what you're looking for?
            </h2>
            <p className="text-gray-600 mb-6">
              We specialize in custom 3D printing! Contact us to discuss your unique project.
            </p>
            <a href="/contact" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Request Custom Design
            </a>
          </div>
        </div>
      </div>
    </div>;
};
export default PremadeDesigns;