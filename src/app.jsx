/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/index';
import ThemeProvider from 'src/theme';
import NotistackProvider from './components/NotistackProvider';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <NotistackProvider>
        <Router />
      </NotistackProvider>
    </ThemeProvider>
  );
}
