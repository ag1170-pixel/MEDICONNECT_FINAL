import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Calendar, Shield, Award, Clock, TestTube, Filter, Star, AlertCircle, FlaskConical, X, Plus, Home, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { mockLabTests, labTestCategories, type LabTest } from "@/data/medicineData";
import { motion, AnimatePresence } from "framer-motion";

export default function LabTests() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { addItem, setIsOpen } = useCart();
  const [filteredTests, setFilteredTests] = useState<LabTest[]>(mockLabTests);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  useEffect(() => {
    let filtered = [...mockLabTests];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(test =>
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(test => test.category === selectedCategory);
    }

    // Sorting
    if (sortBy === 'price_low') {
      filtered.sort((a, b) => (a.discounted_price || a.price) - (b.discounted_price || b.price));
    } else if (sortBy === 'price_high') {
      filtered.sort((a, b) => (b.discounted_price || b.price) - (a.discounted_price || a.price));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'report_time') {
      filtered.sort((a, b) => a.report_time.localeCompare(b.report_time));
    } else {
      filtered.sort((a, b) => b.reviews_count - a.reviews_count);
    }

    setFilteredTests(filtered);
  }, [searchQuery, selectedCategory, sortBy]);

  const handleBookTest = (test: LabTest) => {
    addItem({
      id: test.id,
      name: test.name,
      price: test.discounted_price || test.price,
      quantity: 1,
      type: 'lab test',
      category: test.category
    });
    
    toast({
      title: "Test added to cart",
      description: `${test.name} has been added to your cart.`,
    });
    setIsOpen(true);
  };

  const handleViewDetails = (test: LabTest) => {
    setSelectedTest(test);
  };

  const LabTestDetailModal = () => {
    if (!selectedTest) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedTest(null)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedTest(null)}
              className="absolute right-4 top-4 z-10"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <TestTube className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedTest.name}</h2>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="capitalize">
                      {selectedTest.category}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{selectedTest.rating}</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({selectedTest.reviews_count} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {selectedTest.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TestTube className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sample Type</span>
                  </div>
                  <p className="font-semibold">{selectedTest.sample_type}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Report Time</span>
                  </div>
                  <p className="font-semibold">{selectedTest.report_time}</p>
                </div>
              </div>

              {selectedTest.preparation_required && (
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                        Preparation Instructions
                      </p>
                      {selectedTest.preparation_instructions && (
                        <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
                          {selectedTest.preparation_instructions.map((instruction, index) => (
                            <li key={index}>• {instruction}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-xl mb-6">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200 mb-2">
                      Quality Assurance
                    </p>
                    <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                      <li>• NABL & CAP certified labs</li>
                      <li>• Double verification process</li>
                      <li>• Home sample collection available</li>
                      <li>• Digital reports via email</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  {selectedTest.discounted_price ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary">
                        ₹{selectedTest.discounted_price}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{selectedTest.price}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {Math.round((1 - selectedTest.discounted_price / selectedTest.price) * 100)}% OFF
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-primary">₹{selectedTest.price}</span>
                  )}
                </div>
                
                {selectedTest.home_collection && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Home className="h-4 w-4" />
                    <span className="text-sm font-medium">Home Collection</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => {
                  handleBookTest(selectedTest);
                  setSelectedTest(null);
                }}
                className="w-full rounded-2xl h-12 text-base font-medium"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Trust Indicators */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>NABL Certified Labs</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>ISO 15189 Accredited</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Home Sample Collection</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Quick & Accurate Reports</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <FlaskConical className="h-8 w-8 text-primary" />
                Lab Tests & Health Checkups
              </h1>
              <p className="text-muted-foreground">
                {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} available
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-2xl lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search lab tests, health conditions, or organs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-2xl"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 rounded-2xl">
                <SelectValue placeholder="Test Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {labTestCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Popular Tests */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Popular Health Checkups</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockLabTests.filter(test => test.popular).slice(0, 4).map((test) => (
                <Card key={test.id} className="rounded-2xl border-0 bg-background/80 backdrop-blur">
                  <CardContent className="p-4 text-center">
                    <TestTube className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-medium text-sm mb-2">{test.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {test.discounted_price ? (
                        <>
                          <span className="text-lg font-bold text-primary">₹{test.discounted_price}</span>
                          <span className="text-xs text-muted-foreground line-through">₹{test.price}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-primary">₹{test.price}</span>
                      )}
                    </div>
                    <Button size="sm" className="rounded-full w-full" onClick={() => handleBookTest(test)}>
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {(showFilters || window.innerWidth >= 1024) && (
            <div className="lg:w-80">
              <Card className="rounded-2xl sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sort By */}
                  <div>
                    <h3 className="font-medium mb-3">Sort By</h3>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Most Popular</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="report_time">Fastest Reports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lab Quality Assurance */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl">
                    <div className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                          Quality Assurance
                        </p>
                        <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-xs">
                          <li>• NABL & CAP certified labs</li>
                          <li>• Double verification process</li>
                          <li>• Home sample collection</li>
                          <li>• Digital reports via email</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Sample Collection Info */}
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-2xl">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-green-800 dark:text-green-200 mb-1">
                          Sample Collection
                        </p>
                        <p className="text-green-700 dark:text-green-300">
                          Professional phlebotomists will collect samples from your home at your preferred time slot.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tests Grid */}
          <div className="flex-1">
            {filteredTests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No tests found matching your criteria.</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }} className="mt-4 rounded-2xl">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTests.map((test) => (
                  <Card key={test.id} className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Test Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg leading-tight mb-1">{test.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                            
                            {/* Rating and Popular Badge */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium ml-1">{test.rating}</span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({test.reviews_count})
                                </span>
                              </div>
                              {test.popular && (
                                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            {test.discounted_price ? (
                              <div className="flex flex-col items-end">
                                <span className="text-lg font-bold text-primary">
                                  ₹{test.discounted_price}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground line-through">
                                    ₹{test.price}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    {Math.round((1 - test.discounted_price / test.price) * 100)}% OFF
                                  </Badge>
                                </div>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-primary">₹{test.price}</span>
                            )}
                          </div>
                        </div>

                        {/* Test Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <TestTube className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Sample:</span>
                            <span className="font-medium">{test.sample_type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Report:</span>
                            <span className="font-medium">{test.report_time}</span>
                          </div>
                        </div>

                        {/* Preparation Required */}
                        {test.preparation_required && (
                          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div className="text-sm">
                                <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                                  Preparation Required
                                </p>
                                {test.preparation_instructions && (
                                  <ul className="text-amber-700 dark:text-amber-300 text-xs space-y-0.5">
                                    {test.preparation_instructions.map((instruction, index) => (
                                      <li key={index}>• {instruction}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <Separator />

                        {/* Book Test Button */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleBookTest(test)}
                            className="flex-1 rounded-2xl"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Test
                          </Button>
                          <Button variant="outline" className="rounded-2xl" onClick={() => handleViewDetails(test)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Lab Test Detail Modal */}
      <LabTestDetailModal />
    </div>
  );
}