import { Route, Routes } from "react-router-dom";
import "./app.scss";
import { Layout } from "./layout/layout";
import { CollectionPage } from "./pages/collection/collection";
import { HomePage } from "./pages/home/home";
import {NewCollectionPage} from "./pages/new-collection/new-collection";
function App() {
  return (
      
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new-collection" element={<NewCollectionPage />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
        </Routes>
      </Layout>
  );
}

export default App;
