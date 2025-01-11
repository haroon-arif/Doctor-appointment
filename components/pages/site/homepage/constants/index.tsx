import { Tab } from '../components/hero/SearchTab';
import { BlogPost } from '../components/OurBlog';
import { Service } from '../components/Services';
import { Treatment } from '../components/Treatments';
export const HERO_ITEMS = [
    {
        icon: '/home/hero/compare.svg',
        text: 'Compare costs and treatments'
    },
    {
        icon: '/home/hero/find.svg',
        text: 'Find your clinic'
    },
    {
        icon: '/home/hero/book.svg',
        text: 'Book your appointment'
    }
];

export const TABS_CONSTANT: Tab[] = [
    {
      id: 'home',
      name: 'Treatments',
      icon: '/home/hero/search/injection.svg',
    },
    {
      id: 'profile',
      name: 'Clinics',
      icon: '/home/hero/search/clinics.svg',
    },
    {
      id: 'settings',
      name: 'Specialist',
      icon: '/home/hero/search/doctor.svg',
    },
  ];
  
  export const TREATMENTS: Treatment[] = [
    {
      id: 1,
      title: 'Cosmetic Treatment 1',
      name:'Soft surgery',
      price:'From €200',
      description: 'Step-by-step protocol for the keratin treatment procedure · Wash hair with a deep cleansing shampoo.',
      imageUrl: '/home/treatments/treatment1.png',
    },
    {
      id: 2,
      title: 'Cosmetic Treatment 2',
      name:'Injectables',
      price:'From €200',
      description: 'Step-by-step protocol for the keratin treatment procedure · Wash hair with a deep cleansing shampoo.',
      imageUrl: '/home/treatments/treatment2.png',
    },
    {
      id: 3,
      title: 'Cosmetic Treatment 3',
      name:'Skin improvement',
      price:'From €170',
      description: 'Step-by-step protocol for the keratin treatment procedure · Wash hair with a deep cleansing shampoo.',
      imageUrl: '/home/treatments/treatment3.png',
    },
    {
      id: 4,
      title: 'Cosmetic Treatment 4',
      name:'Skin improvement',
      price:'From €800',
      description: 'Step-by-step protocol for the keratin treatment procedure · Wash hair with a deep cleansing shampoo.',
      imageUrl: '/home/treatments/treatment4.png',
    },
    {
      id: 5,
      title: 'Cosmetic Treatment 5',
      name:'Soft surgery',
      price:'From €150',
      description: 'Step-by-step protocol for the keratin treatment procedure · Wash hair with a deep cleansing shampoo.',
      imageUrl: '/home/treatments/treatment5.png',
    },
    {
      id: 6,
      title: 'Cosmetic Treatment 6',
      name:'Skin improvement',
      price:'From €120',
      description: 'Step-by-step protocol for the keratin treatment procedure · Wash hair with a deep cleansing shampoo.',
      imageUrl: '/home/treatments/treatment6.png',
    },
    {
      id: 7,
      title: 'Cosmetic Treatment 7',
      name:'Skin improvement',
      price:'From €2000',
      description: 'Step-by-step protocol for the keratin treatment procedure · Wash hair with a deep cleansing shampoo.',
      imageUrl: '/home/treatments/treatment7.png',
    },
    {
      id: 8,
      title: 'Cosmetic Treatment 8',
      name:'Injectables',
      price:'From €650',
      description: 'Step-by-step protocol for the keratin treatment procedure · Wash hair with a deep cleansing shampoo.',
      imageUrl: '/home/treatments/treatment8.png',
    },
  ];

  export const SERVICES: Service[] = [
    {
      id: 1,
      name: 'Treatments',
      description: 'Cosmetic',
      imageUrl: '/home/services/treatment.png',
    },
    {
      id: 2,
      name: 'Best clinics',
      description: 'in the Netherlands',
      imageUrl: '/home/services/femalediagnosing.png',
    },
    {
      id: 3,
      name: 'Our blog',
      description: 'for all the news and tips',
      imageUrl: '/home/services/skintest.png',
    },
  ];
  
  export const BLOGS: BlogPost[] = [
    {
      date: 'July 7, 2024',
      title: 'What is PRF, Platelet-Rich Fibrin',
      description: 'Platelet rich fibrin (PRF) injections are setting a new evolution in cosmetic rejuvenation',
      imageUrl: '/home/blog/blog1.png', 
    },
    {
      date: 'February 18, 2024',
      title: 'A Beginners Guide to Lip Augmentation',
      description: 'Explore the science in lip augmentation, unlocking a journey that helps your lip goals',
      imageUrl: '/home/blog/blog2.png', 
    },
    {
      date: 'January 6, 2024',
      title: 'Exploring the World of Lip Line Fillers',
      description: 'Lip line filler treatments are the precision with which practitioners target specific areas of the lips.',
      imageUrl: '/home/blog/blog3.png', 
    },
  ];

  export const CLIENTS = [
    {
      name: 'Aéstec Amsterdam | beste cosmetisch...',
      logo: '/home/clients/Rectangle 80.svg',
      rating: 9.4,
      reviews: 25,
      address: 'Dr. Molewaterplein 40, 3016 GD Rotterdam',
    },
    {
      name: 'Aéstec Amsterdam | beste cosmetisch...',
      logo: '/home/clients/Rectangle 80 (1).svg',
      rating: 9.1,
      reviews: 66,
      address: 'Van Baerlestraat 121, 1071 BD Amsterdam',
    },
    {
      name: 'Beauty Care Nederland',
      logo: '/home/clients/Rectangle 80 (2).svg',
      rating: 9.6,
      reviews: 56,
      address: 'Dreef 7, 2017 HD Haarlem',
    },
    {
      name: 'The Body Clinic Amsterdam',
      logo: '/home/clients/Rectangle 80 (3).svg',
      rating: 8.3,
      reviews: 13,
      address: 'Rijksstraatweg 125, 9756 AN Glimmen',
    },
  ];