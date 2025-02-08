import { AuthProvider } from "./provider/AuthProvider";
import AppRouter from "./components/AppRouter";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  );
};

export default App;
