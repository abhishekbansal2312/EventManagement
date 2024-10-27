import { AuthProvider } from "./provider/AuthProvider";
import AppRouter from "./components/AppRouter";
import { BrowserRouter } from "react-router-dom";
import { Toaster} from 'react-hot-toast';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
        <Toaster/>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
