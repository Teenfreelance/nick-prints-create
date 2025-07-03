
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLogin from "../components/AdminLogin";
import AdminPanel from "../components/AdminPanel";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Design {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string | null;
  square_payment_link: string | null;
}

const PremadeDesigns = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch designs from Supabase
  const { data: designs = [], isLoading, error } = useQuery({
    queryKey: ['designs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designs')
        .select('id, name, price, image, description, square_payment_link')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching designs:', error);
        throw error;
      }

      return data as Design[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const handleUpdateDesigns = async (newDesigns: Design[]) => {
    // Refresh the query to get updated data from Supabase
    queryClient.invalidateQueries({ queryKey: ['designs'] });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleOrderClick = (design: Design) => {
    if (design.square_payment_link) {
      window.open(design.square_payment_link, '_blank');
    } else {
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
    }
  };

  useEffect(() => {
    if (error) {
      console.error('Query error:', error);
      toast({
        title: "Error loading designs",
        description: "Failed to load designs from the database.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen py-12">
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
        {!isLoggedIn ? (
          <div className="mb-8">
            <details className="max-w-md mx-auto">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 text-center">
                Owner Access
              </summary>
              <AdminLogin onLogin={handleLogin} />
            </details>
          </div>
        ) : (
          <AdminPanel designs={designs} onUpdateDesigns={handleUpdateDesigns} onLogout={handleLogout} />
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading designs...</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No designs available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map(design => (
              <div key={design.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={design.image} 
                    alt={design.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop';
                    }}
                  />
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
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Don't see what you're looking for?
            </h2>
            <p className="text-gray-600 mb-6">
              We specialize in custom 3D printing! Contact us to discuss your unique project.
            </p>
            <Link to="/custom-design" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Request Custom Design
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremadeDesigns;
