import { Provider } from "react-redux";
import { store } from "../app/store";
import "../styles/globals.css";
import { Provider as AuthProvider } from "next-auth/client";
import { RecoilRoot } from "recoil";
const MyApp = ({ Component, pageProps }) => {
  return (
    <AuthProvider session={pageProps.session}>
      <Provider store={store}>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </Provider>
    </AuthProvider>
  );
};

export default MyApp;
