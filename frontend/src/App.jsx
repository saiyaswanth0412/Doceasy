import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import DoctorDiscovery from './pages/DoctorDiscovery'
import VirtualDoctor from './pages/VirtualDoctor'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext'

const App = () => {
  return (
    <ThemeProvider>
      <div className='bg-gradient-to-b from-white to-blue-50 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen flex flex-col'>
        <Navbar />
        <ToastContainer />
        <main className='flex-1'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/doctors' element={<Doctors />} />
            <Route path='/doctors/:speciality' element={<Doctors />} />
            <Route path='/doctor-discovery' element={<DoctorDiscovery />} />
            <Route path='/virtual-doctor' element={<VirtualDoctor />} />
            <Route path='/login' element={<Login />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/my-profile' element={<MyProfile />} />
            <Route path='/my-appointments' element={<MyAppointment />} />
            <Route path='/appointment/:docId' element={<Appointment />} />
          </Routes>
        </main>
        <Footer />
        <ChatBot />
      </div>
    </ThemeProvider>
  )
}

export default App
