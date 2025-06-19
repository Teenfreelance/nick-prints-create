
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Design {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

interface AdminPanelProps {
  designs: Design[];
  onUpdateDesigns: (designs: Design[]) => void;
  onLogout: () => void;
}

const AdminPanel = ({ designs, onUpdateDesigns, onLogout }: AdminPanelProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDesign, setNewDesign] = useState({
    name: "",
    price: "",
    image: "",
    description: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (file: File, isNewDesign: boolean = false, designId?: number) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      if (isNewDesign) {
        setNewDesign({...newDesign, image: imageUrl});
      } else if (designId) {
        onUpdateDesigns(
          designs.map(d => d.id === designId ? { ...d, image: imageUrl } : d)
        );
        setEditingId(null);
      }
      
      toast({
        title: "Image uploaded successfully!",
        description: "The image has been added to the design.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddDesign = () => {
    if (newDesign.name && newDesign.price) {
      const design: Design = {
        id: Math.max(...designs.map(d => d.id), 0) + 1,
        ...newDesign
      };
      onUpdateDesigns([...designs, design]);
      setNewDesign({ name: "", price: "", image: "", description: "" });
      setShowAddForm(false);
      toast({
        title: "Design added successfully!",
        description: `${design.name} has been added to your catalog.`,
      });
    }
  };

  const handleDeleteDesign = (id: number) => {
    const designToDelete = designs.find(d => d.id === id);
    onUpdateDesigns(designs.filter(d => d.id !== id));
    toast({
      title: "Design deleted",
      description: `${designToDelete?.name} has been removed from your catalog.`,
    });
  };

  const handleUpdateDesign = (id: number, updatedDesign: Partial<Design>) => {
    onUpdateDesigns(
      designs.map(d => d.id === id ? { ...d, ...updatedDesign } : d)
    );
    setEditingId(null);
    toast({
      title: "Design updated",
      description: "The design has been successfully updated.",
    });
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
              <Input
                id="price"
                value={newDesign.price}
                onChange={(e) => setNewDesign({...newDesign, price: e.target.value})}
                placeholder="$00.00"
              />
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
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newDesign.description}
                onChange={(e) => setNewDesign({...newDesign, description: e.target.value})}
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
    description: design.description
  });

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
      <Input
        value={editData.name}
        onChange={(e) => setEditData({...editData, name: e.target.value})}
        placeholder="Name"
      />
      <Input
        value={editData.price}
        onChange={(e) => setEditData({...editData, price: e.target.value})}
        placeholder="Price"
      />
      <div className="flex gap-2">
        <Input
          value={editData.image}
          onChange={(e) => setEditData({...editData, image: e.target.value})}
          placeholder="Image URL"
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
      <Input
        value={editData.description}
        onChange={(e) => setEditData({...editData, description: e.target.value})}
        placeholder="Description"
      />
      <div className="flex gap-2 md:col-span-2">
        <Button onClick={() => onSave(editData)} size="sm">Save</Button>
        <Button onClick={onCancel} variant="outline" size="sm">Cancel</Button>
      </div>
    </div>
  );
};

export default AdminPanel;
