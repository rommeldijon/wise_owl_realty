import React from 'react';
import { Alert, Image, ImageSourcePropType, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { settings } from '@/constants/data';
import icons from "@/constants/icons";
import { logout } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';

interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon, 
  title,
  onPress, 
  textStyle, 
  showArrow=true,
}: SettingsItemProp) => (
  <TouchableOpacity 
   onPress={onPress} 
   className='flex flex-row items-center justify-between py-3'
   >
    <View className='flex flex-row items-center gap-3'>
      <Image source={icon} className='size-6'/>
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} className='size-5'/>}
  </TouchableOpacity>
);

const Profile = () => {
  const { user, refetch } = useGlobalContext();
  const [avatarLoadFailed, setAvatarLoadFailed] = React.useState(false);

  const initialsSource = user?.name?.trim() || user?.email?.trim() || '';

  const userInitials = initialsSource
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  React.useEffect(() => {
    setAvatarLoadFailed(false);
  }, [user?.avatar]);

  const handleLogout = async () => {
     const result = await logout();
     if (result) {
         Alert.alert('Success', 'Logged out successfully');
         refetch();
     } else {
         Alert.alert('Error', 'Failed to login')
     }
    };


  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName='pb-32 px-7'
      >
          <View className='flex flex-row items-center justify-between mt-5'>
              <Text className='text-xl font-rubik-bold'>
                Profile
              </Text>
              <Image source={icons.bell} className='size-5'/>
          </View>

          <View className='flex-row justify-center flex mt-5'>
            <View className='flex flex-col items-center relative mt-5'>
              {user?.avatar && !avatarLoadFailed ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={{ width: 176, height: 176, borderRadius: 88 }}
                  onError={() => setAvatarLoadFailed(true)}
                />
              ) : (
                <View
                  style={{
                    width: 176,
                    height: 176,
                    borderRadius: 88,
                    backgroundColor: '#E8ECFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 44, lineHeight: 52, color: '#475BE8', fontWeight: '700' }}>
                    {userInitials || '?'}
                  </Text>
                </View>
              )}
              <TouchableOpacity className='absolute bottom-11 right-2'>
              <Image source={icons.edit} className='size-9'/>
              </TouchableOpacity>
              <Text className='text-2xl font-rubik-bold mt-1'> {user?.name} </Text>
            </View>
          </View>

          <View className='flex flex-col mt-10'>
             <SettingsItem icon={icons.calendar} title='My Bookings'/>
             <SettingsItem icon={icons.wallet} title='Payments'/>
          </View>

          <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
            {settings.slice(2).map((item, index) => (
              <SettingsItem key={index} {...item} />
            ))}
          </View>
         
          <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
            <SettingsItem 
              icon={icons.logout} 
              title='Logout' 
              textStyle='text-danger'
              showArrow={false} 
              onPress={handleLogout}
            />
          </View>     
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;