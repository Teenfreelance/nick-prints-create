
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Design {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string | null;
}

interface AdminPanelProps {
  designs: Design[];
  onUpdateDesigns: (designs: Design[]) => void;
  onLogout: () => void;
}

const AdminPanel = ({ designs, onUpdateDesigns, onLogout }: AdminPanelProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDesign, setNewDesign] = useState({
    name: "",
    price: "",
    image: "",
    description: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleImageUpload = (file: File, isNewDesign: boolean = false, designId?: string) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      
      if (isNewDesign) {
        setNewDesign({...newDesign, image: imageUrl});
      } else if (designId) {
        await handleUpdateDesign(designId, { image: imageUrl });
      }
      
      toast({
        title: "Image uploaded successfully!",
        description: "The image has been added to the design.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddDesign = async () => {
    if (newDesign.name && newDesign.price) {
      try {
        console.log('Adding new design:', newDesign);
        // Format price with $ symbol
        const formattedPrice = newDesign.price.startsWith('$') ? newDesign.price : `$${newDesign.price}`;
        
        const { data, error } = await supabase
          .from('designs')
          .insert([{
            name: newDesign.name,
            price: formattedPrice,
            image: newDesign.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
            description: newDesign.description
          }])
          .select();

        if (error) {
          console.error('Error adding design:', error);
          throw error;
        }

        console.log('Design added successfully:', data);
        setNewDesign({ name: "", price: "", image: "", description: "" });
        setShowAddForm(false);
        queryClient.invalidateQueries({ queryKey: ['designs'] });
        
        toast({
          title: "Design added successfully!",
          description: `${newDesign.name} has been added to your catalog.`,
        });
      } catch (error) {
        console.error('Failed to add design:', error);
        toast({
          title: "Error adding design",
          description: "Failed to add the design to the database.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteDesign = async (id: string) => {
    try {
      console.log('Deleting design:', id);
      const designToDelete = designs.find(d => d.id === id);
      
      const { error } = await supabase
        .from('designs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting design:', error);
        throw error;
      }

      console.log('Design deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['designs'] });
      
      toast({
        title: "Design deleted",
        description: `${designToDelete?.name} has been removed from your catalog.`,
      });
    } catch (error) {
      console.error('Failed to delete design:', error);
      toast({
        title: "Error deleting design",
        description: "Failed to delete the design from the database.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDesign = async (id: string, updatedDesign: Partial<Design>) => {
    try {
      console.log('Updating design:', id, updatedDesign);
      const { error } = await supabase
        .from('designs')
        .update(updatedDesign)
        .eq('id', id);

      if (error) {
        console.error('Error updating design:', error);
        throw error;
      }

      console.log('Design updated successfully');
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['designs'] });
      
      toast({
        title: "Design updated",
        description: "The design has been successfully updated.",
      });
    } catch (error) {
      console.error('Failed to update design:', error);
      toast({
        title: "Error updating design",
        description: "Failed to update the design in the database.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        <Button onClick={onLogout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="mb-6">
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Design
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Design</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newDesign.name}
                onChange={(e) => setNewDesign({...newDesign, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="price"
                  value={newDesign.price.replace('$', '')}
                  onChange={(e) => setNewDesign({...newDesign, price: e.target.value})}
                  placeholder="24.99"
                  className="pl-7"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  value={newDesign.image}
                  onChange={(e) => setNewDesign({...newDesign, image: e.target.value})}
                  placeholder="https://... or upload below"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('new-design-upload')?.click()}
                >
                  <Upload size={16} />
                </Button>
                <input
                  id="new-design-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, true);
                  }}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={newDesign.description}
                onChange={(e) => setNewDesign({...newDesign, description: e.target.value})}
                placeholder="Enter product description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddDesign}>Add Design</Button>
            <Button onClick={() => setShowAddForm(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {designs.map((design) => (
          <div key={design.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <img 
              src={design.image} 
              alt={design.name}
              className="w-16 h-16 object-cover rounded"
            />
            {editingId === design.id ? (
              <EditForm 
                design={design} 
                onSave={(updated) => handleUpdateDesign(design.id, updated)}
                onCancel={() => setEditingId(null)}
                onImageUpload={(file) => handleImageUpload(file, false, design.id)}
              />
            ) : (
              <>
                <div className="flex-1">
                  <h4 className="font-semibold">{design.name}</h4>
                  <p className="text-gray-600">{design.price}</p>
                  <p className="text-sm text-gray-500">{design.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setEditingId(design.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    onClick={() => handleDeleteDesign(design.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EditForm = ({ design, onSave, onCancel, onImageUpload }: {
  design: Design;
  onSave: (design: Partial<Design>) => void;
  onCancel: () => void;
  onImageUpload: (file: File) => void;
}) => {
  const [editData, setEditData] = useState({
    name: design.name,
    price: design.price,
    image: design.image,
    description: design.description || ""
  });

  return (
    <div className="flex-1 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label className="text-sm font-medium">Name</Label>
          <Input
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
            placeholder="Product name"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              value={editData.price.replace('$', '')}
              onChange={(e) => setEditData({...editData, price: e.target.value})}
              placeholder="24.99"
              className="pl-7"
              type="number"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Image URL</Label>
        <div className="flex gap-2">
          <Input
            value={editData.image}
            onChange={(e) => setEditData({...editData, image: e.target.value})}
            placeholder="https://example.com/image.jpg"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById(`edit-upload-${design.id}`)?.click()}
          >
            <Upload size={14} />
          </Button>
          <input
            id={`edit-upload-${design.id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageUpload(file);
            }}
          />
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Description</Label>
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({...editData, description: e.target.value})}
          placeholder="Product description..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={2}
        />
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button onClick={() => onSave({...editData, price: editData.price.startsWith('$') ? editData.price : `$${editData.price}`})} size="sm">Save</Button>
        <Button onClick={onCancel} variant="outline" size="sm">Cancel</Button>
      </div>
    </div>
  );
};

export default AdminPanel;
