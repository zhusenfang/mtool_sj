import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Dimensions,
    AppState
} from 'react-native';

export default class BackTimer extends Component {

    constructor(props) {

        super(props);

        //进入后台的时间
        this.recodTime = 0;

        //计数用的
        this.count = 0;

    }

    _beginTimer(){

        this.timer = setInterval(()=>{

            this.count++;

            this.props.changeTime(this.count);

        },this.props.interval);
    }

    _endTimer(){

        this.timer && clearInterval(this.timer)

    }


    render(){

        return (<View/>)
    }

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppState.bind(this));
    }

    componentWillUnmount() {
        this.clearTimer();
        AppState.removeEventListener('change', this.handleAppState.bind(this));
    }

    handleAppState(nextAppState) {
        if (nextAppState === 'inactive') {
            this.recodTime = new Date();
            this._endTimer();
        } else if (nextAppState === 'active') {

            this.turnsOnTimer();
        }
    };

    turnsOnTimer(){

        const now = new Date();
        const diff = Math.round((now - this.recodTime) / 1000);

        this.count = this.count+diff;

        this._beginTimer();

    };

}
