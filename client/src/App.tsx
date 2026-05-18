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
import SearchPage from "./pages/SearchPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminPostEdit from "./pages/admin/AdminPostEdit";
import AdminPostNew from "./pages/admin/AdminPostNew";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import NotFound from "./pages/NotFound";
import PricePage from "./pages/PricePage";

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

      {/* Admin routes (protected inside components) */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/posts" component={AdminPosts} />
      <Route path="/admin/posts/new" component={AdminPostNew} />
      <Route path="/admin/posts/:id" component={AdminPostEdit} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/projects" component={AdminProjects} />
      <Route path="/admin/submissions" component={AdminSubmissions} />
      <Route path="/admin/subscribers" component={AdminSubscribers} />
      <Route path="/prices" component={PricePage} />

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
