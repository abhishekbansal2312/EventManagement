import { AuthProvider } from "./provider/AuthProvider";
import AppRouter from "./components/AppRouter";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <AppRouter />
            <Toaster />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </AuthProvider>
  );
};

export default App;
