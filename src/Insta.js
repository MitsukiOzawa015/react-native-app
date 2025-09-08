import React from 'react';
import type {Node} from 'react';
import { View, Text, Image, FlatList, ScrollView, StyleSheet, TouchableOpacity, Button, Modal,Dimensions } from 'react-native';
import { useState } from "react";
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { width: screenWidth } = Dimensions.get('window');


const stories = [
  { id: '1', name: '山田太郎', image: require('../static/user_icon.png'), story: require('../static/boat-8394639_1280.jpg') },
  { id: '2', name: '山田花子', image: require('../static/user_icon.png'), story: require('../static/boat-8394639_1280.jpg') },
  // ...他のストーリー
];

export default function App() {

  const [posts, setPosts] = useState([
    {
    id: '1',
    user: '山田太郎',
    userImage: require('../static/user_icon.png'),
    postImages: [
      require('../static/boat-8394639_1280.jpg'),
      require('../static/bridge-8436747_1280.jpg')],
    like: true,
    caption: 'キレイな夕焼け！',
  },
  {
    id: '2',
    user: '山田花子',
    userImage: require('../static/user_icon.png'),
    postImages: [
       require('../static/bridge-8436747_1280.jpg'),
       require('../static/bridge-8436747_1280.jpg')],
    like: false,
    caption: 'すごい橋！',
  }
  ]);

  // ストーリー拡大表示用のstate
  const [selectedStory, setSelectedStory] = useState(null);

  // カルーセルのページインジケーター用
  const [carouselIndexes, setCarouselIndexes] = useState({});

  const handleScroll = (event, postId) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    setCarouselIndexes(prev => ({ ...prev, [postId]: index }));
  };


  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.logo}>Insta</Text>
      </View>

      {/* ストーリーズ */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stories}>
        {stories.map(story => (
          <TouchableOpacity key={story.id} style={styles.story} onPress={() => setSelectedStory(story)}>
            <Image source={story.image} style={styles.storyImage} />
            <Text style={styles.storyName}>{story.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 投稿フィード（カルーセル） */}
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <View style={styles.postHeader}>
              <Image source={item.userImage} style={styles.postUserImage} />
              <Text style={styles.postUser}>{item.user}</Text>
            </View>
            {/* 画像カルーセル */}
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={event => handleScroll(event, item.id)}
              scrollEventThrottle={16}
              style={styles.carousel}
            >
              {item.postImages.map((img, idx) => (
                <Image key={idx} source={img} style={styles.carouselImage} resizeMode="cover" />
              ))}
            </ScrollView>
            {/* ページインジケーター */}
            <View style={styles.carouselIndicatorContainer}>
              {item.postImages.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.carouselIndicator,
                    carouselIndexes[item.id] === idx ? styles.carouselIndicatorActive : null,
                  ]}
                />
              ))}
            </View>
            <TouchableOpacity>
              <View style={styles.postActions}>
                <Text style={styles.like} onPress={() => toggleLike(item.id)}>
                  {item.like ? '♥' : '♡'}
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      />


      {/* ストーリー拡大表示モーダル */}
      <Modal visible={!!selectedStory} transparent animationType="fade" onRequestClose={() => setSelectedStory(null)}>
        <View style={styles.fullScreenModalBackground}>
          <Text style={{color: "white", fontSize: 24, padding: 30}} onPress={() => setSelectedStory(null)}>X</Text>
          <TouchableOpacity style={styles.modalCloseArea} onPress={() => setSelectedStory(null)} />
          {selectedStory && (
            <View style={styles.fullScreenModalContent}>
              <Image source={selectedStory.story} style={styles.fullScreenModalImage} resizeMode="contain" />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );

  function toggleLike(itemId) {
  setPosts(posts.map(post => {
    if (post.id === itemId) {
      return { ...post, like: !post.like };
    }
    return post;
  }));
}
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#eee' },
  logo: { fontSize: 24, fontWeight: 'bold' },
  dm: { fontSize: 18 },
  like: { fontSize: 18 },
  stories: { height: 130, borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 },
  story: { alignItems: 'center', marginHorizontal: 8 },
  storyImage: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#f00' },
  storyName: { fontSize: 12, marginTop: 4 },
  post: { marginBottom: 50 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  postUserImage: { width: 40, height: 40, borderRadius: 20 },
  postUser: { marginLeft: 8, fontWeight: 'bold' },
  postImage: { width: '100%', height: 300 },
  postActions: { flexDirection: 'row', justifyContent: 'flex-start', padding: 8 },
  caption: { paddingHorizontal: 8 },
  bottomNav: { height: 60, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderColor: '#eee' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 16, alignItems: 'center' },
  modalImage: { width: 300, height: 400, marginBottom: 16 },
  modalName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalCloseArea: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  fullScreenModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fullScreenModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  fullScreenModalImage: {
    width: '100%',
    height: '100%',
  },
  // カルーセル用
  carousel: { width: screenWidth, height: 300 },
  carouselImage: { width: screenWidth, height: 300 },
  carouselIndicatorContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  carouselIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', marginHorizontal: 2 },
  carouselIndicatorActive: { backgroundColor: '#333' },
  postActions: { flexDirection: 'row', justifyContent: 'flex-start', padding: 8 },
  
});