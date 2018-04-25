/**
 * Created by zhg on 2017/9/2.
 */
import React,{Component} from "react";
import {

    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableOpacity,
    TouchableHighlight

} from "react-native";

var TimerMixin = require('react-timer-mixin');

var GGInput = React.createClass({

   mixins: [TimerMixin],

    getInitialState(){

        return {

            content:"",
            disabled:false,
            //倒计时
            countdown:60,

        }

    },

   render(){

       var rightView = null;

        var rightTitle = this.state.disabled !=true ? '发送短信' : this.state.countdown + '秒后重发';


       if(this.props.isCaptcha == true){

           rightView = (

               <TouchableHighlight
                   style={[InputStyle.rightBtnText,{backgroundColor:this.state.disabled==true?"gray":"black"}]}
                   disabled={this.state.disabled}
                   activeOpacity={1}
                   onPress={this.clickCaptcha}
               >

                   <Text style={{color:"white"}}>{rightTitle}</Text>

               </TouchableHighlight>
           )

       }

       return (

           <View style={this.props.style}>

               <View style={InputStyle.leftTextView}>
                   <Text style={InputStyle.leftText}>{this.props.leftTitle}</Text>
               </View>

               <TextInput

                   ref={e=>this._input=e}
                   onSubmitEditing={this.submitEditAction}
                   placeholderTextColor={"rgb(158,158,158)"}
                   placeholder={this.props.placeholder}
                   onChangeText={(text)=>{this.changeText(text)}}
                   secureTextEntry={this.props.isPwd}
                   underlineColorAndroid="transparent"
                   style={InputStyle.middleInput}
                   keyboardType={this.props.keyboardType}
                   value={this.state.content}

               />

               {rightView}


           </View>

       );
   },



    clickCaptcha(){



        if(this.state.disabled != true){

            this.props.rightAction();

            var reg = /^\d{11}$/;

            if(!reg.test(this.props.superthis._captcha.state.content)){

                return;
            }


            this.setState({

                disabled:true,
            })

            this.timer = this.setInterval(()=>{

                if(this.state.countdown <= 0){

                    this.clearInterval(this.timer);
                    this.setState({

                        countdown:60,
                        disabled:false,
                    })
                }

                this.setState({

                    countdown:this.state.countdown-1,
                });

            },1000);
        }

    },

    changeText(text){

       this.setState({

           content:text,
       })
    },

});

var InputStyle = StyleSheet.create({

    leftTextView:{

        width:80,
        justifyContent:"center",
        alignItems:"flex-start",
    },

    leftText:{

        fontSize:15,
        color:"black",
        marginLeft:10,
    },

    middleInput:{

        flex:3,
        height:53,

    },

    rightBtnText:{

       flex:2,
        justifyContent:"center",
        alignItems:"center",

    },



})

module.exports = GGInput;


