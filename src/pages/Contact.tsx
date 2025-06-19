
import { Phone, Mail, ArrowUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    design: "",
    measurements: "",
    filament: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create email with form data
    const subject = `Design Request from ${formData.name}`;
    const body = `Hi Nick,

I would like to request a 3D print design:

Name: ${formData.name}
Email: ${formData.email}
Design Needed: ${formData.design}
Measurements: ${formData.measurements || 'Not specified'}
Filament Type: ${formData.filament || 'Not specified'}

Additional Details:
${formData.message}

Thank you!`;

    const emailUrl = `mailto:grovesn094@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);

    toast({
      title: "Request Sent!",
      description: "Your email client should open with the design request. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", design: "", measurements: "", filament: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Need a custom 3D print? Contact us with your design needs, 
            measurements, and any specific requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a
                      href="tel:463-246-5568"
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      463-246-5568
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a
                      href="mailto:grovesn094@gmail.com"
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      grovesn094@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Custom 3D Printing?</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-2">
                  <ArrowUp className="text-blue-600 transform rotate-45" size={16} />
                  <span>Bring your unique ideas to life</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowUp className="text-blue-600 transform rotate-45" size={16} />
                  <span>Perfect fit for your specific needs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowUp className="text-blue-600 transform rotate-45" size={16} />
                  <span>Professional quality and finish</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowUp className="text-blue-600 transform rotate-45" size={16} />
                  <span>Competitive pricing and fast turnaround</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Design Request</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="design" className="block text-sm font-medium text-gray-700 mb-2">
                  What Design Do You Need? *
                </label>
                <input
                  type="text"
                  id="design"
                  name="design"
                  required
                  value={formData.design}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Custom phone case, replacement part, figurine..."
                />
              </div>

              <div>
                <label htmlFor="measurements" className="block text-sm font-medium text-gray-700 mb-2">
                  Measurements
                </label>
                <input
                  type="text"
                  id="measurements"
                  name="measurements"
                  value={formData.measurements}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., 10cm x 5cm x 2cm"
                />
              </div>

              <div>
                <label htmlFor="filament" className="block text-sm font-medium text-gray-700 mb-2">
                  Filament Type (if known)
                </label>
                <select
                  id="filament"
                  name="filament"
                  value={formData.filament}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select filament type</option>
                  <option value="PLA">PLA</option>
                  <option value="ABS">ABS</option>
                  <option value="PETG">PETG</option>
                  <option value="TPU">TPU (Flexible)</option>
                  <option value="Other">Other</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Any additional details, color preferences, special requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Send Request
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4 text-center">
              * We'll get back to you with details about your custom design request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
