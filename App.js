import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  Linking,
  Button,
} from 'react-native';

const App = () => {
  const [username, setUsername] = React.useState('');
  const [data, setData] = React.useState(null);
  const [newData, setNewData] = React.useState(data);
  const [text, onChangeText] = React.useState('');

  const url = `https://api.github.com/users/${username}/repos`;

  const fetchData = () => {
    fetch(url)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then(resJson => {
        setData(resJson);
        setNewData(resJson);
      });
  };

  React.useEffect(() => {
    if (data !== null) {
      const found = data.filter(item => item.name.includes(text));
      text === '' ? setNewData(data) : setNewData(found);
    }
  }, [text]);

  console.log('data', data);

  const FirstPage = () => {
    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={setUsername}
          style={styles.inputUsername}
          value={username}
          placeholder={'Input username github here'}
          autoFocus={true}
        />
        <Button title="Submit" onPress={fetchData} style={styles.button} />
      </View>
    );
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleClick(item.html_url)}>
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (data === null) {
    return <FirstPage />;
  }

  const handleClick = uri => {
    Linking.canOpenURL(uri).then(supported => {
      if (supported) {
        Linking.openURL(uri);
      } else {
        console.log("Don't know how to open URI: " + uri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Search repository"
      />
      <FlatList
        data={newData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c4ba',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  title: {
    fontSize: 20,
  },
  input: {
    borderRadius: 50,
    paddingHorizontal: 15,
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  inputUsername: {
    borderRadius: 50,
    paddingHorizontal: 15,
    height: 40,
    marginTop: '50%',
    marginBottom: '5%',
    borderWidth: 1,
  },
  button: {
    width: 100,
    borderRadius: 10,
  },
});

export default App;
