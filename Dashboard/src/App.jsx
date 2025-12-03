import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./components/Dashboard/Home";
import { CreateBanner } from "./components/Dashboard/banner/CreateBanner";
import { AllBannerList } from "./components/Dashboard/banner/AllBannerList";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="create-banner" element={<CreateBanner />} />
          <Route path="getall-banner" element={<AllBannerList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
