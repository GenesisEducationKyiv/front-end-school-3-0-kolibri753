import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy } from "react";
import { useTheme } from "@/hooks";
import { Footer, Header, LoadingSpinner } from "@/components";
import "react-toastify/dist/ReactToastify.css";

const TracksPage = lazy(() =>
  import("@/pages/TracksPage").then((module) => ({
    default: module.default,
  }))
);

const AudioPlayer = lazy(() =>
  import("@/features/AudioPlayer").then((module) => ({
    default: module.AudioPlayer,
  }))
);

function App() {
  const { theme } = useTheme();
  const toastTheme = theme === "dark" ? "light" : "dark";

  return (
    <BrowserRouter>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/tracks" />} />
          <Route path="/tracks" element={<TracksPage />} />
        </Routes>
      </Suspense>
      <Footer />

      <Suspense fallback={null}>
        <AudioPlayer />
      </Suspense>

      <ToastContainer
        data-testid="toast-container"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={toastTheme}
      />
    </BrowserRouter>
  );
}

export default App;
