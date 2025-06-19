
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileImage, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CustomDesign = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designDescription: "",
    measurements: "",
    filamentType: "",
    additionalDetails: ""
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Files uploaded successfully!",
        description: `${newFiles.length} file(s) added to your request.`,
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let emailBody = `Hi Nick,

I would like to request a custom 3D print design:

Name: ${formData.name}
Email: ${formData.email}

Design Needed: ${formData.designDescription}
Measurements: ${formData.measurements || 'Not specified'}
Filament Type: ${formData.filamentType || 'No preference'}

Design Files: ${uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) attached` : 'No files attached - need design created from scratch'}

Additional Details:
${formData.additionalDetails}

Thank you!`;

    const subject = "Custom 3D Print Design Request";
    const emailUrl = `mailto:grovesn094@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.open(emailUrl);
    
    toast({
      title: "Email client opened!",
      description: "Please attach your design files manually in your email client before sending.",
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Custom Design Request
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us about your custom 3D printing project. Upload your design files or describe what you need created.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="designDescription">Design Description *</Label>
              <Textarea
                id="designDescription"
                required
                value={formData.designDescription}
                onChange={(e) => setFormData({...formData, designDescription: e.target.value})}
                placeholder="Describe what you need printed. Be as detailed as possible..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="measurements">Measurements</Label>
                <Input
                  id="measurements"
                  value={formData.measurements}
                  onChange={(e) => setFormData({...formData, measurements: e.target.value})}
                  placeholder="e.g., 10cm x 5cm x 2cm"
                />
              </div>
              <div>
                <Label htmlFor="filamentType">Filament Preference</Label>
                <Input
                  id="filamentType"
                  value={formData.filamentType}
                  onChange={(e) => setFormData({...formData, filamentType: e.target.value})}
                  placeholder="e.g., PLA, ABS, PETG"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fileUpload">Design Files</Label>
              <div className="mt-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('fileInput')?.click()}
                    >
                      Choose Files
                    </Button>
                    <input
                      id="fileInput"
                      type="file"
                      multiple
                      accept=".stl,.obj,.3mf,.ply,.amf,.step,.stp,.iges,.igs,.dwg,.dxf,.pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Upload STL, OBJ, images, or other design files
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileImage className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Textarea
                id="additionalDetails"
                value={formData.additionalDetails}
                onChange={(e) => setFormData({...formData, additionalDetails: e.target.value})}
                placeholder="Any other requirements, color preferences, deadline, etc..."
                className="min-h-[80px]"
              />
            </div>

            <div className="text-center">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg"
              >
                Send Request
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                This will open your email client. Remember to attach your files before sending!
              </p>
            </div>
          </form>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What happens next?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto">1</div>
                </div>
                <h3 className="font-semibold text-gray-900">Review</h3>
                <p className="text-gray-600 text-sm">We'll review your request and files within 24 hours</p>
              </div>
              <div>
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto">2</div>
                </div>
                <h3 className="font-semibold text-gray-900">Quote</h3>
                <p className="text-gray-600 text-sm">Get a detailed quote with timeline and pricing</p>
              </div>
              <div>
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto">3</div>
                </div>
                <h3 className="font-semibold text-gray-900">Create</h3>
                <p className="text-gray-600 text-sm">Your custom design gets printed with precision</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;
