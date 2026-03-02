import React from 'react';
import ProfileScreen from './ProfileScreen';
import { useAppSelector } from '../redux/app/hooks';

const MyProfileScreen: React.FC = () => {
    const user = useAppSelector((state) => state.user);
    
    // create mock route params to pass current user's ID
    const mockRoute = {
        params: {
            userId: user.user?.id
        }
    };

    // render ProfileScreen with current user's ID
    return <ProfileScreen route={mockRoute} />;
};

export default MyProfileScreen;