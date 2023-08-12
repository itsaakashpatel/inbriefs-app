import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Layout from '../components/layout';
import { getCurrentUser } from '../utils/currentUser';
import api from '../api';

export default function Feed() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await getCurrentUser();
      setUserInfo(JSON.parse(userInfo));
    };

    const fetchData = async () => {
      try {
        const response = await api.get('/'); // Fetch news data from the API
        if (response.status === 200) {
          setData(response.data ? response.data : []);
        }
      } catch (error) {
        console.log('Error fetching data', error);
      }
    };

    getUserInfo();
    fetchData();
  }, []);


  if (!data) {
    return (
      <Layout>
        <Text>Loading...</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <Text style={styles.mainText}>{userInfo?.name}</Text>
      <View>
        {data.length === 0 && <Text>No news found for today!</Text>}
        {data.map((item, index) => (
          <View key={index}>
            
              <Text>{item.title}</Text>
            
          </View>
        ))}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000',
  },
});