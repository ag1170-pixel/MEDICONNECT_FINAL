import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Calendar, Shield, Award, Clock, TestTube, Filter, Star, AlertCircle, FlaskConical, X, Plus, Home, CheckCircle, Upload, FileText, AlertTriangle } from "lucide-react";
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

  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [pendingPrescriptionTest, setPendingPrescriptionTest] = useState<LabTest | null>(null);
  const [uploadedPrescriptionFiles, setUploadedPrescriptionFiles] = useState<File[]>([]);
  const [isDraggingPrescription, setIsDraggingPrescription] = useState(false);
  const prescriptionFileInputRef = useRef<HTMLInputElement>(null);

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
    // Lab tests require a doctor's order/prescription. We open a popup first
    // and only add the test to cart after the upload.
    setSelectedTest(null);
    setPendingPrescriptionTest(test);
    setUploadedPrescriptionFiles([]);
    setIsPrescriptionModalOpen(true);
  };

  const handleViewDetails = (test: LabTest) => {
    setSelectedTest(test);
  };

  const closePrescriptionModal = () => {
    setIsPrescriptionModalOpen(false);
    setPendingPrescriptionTest(null);
    setUploadedPrescriptionFiles([]);
    setIsDraggingPrescription(false);
    if (prescriptionFileInputRef.current) {
      prescriptionFileInputRef.current.value = "";
    }
  };

  const handlePrescriptionFileUpload = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload JPG, PNG, or PDF files only.",
          variant: "destructive",
        });
        return false;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 10MB.",
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setUploadedPrescriptionFiles(prev => [...prev, ...validFiles]);
      toast({
        title: "Prescription uploaded",
        description: `${validFiles.length} file(s) added.`,
      });
    }
  };

  const removeUploadedPrescriptionFile = (index: number) => {
    setUploadedPrescriptionFiles(prev => prev.filter((_, i) => i !== index));
  };

  const confirmPrescriptionAndBook = () => {
    if (!pendingPrescriptionTest) return;

    if (uploadedPrescriptionFiles.length === 0) {
      toast({
        title: "Prescription required",
        description: "Please upload a doctor's order/prescription to proceed.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: pendingPrescriptionTest.id,
      name: pendingPrescriptionTest.name,
      price: pendingPrescriptionTest.discounted_price || pendingPrescriptionTest.price,
      quantity: 1,
      type: "lab test",
      category: pendingPrescriptionTest.category,
    });

    toast({
      title: "Test added to cart",
      description: `${pendingPrescriptionTest.name} has been added to your cart.`,
    });

    setIsOpen(true);
    closePrescriptionModal();
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

  const PrescriptionUploadModal = () => {
    if (!isPrescriptionModalOpen || !pendingPrescriptionTest) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePrescriptionModal}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="relative bg-background rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={closePrescriptionModal}
              className="absolute right-4 top-4 z-10"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="p-6 pt-12">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">Upload Doctor's Order</h2>
                  <p className="text-sm text-muted-foreground">
                    Upload a valid prescription for{" "}
                    <span className="font-medium text-foreground">{pendingPrescriptionTest.name}</span>{" "}
                    to proceed.
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-xl mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                      Accepted formats
                    </p>
                    <ul className="text-orange-700 dark:text-orange-300 text-xs space-y-1">
                      <li>• JPG / PNG / PDF up to 10MB</li>
                      <li>• Clear image with doctor's name and details</li>
                      <li>• All text visible (no blur)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                  isDraggingPrescription
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/30 hover:border-primary/50"
                }`}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingPrescription(false);
                  handlePrescriptionFileUpload(e.dataTransfer.files);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingPrescription(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDraggingPrescription(false);
                }}
              >
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">Drop files here or browse</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  This demo stores files locally until you confirm.
                </p>

                <Button
                  variant="outline"
                  onClick={() => prescriptionFileInputRef.current?.click()}
                  className="rounded-2xl"
                >
                  Choose Files
                </Button>

                <input
                  ref={prescriptionFileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handlePrescriptionFileUpload(e.target.files)}
                  className="sr-only"
                />
              </div>

              {/* Uploaded Files */}
              {uploadedPrescriptionFiles.length > 0 && (
                <div className="space-y-3 mt-5">
                  <h4 className="font-medium">
                    Uploaded Files ({uploadedPrescriptionFiles.length})
                  </h4>
                  {uploadedPrescriptionFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUploadedPrescriptionFile(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 rounded-2xl"
                  onClick={closePrescriptionModal}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-2xl"
                  size="lg"
                  onClick={confirmPrescriptionAndBook}
                  disabled={uploadedPrescriptionFiles.length === 0}
                >
                  Confirm & Book
                </Button>
              </div>
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
              <p className="text-sm text-muted-foreground mt-2">
                For most lab tests, please upload your doctor's order in the popup after you click{" "}
                <span className="font-medium text-foreground">Book Test</span>.
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

        {/* How Booking Works */}
        <div className="bg-muted/50 rounded-2xl p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-3">How Booking Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-background/70 rounded-xl p-4 border">
              <p className="font-semibold mb-1">1. Choose your test</p>
              <p className="text-muted-foreground">
                Browse by category and compare price, rating, and report time.
              </p>
            </div>
            <div className="bg-background/70 rounded-xl p-4 border">
              <p className="font-semibold mb-1">2. Upload doctor's order</p>
              <p className="text-muted-foreground">
                After you click <span className="font-medium text-foreground">Book Test</span>, a popup will let you upload the prescription from your system.
              </p>
            </div>
            <div className="bg-background/70 rounded-xl p-4 border">
              <p className="font-semibold mb-1">3. Get your report</p>
              <p className="text-muted-foreground">
                Receive accurate digital reports; home collection is available for supported tests.
              </p>
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

                        {test.home_collection && (
                          <div className="flex items-center gap-2 mt-3 text-green-600 text-xs font-medium">
                            <Home className="h-4 w-4" />
                            Home sample collection available
                          </div>
                        )}

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
      <PrescriptionUploadModal />
    </div>
  );
}