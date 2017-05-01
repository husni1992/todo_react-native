/**
 * Created by Husny Ahamed - 30/04/2017
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ListView,
  Keyboard,
  Alert,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import Header from './header';
import Footer from './footer';
import Row from './row';


const filterItems = (filter, items) => {
  return items.filter((item) => {
    switch (filter) {
      case 'all':
        return true
      case 'active':
        return !item.complete
      case 'completed':
        return item.complete
    };
  })
}

class App extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      loading: true,
      allComplete: false,
      value: "",
      items: [],
      dataSource: ds.cloneWithRows([]),
      filter: "all"
    };

    this.setSource = this.setSource.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleSetFilter = this.handleSetFilter.bind(this);
    this.handleClearComplete = this.handleClearComplete.bind(this);
    this.handleUpdateText = this.handleUpdateText.bind(this);
    this.handleToggleEditing = this.handleToggleEditing.bind(this);
  };

  setSource(items, itemsDatasource, otherState = {}) {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
      ...otherState
    })
    AsyncStorage.setItem('items', JSON.stringify(items));
  };

  handleToggleAllComplete() {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => ({
      ...item,
      complete
    }))
    console.table(newItems);
    this.setSource(newItems, filterItems(this.state.filter, newItems), { allComplete: complete });
  };

  handleAddItem() {
    if (!this.state.value) return;
    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        text: this.state.value,
        complete: false
      }
    ];
    this.setSource(newItems, filterItems(this.state.filter, newItems), { value: "" });
  };

  handleToggleComplete(key, status) {
    const newItems = this.state.items.map((item) => {
      var complete = status;
      if (item.key !== key) return item;
      return {
        ...item,
        complete
      }

      // below code is enhanced with es6 as above
      // if (item.ukey !== key) {
      //   return item
      // } else {
      //   return {
      //     text: item.text,
      //     ukey: item.uket,
      //     complete: status
      //   };
      // }

    })

    this.setSource(newItems, filterItems(this.state.filter, newItems));
    // let dsNewValue = this.state.items.filter((item) => {
    //     if(item.ukey == u_key){
    //       item.complete = !item.complete;
    //     }
    //     return true;
    //   });
    // this.setState({
    //   dataSource: this.state.dataSource.cloneWithRows(dsNewValue)
    // })
  };

  handleDeleteItem(itemKey) {

    Alert.alert(
      'Delete item',
      'Are you sure you want to delete ?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
        {
          text: 'OK', onPress: () => {
            const newItems = this.state.items.filter(item => item.key !== itemKey)
            this.setSource(newItems, filterItems(this.state.filter, newItems));
          }
        }
      ]
    )
  }

  handleUpdateText(key, text) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ...item,
        text
      }
    })

    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleToggleEditing(key, editing) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ...item,
        editing
      }
    })

    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleSetFilter(filterType) {
    console.log(filterType);
    debugger
    this.setSource(this.state.items, filterItems(filterType, this.state.items), { filter: filterType })
  }

  handleClearComplete() {
    const newItems = filterItems("active", this.state.items);
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  };

  componentWillMount() {
    AsyncStorage.getItem('items').then((response) => {
      try {
        const items = JSON.parse(response);
        this.setSource(items, items, { loading: false });
      } catch (e) {
        this.setState({
          loading: false
        })
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.setState({ value })}
          onToggleAllComplete={this.handleToggleAllComplete}
        />
        <View style={styles.content}>
          <ListView
            style={styles.list}
            enableEmptySections
            dataSource={this.state.dataSource}
            onScroll={() => Keyboard.dismiss}
            renderRow={({ key, ...value }) => {
              return (
                <Row
                  ukey={key} // because we cannot use 'key' as a prop, so we overwrited the spread syntax
                  {...value}
                  onComplete={(val) => this.handleToggleComplete(key, val)}
                  deleteItem={() => { this.handleDeleteItem(key) }}
                  onUpdate={(value) => this.handleUpdateText(key, value)}
                  onToggleEdit={(editing) => this.handleToggleEditing(key, editing)}
                />
              )
            }}
            renderSeparator={({ sectionId, rowId }) => {
              return <View key={rowId} style={styles.seperator} />
            }}
          />
        </View>
        <Footer
          count={filterItems("active", this.state.items).length}
          setFilter={this.handleSetFilter}
          filter={this.state.filter}
          onClearComplete={this.handleClearComplete}
        />
        {this.state.loading && <View style={styles.loading}>
          <ActivityIndicator
            animating
            size="large"
          />
        </View>}
      </ View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0, .2)'
  },
  content: {
    flex: 1
  },
  list: {
    backgroundColor: '#FFF',
  },
  seperator: {
    borderWidth: 1,
    borderColor: "#F5F5F5"
  }
})

export default App;