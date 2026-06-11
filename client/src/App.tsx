import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";
import CategoryPage from "./pages/CategoryPage";
import TagPage from "./pages/TagPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import TimelinePage from "./pages/TimelinePage";
import WatchPage from "./pages/WatchPage";
import SubmitArticlePage from "./pages/SubmitArticlePage";
import ContactPage from "./pages/ContactPage";
import AdvertisePage from "./pages/AdvertisePage";
import SupportPage from "./pages/SupportPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import SearchPage from "./pages/SearchPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminPostEdit from "./pages/admin/AdminPostEdit";
import AdminPostNew from "./pages/admin/AdminPostNew";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";
import PricePage from "./pages/PricePage";
import SubmitProjectPage from "./pages/SubmitProjectPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import ManageSubscriptionsPage from "./pages/ManageSubscriptionsPage";
import ExplorerPage from "./pages/explorer/ExplorerPage";
import BlockPage from "./pages/explorer/BlockPage";
import TxPage from "./pages/explorer/TxPage";
import AddressPage from "./pages/explorer/AddressPage";
import BakersPage from "./pages/explorer/BakersPage";
import StakingPage from "./pages/StakingPage";
import ArtPage from "./pages/ArtPage";
import ToolsPage from "./pages/tools/ToolsPage";
import WalletInspectorPage from "./pages/tools/WalletInspectorPage";
import NftGalleryPage from "./pages/tools/NftGalleryPage";
import WhaleWatcherPage from "./pages/tools/WhaleWatcherPage";
import RewardCalculatorPage from "./pages/tools/RewardCalculatorPage";
import PortfolioTrackerPage from "./pages/tools/PortfolioTrackerPage";
import AddressBookPage from "./pages/tools/AddressBookPage";
import TokenPriceHistoryPage from "./pages/tools/TokenPriceHistoryPage";
import AirdropCheckerPage from "./pages/tools/AirdropCheckerPage";
import BatchAddressLookupPage from "./pages/tools/BatchAddressLookupPage";
import TnsLookupPage from "./pages/tools/TnsLookupPage";
import LiveOpsMonitorPage from "./pages/tools/LiveOpsMonitorPage";
import SmartContractInspectorPage from "./pages/tools/SmartContractInspectorPage";
import DefiDashboardPage from "./pages/tools/DefiDashboardPage";
import DefiProtocolPage from "./pages/tools/DefiProtocolPage";
import LiveAuctionTrackerPage from "./pages/tools/LiveAuctionTrackerPage";
import TopCollectorsPage from "./pages/tools/TopCollectorsPage";
import CollectionStatsPage from "./pages/tools/CollectionStatsPage";
import TranslatedArticlePage from "./pages/TranslatedArticlePage";
import LocaleArchivePage from "./pages/LocaleArchivePage";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchPage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/tag/:slug" component={TagPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/projects/:slug" component={ProjectDetailPage} />
      <Route path="/tezos-projects" component={ProjectsPage} />
      <Route path="/project/:slug" component={ProjectDetailPage} />
      <Route path="/timeline" component={TimelinePage} />

      <Route path="/submit-article" component={SubmitArticlePage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/advertise" component={AdvertisePage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/disclaimer" component={DisclaimerPage} />

      {/* Admin routes (protected inside components) */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/posts" component={AdminPosts} />
      <Route path="/admin/posts/new" component={AdminPostNew} />
      <Route path="/admin/posts/:id" component={AdminPostEdit} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/submissions" component={AdminSubmissions} />
      <Route path="/admin/subscribers" component={AdminSubscribers} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/prices" component={PricePage} />
      <Route path="/submit-project" component={SubmitProjectPage} />
      <Route path="/unsubscribe" component={UnsubscribePage} />
      <Route path="/manage-subscriptions" component={ManageSubscriptionsPage} />

      {/* Explorer routes */}
      <Route path="/explorer" component={ExplorerPage} />
      <Route path="/explorer/bakers" component={BakersPage} />
      <Route path="/staking" component={StakingPage} />
      <Route path="/art" component={ArtPage} />
      <Route path="/tools" component={ToolsPage} />
      <Route path="/tools/wallet" component={WalletInspectorPage} />
      <Route path="/tools/nft-gallery" component={NftGalleryPage} />
      <Route path="/tools/whale-watcher" component={WhaleWatcherPage} />
      <Route path="/tools/rewards" component={RewardCalculatorPage} />
      <Route path="/tools/portfolio" component={PortfolioTrackerPage} />
      <Route path="/tools/address-book" component={AddressBookPage} />
      <Route path="/tools/token-price" component={TokenPriceHistoryPage} />
      <Route path="/tools/airdrop" component={AirdropCheckerPage} />
      <Route path="/tools/batch-lookup" component={BatchAddressLookupPage} />
      <Route path="/tools/tns" component={TnsLookupPage} />
      <Route path="/tools/live-ops" component={LiveOpsMonitorPage} />
      <Route path="/tools/contract" component={SmartContractInspectorPage} />
      <Route path="/tools/defi" component={DefiDashboardPage} />
      <Route path="/tools/defi/:slug" component={DefiProtocolPage} />
      <Route path="/tools/auctions" component={LiveAuctionTrackerPage} />
      <Route path="/tools/top-collectors" component={TopCollectorsPage} />
      <Route path="/tools/collection-stats" component={CollectionStatsPage} />
      <Route path="/explorer/block/:id" component={BlockPage} />
      <Route path="/explorer/tx/:hash" component={TxPage} />
      <Route path="/explorer/address/:address" component={AddressPage} />

      {/* Internationalisation routes — explicit locale paths to avoid conflicting with article slugs */}
      {["zh", "ko", "ja", "de", "es", "fr", "pt", "ru", "ar", "tr"].map((locale) => (
        <Route key={locale} path={`/${locale}`} component={LocaleArchivePage} />
      ))}
      {["zh", "ko", "ja", "de", "es", "fr", "pt", "ru", "ar", "tr"].map((locale) => (
        <Route key={`${locale}-article`} path={`/${locale}/:slug+`} component={TranslatedArticlePage} />
      ))}

      {/* Article pages — must be last to catch all slugs */}
      <Route path="/:slug" component={ArticlePage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Layout>
            <Router />
          </Layout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
