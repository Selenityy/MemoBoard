import { ReduxProvider } from "../redux/provider";

export const metadata = {
  title: "MemoBoard",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <main>{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
};

export default RootLayout;
