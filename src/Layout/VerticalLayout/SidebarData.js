import { userData } from "../../store/getProfileData";

const SidebarData = [
  {
    label: "Menu",
    isMainMenu: true,
  },
  {
    label: "Dashboard",
    icon: "bx bx-tachometer icon nav-icon",
    url: "/dashboard",
    issubMenubadge: true,
    bgcolor: "bg-success",
    badgeValue: "5+",
  },
  {
    label: "Courses",
    isMainMenu: true,
  },
  {
    label: "Reels",
    icon: "bx bx-store icon nav-icon",
    url: "/reals",
    issubMenubadge: true,
  },
  {
    label: "Community",
    icon: "bx bx-store icon nav-icon",
    url: "/community",
    issubMenubadge: true,
  },
  {
    label: "market place",
    icon: "bx bx-store icon nav-icon",
    url: "/market-place",
    issubMenubadge: true,
  },
  {
    label: "Exam Free Courses",
    icon: "bx bx-store icon nav-icon",
    url: "/ComingSoonCourses",
  },
  {
    label: "Modules",
    icon: "bx bx-store icon nav-icon",
    url: "/Modules-list",
  },
  {
    label: "Images",
    url: "/ImagesFolder",
    icon: "bx bx-store icon nav-icon",
  },
  {
    label: "BoadCast",
    url: "/BoadCast",
    icon: "bx bx-store icon nav-icon",
  },
  {
    label: "Posts",
    url: "/posts",
    icon: "bx bx-store icon nav-icon",
  },
  {
    label: "Bank Search Question",
    url: "/SearchQuestion",
    icon: "bx bx-store icon nav-icon",
  },
  {
    label: "Search True False Question",
    url: "/SearchTrueFalseQuestion",
    icon: "bx bx-store icon nav-icon",
  }, // {
  //   label: "Time Stamp",
  //   url: "/timestamp",
  //   icon: "bx bx-store icon nav-icon",
  // },
  // {
  //   label: "Cases",
  //   url: "/CasesExam",
  //   icon: "bx bx-store icon nav-icon",
  // },
  // {
  //   label: "Inquires",
  //   url: "/inquires",
  //   icon: "bx bx-store icon nav-icon",
  // },
  {
    label: "E-book Store",
    url: "/e-book-store",
    icon: "bx bx-store icon nav-icon",
  },
  {
    label: "Voices",
    url: "/VoiceStore",
    icon: "bx bx-store icon nav-icon",
  },
  {
    label: "Users",
    url: "/Users",
    icon: "bx bx-store icon nav-icon",
  },
  // Users
  // {
  //   label: "Q-Bank",
  //   url: "/CourseGradesQBank",
  //   icon: "bx bx-store icon nav-icon",
  // },
  {
    label: "Add Courses Cards",
    icon: "bx bx-store icon nav-icon",
    url: "/copouns-list/add-copoun",
  },
  {
    label: "Add ebook Cards",
    icon: "bx bx-store icon nav-icon",
    url: "/copouns-list/add-ebook-copoun",
  },
  {
    label: "Add Grades Cards",
    icon: "bx bx-store icon nav-icon",
    url: "/AddGradesCopoun",
  },
  // {
  //   label: "Videos Groups",
  //   icon: "bx bx-store icon nav-icon",
  //   url: "/Groups",
  // },
  // {
  //   label: "Charge",
  //   icon: "bx bx-store icon nav-icon",
  //   url: "/Charge",
  // },
  // {
  //   label: "Videos",
  //   icon: "bx bx-store icon nav-icon",
  //   subItem: [
  //     { sublabel: "videos", link: "/videos" },
  //     { sublabel: "Add Video", link: "/videos/add-video" },
  //   ],
  // },
  // {
  //   label: "General Agenda",
  //   url: "/AgenaUniversities",
  //   icon: "bx bx-store icon nav-icon",
  // },
  {
    label: "Universities",
    icon: "bx bx-store icon nav-icon",
    url: "/universities",
  },
  {
    label: "Subscription",
    icon: "bx bx-store icon nav-icon",
    subItem: [
      { sublabel: "Subscription", link: "/subscription" },
      // { sublabel: "Ended Subscription", link: "/endedsubscription" },
      { sublabel: "Canceled Subscription", link: "/canceledsubscription" },
    ],
  },

  {
    label: "Students",
    icon: "bx bx-store icon nav-icon",
    subItem: [
      { sublabel: "Students Reports", link: "/studentsreports" },
      { sublabel: "List Students", link: "/students" },
      { sublabel: "Don't Marry", link: "/DoNotMarry" },
    ],
  },

  {
    label: "Exam",
    icon: "bx bx-store icon nav-icon",
    url: "/publicexam",
  },

  {
    label: "Reports",
    icon: "bx bx-store icon nav-icon",
    url: "/ReportsLessons",
  },

  // {
  //   label: "AllReports",
  //   icon: "bx bx-store icon nav-icon",
  //   url: "/AllReports",
  // },
  //
  // {
  //   label: "Live ( Zoom )",
  //   icon: "bx bx-store icon nav-icon",
  //   url: "/lives",
  // },
  // {
  //   label: "Live ( V Connect )",
  //   icon: "bx bx-store icon nav-icon",
  //   url: "/vConnect",
  // },
  // {
  //   label: "ClassPoint",
  //   icon: "bx bx-store icon nav-icon",
  //   url: "/ClassPoint",
  // },

  // {
  //   label: "TimeLine",
  //   icon: "bx bx-store icon nav-icon",
  //   url: "/TimeLine",
  // }, // ClassPoint
  // {
  //   label: "Zoom Emails",
  //   icon: "bx bx-store icon nav-icon",
  //   url: "/ZoomEmail",
  // }, // NewUniversities
  // {
  //   label: "Top & Not To Marry - Students",
  //   url: "/NewUniversities",
  //   icon: "bx bx-store icon nav-icon",
  // },
  // {
  //   label: "Polling",
  //   url: "/uniPolling",
  //   icon: "bx bx-store icon nav-icon",
  // },
  // Polling
  // {
  //   label: "Show Exam",
  //   icon: "bx bx-store icon nav-icon",
  //   subItem: [{ sublabel: "Exams", link: "/Univeritiesshowexams" }],
  // },

  // interactive
  // e-book
  // {
  //   label: "Add Material",
  //   icon: "bx bx-tachometer icon nav-icon",
  //   url: "/add-material"
  // },
  // {
  //   label: "Applications",
  //   isMainMenu: true,
  // },
  // {
  //   label: "Calendar",
  //   icon: "bx bx-calendar icon nav-icon",
  //   url: "/apps-calendar",
  // },
  // {
  //   label: "Chat",
  //   icon: "bx bx-chat icon nav-icon",
  //   url: "/apps-chat",
  //   issubMenubadge: true,
  //   bgcolor: "bg-danger",
  //   badgeValue: "Hot",
  // },
  // {
  //   label: "Email",
  //   icon: "bx bx-envelope icon nav-icon",
  //   subItem: [
  //     { sublabel: "Inbox", link: "/email-inbox" },
  //     { sublabel: "Read Email", link: "/email-read" },
  //   ],
  // },
  // {
  //   label: "Ecommerce",
  //   icon: "bx bx-store icon nav-icon",
  //   subItem: [
  //     { sublabel: "Courses", link: "/ecommerce-products" },
  //     { sublabel: "Product Detail", link: "/ecommerce-product-detail/1" },
  //     { sublabel: "Orders", link: "/ecommerce-orders" },
  //     { sublabel: "Customers", link: "/ecommerce-customers" },
  //     { sublabel: "Cart", link: "/ecommerce-cart" },
  //     { sublabel: "Checkout", link: "/ecommerce-checkout" },
  //     { sublabel: "Shops", link: "/ecommerce-shops" },
  //     { sublabel: "Add Product", link: "/ecommerce-add-product" },
  //   ],
  // },
  // {
  //   label: "Invoices",
  //   icon: "bx bx-receipt icon nav-icon",

  //   subItem: [
  //     { sublabel: "Invoice List", link: "/invoices-list" },
  //     { sublabel: "Invoice Detail", link: "/invoices-detail" },
  //   ],
  // },
  // {
  //   label: "Contacts",
  //   icon: "bx bxs-user-detail icon nav-icon",

  //   subItem: [
  //     { sublabel: "User Grid", link: "/contacts-grid" },
  //     { sublabel: "User List", link: "/contacts-list" },
  //     { sublabel: "User Profile", link: "/contacts-profile" },
  //   ],
  // },

  // {
  //   label: "Pages",
  //   isMainMenu: true,
  // },

  // {
  //   label: "Authentication",
  //   icon: "bx bx-user-circle icon nav-icon",

  //   subItem: [
  //     { sublabel: "Login", link: "/auth-login" },
  //     { sublabel: "Register", link: "/auth-register" },
  //     { sublabel: "Recover Password", link: "/auth-recoverpw" },
  //     { sublabel: "Lock Screen", link: "/auth-lock-screen" },
  //     { sublabel: "Log Out", link: "/auth-logout" },
  //     { sublabel: "Confirm Mail", link: "/auth-confirm-mail" },
  //     { sublabel: "Email Verification", link: "/auth-email-verification" },
  //     {
  //       sublabel: "Two Step Verification",
  //       link: "/auth-two-step-verification",
  //     },
  //   ],
  // },
  // {
  //   label: "Utility",
  //   icon: "bx bx-file icon nav-icon",

  //   subItem: [
  //     { sublabel: "Starter Page", link: "/pages-starter" },
  //     { sublabel: "Maintenance", link: "/pages-maintenance" },
  //     { sublabel: "Coming Soon", link: "/pages-comingsoon" },
  //     { sublabel: "Timeline", link: "/pages-timeline" },
  //     { sublabel: "FAQs", link: "/pages-faqs" },
  //     { sublabel: "Pricing", link: "/pages-pricing" },
  //     { sublabel: "Error 404", link: "/pages-404" },
  //     { sublabel: "Error 500", link: "/pages-500" },
  //   ],
  // },
  // {
  //   label: "Components",
  //   isMainMenu: true,
  // },
  // {
  //   label: "Bootstrap",
  //   icon: "bx bxl-bootstrap icon nav-icon",

  //   subItem: [
  //     { sublabel: "Alerts", link: "/ui-alerts" },
  //     { sublabel: "Buttons", link: "/ui-buttons" },
  //     { sublabel: "Cards", link: "/ui-cards" },
  //     { sublabel: "Carousel", link: "/ui-carousel" },
  //     { sublabel: "Dropdowns", link: "/ui-dropdowns" },
  //     { sublabel: "Grid", link: "/ui-grid" },
  //     { sublabel: "Images", link: "/ui-images" },
  //     { sublabel: "Modals", link: "/ui-modals" },
  //     { sublabel: "Offcanvas", link: "/ui-offcanvas" },
  //     { sublabel: "Placeholders", link: "/ui-placeholders" },
  //     { sublabel: "Progress Bars", link: "/ui-progressbars" },
  //     { sublabel: "Tabs & Accordions", link: "/ui-tabs-accordions" },
  //     { sublabel: "Typography", link: "/ui-typography" },
  //     { sublabel: "Video", link: "/ui-video" },
  //     { sublabel: "General", link: "/ui-general" },
  //     { sublabel: "Colors", link: "/ui-colors" },
  //   ],
  // },

  // {
  //   label: "Extended",
  //   icon: "bx bx-disc icon nav-icon",

  //   subItem: [
  //     { sublabel: "Lightbox", link: "/extended-lightbox" },
  //     { sublabel: "Range Slider", link: "/extended-rangeslider" },
  //     { sublabel: "Rating", link: "/extended-rating" },
  //     { sublabel: "Notifications", link: "/extended-notifications" },
  //   ],
  // },

  // {
  //   label: "Forms",
  //   icon: "bx bxs-eraser icon nav-icon",
  //   subItem: [
  //     { sublabel: "Basic Elements", link: "/form-elements" },
  //     { sublabel: "Validation", link: "/form-validation" },
  //     { sublabel: "Advanced Plugins", link: "/form-advanced" },
  //     { sublabel: "Editors", link: "/form-editor" },
  //     { sublabel: "File Upload", link: "/form-uploads" },
  //     { sublabel: "Wizard", link: "/form-wizard" },
  //     { sublabel: "Mask", link: "/form-mask" },
  //   ],
  // },
  // {
  //   label: "Tables",
  //   icon: "bx bx-list-ul icon nav-icon",
  //   subItem: [
  //     { sublabel: "Bootstrap Basic", link: "/tables-basic" },
  //     { sublabel: "Advance Tables", link: "/table-advanced" },
  //   ],
  // },
  // {
  //   label: "Charts",
  //   icon: "bx bxs-bar-chart-alt-2 icon nav-icon",
  //   subItem: [
  //     { sublabel: "Apex Charts", link: "/charts-apex" },
  //     { sublabel: "Chartjs", link: "/charts-chartjs" },
  //   ],
  // },
  // {
  //   label: "Icons",
  //   icon: "bx bx-aperture icon nav-icon",
  //   subItem: [
  //     { sublabel: "Feather", link: "/icons-feather" },
  //     { sublabel: "Boxicons", link: "/icons-boxicons" },
  //     { sublabel: "Material Design", link: "/icons-materialdesign" },
  //     { sublabel: "Dripicons", link: "/icons-dripicons" },
  //     { sublabel: "Font Awesome 5", link: "/icons-fontawesome" },
  //   ],
  // },
  // {
  //   label: "Maps",
  //   icon: "bx bx-map icon nav-icon",
  //   subItem: [
  //     { sublabel: "Google", link: "/maps-google" },
  //     { sublabel: "Vector", link: "/maps-vector" },
  //     { sublabel: "Leaflet", link: "/maps-leaflet" },
  //   ],
  // },
  // {
  //   label: "Multi Level",
  //   icon: "bx bx-share-alt icon nav-icon",
  //   subItem: [
  //     { sublabel: "Level 1.1", link: "/#" },
  //     {
  //       sublabel: "Level 1.2",
  //       link: "/#",
  //       subMenu: [{ title: "Level 2.1" }, { title: "Level 2.2" }],
  //     },
  //   ],
  // },
  {
    label: "Information",
    icon: "bx bx-store icon nav-icon",
    subItem: [
      { sublabel: "Policy", link: "/policy" },
      { sublabel: "CallCenter", link: "/callcenter" },
      // { sublabel: "Product Detail", link: "/ecommerce-product-detail/1" },
      // { sublabel: "Orders", link: "/ecommerce-orders" },
      // { sublabel: "Customers", link: "/ecommerce-customers" },
      // { sublabel: "Cart", link: "/ecommerce-cart" },
      // { sublabel: "Checkout", link: "/ecommerce-checkout" },
      // { sublabel: "Shops", link: "/ecommerce-shops" },
      // { sublabel: "Add Product", link: "/ecommerce-add-product" },
    ],
  },
];

export default SidebarData;
