import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  TextInput
} from 'react-native';

class Row extends Component {
  render() {
    const { complete } = this.props;

    const textComponent = (
      <TouchableOpacity onPress={() => this.props.onToggleEdit(this.props.ukey, true)} style={styles.textWrap}>
        <Text style={[styles.text, complete && styles.complete]}>{String(this.props.text)}</Text>
      </TouchableOpacity>
    );
    
    const removeButton = (
      <TouchableOpacity onPress={this.props.deleteItem}>
        <Text style={styles.destroy}>X</Text>
      </TouchableOpacity>
    );

    const editingComponent = (
      <View style={styles.textWrap}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => this.props.onUpdate(value)}
          autoFocus
          value={this.props.text}
          multiline
        />
      </View>
    );

    const doneButton = (
      <TouchableOpacity style={styles.done} onPress={() => this.props.onToggleEdit(false)}>
        <Text style={styles.doneText}>Save</Text>
      </TouchableOpacity>
    )

    return (
      <View style={styles.container} key={this.props.ukey}>
        <Switch
          value={complete}
          onValueChange={this.props.onComplete}
        />
        {this.props.editing ? editingComponent : textComponent}
        {this.props.editing ? doneButton : removeButton}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  input: {
    height: 100,
    flex: 1,
    fontSize: 24,
    padding: 0,
    color: '#4d4d4d'
  },
  done: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#7be290",
    padding: 1
  },
  doneText: {
    color: '#4d4d4d',
    fontSize: 20
  },
  textWrap: {
    flex: 1,
    marginHorizontal: 10
  },
  complete: {
    textDecorationLine: "line-through",
    color: 'lightgrey'
  },
  text: {
    fontSize: 24,
    color: "#4d4d4d"
  },
  destroy: {
    fontSize: 20,
    color: "#cc9a9a",
    marginHorizontal: 10
  }
})

export default Row;