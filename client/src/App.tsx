import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy } from "react";
import { useTheme } from "@/hooks";
import { Footer, Header } from "@/components";
import TracksPage from "@/pages/TracksPage";
import "react-toastify/dist/ReactToastify.css";

const AudioPlayer = lazy(() =>
  import("@/features").then((module) => ({
    default: module.AudioPlayer,
  }))
);

function App() {
  const { theme } = useTheme();
  const toastTheme = theme === "dark" ? "light" : "dark";

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Navigate to="/tracks" />} />
            <Route path="/tracks" element={<TracksPage />} />
          </Routes>
        </main>
        <Footer />
      </div>

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
