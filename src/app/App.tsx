import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { DataProvider } from '../context/DataContext';
import { ThemeProvider } from '../context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
