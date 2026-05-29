// Home screen: shows the user greeting, search, featured properties, filters, and recommendations.
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, FeaturedCard } from '@/components/Cards';
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from '@/components/Search';
import icons from "@/constants/icons";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import React, { useEffect } from "react";

export default function Index() {
    // Current user powers the greeting and avatar shown at the top of Home.
    const { user } = useGlobalContext();
    const [avatarLoadFailed, setAvatarLoadFailed] = React.useState(false);
    const params = useLocalSearchParams<{ query?: string; filter?: string }>();

    // Featured carousel data is fetched separately from the recommendation grid.
    const { 
      data: latestProperties, 
      loading: latestPropertiesLoading } =
      useAppwrite({
      fn: getLatestProperties,
    });

    const {
      data: properties,
      refetch,
      loading,
    } = useAppwrite({
      fn: getProperties,
      params: {
        filter: params.filter!,
        query: params.query!,
        limit: 6,
      },
      skip: true,
    });

    useEffect(() => {
      refetch({
        filter: params.filter!,
        query: params.query!,
        limit: 6,
      });
    }, [params.filter, params.query]);
    
    const handleCardPress = (id: string) => router.push(`/properties/${id}`);
    
    // Initials keep the header useful when the user has not uploaded an avatar.
    const initialsSource = user?.name?.trim() || user?.email?.trim() || "";
    const userInitials = initialsSource
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

    React.useEffect(() => {
      setAvatarLoadFailed(false);
    }, [user?.avatar]);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
          data={properties ?? []}
          keyExtractor={(item, index) => item?.$id ?? item?.id ?? index.toString()}
          numColumns={2}
          contentContainerClassName="pb-32"
          columnWrapperClassName="flex gap-5 px-5"
          renderItem={({ item }) =>  (
             <Card item={item} onPress={() => handleCardPress(item.$id)} />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size='large' className="text-primary-300 mt-5"/>
            ) : (
            <NoResults/>
            )
          }
          ListHeaderComponent={
        <View className="px-5">
        
          <View className="flex flex-row items-center justify-between mt-5">
            <View className="flex flex-row items-center">
              {user?.avatar && !avatarLoadFailed ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={{ width: 88, height: 88, borderRadius: 44, marginBottom: 16 }}
                  onError={() => setAvatarLoadFailed(true)}
                />
              ) : (
                <View
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 44,
                    backgroundColor: "#E8ECFF",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ fontSize: 28, lineHeight: 32, color: "#475BE8", fontWeight: "700" }}>
                    {userInitials || "?"}
                  </Text>
                </View>
              )}

              <View className="flex flex-col items-start ml-2 justify-center">
                <Text className="text-xs font-rubik text-black-100">Good Morning</Text>
                <Text className="text-base font-rubik-medium text-black-300"> Rommel </Text>
              </View>
            </View>
            <Image source={icons.bell} className="size-6" />
          </View>
          <Search/>
          <View className='my-5'>
            <View className='flex flex-row items-center justify-between'>
              <Text className='text-xl font-rubik-bold text-black-300'>Featured</Text>
              <TouchableOpacity>
                <Text className='text-base font-rubik-bold text-primary-300'>See All</Text>
              </TouchableOpacity>
            </View>

            {latestPropertiesLoading ? (
              <ActivityIndicator size="large" className="text-primary-300" />
            ) : !latestProperties || latestProperties.length === 0 ? (
              <NoResults />
            ) : (
             <FlatList
              data={latestProperties ?? []}
              renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  )}
              keyExtractor={(item, index) => item?.$id ?? item?.id ?? index.toString()}
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="flex gap-5 mt-5"
            />
           )}
          </View>
          <View className='flex flex-row items-center justify-between'>
              <Text className='text-xl font-rubik-bold text-black-300'>
                Recommendations
              </Text>
              <TouchableOpacity>
                <Text className='text-base font-rubik-bold text-primary-300'>
                  See All
                </Text>
              </TouchableOpacity>
          </View>

          <Filters/>          
        </View>
      }
      />
    </SafeAreaView>
  );
};
