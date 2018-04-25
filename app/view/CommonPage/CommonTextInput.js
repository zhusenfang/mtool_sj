import React,{Component,PropTypes} from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    TouchableHighlight,
    InteractionManager,
    Text
} from 'react-native';
export default class CommonTextInput extends Component {
    static propTypes = {
        style: View.propTypes.style,
        inputItemStyle: View.propTypes.style,
        iconStyle: View.propTypes.style,
        maxLength: TextInput.propTypes.maxLength.isRequired,
        onChange: PropTypes.func,
        onEnd: PropTypes.func,
        autoFocus: PropTypes.bool,
    };

    static defaultProps = {
        autoFocus: true,
        onChange: () => {
        },
        onEnd: () => {
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };

    }

    componentDidMount() {
        if (this.props.autoFocus) {
            InteractionManager.runAfterInteractions(() => {
                this._onPress();
            });
        }
    }

    clear = () => {
        this.refs.textInput.clear();
        this.setState({text:''});
    };

    _onChangeText = (text) => {

        this.setState({text});
        this.props.onChange(text);
        if (text.length === this.props.maxLength) {
            this.props.onEnd(text);
        }
    }

    render() {
        return (
            <TouchableHighlight
                onPress={this._onPress.bind(this)}
                activeOpacity={1}
                underlayColor='transparent'>
                <View style={[styles.container, this.props.style]}>
                    <TextInput
                        style={{height: 45, zIndex: 99, position: 'absolute', width: 45 * 6, opacity: 0}}
                        ref='textInput'
                        maxLength={this.props.maxLength}
                        autoFocus={false}
                        keyboardType="number-pad"
                        onChangeText={this._onChangeText}
                    />
                    {
                        this._getInputItem()
                    }
                    {/*<View style={{backgroundColor:'#E5E5E5',width}}></View>*/}
                </View>
            </TouchableHighlight>
        )

    }

    _getInputItem() {
        let inputItem = [];
        let {text}=this.state;
        for (let i = 0; i < parseInt(this.props.maxLength); i++) {
            if (i == 0) {
                inputItem.push(
                    <View
                        key={i}
                        style={[styles.inputItem, this.props.inputItemStyle]}
                    >
                        {
                            i < text.length ?
                                <Text style={{fontSize:14,
                                color:'#2D2D2D'}}>{text.charAt(i)}</Text>
                                : <View style={{backgroundColor:'#E5E5E5',width:40,height:2,marginTop:20}}/>
                        }
                    </View>)
            }
            else {
                inputItem.push(
                    <View
                        key={i}
                        style={[styles.inputItem, this.props.inputItemStyle]}
                    >
                        {
                            i < text.length ?
                                <Text style={{fontSize:14,
                                    color:'#2D2D2D'}}>{text.charAt(i)}</Text> :
                                <View style={{backgroundColor:'#E5E5E5',width:40,height:2,marginTop:20}}/>
                        }
                    </View>)
            }
        }
        return inputItem;
    }

    _onPress() {
        this.refs.textInput.focus();
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        // borderWidth: 1,
        // borderColor: '#ccc',
        // backgroundColor: '#fff'
    },
    inputItem: {
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:10,
    },
    iconStyle: {
        width: 16,
        height: 16,
        color:'black',

        // backgroundColor: '#222',
        // borderRadius: 8,
    },
});