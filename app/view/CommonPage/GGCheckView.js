/**
 * Created by GG on 2017/9/4.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight,
} from 'react-native'

// import defaultImg from "../../Common/defaultImg.js";

export default class CheckBox extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isChecked: this.props.isChecked,
        }
    }

    componentWillReceiveProps(nextProps){

        this.state = {
            isChecked: nextProps.isChecked,
        }

    }

    /**
     * propTypes是React内部提供的校验器,如果通过props传过的数据与之不匹配,则会抛出异常。
     *
     */
    static propTypes = {
        ...View.propTypes,
        leftText: React.PropTypes.string,
        leftTextView: React.PropTypes.element,
        rightText: React.PropTypes.string,
        leftTextStyle: Text.propTypes.style,
        rightTextView: React.PropTypes.element,
        rightTextStyle: Text.propTypes.style,
        checkedImage: React.PropTypes.element,
        unCheckedImage: React.PropTypes.element,
        onClick: React.PropTypes.func.isRequired,
        isChecked: React.PropTypes.bool

    }

    changeStatus(isChecked){

        this.setState({

            isChecked:isChecked

        })

    }


    /**
     * 如果没有通过props传过来数据,则默认的是这样
     * @type
     */
    static defaultProps = {
        isChecked: false,
        leftTextStyle: {},
        rightTextStyle: {}
    }

    /**
     * 左边文字
     */
    _renderLeft() {
        if (this.props.leftTextView) {
            return this.props.leftTextView;
        }

        if (!this.props.leftText) {
            return null;
        }
        return (
            <Text allowFontScaling={false}  key={1} style={[styles.leftText, this.props.leftTextStyle]}>{this.props.leftText}</Text>
        )
    }


    /**
     * 右边的文字
     * @returns {*}
     * @private
     */
    _renderRight() {
        if (this.props.rightTextView) {
            return this.props.rightTextView;
        }
        if (!this.props.rightText) {
            return null;
        }
        return (
            <Text allowFontScaling={false} key={2} style={[styles.rightText, this.props.rightTextStyle]}>{this.props.rightText}</Text>
        )
    }

    /**
     * 选中和为选中的图片按钮样式
     * @returns {*}
     * @private
     */
    _renderImage() {
        if (this.state.isChecked) {
            return this.props.checkedImage ? this.props.checkedImage : this.genCheckedImage();
        } else {
            return this.props.unCheckedImage ? this.props.unCheckedImage : this.genCheckedImage();
        }
    }

    genCheckedImage() {
        var source = this.state.isChecked ? require('../../img/window/redsqree.png') : require('../../img/window/huisqree.png');
        return (
            <Image key={3} source={source} style={{width:20,height:20}}/>
        )
    }

    onClick() {

        this.setState({
            isChecked: !this.state.isChecked
        })

        this.props.onClick();
    }

    render() {

        return (
            <TouchableHighlight
                style={this.props.style}
                onPress={()=>this.onClick()}
                underlayColor='transparent'
            >
                <View style={styles.container}>
                    {this._renderLeft()}
                    {this._renderImage()}
                    {this._renderRight()}
                </View>
            </TouchableHighlight>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftText: {
        flex: 1,
        fontSize:16,

    },
    rightText: {
        flex: 1,
        marginLeft: 10,

    }
})