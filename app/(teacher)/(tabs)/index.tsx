import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/context/auth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function TabOneScreen() {
  const {signOut, user} = useAuth();
  const router = useRouter()
  
  if (user === null)
  {
    return(
      <View>
        <Text>
          Loading...
        </Text>
      </View>
    )
  }

  console.log(user);
  
  return (
    <View style={styles.container}>
      <Text> {user.name} </Text>
      <Text style={styles.title}>Teacher</Text>
      <Button
        title='Sign Out'
        color={"orange"}
        onPress={signOut}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
