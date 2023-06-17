import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from 'react-router-dom'
import '../App.css'


// Layouts
import SignUpLayout from '../layouts/SignUpLayout'
import SignInLayout from '../layouts/SignInLayout'

// Pages
import Home from './Home/Home'
import UpdateProfile from './User_Profile/UpdateProfile'
import AddPhoneNumber from './AddPhoneNumber'
import Admin from './Admin/Admin'
import _AcceptedUsers from './_AcceptedUsers'
import _NotAcceptedUsers from './_NotAcceptedUsers'

function App() {

  const routest = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/'>
        <Route index element={<Home />} />
        <Route path='signup' element={<SignUpLayout />} />
        <Route path='signin' element={<SignInLayout />} />
        <Route path='profile' element={<UpdateProfile />} />
        <Route path='number' element={<AddPhoneNumber />} />
        <Route path='admin' element={<Admin />}>
          <Route path='accepted' element={<_AcceptedUsers />} />
          <Route path='waitingusers' element={<_NotAcceptedUsers />} />
        </Route>
      </Route>
    )
  )

  return (
    <div>
      <RouterProvider router={routest} />
    </div>
  )
}

export default App