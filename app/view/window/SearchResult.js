import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    ListView
} from 'react-native';
import Contants from '../../common/Contants';
import CheckBox from '../CommonPage/GGCheckView'
import {API,postFetch} from '../../common/GConst'
import Toast from "react-native-easy-toast";
export default class SearchResult extends Component {
constructor(props){
    super(props)
    this.state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
    }
}
    componentDidMount(){
        const list=this.props.navigation.state.params.id
        this.setState({
        dataSource:this.state.dataSource.cloneWithRows(JSON.parse(list))
    })
    }
     render(){
         const list=this.props.navigation.state.params.id
        const lists=JSON.parse(list)
         // alert(lists[1])
         return(<View style={{flex:1,backgroundColor:'#f9f9f9'}}>
             {/*<Text>{lists[0].id}</Text>*/}
             <ListView
             dataSource={this.state.dataSource}
             renderRow={this._renderRow}
             // automaticallyAdjustContentInsets={false}
             />
         </View>)
     }
       _renderRow=(rowData)=>{
         return(

             <TouchableOpacity style={styles.listview} onPress={this.select.bind(this,rowData)}>
            <View style={styles.font}>
                <Text style={styles.texts}>{rowData.memUsername}</Text>
                <Text style={styles.textf}>{rowData.createTime}</Text>
            </View>
             <Text style={styles.pingjia}>{rowData.score==undefined?'用户暂未评价':"用户评价"+rowData.score+"/"+rowData.serverScore}</Text>
         </TouchableOpacity>)
}
     select(rowData){
         // var data={
         //     id:rowData.id
         // }
        this.props.navigation.navigate('SearchDetail',{data:rowData.id})
}
}
const styles=StyleSheet.create({
    contain:{
         flex:1
    },
    listview:{
        width:Contants.Screen.width,
        height:50,
        backgroundColor:"white",
        marginTop:10
    },
    texts:{
        fontSize:18,
        marginRight:60
    },
    textf:{
        fontSize:14
    },
    font:{
        flexDirection:'row',
        justifyContent:'space-around',
        width:Contants.Screen.width
    },
    pingjia:{
        marginLeft:20
    }
})