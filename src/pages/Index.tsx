
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import ProductCarousel from '@/components/ProductCarousel';
import RootCategoryCard from '@/components/RootCategoryCard';
import { fetchFeaturedProducts, fetchDeals, fetchNewArrivals, getCategories, getRootCategories } from '@/data/mockData';

const Index = () => {
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dailyDeals, setDailyDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const rootCategories = getRootCategories();
  const categories = getCategories();

  useEffect(() => {
    // Fetch data on component mount
    setFeaturedProducts(fetchFeaturedProducts());
    setDailyDeals(fetchDeals());
    setNewArrivals(fetchNewArrivals());
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get('email') as string;
    
    if (email) {
      toast({
        title: "Newsletter Subscription",
        description: "Thank you for subscribing to our newsletter!",
      });
      form.reset();
    }
  };

  return (
    <div>
      {/* Hero Carousel */}
      <section className="hero-section mb-12">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <div className="hero-slide relative h-[400px] rounded-lg overflow-hidden">
                <img 
                  src="https://source.unsplash.com/random/1200x400/?electronics" 
                  alt="Electronics deals" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                  <div className="text-white p-8 max-w-md">
                    <h1 className="text-4xl font-bold mb-4">Βρες την καλύτερη τιμή</h1>
                    <p className="mb-6">Συγκρίνε τιμές, χαρακτηριστικά & αξιολογήσεις και βρες την καλύτερη τιμή για χιλιάδες προϊόντα!</p>
                    <Link to="/deals" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
                      Δες τις προσφορές
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="hero-slide relative h-[400px] rounded-lg overflow-hidden">
                <img 
                  src="https://source.unsplash.com/random/1200x400/?smartphone" 
                  alt="Smartphone deals" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                  <div className="text-white p-8 max-w-md">
                    <h1 className="text-4xl font-bold mb-4">Τα καλύτερα Smartphones</h1>
                    <p className="mb-6">Ανακάλυψε τα νέα μοντέλα στις καλύτερες τιμές της αγοράς!</p>
                    <Link to="/categories/c1" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
                      Δες τα Smartphones
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Main Categories Section */}
      <section className="main-categories mb-12">
        <h2 className="text-2xl font-bold mb-6">Κύριες Κατηγορίες</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-categories__verticals">
          {rootCategories.map((category) => (
            <RootCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Daily Deals Section */}
      <ProductCarousel title="Προσφορές Ημέρας" products={dailyDeals} />

      {/* New Arrivals Section */}
      <ProductCarousel title="Νέες Αφίξεις" products={newArrivals} />

      {/* Popular Categories */}
      <section className="popular-categories mb-12">
        <h2 className="text-2xl font-bold mb-6">Δημοφιλείς Κατηγορίες</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((category) => (
            <Link 
              key={category.id} 
              to={`/categories/${category.id}`} 
              className="bg-muted/50 rounded-lg p-4 text-center hover:bg-muted transition-colors"
            >
              <div className="font-medium">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter bg-muted/30 rounded-lg p-8 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Εγγραφή στο Newsletter</h2>
          <p className="text-muted-foreground mb-6">
            Μάθε πρώτος για νέα προϊόντα και προσφορές που σε ενδιαφέρουν.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              name="email"
              placeholder="Το email σου" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
            <button 
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Εγγραφή
            </button>
          </form>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="blog-posts mb-12">
        <h2 className="text-2xl font-bold mb-6">Πρόσφατα Άρθρα</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <Card key={id} className="overflow-hidden">
              <img 
                src={`https://source.unsplash.com/random/400x200/?tech&sig=${id}`} 
                alt={`Blog post ${id}`} 
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Τεχνολογικά Νέα {id}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum.
                </p>
                <Link to="/blog" className="text-primary hover:underline text-sm">
                  Διαβάστε περισσότερα
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
