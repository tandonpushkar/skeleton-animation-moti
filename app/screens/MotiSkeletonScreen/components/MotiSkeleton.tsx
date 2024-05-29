import axios from 'axios';

import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Image} from 'react-native';

import UserCard from './UserCard';

const MotiSkeleton = () => {
  const apiUrl = 'https://dummyjson.com/users';
  const [users, setUsers]: any = useState();
  const userPlaceholderList = useMemo(() => {
    return Array.from({length: 15}).map(_ => null);
  }, []);
  const fetchApi = useCallback(async () => {
    const res = await axios.get(apiUrl);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUsers(res?.data?.users);
  }, []);

  useEffect(() => {
    fetchApi();
  }, []);

  const renderList: any = ({item}: any) => {
    const descriptionLine = `${item?.firstName} ${item?.lastName}, a ${item?.age}-year-old ${item?.company?.title} at ${item?.company?.name}, resides in ${item?.address?.city}, ${item?.address?.state}. She holds a degree from the ${item?.university}.`;
    return (
      <UserCard
        item={item}
        description={descriptionLine}
        imageUrl={item?.image}
        title={`${item?.firstName} ${item?.lastName}`}
        country={item?.address?.country}
      />
    );
  };

  return (
    <FlatList data={users ?? userPlaceholderList} renderItem={renderList} />
  );
};

export default memo(MotiSkeleton);
