
import { Phone, Mail, ArrowUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create email with form data
    const subject = `Quote Request from ${formData.name}`;
    const body = `Hi Nick,

I would like to request a quote for a 3D printing project:

Name: ${formData.name}
Email: ${formData.email}
Project Type: ${formData.project || 'Not specified'}

Project Details:
${formData.message}

Please provide a quote and timeline for this project.

Thank you!`;

    const emailUrl = `mailto:grovesn094@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);

    toast({
      title: "Quote Request Sent!",
      description: "Your email client should open with the quote request. We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", project: "", message: "" });
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
            Ready to start your 3D printing project? Contact us for custom orders, 
            quotes, or any questions about our services.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Request a Quote</h2>
            
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
                <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select a project type</option>
                  <option value="custom-design">Custom Design</option>
                  <option value="prototype">Prototype</option>
                  <option value="replacement-part">Replacement Part</option>
                  <option value="miniature">Miniature/Figurine</option>
                  <option value="functional-print">Functional Print</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Please describe your project in detail. Include dimensions, materials, quantity, timeline, and any special requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Send Quote Request
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4 text-center">
              * We typically respond within 24 hours with a detailed quote and timeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
