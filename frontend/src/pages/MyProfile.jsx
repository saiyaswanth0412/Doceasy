import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useTheme } from '../context/ThemeContext'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const { isDark } = useTheme()

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData()
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return userData ? (
        <div className={`max-w-3xl mx-auto px-4 py-12 transition-colors duration-300 ${
            isDark ? 'bg-slate-900' : 'bg-gray-50'
        }`}>
            {/* Profile Header Card */}
            <div className={`rounded-2xl shadow-lg p-8 mb-8 ${
                isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
                <div className='flex flex-col md:flex-row gap-8 items-start'>
                    {/* Profile Picture */}
                    {isEdit ? (
                        <label htmlFor='image'>
                            <div className='relative cursor-pointer group'>
                                <img
                                    className='w-40 h-40 rounded-2xl object-cover border-4 border-blue-500 group-hover:opacity-75 transition'
                                    src={image ? URL.createObjectURL(image) : userData.image}
                                    alt='Profile'
                                />
                                <div className='absolute inset-0 rounded-2xl bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition'>
                                    <span className='text-white font-bold'>Change Photo</span>
                                </div>
                            </div>
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                        </label>
                    ) : (
                        <img className='w-40 h-40 rounded-2xl object-cover border-4 border-blue-500' src={userData.image} alt='Profile' />
                    )}

                    {/* User Info */}
                    <div className='flex-1'>
                        {isEdit ? (
                            <input
                                className={`text-4xl font-bold mb-3 w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    isDark ? 'bg-slate-700 text-white' : 'bg-gray-100'
                                }`}
                                type="text"
                                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                value={userData.name}
                            />
                        ) : (
                            <h1 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {userData.name}
                            </h1>
                        )}

                        <div className='space-y-3'>
                            <div className='flex items-center gap-2'>
                                <span className={`font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
                                <p className='text-blue-600 dark:text-blue-400'>{userData.email}</p>
                            </div>

                            <div className='flex items-center gap-2'>
                                <span className={`font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone:</span>
                                {isEdit ? (
                                    <input
                                        className={`rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isDark ? 'bg-slate-700 text-white' : 'bg-gray-100'
                                        }`}
                                        type="text"
                                        onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                        value={userData.phone}
                                    />
                                ) : (
                                    <p className='text-blue-600 dark:text-blue-400'>{userData.phone || 'Not provided'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information Card */}
            <div className={`rounded-2xl shadow-lg p-8 mb-8 ${
                isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6'>
                    Contact Information
                </h2>

                <div className='space-y-6'>
                    <div>
                        <label className={`block font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Address
                        </label>
                        {isEdit ? (
                            <div className='space-y-3'>
                                <input
                                    className={`w-full rounded-lg px-4 py-3 border-2 focus:outline-none focus:border-blue-500 ${
                                        isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300'
                                    }`}
                                    type="text"
                                    placeholder='Address Line 1'
                                    onChange={(e) => setUserData(prev => ({
                                        ...prev,
                                        address: { ...(prev.address || {}), line1: e.target.value }
                                    }))}
                                    value={userData.address?.line1 || ''}
                                />
                                <input
                                    className={`w-full rounded-lg px-4 py-3 border-2 focus:outline-none focus:border-blue-500 ${
                                        isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300'
                                    }`}
                                    type="text"
                                    placeholder='Address Line 2'
                                    onChange={(e) => setUserData(prev => ({
                                        ...prev,
                                        address: { ...(prev.address || {}), line2: e.target.value }
                                    }))}
                                    value={userData.address?.line2 || ''}
                                />
                            </div>
                        ) : (
                            <p className={`px-4 py-2 rounded-lg ${isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                {userData.address?.line1 && userData.address?.line2
                                    ? `${userData.address.line1}, ${userData.address.line2}`
                                    : 'Not provided'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Basic Information Card */}
            <div className={`rounded-2xl shadow-lg p-8 mb-8 ${
                isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6'>
                    Basic Information
                </h2>

                <div className='grid md:grid-cols-2 gap-6'>
                    <div>
                        <label className={`block font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Gender
                        </label>
                        {isEdit ? (
                            <select
                                className={`w-full rounded-lg px-4 py-3 border-2 focus:outline-none focus:border-blue-500 ${
                                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300'
                                }`}
                                onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                value={userData.gender}
                            >
                                <option value="Not Selected">Not Selected</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <p className={`px-4 py-2 rounded-lg ${isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                {userData.gender || 'Not Selected'}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className={`block font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Date of Birth
                        </label>
                        {isEdit ? (
                            <input
                                className={`w-full rounded-lg px-4 py-3 border-2 focus:outline-none focus:border-blue-500 ${
                                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-300'
                                }`}
                                type='date'
                                onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                value={userData.dob}
                            />
                        ) : (
                            <p className={`px-4 py-2 rounded-lg ${isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                {userData.dob || 'Not provided'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4'>
                {isEdit ? (
                    <>
                        <button
                            onClick={updateUserProfileData}
                            className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all'
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => {
                                setIsEdit(false)
                                setImage(false)
                            }}
                            className={`flex-1 border-2 font-bold py-3 rounded-lg transition-all ${
                                isDark
                                ? 'border-slate-600 text-gray-300 hover:bg-slate-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEdit(true)}
                        className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all'
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    ) : null
}

export default MyProfile
