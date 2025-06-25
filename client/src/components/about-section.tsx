import { CheckCircle } from "lucide-react";
import teamPhotoPath from "@assets/image9.png";

export default function AboutSection() {
  const features = [
    {
      title: "Certified Expertise",
      description: "Factory-trained technicians with specialized hybrid knowledge"
    },
    {
      title: "Two Locations",
      description: "Service centers in both Harare and Bulawayo"
    },
    {
      title: "Quality Guarantee",
      description: "Comprehensive warranty on all parts and services"
    }
  ];

  return (
    <section id="about" className="py-20 bg-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 lg:mb-20">
          <div className="text-center lg:text-left">
            <span className="inline-block bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              ABOUT FADARC
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fadarc-black mb-6 sm:mb-8 leading-tight">
              Supplier of genuine parts
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Fadarc offers a range of high-quality products designed to enhance the appearance and perfomance of your vehicle. Our products are expertly crafted and tailored to fit your car perfectly.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start p-6 bg-gradient-to-r from-red-500 to-red-500 rounded-2xl hover:shadow-lg transition-all duration-300">
                  <div className="bg-gradient-to-br from-fadarc-red to-red-600 text-white p-3 rounded-xl mr-6 mt-1 shadow-lg">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-fadarc-black mb-2">{feature.title}</h3>
                    <p className="text-gray-900 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:pl-8">
            <div className="relative">
              <img 
                src={teamPhotoPath} 
                alt="Fadarc Motors team at Toyota parts exhibition" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
