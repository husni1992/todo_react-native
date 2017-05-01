import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

class Footer extends Component {
  render() {
    const { filter } = this.props;
    return (
      <View style={styles.container}>
        <Text>Count: {this.props.count}</Text>
        <View style={styles.filters}>
          <TouchableOpacity style={[styles.filter, filter === 'all' && styles.selected]} onPress={() => this.props.setFilter('all')}>
            <Text>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filter, filter === 'active' && styles.selected]} onPress={() => this.props.setFilter('active')}>
            <Text>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filter, filter === 'completed' && styles.selected]} onPress={() => this.props.setFilter('completed')}>
            <Text>Completed</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.filter, {borderColor: 'darkgrey'}]} onPress={this.props.onClearComplete}>
          <Text>
            Clear Completed
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  filters: {
    flexDirection: "row"
  },
  filter: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent'    
  },
  selected: {
    borderColor: "rgba(175, 47, 47, .2)"
  }
})

export default Footer;