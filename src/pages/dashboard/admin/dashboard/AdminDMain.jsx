import React from 'react'
import { useSelector } from 'react-redux';
import AdminStats from './AdminStats';
import { useGetAdminStatsQuery } from '../../../../redux/features/stats/statsApi';
import Loading from '../../../../components/Loading';
import AdminStatsChart from './AdminStatsChart';
import CoinSettingsManager from './CoinSettingsManager';

const AdminDMain = () => {
    const { user } = useSelector(state => state.auth);

    const {data: adminData, isLoading, error} = useGetAdminStatsQuery();
    if (isLoading) return <Loading />
    if (error) return <div>Failed to fetch data</div>

    const stats = adminData || {};
    
    console.log(adminData);

    if(!stats) {
        return <div>No admin stats available</div>
    }

    return (
        <div className='p-6'>
            <div>
                <h1 className='text-2xl font-semibold mb-4'>Admin Dashboard</h1>
                <p className='text-gray-500'>Hi, {user?.username}! Welcome to your user dashboard.</p>
            </div>

            <AdminStats stats={stats}/>

            <AdminStatsChart stats={stats}/>


            <div>
                <CoinSettingsManager/>
            </div>

        </div>
    )
}

export default AdminDMain