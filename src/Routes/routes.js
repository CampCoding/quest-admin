/* eslint-disable no-unused-vars */
import React from "react";
import { Navigate } from "react-router-dom";

// DashBoard
import Dashboard from "../Pages/Dashboard/Index";

// Calendar
import Calendar from "../Pages/Calendar/index";
// Chat
import Chat from "../Pages/Chat/Chat";

// Email
import Inbox from "../Pages/Email/Inbox";
import ReadEmail from "../Pages/Email/ReadEmail";
import ExamListPublicTableResult from "../Pages/publicexams/ExamTable/examListPublicTableResult";
// Ecommerce
// import AddProduct from '../Pages/Ecommerce/AddProduct';
// import Cart from '../Pages/Ecommerce/Cart';
// import Checkout from '../Pages/Ecommerce/Checkout';
// import Customers from '../Pages/Ecommerce/EcommerceCustomer/Customers';
// import Orders from '../Pages/Ecommerce/EcommerceOrder/Orders';
// import ProductDetail from '../Pages/Ecommerce/ProductDetail';
// import Product from '../Pages/Ecommerce/Products';
// import Shops from '../Pages/Ecommerce/Shops';

// Invoices
// import InvoicesDetail from '../Pages/Invoices/InvoiceDetails';
// import InvoicesList from '../Pages/Courses/CoursesList/CoursesList';

// Contact
import UserGrid from "../Pages/Contacts/UserGrid";
import UserList from "../Pages/Contacts/UserList";
import ContactUserProfile from "../Pages/Contacts/UserProfile";

// UiElememnt
import UiAlerts from "../Pages/UIElements/UiAlerts";
import UiButtons from "../Pages/UIElements/UiButtons";
import UiCards from "../Pages/UIElements/UiCards";
import UiCarousel from "../Pages/UIElements/UiCarousel";
import UiColors from "../Pages/UIElements/UiColors";
import UiDropdowns from "../Pages/UIElements/UiDropdowns";
import UiGeneral from "../Pages/UIElements/UiGeneral";
import UiGrid from "../Pages/UIElements/UiGrid";
import UiImages from "../Pages/UIElements/UiImages";
import UiModals from "../Pages/UIElements/UiModals";
import UiOffcanvas from "../Pages/UIElements/UiOffcanvas";
import UiPlaceholders from "../Pages/UIElements/UiPlaceholders";
import UiProgressBars from "../Pages/UIElements/UiProgressBars";
import UiTabs from "../Pages/UIElements/UiTabs&Accordions";
import UiTypography from "../Pages/UIElements/UiTypography";
import UiVideo from "../Pages/UIElements/UiVideo";

// Extended Element
import ExLightbox from "../Pages/ExtendedElement/ExLightbox";
import ExNotification from "../Pages/ExtendedElement/ExNotification";
import ExRangSlider from "../Pages/ExtendedElement/ExRangeSlider";
import ExRating from "../Pages/ExtendedElement/ExRating";

// Forms
import AdvancedPlugins from "../Pages/Forms/AdvancedPlugins";
import BasicElements from "../Pages/Forms/BasicElements";
import Editors from "../Pages/Forms/Editors";
import FileUpload from "../Pages/Forms/FileUpload";
import Mask from "../Pages/Forms/Mask";
import Validation from "../Pages/Forms/Validation";
import Wizard from "../Pages/Forms/Wizard";

// Tables
import AdvanceTable from "../Pages/Tables/AdvanceTable";
import BootstrapBasic from "../Pages/Tables/BootstrapBasic";

// Charts
import ApexCharts from "../Pages/Charts/ApexCharts";
import ChartjsCharts from "../Pages/Charts/Chartjs";

// Icons
import BoxIcons from "../Pages/Icons/Boxicons";
import DripIcons from "../Pages/Icons/Dripicons";
import FeatherIcons from "../Pages/Icons/Feathericon";
import FontAwesomeIcons from "../Pages/Icons/FontAwesome";
import MaterialDesignIcons from "../Pages/Icons/MaterialDesign";

// Maps
import GoogleMaps from "../Pages/Maps/GoogleMaps";
import LeafletMaps from "../Pages/Maps/LeafletMaps";
import VectorMaps from "../Pages/Maps/VectorMaps";

// Inner Authentication Pages
import ConfirmMail from "../Pages/InnerAuthPages/ConfirmMail";
import EmailVerification from "../Pages/InnerAuthPages/EmailVerification";
import LockScreen from "../Pages/InnerAuthPages/LockScreen";
import InnerLogout from "../Pages/InnerAuthPages/Logout";
import RecoverPassword from "../Pages/InnerAuthPages/RecoverPassword";
import InnerRegister from "../Pages/InnerAuthPages/Register";
import TwoStepVerification from "../Pages/InnerAuthPages/TwoStepVerification";
import InnerLogin from "../Pages/InnerAuthPages/login";

// Utility Pages
import Error404 from "../Pages/Utility/pages-404";
import Error500 from "../Pages/Utility/pages-500";
import ComingSoonPage from "../Pages/Utility/pages-comingsoon";
import FaqsPage from "../Pages/Utility/pages-faqs";
import MaintenancePage from "../Pages/Utility/pages-maintenance";
import PricingPage from "../Pages/Utility/pages-pricing";
import StarterPage from "../Pages/Utility/pages-starter";
import TimelinePage from "../Pages/Utility/pages-timeline";

// Import Authentication pages
import ForgetPasswordPage from "../Pages/Authentication/ForgetPassword";
import Login from "../Pages/Authentication/Login";
import Logout from "../Pages/Authentication/Logout";
import Register from "../Pages/Authentication/Register";
import UserProfile from "../Pages/Authentication/user-profile";
import AddCourse from "../Pages/Courses/AddCourse";
import AddMaterial from "../Pages/Courses/AddMaterial";
import Courses from "../Pages/Courses/CoursesList/CoursesList";
import CoursesShowExams from "../Pages/CoursesShowExams/CoursesList/CoursesList";
import Gradesshowexams from "../Pages/Gradesshowexams/Grade";
import Gradeshowstudents from "../Pages/Gradesshowstudents/Grade";
import Reports from "../Pages/Reports/CoursesList/CoursesList";
import Universities from "../Pages/Univerities/Universities";
import Univeritiesshowexams from "../Pages/Univeritiesshowexams/Universities";
import UniversitiesShowStudents from "../Pages/Univeritiesshowstudents/Universities";
import Live from "../Pages/live/live";

import Grade from "../Pages/Grades/Grade";
//
// Courses
// import AddProduct from '../Pages/Ecommerce/AddProduct';
// import Cart from '../Pages/Ecommerce/Cart';
// import Checkout from '../Pages/Ecommerce/Checkout';
// import Courses from '../Pages/Courses/CoursesList/Courses';
// import Orders from '../Pages/Ecommerce/EcommerceOrder/Orders';
// import ProductDetail from '../Pages/Ecommerce/ProductDetail';
// import Product from '../Pages/Ecommerce/Products';
// import Shops from '../Pages/Ecommerce/Shops';

import CourseDetail from "../Pages/Courses/CourseDetail";
import Lessons from "../Pages/Lessons/Lessons";
import ReportsLessons from "../Pages/ReportsLessons/Lessons";
import Units from "../Pages/Units/Units";
import Policy from "../Pages/information/policy/Units";
// ReportsLessons
import AddQuestions from "../Pages/AddQuestions/AddQuestion";
import Exam from "../Pages/Exams/Exams";
import Question from "../Pages/Exams/questions";
import AddBook from "../Pages/ebook/Addbook";
import Books from "../Pages/ebook/BooksList/BooksList";
import PublicExams from "../Pages/publicexams/Exams";
import Publicexamsshowexams from "../Pages/publicexamsshowexams/Exams";
import Student from "../Pages/student";
import StudentReports from "../Pages/studentreports";
import AddCopoun from "../Pages/sub-copouns/AddCopoun";
import Copouns from "../Pages/sub-copouns/CopounsList/CopounsList";
import Subscription from "../Pages/subscription";
import CanceledSubscription from "../Pages/subscription/canceled";
import EndedSubscription from "../Pages/subscription/ended";
import Videos from "../Pages/video/VideosList/VideosList";
import StudentList from "../Pages/video/VideosList/studentList";
import VideoQuestionList from "../Pages/video/VideosList/videoQuestionList";
import AgenaUniversities from "../Pages/agenda/university";
import AgendaGrade from "../Pages/agenda/Grade";
import AgenaGradesPdfs from "../Pages/agenda/AgenaGradesPdfs";
import AllReports from "../Pages/AllReports/Lessons";
import ClassPoint from "../Pages/ClassPoint";
import CourseCasesTask from "../Pages/CourseCasesTask/CourseCasesTasks";
import CourseWrQuesTask from "../Pages/CourseWrQuesTask/CourseWrQuesTask";
import TaskAnswerList from "../Pages/Courses/AnswerList";
import ExamQuestion from "../Pages/ExamQuestions/ExamQuestion";
import ResultExamListTable from "../Pages/Exams/ExamTable/ExamResultTableList";
import PollGrades from "../Pages/Grades_Poll/Grade";
import NewGrades from "../Pages/Grades_new/Grade";
import ImagesFolder from "../Pages/ImageFolder/ImageFolder";
import TopicCases from "../Pages/InteractiveTopics/casestopics";
import Topic_Flash_Cards from "../Pages/InteractiveTopics/flashcardstopics";
import TopicTweets from "../Pages/InteractiveTopics/tweetstopics";
import TopicWrittenQuestions from "../Pages/InteractiveTopics/writtenquestiontopics";
import LiveQuesMcq from "../Pages/LiveQuesMcq/LiveQuesMcq";
import Lives from "../Pages/Lives/Lives";
import VConnectLives from "../Pages/Lives/vConnect";
import Publicexamquestion from "../Pages/PublicExamQuestions/ExamQuestion";
import StudenCourseUnit from "../Pages/StudentCourses/StudenCourseUnit";
import StudentCourses from "../Pages/StudentCourses/StudentCourses";
import Studentcourseunitvideoslist from "../Pages/StudentCourses/Units/UnitTable/UnitTableList";
import StudentQuestions from "../Pages/StudentsQuestions/StudenQuestions";
import TimeLine from "../Pages/TimeLineEvent";
import TimeStamp from "../Pages/TimeStamp/timestamp";
import UniqQuestion from "../Pages/UnitQuestion/UniqQuestion";
import UnitAnswerList from "../Pages/Units/UnitTable/AnswerList";
import Answers from "../Pages/Units/UnitTable/answers";
import Topics from "../Pages/Units/UnitTable/topics";
import TopicsMCQQuestions from "../Pages/Units/mcqquestion";
import PollUniversities from "../Pages/Univerities_Poll/Universities";
import NewUniversities from "../Pages/Univerities_new/Universities";
import VideosQuestions from "../Pages/VideosQuestions/VideosQuestions";
import Indexing from "../Pages/bookCatalougue/timestamp";
import DoNotMarry from "../Pages/donontmarry";
import EBook from "../Pages/eBookStore";
import Images from "../Pages/images";
import CallCenter from "../Pages/information/call_center/Units";
import Inquiries from "../Pages/inquiries/Inquires";
import Polling from "../Pages/polling";
import StudentSubmision from "../Pages/publicexams/ExamTable/StudentSubmision";
import StudentSubmisionList from "../Pages/publicexams/ExamTable/StudentSubmisionList";
import ExamQuestionStatistics from "../Pages/publicexams/ExamTable/examQuestionStatistics";
import StudenCourseUnitVideos from "../Pages/studentcourseunitvideos/StudentCourseUnitVideos";
import StudentNew from "../Pages/studentreportsnew";
import TopicLessons from "../Pages/topicLessons/Lessons";
import Users from "../Pages/users";
import AddVideo from "../Pages/video/Addvideo";
import UnitVideo from "../Pages/video/UnitVideos/Units";
import AnswerList from "../Pages/video/VideosList/AnswerList";
import UnitStudentList from "../Pages/video/VideosList/studentList";
import VideoMCQQuestions from "../Pages/video/mcqquestion";
import ZoomEmail from "../Pages/zoom";
import { userData } from "../store/getProfileData";
import Mainpost from "../Pages/posts/MainPosts/Mainpost";
import EbookStats from "../Pages/ebook/bookStats";
import StudentBookStats from "../Pages/ebook/StudentBookStats";
import VideosStats from "../Pages/Lessons/videosStats";
import StudentVideosStats from "../Pages/Lessons/StudentVideosStats";
import Notifications from "../Pages/student/notification";
import VideoRates from "../Pages/Lessons/VideoRates";
import ComingSoonCourses from "../Pages/Courses/CoursesList/ComingSoonCourses";
import Groups from "../Pages/groups";
import GroupsVideos from "../Pages/groupVideos/VideosList/VideosList";
import Agora from "../Pages/agora";
import { ConnectForm } from "../Pages/agora/connectForm";
import { LiveVideo } from "../Pages/agora/LiveVideo";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import CasesExam from "../Pages/cases";
import CasesMCQQuestions from "../Pages/cases/mcqquestion";
import CasesTasksTopics from "../Pages/Units/UnitTable/casesTopics";
import CourseGradesQBank from "../Pages/QBanks";
import SearchQuestion from "../Pages/Units/searchQuestion";
import VoiceStore from "../Pages/eBookStore/voicestore";
import BoadCasts from "../Pages/boadcast/MainboadCasts/MainboadCast";
import TrueFalseTopics from "../Pages/Units/UnitTable/truefalsetopics";
import TopicTrueFalseQuestionList from "../Pages/Units/UnitTable/TrueFalseQuestions";
import MatchingTopics from "../Pages/Units/UnitTable/matchingtopics";
import MatchingQuestionsList from "../Pages/Units/UnitTable/MatchingQuestions";
import SearchTrueFalseQuestion from "../Pages/Units/searchTrueFalseQuestion";
import AddGradesCopoun from "../Pages/sub-copouns/AddCardsSubscriptionFroups";
import Charge from "../Pages/eBookStore/Charge";
import Reals from "../Pages/Reals/Reals";
import Community from "../Pages/Community/Community";
import MarketPlace from "../Pages/MarketPlace/MarketPlace";
import MarketOffers from "../Pages/MarketPlace/MarketOffers";
import Modules from "../Pages/Courses/CoursesList/Modules";
import ModuleCourses from "../Pages/Courses/ModuleCourses";
import StudentStatistics from "../Pages/student/StudentTable/StudentStatistics";
import Lessonsbooks from "../Pages/Lessons/Lessonsbooks";

// import MCQSearch from "../Pages/mcqSearch";
// import Indexing from "../Pages/TimeStamp/timestamp";

const permissions = userData?.permissions;

// import DailyIncome from "../Pages/subscription/dailyIncome";
let agoraClient = AgoraRTC.createClient({ codec: "vp8", mode: "rtc" });

const authProtectedRoutes = [
  // dashboard
  { path: "/dashboard", component: <Dashboard /> },

  // Profile
  { path: "/userprofile", component: <UserProfile /> },
  { path: "/VoiceStore", component: <VoiceStore /> },
  // Calendar
  { path: "/apps-calendar", component: <Calendar /> },
  { path: "/CasesExam", component: <CasesExam /> },
  { path: "/CasesMCQQuestions", component: <CasesMCQQuestions /> },
  // CasesMCQQuestions
  // CasesExam
  { path: "/Agora", component: <ConnectForm /> },
  { path: "/CourseGradesQBank", component: <CourseGradesQBank /> },
  // CourseGradesQBank
  {
    path: "/via",
    component: (
      <AgoraRTCProvider client={agoraClient}>
        <LiveVideo />
      </AgoraRTCProvider>
    ),
  },

  // Agora

  // Chat
  { path: "/apps-chat", component: <Chat /> },

  // Email
  { path: "/email-inbox", component: <Inbox /> },
  { path: "/email-read", component: <ReadEmail /> },
  { path: "/AddGradesCopoun", component: <AddGradesCopoun /> },
  // Ecommerce
  // { path: "/ecommerce-product-detail/:id", component: <ProductDetail /> },
  // { path: "/ecommerce-products", component: <Product /> },
  // { path: "/ecommerce-orders", component: <Orders /> },
  // { path: "/ecommerce-customers", component: <Customers /> },
  // { path: "/ecommerce-cart", component: <Cart /> },
  // { path: "/ecommerce-checkout", component: <Checkout /> },
  // { path: "/ecommerce-shops", component: <Shops /> },
  // { path: "/ecommerce-add-product", component: <AddProduct /> },
  // Courses
  { path: "/reals", component: <Reals /> },
  { path: "/community", component: <Community /> },
  { path: "/market-place", component: <MarketPlace /> },
  { path: "/market-place/:marketplace_id/offers", component: <MarketOffers /> },

  { path: "/Modules-list", component: <Modules /> },
  {
    path: "/Modules-list/:module_id/ModuleCourses",
    component: <ModuleCourses />,
  },
  // { path: "/Modules-list/add-course", component: <AddCourse /> },
  {
    path: "/Modules-list/:module_id/ModuleCourses/add-course",
    component: <AddCourse />,
  },

  { path: "/Indexing", component: <Indexing /> },
  { path: "/ZoomEmail", component: <ZoomEmail /> },
  { path: "/Notifications", component: <Notifications /> },
  // Notifications
  {
    path: "/reports-list",
    component:
      permissions?.includes("*21_1") ||
      permissions?.startsWith("21_1") ||
      permissions == "all" ? (
        <Reports />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/ReportsLessons", component: <ReportsLessons /> },
  { path: "/AllReports", component: <AllReports /> },
  { path: "/video/VideoRates", component: <VideoRates /> },
  { path: "/ComingSoonCourses", component: <ComingSoonCourses /> },
  // ComingSoonCourses
  // VideoRates
  // ReportsLessons
  {
    path: "/copouns-list",
    component:
      permissions?.includes("*14_1") ||
      permissions?.startsWith("14_1") ||
      permissions == "all" ? (
        <Copouns />
      ) : (
        <Dashboard />
      ),
  },
  {
    path: "/courses-list/add-course",
    component:
      permissions?.includes("*1_1") ||
      permissions?.startsWith("1_1") ||
      permissions == "all" ? (
        <AddCourse />
      ) : (
        <Dashboard />
      ),
  },
  {
    path: "/ComingSoonCourses/add-course",
    component:
      permissions?.includes("*1_1") ||
      permissions?.startsWith("1_1") ||
      permissions == "all" ? (
        <AddCourse />
      ) : (
        <Dashboard />
      ),
  },
  {
    path: "/copouns-list/add-copoun",
    component:
      permissions?.includes("*14_1") ||
      permissions?.startsWith("14_1") ||
      permissions == "all" ? (
        <AddCopoun />
      ) : (
        <Dashboard />
      ),
  },
  {
    path: "/copouns-list/add-ebook-copoun",
    component:
      permissions?.includes("*14_1") ||
      permissions?.startsWith("14_1") ||
      permissions == "all" ? (
        <AddCopoun />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/videosquestions", component: <VideosQuestions /> },
  { path: "/studentsquestions", component: <StudentQuestions /> },
  { path: "/videosStats", component: <VideosStats /> },
  // VideosStats
  {
    path: "/examListPublicResult",
    component:
      permissions?.includes("*24_1") ||
      permissions?.startsWith("24_1") ||
      permissions == "all" ? (
        <ExamListPublicTableResult />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/indvidualResults", component: <StudentSubmision /> },
  { path: "/indvidualResultsList", component: <StudentSubmisionList /> },
  // indvidualResultsList
  // indvidualResults
  { path: "/examQuestionStatistics", component: <ExamQuestionStatistics /> },
  // reports-list
  { path: "add-material", component: <AddMaterial /> },
  { path: "/coursedetail", component: <CourseDetail /> },
  {
    path: "/units",
    component:
      permissions?.includes("*3_4") ||
      permissions?.startsWith("3_4") ||
      permissions == "all" ? (
        <Units />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/AgenaUniversities", component: <AgenaUniversities /> },
  { path: "/AgenaGrades/:univ_id", component: <AgendaGrade /> },
  {
    path: "/AgenaGradesPdfs/:univ_id/:grade_id",
    component: <AgenaGradesPdfs />,
  },
  { path: "/lessons", component: <Lessons /> },
  {
    path: "/lessons/uni/:university_id/grade/:grade_id",
    component: <Lessonsbooks />,
  },
  { path: "/e-book/add-book", component: <AddBook /> },
  { path: "/e-book", component: <Books /> },
  { path: "/addques", component: <AddQuestions /> },
  { path: "/StudentBookStats", component: <StudentBookStats /> },
  // StudentBookStats
  // { path: '/interactive', component: <Interactive /> },
  {
    path: "/exam",
    component:
      permissions?.includes("*20_7") ||
      permissions?.startsWith("20_7") ||
      permissions == "all" ? (
        <Exam />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/unitquestion", component: <UniqQuestion /> },
  { path: "/examquestion", component: <ExamQuestion /> },
  { path: "/studentcouunits", component: <StudenCourseUnit /> },
  { path: "/questions", component: <Question /> },
  {
    path: "/subscription",
    component:
      permissions?.includes("*18_1") ||
      permissions?.startsWith("18_1") ||
      permissions == "all" ? (
        <Subscription />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/endedsubscription", component: <EndedSubscription /> },
  { path: "/studentcourseunitvideos", component: <StudenCourseUnitVideos /> },
  {
    path: "/inquires",
    component:
      permissions?.includes("*25_3") ||
      permissions?.startsWith("25_3") ||
      permissions == "all" ? (
        <Inquiries />
      ) : (
        <Dashboard />
      ),
  },
  // /inquires/inquires
  {
    path: "/studentcourseunitvideoslist",
    component: <Studentcourseunitvideoslist />,
  },
  {
    path: "/canceledsubscription",
    component:
      permissions?.includes("*18_2") ||
      permissions?.startsWith("18_2") ||
      permissions == "all" ? (
        <CanceledSubscription />
      ) : (
        <Dashboard />
      ),
  },
  {
    path: "/students",
    component:
      permissions?.includes("*19_1") ||
      permissions?.startsWith("19_1") ||
      permissions == "all" ? (
        <Student />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/studentsreports", component: <StudentReports /> },
  { path: "/newStudents", component: <StudentNew /> },
  // StudentNew
  {
    path: "/videos",
    component:
      permissions?.includes("*15_5") ||
      permissions?.startsWith("15_5") ||
      permissions == "all" ? (
        <Videos />
      ) : (
        <Dashboard />
      ),
  },
  {
    path: "/videos/add-video",
    component:
      permissions?.includes("*15_1") ||
      permissions?.startsWith("15_1") ||
      permissions == "all" ? (
        <AddVideo />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/videos/unit-videos", component: <UnitVideo /> },
  {
    path: "/grade",
    component:
      permissions?.includes("*17_4") ||
      permissions?.startsWith("17_4") ||
      permissions == "all" ? (
        <Grade />
      ) : (
        <Dashboard />
      ),
  },
  {
    path: "/universities",
    component:
      permissions?.includes("*16_4") ||
      permissions?.startsWith("16_4") ||
      permissions == "all" ? (
        <Universities />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/StudentCourses", component: <StudentCourses /> },
  { path: "/video/VideoMCQQuestions", component: <VideoMCQQuestions /> },
  { path: "/Polling", component: <Polling /> },
  { path: "/uniPolling", component: <PollUniversities /> },
  { path: "/gradePolling", component: <PollGrades /> },
  { path: "/videoStats", component: <VideosStats /> },
  { path: "/StudentVideosStats", component: <StudentVideosStats /> },
  { path: "/Groups", component: <Groups /> },
  { path: "/GroupsVideos", component: <GroupsVideos /> },
  // GroupsVideos
  // Groups
  // StudentVideosStats
  // videoStats
  // Polling
  {
    path: "/publicexam",
    component:
      permissions?.includes("*20_7") ||
      permissions?.startsWith("20_7") ||
      permissions == "all" ? (
        <PublicExams />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/publicexamsshowexams", component: <Publicexamsshowexams /> },
  { path: "/publicexamquestion", component: <Publicexamquestion /> },
  { path: "/BoadCast", component: <BoadCasts /> },
  {
    path: "/exam_result",
    component:
      permissions?.includes("*24_1") ||
      permissions?.startsWith("24_1") ||
      permissions == "all" ? (
        <ResultExamListTable />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/DoNotMarry", component: <DoNotMarry /> },
  {
    path: "/policy",
    component:
      permissions?.includes("*22_6") ||
      permissions?.startsWith("22_6") ||
      permissions == "all" ? (
        <Policy />
      ) : (
        <Dashboard />
      ),
  },
  {
    path: "/callcenter",
    component:
      permissions?.includes("*22_5") ||
      permissions?.startsWith("22_5") ||
      permissions == "all" ? (
        <CallCenter />
      ) : (
        <Dashboard />
      ),
  },
  { path: "/live", component: <Live /> },
  { path: "/Univeritiesshowexams", component: <Univeritiesshowexams /> },
  { path: "/Gradesshowexams", component: <Gradesshowexams /> },
  { path: "/CoursesShowExams", component: <CoursesShowExams /> },
  { path: "/Univeritiesshowstudents", component: <UniversitiesShowStudents /> },
  { path: "/Gradesshowstudents", component: <Gradeshowstudents /> },
  // { path: "/studentsshowstudents", component: <CoursesShowExams /> },
  { path: "/videos/answeredStudents", component: <StudentList /> },
  {
    path: "/videos/answeredStudents/studentVideoAnswers",
    component: <AnswerList />,
  },
  { path: "/livemcqquestion", component: <LiveQuesMcq /> },
  // { path: "/live", component: <LivePage /> },
  { path: "/lives", component: <Lives /> },
  { path: "/vConnect", component: <VConnectLives /> },
  { path: "/ClassPoint", component: <ClassPoint /> },
  { path: "/TimeLine", component: <TimeLine /> }, // ClassPoint
  { path: "/topics", component: <Topics /> },
  { path: "/TrueFalseTopics", component: <TrueFalseTopics /> },
  {
    path: "/TopicTrueFalseQuestionList",
    component: <TopicTrueFalseQuestionList />,
  },
  { path: "/matchingtopics", component: <MatchingTopics /> },
  {
    path: "/MatchingQuestionList",
    component: <MatchingQuestionsList />,
  },
  { path: "/TopicMcqQuestionList", component: <TopicsMCQQuestions /> },
  { path: "/answers", component: <Answers /> },
  { path: "/timestamp", component: <TimeStamp /> },
  { path: "/casesTopics", component: <CasesTasksTopics /> },
  { path: "/SearchQuestion", component: <SearchQuestion /> },
  { path: "/Charge", component: <Charge /> },
  { path: "/SearchTrueFalseQuestion", component: <SearchTrueFalseQuestion /> }, // CasesTasksTopics
  {
    path: "/e-book-store",
    component:
      permissions?.includes("*12_5") ||
      permissions?.startsWith("12_5") ||
      permissions == "all" ? (
        <EBook />
      ) : (
        <Dashboard />
      ),
  },

  { path: "/posts", component: <Mainpost /> },
  {
    path: "/units/answeredStudents/studentUnitAnswers",
    component: <UnitAnswerList />,
  },
  { path: "/units/answeredStudents", component: <UnitStudentList /> },
  { path: "/coursewrquestask", component: <CourseWrQuesTask /> },
  { path: "/coursecasesquestask", component: <CourseCasesTask /> },
  { path: "/taskResult", component: <TaskAnswerList /> },
  { path: "/interActiveTopics", component: <TopicLessons /> },
  { path: "/interActiveTopicsTweets", component: <TopicTweets /> },
  {
    path: "/interActiveTopicsWrittenQuestions",
    component: <TopicWrittenQuestions />,
  },
  { path: "/interActiveTopicsFlashCards", component: <Topic_Flash_Cards /> },
  { path: "/interActiveTopicsCases", component: <TopicCases /> },
  { path: "/videos/video-questions", component: <VideoQuestionList /> },
  { path: "/images", component: <Images /> },
  { path: "/ImagesFolder", component: <ImagesFolder /> },
  { path: "/Users", component: <Users /> },
  { path: "/StudentStatistics/:student_id", component: <StudentStatistics /> },
  // Users
  // ImagesFolder
  // /videos/video-questions
  // Topic_Flash_Cards
  // interActiveTopics
  // answers
  // TopicMcqQuestionList
  // {path:'/dailyIncome',component:<DailyIncome />},
  // questions
  // AddBook
  // courses-list/add-course

  // courses-list
  // Invoices
  // { path: "/invoices-detail", component: <InvoicesDetail /> },
  // { path: "/invoices-list", component: <InvoicesList /> },

  // Contact
  { path: "/contacts-grid", component: <UserGrid /> },
  { path: "/contacts-list", component: <UserList /> },
  { path: "/contacts-profile", component: <ContactUserProfile /> },

  // Utility Pages
  { path: "/pages-starter", component: <StarterPage /> },
  { path: "/pages-timeline", component: <TimelinePage /> },
  { path: "/pages-faqs", component: <FaqsPage /> },
  { path: "/pages-pricing", component: <PricingPage /> },

  // UiElement
  { path: "/ui-alerts", component: <UiAlerts /> },
  { path: "/ui-buttons", component: <UiButtons /> },
  { path: "/ui-cards", component: <UiCards /> },
  { path: "/ui-carousel", component: <UiCarousel /> },
  { path: "/ui-dropdowns", component: <UiDropdowns /> },
  { path: "/ui-grid", component: <UiGrid /> },
  { path: "/ui-images", component: <UiImages /> },
  { path: "/ui-modals", component: <UiModals /> },
  { path: "/ui-offcanvas", component: <UiOffcanvas /> },
  { path: "/ui-placeholders", component: <UiPlaceholders /> },
  { path: "/ui-progressbars", component: <UiProgressBars /> },
  { path: "/ui-tabs-accordions", component: <UiTabs /> },
  { path: "/ui-typography", component: <UiTypography /> },
  { path: "/ui-video", component: <UiVideo /> },
  { path: "/ui-general", component: <UiGeneral /> },
  { path: "/ui-colors", component: <UiColors /> },

  // Extended Element
  { path: "/extended-lightbox", component: <ExLightbox /> },
  { path: "/extended-rangeslider", component: <ExRangSlider /> },
  { path: "/extended-rating", component: <ExRating /> },
  { path: "/extended-notifications", component: <ExNotification /> },

  // Forms
  { path: "/form-elements", component: <BasicElements /> },
  { path: "/form-validation", component: <Validation /> },
  { path: "/form-advanced", component: <AdvancedPlugins /> },
  { path: "/form-editor", component: <Editors /> },
  { path: "/form-uploads", component: <FileUpload /> },
  { path: "/form-wizard", component: <Wizard /> },
  { path: "/form-mask", component: <Mask /> },

  // Tables
  { path: "/tables-basic", component: <BootstrapBasic /> },
  { path: "/table-advanced", component: <AdvanceTable /> },

  // Charts
  { path: "/charts-apex", component: <ApexCharts /> },
  { path: "/charts-chartjs", component: <ChartjsCharts /> },

  // Icons
  { path: "/icons-feather", component: <FeatherIcons /> },
  { path: "/icons-boxicons", component: <BoxIcons /> },
  { path: "/icons-materialdesign", component: <MaterialDesignIcons /> },
  { path: "/icons-dripicons", component: <DripIcons /> },
  { path: "/icons-fontawesome", component: <FontAwesomeIcons /> },

  // Maps
  { path: "/maps-google", component: <GoogleMaps /> },
  { path: "/maps-vector", component: <VectorMaps /> },
  { path: "/maps-leaflet", component: <LeafletMaps /> },
  { path: "/NewUniversities", component: <NewUniversities /> },
  { path: "/NewGrades", component: <NewGrades /> },
  { path: "/EbookStats", component: <EbookStats /> },
  // EbookStats
  // NewUniversities

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  // Inner Auth Pages
  { path: "/auth-login", component: <InnerLogin /> },
  // Mainpost
  { path: "/auth-register", component: <InnerRegister /> },
  { path: "/auth-recoverpw", component: <RecoverPassword /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
  { path: "/auth-logout", component: <InnerLogout /> },
  { path: "/auth-confirm-mail", component: <ConfirmMail /> },
  { path: "/auth-email-verification", component: <EmailVerification /> },
  { path: "/auth-two-step-verification", component: <TwoStepVerification /> },

  // Utility Pages
  { path: "/pages-maintenance", component: <MaintenancePage /> },
  { path: "/pages-comingsoon", component: <ComingSoonPage /> },
  { path: "/pages-404", component: <Error404 /> },
  { path: "/pages-500", component: <Error500 /> },
];

export { authProtectedRoutes, publicRoutes };
