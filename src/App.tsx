import { Outlet } from 'react-router';
import CommonLayout from './components/layouts/CommonLayout';

function App() {

  return (
    <>
      <CommonLayout>
        <Outlet></Outlet>
      </CommonLayout>
    </>
  )
}

export default App;
