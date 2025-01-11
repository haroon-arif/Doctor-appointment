export const specialist = {
  id: 1,
  name: "Tim Bouwman",
  location: "Aēstec Amsterdam",
  about: `Sacha is a skin therapist and specialized in the field of skin improvement and skin rejuvenation. She brings out the natural glow of your skin through laser facials, peelings or collagen boosters. In addition, her expertise is focused on removing imperfections such as scars, acne, pigment and rosacea and she is experienced in the field of laser hair removal. 

Sacha has a broad advisory role due to her experience in aesthetics. She is happy to make a plan, focused on your personal skin concerns, to make the skin shine again.
`,
  workingAt: {
    name: "Doctors at soap Amsterdam-Zuid",
    address: "Van Baerlestraat 122 H, 1071 BD Amsterdam",
  },
  qualityMarks: [
    "KNMG CERTIFIED DOCTORS",
    "KNMG CERTIFIED DOCTORS",
    "KNMG CERTIFIED DOCTORS",
    "KNMG CERTIFIED DOCTORS",
    "KNMG CERTIFIED DOCTORS",
  ],
  username: "tim",
  password: "password123",
  workingDays: [
    {
      date: null,
      allWeek: true,
      isWorkDay: true,
      recurring: true,
      day: "monday",
      durations: [
        {
          startTime: "09:00",
          endTime: "12:00",
        },
        {
          startTime: "14:00",
          endTime: "17:00",
        },
      ],
    },
    {
      date: null,
      allWeek: true,
      isWorkDay: true,
      recurring: true,
      day: "tuesday",
      durations: [
        {
          startTime: "09:00",
          endTime: "12:00",
        },
        {
          startTime: "14:00",
          endTime: "17:00",
        },
      ],
    },
    {
      date: null,
      allWeek: true,
      isWorkDay: true,
      recurring: true,
      day: "wednesday",
      durations: [
        {
          startTime: "09:00",
          endTime: "12:00",
        },
        {
          startTime: "14:00",
          endTime: "17:00",
        },
      ],
    },
    {
      date: null,
      allWeek: true,
      isWorkDay: true,
      recurring: true,
      day: "thursday",
      durations: [
        {
          startTime: "09:00",
          endTime: "12:00",
        },
        {
          startTime: "14:00",
          endTime: "17:00",
        },
      ],
    },
    {
      date: null,
      allWeek: true,
      isWorkDay: true,
      recurring: true,
      day: "friday",
      durations: [
        {
          startTime: "09:00",
          endTime: "12:00",
        },
        {
          startTime: "14:00",
          endTime: "17:00",
        },
      ],
    },
    {
      date: null,
      allWeek: false,
      isWorkDay: false,
      recurring: false,
      day: "saturday",
      durations: [],
    },
    {
      date: null,
      allWeek: false,
      isWorkDay: false,
      recurring: false,
      day: "sunday",
      durations: [],
    },
  ],
  services: [
    {
      subcategory: { id: 1, name: "Botox & Fillers", category: 1 },
      treatments: [
        {
          id: 1,
          name: "Botox (hele zone)",
          duration: "30",
          price: "120",
        },
        {
          id: 2,
          name: "Lip Fillers",
          duration: "30",
          price: "150",
        },
        {
          id: 3,
          name: "Jawline Contouring",
          duration: "30",
          price: "200",
        },
      ],
    },
    {
      subcategory: { id: 2, name: "Laser Treatments", category: 1 },
      treatments: [
        {
          id: 4,
          name: "Hair Laser Removal",
          duration: "30",
          price: "80",
        },
        {
          id: 5,
          name: "Facial Laser Treatment",
          duration: "30",
          price: "100",
        },
      ],
    },
    {
      subcategory: { id: 3, name: "Chemical Peels", category: 1 },
      treatments: [
        {
          id: 6,
          name: "Chemical Peel Treatment",
          duration: "30",
          price: "100",
        },
        {
          id: 7,
          name: "Deep Cleansing Peel",
          duration: "30",
          price: "120",
        },
      ],
    },
    {
      subcategory: { id: 4, name: "Microdermabrasion", category: 2 },
      treatments: [
        {
          id: 8,
          name: "Microdermabrasion Treatment",
          duration: "30",
          price: "90",
        },
        {
          id: 9,
          name: "Diamond Microdermabrasion",
          duration: "30",
          price: "130",
        },
      ],
    },
  ],
};

export const categories = [
  {
    id: 1,
    name: "Injectables",
  },
  {
    id: 2,
    name: "Skin Improvement",
  },
  {
    id: 3,
    name: "Hair Removal",
  },
  {
    id: 4,
    name: "Soft Surgery",
  },
  {
    id: 5,
    name: "Plastic Surgery",
  },
];

export const subCategories = [
  { id: 1, name: "Botox & Fillers", category: 1 },
  { id: 2, name: "Laser Treatments", category: 1 },
  { id: 3, name: "Chemical Peels", category: 1 },
  { id: 4, name: "Microdermabrasion", category: 2 },
  { id: 5, name: "Light Therapies", category: 2 },
  { id: 6, name: "Exilis", category: 2 },
  { id: 7, name: "Facials", category: 2 },
  { id: 8, name: "Waxing", category: 3 },
  { id: 9, name: "Electrolysis", category: 3 },
  { id: 10, name: "Liposuction", category: 4 },
  { id: 11, name: "Rhinoplasty", category: 5 },
];

export const patients = [
  {
    id: 1,
    name: "Brad Pit",
    email: "brad@gmail.com",
    phone: "(201) 551-5512",
  },
  {
    id: 2,
    name: "Tom Cruise",
    email: "tom@gmail.com",
    phone: "(202) 551-5543",
  },
  {
    id: 3,
    name: "Henry Cavil",
    email: "henry@gmail.com",
    phone: "(202) 552-2344",
  },
];

// const mongoose = require('mongoose');

// const CategorySchema = new mongoose.Schema({
//   name: { type: String, required: true },
// });

// const Category = mongoose.model('Category', CategorySchema);

// const SubcategorySchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
//   });

//   const Subcategory = mongoose.model('Subcategory', SubcategorySchema);

// const TreatmentSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
//   });

//   const Treatment = mongoose.model('Treatment', TreatmentSchema);

// const SpecialistSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   location: { type: String, required: true },
//   services: [
//     {
//       subcategory: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Subcategory",
//         required: true,
//       },
//       treatments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Treatment" }],
//     },
//   ],
// });

// const Specialist = mongoose.model("Specialist", SpecialistSchema);
