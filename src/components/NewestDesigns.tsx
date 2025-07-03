import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Design {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string | null;
  square_payment_link: string | null;
  created_at: string;
}

const NewestDesigns = () => {
  const { data: newestDesigns = [], isLoading } = useQuery({
    queryKey: ['newest-designs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designs')
        .select('id, name, price, image, description, square_payment_link, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching newest designs:', error);
        throw error;
      }

      return data as Design[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

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

  if (isLoading) {
    return (
      <div className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">Loading newest designs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (newestDesigns.length === 0) {
    return null;
  }

  return (
    <div className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Newest Designs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Check out our latest 3D print designs, fresh from the workshop.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {newestDesigns.map(design => (
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
                  <span className="text-xl font-bold text-primary">
                    {design.price}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {design.description}
                </p>
                <button 
                  onClick={() => handleOrderClick(design)} 
                  className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/premade-designs" 
            className="inline-block bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors duration-200"
          >
            View All Designs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewestDesigns;