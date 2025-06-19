
const Features = () => {
  const features = [
    {
      title: "Precision Engineering",
      description: "Every print is crafted with meticulous attention to detail using state-of-the-art 3D printing technology.",
      icon: "🎯"
    },
    {
      title: "Custom Designs",
      description: "Bring your unique ideas to life with our custom 3D printing services tailored to your specifications.",
      icon: "🎨"
    },
    {
      title: "Quality Materials",
      description: "We use only the finest printing materials to ensure durability and professional finish.",
      icon: "⭐"
    },
    {
      title: "Fast Turnaround",
      description: "Quick and efficient service without compromising on quality. Most orders completed within 3-5 days.",
      icon: "⚡"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Nick 3D Prints?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We combine cutting-edge technology with creative expertise to deliver exceptional 3D printing results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
