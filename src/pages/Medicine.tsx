import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, Shield, Award, Truck, Clock, Filter, Star, AlertTriangle, Pill, Upload, X, FileText } from "lucide-react";
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
import { mockMedicines, medicineCategories, type Medicine } from "@/data/medicineData";

export default function Medicine() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { addItem, setIsOpen } = useCart();
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>(mockMedicines);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [prescriptionFilter, setPrescriptionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [pendingPrescriptionMedicine, setPendingPrescriptionMedicine] = useState<Medicine | null>(null);
  const [uploadedPrescriptionFiles, setUploadedPrescriptionFiles] = useState<File[]>([]);
  const [isDraggingPrescription, setIsDraggingPrescription] = useState(false);
  const prescriptionFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let filtered = [...mockMedicines];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.generic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.uses.some(use => use.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(medicine => medicine.category === selectedCategory);
    }

    // Prescription filter
    if (prescriptionFilter === 'otc') {
      filtered = filtered.filter(medicine => !medicine.prescription_required);
    } else if (prescriptionFilter === 'rx') {
      filtered = filtered.filter(medicine => medicine.prescription_required);
    }

    // Sorting
    if (sortBy === 'price_low') {
      filtered.sort((a, b) => (a.discounted_price || a.price) - (b.discounted_price || b.price));
    } else if (sortBy === 'price_high') {
      filtered.sort((a, b) => (b.discounted_price || b.price) - (a.discounted_price || a.price));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      filtered.sort((a, b) => b.reviews_count - a.reviews_count);
    }

    setFilteredMedicines(filtered);
  }, [searchQuery, selectedCategory, prescriptionFilter, sortBy]);

  const handleAddToCart = (medicine: Medicine) => {
    if (medicine.prescription_required) {
      setPendingPrescriptionMedicine(medicine);
      setUploadedPrescriptionFiles([]);
      setIsPrescriptionModalOpen(true);
      return;
    } else {
      addItem({
        id: medicine.id,
        name: medicine.name,
        price: medicine.discounted_price || medicine.price,
        quantity: 1,
        type: 'medicine',
        category: medicine.category
      });
      
      toast({
        title: "Added to Cart",
        description: `${medicine.name} has been added to your cart.`
      });
    }
  };

  const closePrescriptionModal = () => {
    setIsPrescriptionModalOpen(false);
    setPendingPrescriptionMedicine(null);
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

  const confirmPrescriptionAndAdd = () => {
    if (!pendingPrescriptionMedicine) return;

    if (uploadedPrescriptionFiles.length === 0) {
      toast({
        title: "Prescription required",
        description: "Please upload a doctor's order/prescription to proceed.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: pendingPrescriptionMedicine.id,
      name: pendingPrescriptionMedicine.name,
      price: pendingPrescriptionMedicine.discounted_price || pendingPrescriptionMedicine.price,
      quantity: 1,
      type: "medicine",
      category: pendingPrescriptionMedicine.category,
    });

    toast({
      title: "Added to Cart",
      description: `${pendingPrescriptionMedicine.name} has been added to your cart.`,
    });
    setIsOpen(true);
    closePrescriptionModal();
  };

  const PrescriptionUploadModal = () => {
    if (!isPrescriptionModalOpen || !pendingPrescriptionMedicine) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closePrescriptionModal}
        />

        {/* Modal */}
        <div className="relative bg-background rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border">
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
                <h2 className="text-xl font-bold mb-1">Upload Prescription</h2>
                <p className="text-sm text-muted-foreground">
                  Upload a valid prescription for{" "}
                  <span className="font-medium text-foreground">{pendingPrescriptionMedicine.name}</span>{" "}
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
                    <li>• Clear image with doctor's details</li>
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
                Files are stored locally in this demo flow.
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
                onClick={confirmPrescriptionAndAdd}
                disabled={uploadedPrescriptionFiles.length === 0}
              >
                Confirm & Add
              </Button>
            </div>
          </div>
        </div>
      </div>
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
              <span>100% Authentic Medicines</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>FDA Approved Pharmacy</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Free Delivery Above ₹499</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>24/7 Pharmacist Support</span>
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
                <Pill className="h-8 w-8 text-primary" />
                Online Pharmacy
              </h1>
              <p className="text-muted-foreground">
                {filteredMedicines.length} medicine{filteredMedicines.length !== 1 ? 's' : ''} found
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
                placeholder="Search medicines, generic names, or health conditions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-2xl"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 rounded-2xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {medicineCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

          {/* How it works */}
          <div className="bg-muted/50 rounded-2xl p-6 mb-6 border">
            <h2 className="text-xl font-semibold mb-3">How Pharmacy Delivery Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-background/70 rounded-xl p-4 border">
                <p className="font-semibold mb-1">1. Browse & choose</p>
                <p className="text-muted-foreground">
                  Search medicines by name, generic, or intended use.
                </p>
              </div>
              <div className="bg-background/70 rounded-xl p-4 border">
                <p className="font-semibold mb-1">2. Rx verification (if required)</p>
                <p className="text-muted-foreground">
                  Medicines marked as <span className="font-medium text-foreground">Prescription Required</span> go through pharmacist verification.
                </p>
              </div>
              <div className="bg-background/70 rounded-xl p-4 border">
                <p className="font-semibold mb-1">3. Receive your order</p>
                <p className="text-muted-foreground">
                  Get doorstep delivery with clear order confirmation and support.
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
                  {/* Prescription Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Prescription</h3>
                    <Select value={prescriptionFilter} onValueChange={setPrescriptionFilter}>
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Medicines</SelectItem>
                        <SelectItem value="otc">Over the Counter</SelectItem>
                        <SelectItem value="rx">Prescription Required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Safety Notice */}
                  <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-2xl">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                          Safety Notice
                        </p>
                        <p className="text-orange-700 dark:text-orange-300">
                          Always consult with a healthcare professional before taking any medication. Upload valid prescriptions for Rx medicines.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Medicine Grid */}
          <div className="flex-1">
            {filteredMedicines.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No medicines found matching your criteria.</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPrescriptionFilter('all');
                }} className="mt-4 rounded-2xl">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMedicines.map((medicine) => (
                  <Card key={medicine.id} className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Image & Stock Status */}
                      <div className="relative mb-4">
                        <img 
                          src={medicine.image_url} 
                          alt={medicine.name}
                          className="w-full h-32 object-contain bg-gray-50 dark:bg-gray-900 rounded-xl"
                        />
                        {medicine.in_stock ? (
                          <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="absolute top-2 right-2">
                            Out of Stock
                          </Badge>
                        )}
                      </div>

                      {/* Medicine Info */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg leading-tight">{medicine.name}</h3>
                          <p className="text-sm text-muted-foreground">{medicine.generic_name}</p>
                          <p className="text-xs text-muted-foreground">by {medicine.manufacturer}</p>

                          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                            {medicine.description}
                          </p>

                          {medicine.warnings && medicine.warnings.length > 0 && (
                            <p className="text-xs text-orange-700 mt-2">
                              Safety: {medicine.warnings[0]}
                            </p>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium ml-1">{medicine.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({medicine.reviews_count} reviews)
                          </span>
                        </div>

                        {/* Prescription Badge */}
                        {medicine.prescription_required && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Prescription Required
                          </Badge>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          {medicine.discounted_price ? (
                            <>
                              <span className="text-lg font-bold text-primary">
                                ₹{medicine.discounted_price}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{medicine.price}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {Math.round((1 - medicine.discounted_price / medicine.price) * 100)}% OFF
                              </Badge>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-primary">₹{medicine.price}</span>
                          )}
                        </div>

                        {/* Uses */}
                        <div className="flex flex-wrap gap-1">
                          {medicine.uses.slice(0, 2).map((use, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {use}
                            </Badge>
                          ))}
                          {medicine.uses.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{medicine.uses.length - 2} more
                            </Badge>
                          )}
                        </div>

                        <Separator />

                        {/* Add to Cart */}
                        <Button
                          onClick={() => handleAddToCart(medicine)}
                          disabled={!medicine.in_stock}
                          className="w-full rounded-2xl"
                          variant={medicine.prescription_required ? "outline" : "default"}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {medicine.prescription_required ? "Upload Prescription" : "Add to Cart"}
                        </Button>
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
      <PrescriptionUploadModal />
    </div>
  );
}