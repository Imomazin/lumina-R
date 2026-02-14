import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { DataProvider } from '../context/DataContext';

function App() {
  return (
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  );
}

export default App;
