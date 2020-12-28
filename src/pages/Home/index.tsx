import React, { useState, useEffect, useCallback } from 'react';

import { usePublication } from '../../hooks/app';

import Item from '../../components/Item';

import { Container, ListPost } from './styles';
import Header from '../../components/Header';
import Map from '../../components/Map';

const Home: React.FC = () => {
  const [isMapActive, setIsMapActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { posts, loadPublications } = usePublication();

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadPublications();
    setIsRefreshing(false);
  }, [loadPublications]);

  return (
    <Container>
      <Header isMapActive={isMapActive} setMap={setIsMapActive} />

      {isMapActive ? (
        <Map posts={posts} />
      ) : (
        <ListPost
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          data={posts}
          showsVerticalScrollIndicator={false}
          keyExtractor={post => `key-${post.id}`}
          renderItem={({ item }) => <Item post={item} />}
        />
      )}
    </Container>
  );
};

export default Home;
