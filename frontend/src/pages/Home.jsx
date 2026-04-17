import React from 'react'
import Header from '../components/Header'
import NearbyDoctors from '../components/NearbyDoctors'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'


const Home = () => {
  return (
    <div>
      <Header />
      <div className='px-4 md:px-12 py-8'>
        <NearbyDoctors />
      </div>
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home