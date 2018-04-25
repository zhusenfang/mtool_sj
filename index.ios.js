/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Index from './app/index'





import StackNavi from './app/StackNavi'
export default class Project extends Component {
    render() {
        return (
            <StackNavi/>
        );
    }
}


AppRegistry.registerComponent('MTool', () => Project);

// export default class Project extends Component {
//     render() {
//         return (
//             <Index/>
//         );
//     }
// }
//
//
// AppRegistry.registerComponent('MTool', () => Project);
