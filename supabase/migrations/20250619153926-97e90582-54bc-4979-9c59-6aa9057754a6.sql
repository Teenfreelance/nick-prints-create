
-- Create a table for premade designs
CREATE TABLE public.designs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view designs (public)
CREATE POLICY "Anyone can view designs" 
  ON public.designs 
  FOR SELECT 
  USING (true);

-- Create policy that allows anyone to insert designs (for admin functionality)
-- In a real app, you'd want to restrict this to admin users only
CREATE POLICY "Anyone can create designs" 
  ON public.designs 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows anyone to update designs
CREATE POLICY "Anyone can update designs" 
  ON public.designs 
  FOR UPDATE 
  USING (true);

-- Create policy that allows anyone to delete designs
CREATE POLICY "Anyone can delete designs" 
  ON public.designs 
  FOR DELETE 
  USING (true);

-- Insert the default designs
INSERT INTO public.designs (name, price, image, description) VALUES
('Robot Toy', '$24.99', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop', 'Articulated robot toy with moveable joints, perfect for kids and collectors.'),
('Modern Planter', '$18.99', 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop', 'Geometric planter design that adds a modern touch to any space.'),
('Phone Stand', '$12.99', 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400&h=400&fit=crop', 'Adjustable phone stand perfect for video calls and media viewing.'),
('Desk Organizer', '$21.99', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop', 'Multi-compartment organizer to keep your workspace tidy and efficient.'),
('Cable Management', '$15.99', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop', 'Smart cable management solution for a clean and organized setup.'),
('Miniature Figurine', '$19.99', 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop', 'Detailed miniature figurine perfect for gaming or display.');
