import { Button } from "@/components/ui/button";
import fadarcBannerPath from "@assets/image_1750840247088.png";

export default function HeroSection() {

  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-fadarc-black text-white min-h-screen flex items-center">
      {/* Background overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
      
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${fadarcBannerPath})`
        }}
      ></div>
      
      <div className="relative max-w-3xl mx-auto px-2 sm:px-2 lg:px-4 z-20 py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-block bg-fadarc-red text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                GENUINE OEM PARTS
              </span>
              <h1 className="text-5xl font-bold leading-tight">
                Hybrid Battery
                <span className="block text-fadarc-red">Specialists</span>
              </h1>
            </div>
            <p className="text-1g sm:text-xl mb-6 text-gray-300 leading-relaxed max-w-6xl mx-auto lg:mx-0">
              Serving Zimbabwe with quality parts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4"> 
              <Button 
                onClick={scrollToServices}
                variant="outline"
                className="bg-fadarc-red text-white px-4 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                size="lg"
              >
                View Models
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
