import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./components/Dashboard/Home";
import { CreateBanner } from "./components/Dashboard/banner/CreateBanner";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="create-banner" element={<CreateBanner />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
