import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
const screenWidth = Dimensions.get('window').width;

export default class DashLine extends Component {
    render() {
        var len = Math.ceil(screenWidth / 10);
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }

        return (<View style={styles.dashline}>
            {
                arr.map((item, index) => {
                    return <Text style={styles.dashitem} key={'dash' + index}> </Text>
                })
            }
        </View>);
    }

}
const styles = StyleSheet.create({
    dashline: {
        flexDirection: 'row',
    },
    dashitem: {
        height: 1,
        width: 6,
        marginRight: 4,
        flex: 1,
        backgroundColor: '#E5E5E5',
    }
})