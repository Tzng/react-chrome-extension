import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import { Button } from 'antd';
import * as TodoActions from './actions/todos';
import styles from './App.less';

@connect(
  state => ({
    todos: state.todos
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)
class App extends React.PureComponent {
  render() {
    return (
      <div className={styles.div}>
        <Button type="primary">Example button</Button>
      </div>
    );
  }
}

export default App;
