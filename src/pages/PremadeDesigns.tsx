
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLogin from "../components/AdminLogin";
import AdminPanel from "../components/AdminPanel";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/formatPrice";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch designs from Supabase
  const { data: allDesigns = [], isLoading, error } = useQuery({
    queryKey: ['designs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designs')
        .select('id, name, price, image, description, square_payment_link, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching designs:', error);
        throw error;
      }

      return data as (Design & { created_at: string })[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Filter and search designs
  const filteredDesigns = allDesigns.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter !== "all") {
      const price = parseFloat(design.price.replace(/[^0-9.-]+/g, ""));
      if (priceFilter === "under20" && price >= 20) matchesPrice = false;
      if (priceFilter === "20to50" && (price < 20 || price > 50)) matchesPrice = false;
      if (priceFilter === "over50" && price <= 50) matchesPrice = false;
    }
    
    return matchesSearch && matchesPrice;
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
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground text-center">
                Owner Access
              </summary>
              <AdminLogin onLogin={handleLogin} />
            </details>
          </div>
        ) : (
          <AdminPanel designs={allDesigns} onUpdateDesigns={handleUpdateDesigns} onLogout={handleLogout} />
        )}

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under20">Under $20</SelectItem>
                  <SelectItem value="20to50">$20 - $50</SelectItem>
                  <SelectItem value="over50">Over $50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(searchQuery || priceFilter !== "all") && (
            <p className="text-center text-muted-foreground">
              Showing {filteredDesigns.length} of {allDesigns.length} designs
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">Loading designs...</p>
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || priceFilter !== "all" ? "No designs match your search criteria." : "No designs available yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDesigns.map(design => (
              <div key={design.id} className="bg-card rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="aspect-square overflow-hidden bg-muted">
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
                    <h3 className="text-xl font-semibold text-card-foreground">
                      {design.name}
                    </h3>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(design.price)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {design.description}
                  </p>
                  <button onClick={() => handleOrderClick(design)} className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <div className="bg-muted/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Don't see what you're looking for?
            </h2>
            <p className="text-muted-foreground mb-6">
              We specialize in custom 3D printing! Contact us to discuss your unique project.
            </p>
            <Link to="/custom-design" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200">
              Request Custom Design
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremadeDesigns;
