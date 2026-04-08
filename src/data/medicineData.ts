export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  price: number;
  discounted_price?: number;
  manufacturer: string;
  category: string;
  prescription_required: boolean;
  description: string;
  dosage_forms: string[];
  strengths: string[];
  image_url: string;
  in_stock: boolean;
  rating: number;
  reviews_count: number;
  uses: string[];
  side_effects: string[];
  warnings: string[];
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
  discounted_price?: number;
  description: string;
  preparation_required: boolean;
  preparation_instructions?: string[];
  sample_type: string;
  report_time: string;
  rating: number;
  reviews_count: number;
  popular: boolean;
  home_collection?: boolean;
}

export const medicineCategories = [
  { id: "analgesics", name: "Pain Relief" },
  { id: "antibiotics", name: "Antibiotics" },
  { id: "antidiabetic", name: "Diabetes Care" },
  { id: "cardiovascular", name: "Heart Health" },
  { id: "respiratory", name: "Respiratory" },
  { id: "digestive", name: "Digestive Health" },
  { id: "vitamins", name: "Vitamins & Supplements" },
  { id: "skincare", name: "Skin Care" },
  { id: "baby", name: "Baby Care" },
  { id: "women", name: "Women's Health" }
];

export const labTestCategories = [
  { id: "blood", name: "Blood Tests" },
  { id: "diabetes", name: "Diabetes Tests" },
  { id: "heart", name: "Heart Health" },
  { id: "liver", name: "Liver Function" },
  { id: "kidney", name: "Kidney Function" },
  { id: "thyroid", name: "Thyroid Tests" },
  { id: "vitamin", name: "Vitamin Tests" },
  { id: "infection", name: "Infection Tests" },
  { id: "cancer", name: "Cancer Screening" },
  { id: "comprehensive", name: "Full Body Checkup" }
];

export const mockMedicines: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    generic_name: "Paracetamol",
    price: 45,
    discounted_price: 38,
    manufacturer: "Cipla Ltd",
    category: "analgesics",
    prescription_required: false,
    description: "Effective pain reliever and fever reducer suitable for headaches, body aches, and fever.",
    dosage_forms: ["Tablet", "Syrup"],
    strengths: ["500mg", "650mg"],
    image_url: "/placeholder.svg",
    in_stock: true,
    rating: 4.5,
    reviews_count: 1250,
    uses: ["Headache", "Fever", "Body pain", "Toothache"],
    side_effects: ["Nausea", "Allergic reactions (rare)"],
    warnings: ["Do not exceed recommended dose", "Consult doctor if symptoms persist"]
  },
  {
    id: "2",
    name: "Azithromycin 500mg",
    generic_name: "Azithromycin",
    price: 180,
    discounted_price: 155,
    manufacturer: "Sun Pharma",
    category: "antibiotics",
    prescription_required: true,
    description: "Broad-spectrum antibiotic for bacterial infections.",
    dosage_forms: ["Tablet", "Suspension"],
    strengths: ["250mg", "500mg"],
    image_url: "/placeholder.svg",
    in_stock: true,
    rating: 4.3,
    reviews_count: 890,
    uses: ["Respiratory infections", "Skin infections", "Throat infections"],
    side_effects: ["Stomach upset", "Diarrhea", "Dizziness"],
    warnings: ["Complete full course", "Prescription required", "Not for viral infections"]
  },
  {
    id: "3",
    name: "Metformin 500mg",
    generic_name: "Metformin Hydrochloride",
    price: 65,
    discounted_price: 55,
    manufacturer: "Abbott",
    category: "antidiabetic",
    prescription_required: true,
    description: "First-line medication for type 2 diabetes management.",
    dosage_forms: ["Tablet", "Extended Release"],
    strengths: ["500mg", "850mg", "1000mg"],
    image_url: "/placeholder.svg",
    in_stock: true,
    rating: 4.4,
    reviews_count: 2100,
    uses: ["Type 2 diabetes", "PCOS", "Pre-diabetes"],
    side_effects: ["Nausea", "Diarrhea", "Metallic taste"],
    warnings: ["Monitor kidney function", "Take with meals", "Prescription required"]
  },
  {
    id: "4",
    name: "Omeprazole 20mg",
    generic_name: "Omeprazole",
    price: 95,
    discounted_price: 80,
    manufacturer: "Dr. Reddy's",
    category: "digestive",
    prescription_required: false,
    description: "Proton pump inhibitor for acid reflux and ulcers.",
    dosage_forms: ["Capsule", "Tablet"],
    strengths: ["20mg", "40mg"],
    image_url: "/placeholder.svg",
    in_stock: true,
    rating: 4.6,
    reviews_count: 1560,
    uses: ["Acid reflux", "Gastric ulcers", "GERD", "Heartburn"],
    side_effects: ["Headache", "Stomach pain", "Diarrhea"],
    warnings: ["Long-term use requires medical supervision", "Take before meals"]
  },
  {
    id: "5",
    name: "Vitamin D3 60K IU",
    generic_name: "Cholecalciferol",
    price: 120,
    discounted_price: 105,
    manufacturer: "Mankind Pharma",
    category: "vitamins",
    prescription_required: false,
    description: "High-strength Vitamin D supplement for bone health.",
    dosage_forms: ["Capsule", "Oral Solution"],
    strengths: ["60000 IU"],
    image_url: "/placeholder.svg",
    in_stock: true,
    rating: 4.7,
    reviews_count: 3200,
    uses: ["Vitamin D deficiency", "Bone health", "Immunity support"],
    side_effects: ["Nausea", "Vomiting", "Weakness (with overdose)"],
    warnings: ["Do not exceed recommended dose", "Get blood levels checked"]
  }
];

export const mockLabTests: LabTest[] = [
  {
    id: "1",
    name: "Complete Blood Count (CBC)",
    category: "blood",
    price: 400,
    discounted_price: 320,
    description: "Comprehensive blood test to check overall health and detect various disorders.",
    preparation_required: false,
    sample_type: "Blood",
    report_time: "4-6 hours",
    rating: 4.8,
    reviews_count: 5200,
    popular: true,
    home_collection: true
  },
  {
    id: "2",
    name: "HbA1c (Diabetes Test)",
    category: "diabetes",
    price: 550,
    discounted_price: 450,
    description: "Measures average blood sugar levels over the past 2-3 months.",
    preparation_required: false,
    sample_type: "Blood",
    report_time: "6-8 hours",
    rating: 4.7,
    reviews_count: 3100,
    popular: true,
    home_collection: true
  },
  {
    id: "3",
    name: "Lipid Profile",
    category: "heart",
    price: 650,
    discounted_price: 520,
    description: "Measures cholesterol and triglycerides to assess heart disease risk.",
    preparation_required: true,
    preparation_instructions: ["Fast for 12-14 hours", "Only water allowed", "Take medicines as usual"],
    sample_type: "Blood",
    report_time: "6-8 hours",
    rating: 4.6,
    reviews_count: 2800,
    popular: true,
    home_collection: true
  },
  {
    id: "4",
    name: "Thyroid Function Test (TSH, T3, T4)",
    category: "thyroid",
    price: 800,
    discounted_price: 650,
    description: "Complete thyroid function evaluation including TSH, T3, and T4 levels.",
    preparation_required: false,
    sample_type: "Blood",
    report_time: "8-12 hours",
    rating: 4.7,
    reviews_count: 2200,
    popular: true,
    home_collection: true
  },
  {
    id: "5",
    name: "Liver Function Test (LFT)",
    category: "liver",
    price: 700,
    discounted_price: 560,
    description: "Measures liver enzymes and proteins to assess liver health.",
    preparation_required: true,
    preparation_instructions: ["Fast for 8-10 hours", "Avoid alcohol 24 hours prior"],
    sample_type: "Blood",
    report_time: "6-8 hours",
    rating: 4.5,
    reviews_count: 1900,
    popular: false,
    home_collection: true
  },
  {
    id: "6",
    name: "Vitamin D Test",
    category: "vitamin",
    price: 1200,
    discounted_price: 950,
    description: "Measures 25-hydroxy vitamin D levels to detect deficiency.",
    preparation_required: false,
    sample_type: "Blood",
    report_time: "12-24 hours",
    rating: 4.6,
    reviews_count: 1600,
    popular: false,
    home_collection: true
  },
  {
    id: "7",
    name: "Full Body Health Checkup",
    category: "comprehensive",
    price: 2500,
    discounted_price: 1999,
    description: "Comprehensive health screening with 60+ tests including CBC, diabetes, heart, liver, kidney, and vitamin tests.",
    preparation_required: true,
    preparation_instructions: ["Fast for 12 hours", "Bring first morning urine sample", "Avoid vigorous exercise 24 hours prior"],
    sample_type: "Blood, Urine",
    report_time: "24-48 hours",
    rating: 4.9,
    reviews_count: 4500,
    popular: true,
    home_collection: true
  }
];