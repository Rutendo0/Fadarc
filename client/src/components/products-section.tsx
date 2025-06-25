import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Battery, Wrench, Settings } from "lucide-react";
import { Product } from "@shared/schema";

const categories = [
  { name: "Toyota Hybrid Batteries", icon: Battery, description: "Aqua, Camry, Alphard,Sienta, Auris, CHR" },
  { name: "Honda Hybrid Batteries", icon: Battery, description: "Vezel, GP5, GP6, GP7" },
  { name: "Nissan Hybrid Batteries", icon: Battery, description: " Note 2019" },
  { name: "Gear Boxes", icon: Settings, description: "Honda Gp5, Toyota Aqua, Honda vezel, Nissan Xtrail T32" },
  { name: "Installation Service", icon: Wrench, description: "Professional fitting" }
];

export default function ProductsSection() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });



  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-red-400 to-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-fadarc-black mb-6">Featured Products</h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto leading-relaxed">
            We are a distinguished provider of authentic Engines, Gear boxes and accessories in Zimbabwe.
          </p>
        </div>
        
        {/* Product Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className="group bg-white rounded-2xl p-4 sm:p-6 lg:p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer border-0 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-fadarc-red to-red-900 text-white w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                </div>
                <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-fadarc-black mb-2 sm:mb-3 group-hover:text-fadarc-red transition-colors">{category.name}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">{category.description}</p>
              </div>
            );
          })}
        </div>
        
        {/* Featured Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <Skeleton className="w-full h-56" />
                <CardContent className="p-8">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-6" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-28" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : products && products.length > 0 ? (
            products.slice(0, 8).map((product) => (
              <Card key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"} 
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-fadarc-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                    OEM Quality
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-fadarc-black mb-3 group-hover:text-fadarc-red transition-colors leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Professional installation available</p>
                    </div>
                    <Button 
                      onClick={scrollToContact}
                      className="bg-gradient-to-br from-fadarc-red to-red-900 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-fadarc-red transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No products available at the moment.</p>
            </div>
          )}
        </div>
        
        {/* Additional Product Showcase */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-white via-white to-white rounded-2xl p-10 text-gray-900 shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold mb-6">Complete Hybrid Solutions</h3>
              <p className="text-xl mb-5 leading-relaxed opacity-95">
                From hybrid batteries to complete engine assemblies, we stock genuine OEM parts for all major hybrid vehicle brands. 
                Professional installation and diagnostic services available at both locations.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-red-200 backdrop-blur-sm rounded-xl p-6">
                  <Battery className="w-8 h-8 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Batteries & Motors</h4>
                  <p className="text-sm opacity-90">Complete hybrid powertrain components</p>
                </div>
                <div className="bg-red-200 backdrop-blur-sm rounded-xl p-6">
                  <Car className="w-8 h-8 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Body & Interior</h4>
                  <p className="text-sm opacity-90">Genuine exterior and interior parts</p>
                </div>
                <div className="bg-red-200 backdrop-blur-sm rounded-xl p-6">
                  <Wrench className="w-8 h-8 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Service & Repair</h4>
                  <p className="text-sm opacity-90">Professional fitting and diagnosis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
