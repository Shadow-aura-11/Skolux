/**
 * School Branding Configuration
 * Manages school identification via path: yourdomain.com/schoolname/erp
 */

const DEFAULT_CONFIGS = {
  default: {
    name: "Skolux Global",
    shortName: "SX",
    logoText: "SX",
    logoColor: "#6366f1",
    themeColor: "#6366f1",
    welcomeMessage: "Welcome to our Digital Campus",
    logo: null,
    adminUsername: "admin",
    adminPassword: "admin123",
    teacherUsername: "teacher",
    teacherPassword: "teacher123"
  },
  nms: {
    name: "New Morning Star Public School",
    shortName: "NMS",
    logoText: "NMS",
    logoColor: "#4f46e5",
    themeColor: "#4f46e5",
    adminUsername: "admin",
    adminPassword: "admin123",
    teacherUsername: "teacher",
    teacherPassword: "teacher123",
    welcomeMessage: "Excellence in Education",
    tagline: "Developing leaders for tomorrow through values and innovation.",
    heroImage: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200",
    layout: "classic",
    stats: [
      { label: 'Students', val: '2500+' },
      { label: 'Teachers', val: '120+' },
      { label: 'Buses', val: '15+' },
      { label: 'Labs', val: '8' }
    ],
    about: "Founded in 1995, New Morning Star has been at the forefront of quality education in the region, blending traditional values with a modern approach.",
    features: [
      { icon: "FiBook", title: "CBSE Curriculum", desc: "Rigorous academic standards following the national framework." },
      { icon: "FiShield", title: "Safe Environment", desc: "Complete campus safety with 24/7 monitoring." },
      { icon: "FiTruck", title: "Wide Transport", desc: "Reliable fleet covering a 30km radius." }
    ]
  },
  quantum: {
    name: "Quantum Academy of Excellence",
    shortName: "QA",
    logoText: "QA",
    logoColor: "#06b6d4",
    themeColor: "#06b6d4",
    adminUsername: "admin",
    adminPassword: "admin123",
    teacherUsername: "teacher",
    teacherPassword: "teacher123",
    welcomeMessage: "Decoding the Future",
    tagline: "Empowering tech-savvy innovators in a digital-first world.",
    heroImage: "https://images.unsplash.com/photo-1523050335392-9bef867a0578?auto=format&fit=crop&q=80&w=1200",
    layout: "modern",
    stats: [
      { label: 'AI Labs', val: '4' },
      { label: 'Coding Clubs', val: '12' },
      { label: 'Hackathons', val: '5/yr' },
      { label: 'Devices', val: '1:1' }
    ],
    about: "Quantum Academy is a specialized institution focused on STEM and coding, preparing students for the careers of 2030 and beyond.",
    features: [
      { icon: "FiCpu", title: "AI-Ready Labs", desc: "Equipped with high-end workstations and robotics kits." },
      { icon: "FiGlobe", title: "Global Network", desc: "Collaborations with tech giants and silicon valley schools." },
      { icon: "FiSmartphone", title: "100% Digital", desc: "Paperless campus with personalized learning apps." }
    ]
  },
  heritage: {
    name: "Heritage International School",
    shortName: "HIS",
    logoText: "HIS",
    logoColor: "#10b981",
    themeColor: "#10b981",
    adminUsername: "admin",
    adminPassword: "admin123",
    teacherUsername: "teacher",
    teacherPassword: "teacher123",
    welcomeMessage: "Tradition Meets Innovation",
    tagline: "A legacy of excellence, a vision for the future.",
    heroImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200",
    layout: "premium",
    stats: [
      { label: 'Acres', val: '25' },
      { label: 'Sports', val: '18+' },
      { label: 'Pools', val: '2' },
      { label: 'Hostel', val: '300+' }
    ],
    about: "Heritage International provides a world-class residential experience, focusing on character building and athletic prowess alongside academics.",
    features: [
      { icon: "FiAward", title: "Ivy League Prep", desc: "Specialized coaching for international university admissions." },
      { icon: "FiMusic", title: "Art & Culture", desc: "Extensive programs for music, dance, and fine arts." },
      { icon: "FiLayout", title: "Residential Life", desc: "State-of-the-art boarding facilities for global students." }
    ]
  },
  starlight: {
    name: "Starlight Pre-School & Daycare",
    shortName: "SPD",
    logoText: "SPD",
    logoColor: "#f59e0b",
    themeColor: "#f59e0b",
    adminUsername: "admin",
    adminPassword: "admin123",
    teacherUsername: "teacher",
    teacherPassword: "teacher123",
    welcomeMessage: "Nurturing Little Stars",
    tagline: "Where every child's curiosity finds its way to shine.",
    heroImage: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=1200",
    layout: "playful",
    stats: [
      { label: 'Play Areas', val: '5' },
      { label: 'Care Takers', val: '40+' },
      { label: 'Activities', val: '50+' },
      { label: 'Joy', val: '100%' }
    ],
    about: "Starlight is a safe haven for toddlers, using the Montessori method to foster creativity and early developmental milestones.",
    features: [
      { icon: "FiSmile", title: "Joyful Learning", desc: "Play-based curriculum designed by early child experts." },
      { icon: "FiActivity", title: "Live Tracking", desc: "Watch your child's activities via our secure mobile app." },
      { icon: "FiHeart", title: "Organic Meals", desc: "Nutritionist-approved healthy meals prepared fresh daily." }
    ]
  },
  pk: {
    name: "PK School",
    shortName: "PK",
    logoText: "PK",
    logoColor: "#000000",
    themeColor: "#000000",
    welcomeMessage: "Welcome to PK Digital Campus",
    adminUsername: "admin",
    adminPassword: "admin123",
    teacherUsername: "teacher",
    teacherPassword: "teacher123",
    layout: "modern",
    stats: [
      { label: 'Students', val: '500+' },
      { label: 'Teachers', val: '30+' }
    ]
  }
};

export const getAllSchools = () => {
  const saved = localStorage.getItem('agency_schools_config');
  const customConfigs = saved ? JSON.parse(saved) : {};
  return { ...DEFAULT_CONFIGS, ...customConfigs };
};

export const saveSchoolConfig = (subdomain, config) => {
  const saved = localStorage.getItem('agency_schools_config');
  const customConfigs = saved ? JSON.parse(saved) : {};
  customConfigs[subdomain] = config;
  localStorage.setItem('agency_schools_config', JSON.stringify(customConfigs));
};

export const deleteSchoolConfig = (subdomain) => {
  const saved = localStorage.getItem('agency_schools_config');
  const customConfigs = saved ? JSON.parse(saved) : {};
  delete customConfigs[subdomain];
  localStorage.setItem('agency_schools_config', JSON.stringify(customConfigs));
};

/**
 * Initializes a fresh ERP data set for a new school.
 * Sets up default sessions, classes, and welcome data.
 */
export const initializeSchoolData = (subdomain, schoolName) => {
  const prefix = `erp_${subdomain}`;
  const currentSession = '2026-27';
  
  // 1. Initial Sessions List
  localStorage.setItem(`${prefix}_sessions_list`, JSON.stringify(["2025-26", "2026-27"]));
  localStorage.setItem(`${prefix}_session`, currentSession);

  // 2. Initial Classes & Sections
  const defaultClasses = [
    { id: 1, class: 'Nursery', sections: [{ name: 'A', strength: 30 }] },
    { id: 2, class: 'KG', sections: [{ name: 'A', strength: 30 }] },
    { id: 3, class: '1st', sections: [{ name: 'A', strength: 30 }] },
    { id: 4, class: '2nd', sections: [{ name: 'A', strength: 30 }] },
    { id: 5, class: '3rd', sections: [{ name: 'A', strength: 30 }] },
    { id: 6, class: '4th', sections: [{ name: 'A', strength: 30 }] },
    { id: 7, class: '5th', sections: [{ name: 'A', strength: 30 }] }
  ];
  localStorage.setItem(`${prefix}_classes_${currentSession}`, JSON.stringify(defaultClasses));

  // 3. Initial Session Data (Notices, Homework, etc.)
  const initialSessionData = {
    homework: [],
    attendance: [],
    results: {},
    notices: [
      { 
        id: 'welcome', 
        title: `Welcome to ${schoolName} Digital Portal`, 
        date: new Date().toISOString().split('T')[0], 
        category: 'General', 
        priority: 'high', 
        desc: `Welcome to the new academic session. This portal is now active for ${schoolName}.` 
      }
    ],
    feeStats: { collected: 0, pending: 0, overdue: 0, total: 0 }
  };
  localStorage.setItem(`${prefix}_session_data_${currentSession}`, JSON.stringify(initialSessionData));

  // 4. Initial Fee Config
  const feeConfig = {
    classFees: { 'Nursery': 25000, 'KG': 25000, '1st': 30000, '2nd': 30000, '3rd': 35000, '4th': 35000, '5th': 40000 },
    transportFees: { 'Route 1': 12000, 'Route 2': 15000 }
  };
  localStorage.setItem(`${prefix}_global_fee_config`, JSON.stringify(feeConfig));
};

/**
 * Detects the current school based on the URL path.
 * Format: domain.com/schoolId/erp
 */
export const getActiveSchool = () => {
  const hashPath = window.location.hash.replace(/^#\/?/, '');
  const pathParts = hashPath.split('/').filter(p => p !== '');
  const allConfigs = getAllSchools();
  
  // Detect schoolId from the FIRST segment of the hash path
  let key = pathParts[0] || 'nms';
  
  // If the first part is 'agency', 'erp', or empty, default to nms or check params
  if (key === 'agency' || key === 'erp') {
    const searchParams = new URLSearchParams(window.location.search);
    const urlSchool = searchParams.get('school');
    key = urlSchool || 'nms';
  }

  const config = allConfigs[key] || allConfigs.default;
  return { ...config, key };
};
