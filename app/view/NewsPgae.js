import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button
} from 'react-native';
import BackTimer from '../common/BackTimer';

export default class NewsPgae extends Component {
    constructor(props){
        super(props)
        this.state={
            count:0
        }
    }
    render() {
        return (
            <View>


                <Button title={"开始"} onPress={()=>{

                    this._ggBackTimer._beginTimer();
                }}/>

                <Button title={"暂停"} onPress={()=>{

                    this._ggBackTimer._endTimer();

                }}/>

                <Text>{this.state.count}</Text>

                <BackTimer
                    ref={e=>this._ggBackTimer=e}
                    interval={1000}
                    changeTime={this._changeTime.bind(this)}
                />
            </View>
        );
    }
    _changeTime(time){

        this.setState({

            count:time,
        })
    }
}