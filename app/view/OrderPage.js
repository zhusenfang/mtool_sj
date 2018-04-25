import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,

} from 'react-native';
import Contants from '../common/Contants';
import ExpandableList from 'react-native-expandable-section-flatlist';
import MockData from '../common/MockData'
export default class OrderPage extends Component {
    _renderRow=(rowItem, rowId, sectionId)=>{
return(
        <TouchableOpacity key={rowId} onPress={() => {}}>
            <View
                style={{ alignItems: 'center', margin: 5, padding: 5,
                    borderWidth: 0.5 }}>
                <Text style={{ fontSize: 15, color: "black" }}>
                    {rowItem.title}
                </Text>
            </View>
        </TouchableOpacity>
)
    }
    _renderSection=(section, sectionId)=>{

        return(
            <View
                style={{ marginVertical: 10, marginHorizontal: 15, height: 30, flexDirection: 'row',
                    justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 0.5,
                    borderBottomColor: "black" }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, color: "black"}}>
                        {section}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 21, color: "black" }}>
                        {'更多 '}
                    </Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{width:Contants.Screen.width,height:1,backgroundColor:"black"}}></View>
           <ExpandableList
               dataSource={MockData.workbenchData}
               headerKey="title"
               memberKey="member"
               renderRow={this._renderRow.bind(this)}
               renderSectionHeaderX={this._renderSection.bind(this)}
               openOptions={[1,2,]}


           />
            </View>
        );
    }
}