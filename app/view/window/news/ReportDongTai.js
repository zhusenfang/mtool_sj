import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Switch,
    TouchableOpacity,
    Image,
    FlatList,
    ListView,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    Keyboard,
    DeviceEventEmitter,
    BackHandler
} from 'react-native';
import comstyle from '../../../common/CommonStyle';
import {API, postFetch} from '../../../common/GConst';
import Contants from '../../../common/Contants';
import ImagePicker from 'react-native-image-picker'
import Toast from "react-native-easy-toast";
import Modal from 'react-native-modal';
import VideoView from '../../../view/nativeModuals/VideoView'

export default class ReportDongTai extends Component {
    constructor(props) {
        super(props)
        this.state = {
            textinput: '',
            dataSourceImage: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            imgpng: null,
            imagelist: [],
            // keyboardHeight:0,
            isShowModal: false,
            chooseImg: false,
            chooseVideo: false,
            fengmian: '',
            shangprogress: "",
            videoId: '',
        }
    }
    _androidBack = () => {

        this.props.navigation.goBack()

        return true;

    }

    componentDidMount() {
        if(Platform.OS==='android'){
            BackHandler.addEventListener('hardwareBackPress', this._androidBack);}
        DeviceEventEmitter.addListener('onCoverImage', this.onResult)
        DeviceEventEmitter.addListener('onProgress', (e) => {
            // alert(e);
            this.setState({shangprogress: e})
        });
        DeviceEventEmitter.addListener('onUploadSuccess', this.onSuccess)
    }

    onResult = (e) => {
        // alert(e);
        this.setState({
            fengmian: e
        })
    }
    onSuccess = (e) => {
        if (e) {
            this._toast.show('上传成功')
        }
        this.setState({
            videoId: e
        })
    }

    componentWillUnmount() {
        VideoView.destroy();
        BackHandler.removeEventListener('hardwareBackPress', this._androidBack);
    }

    render() {
        return (<View style={[comstyle.contain, {backgroundColor: '#f9f9f9'}]}>
            <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
                <View style={styles.con}>

                    <View style={styles.input}>
                        <TextInput
                            style={{
                                backgroundColor: "#FFFFFF",
                                // textAlign: "center",
                                height: 70,
                                borderWidth: 1,
                                borderColor: '#E5E5E5',
                                width: Contants.Screen.width - 40,
                                // marginLeft:10,
                                borderRadius: 4,

                                margin: 10,
                            }}
                            placeholder={'发表新动态...'}
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#B2B2B2"

                            onChangeText={(e) => {
                                this.setState({
                                    textinput: e,
                                })
                            }}/>
                    </View>
                    <View style={styles.tup}>
                        <TouchableOpacity style={styles.tup} onPress={() => {
                            this.setState({
                                isShowModal: true
                            })
                        }}>
                            <Image source={require('../../../img/pinglun/jia.png')}
                                   style={styles.imge}/>

                        </TouchableOpacity>
                        {this.state.fengmian == '' ?
                            <ListView
                                dataSource={this.state.dataSourceImage}
                                renderRow={this._renderRowImage}

                                horizontal={true}

                            /> : <View style={styles.video}>
                                <Image source={{uri: "file:///" + this.state.fengmian}}
                                       style={styles.fengtu}>
                                    <Text style={styles.progress}>{this.state.shangprogress}</Text>
                                </Image>
                            </View>}
                    </View>
                </View>
                <View style={{flex: 1}}></View>
                <View style={[styles.tups]}>
                    <View style={styles.item}>
                        <Image source={require('../../../img/pinglun/ait.png')}
                               style={styles.imgm}/>
                        <Image source={require('../../../img/pinglun/errpress.png')}
                               style={styles.imgm}/>
                        <Image source={require('../../../img/pinglun/shoucang.png')}
                               style={styles.imgm}/>
                    </View>
                    <TouchableOpacity onPress={this.fasong.bind(this)}>
                        <Image source={require('../../../img/pinglun/fasong.png')}
                               style={styles.time}>
                            <Text style={styles.song}>发送</Text>
                        </Image>
                    </TouchableOpacity>
                </View>
                <Toast ref={(e) => {
                    this._toast = e
                }}
                       position='center'
                />
            </KeyboardAvoidingView>
            <Modal
                isVisible={this.state.isShowModal}
                hideOnBack={true}
                transparent={true}
                style={styles.modalstyle}
                //backdropColor='transferent'
                backdropOpacity={0.3}
            >
                {/*点击外框，键盘消失*/}
                <TouchableOpacity
                    onPress={() => {
                        this.setState({isShowModal: false});

                    }}
                    style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                />
                <View style={styles.mo}>
                    <TouchableOpacity style={styles.tupian} onPress={this.selectImage.bind(this)}>
                        <Text style={styles.texts}>选择图片</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tupian} onPress={this.video.bind(this)}>
                        <Text style={styles.texts}>选择视频</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>)
    }

    video() {

        if (this.state.chooseImg === true) {
            this._toast.show('只能选择多张图片或一个视频')
            return
        } else {
            this.setState({
                isShowModal: false
            })
            VideoView.getVideo()
        }
        // VideoView.getVideo()

    }

    fasong() {
        var tem = this
        // if(this.state.textinput===''){
        //     return
        // }
        postFetch(API.ReportDongTai, {
            content: this.state.textinput, resourceUrls: this.state.imagelist,
            type: this.state.videoId == '' ? 0 : 1, videoId: this.state.videoId
        }, (result) => {
            // alert(JSON.stringify(result))
            if (result.status == 1) {
                this._toast.show(result.msg)
                setTimeout(function () {
                    tem.props.navigation.navigate('NewsMain',{data:1})
                }, 600)
            }else {
                this._toast.show(result.msg)
            }
        }, (error) => {

        })
    }


    _renderRowImage = (rowData) => {

        return (<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Image source={{uri: rowData}} style={styles.fengtup}/>
            {/*<Text>{rowData}</Text>*/}
        </View>)
    }

    //图片选择
    selectImage() {
        if (this.state.fengmian !== '') {
            return
        }
        if (this.state.imagelist.length > 8) {
            this._toast.show('最多发表9张图片')
            return
        }
        // alert(this.state.imagelist.length)
        var photoOptions = {

            title: "请选择",
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            quality: 0.75,
            allowsEditing: true,
            noData: false,
            maxWidth:200,
            maxHeight:200,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }
        ImagePicker.showImagePicker(photoOptions, (res) => {
            if (res.didCancel) {
                return
            } else {
                let source;  // 保存选中的图片
                source = {uri: 'data:image/jpeg;base64,' + res.data};

                if (Platform.OS === 'android') {
                    source = {uri: res.uri};
                } else {
                    source = {uri: res.uri.replace('file://', '')};
                }

                let file = {uri: source.uri, type: 'multipart/form-data', name: 'image.jpg'};
                var formData = new FormData();
                formData.append('file', file)

                fetch(API.ShangChuan, {
                    method: "POST",

                    body: formData,
                    headers: {'Content-Type': 'multipart/form-data',},
                }).then((response) => response.json()).then((result) => {
                    // alert(JSON.stringify(result))

                    if (result.status == 1) {
                        this.setState({
                            imgpng: result.url,
                            // avatarSource:result.url,
                            imagelist: this.state.imagelist.concat(result.url),
                            dataSourceImage: this.state.dataSourceImage.cloneWithRows(this.state.imagelist.concat(result.url)),
                            isShowModal: false,
                            chooseImg: true
                            // ceshilist:this.state.ceshilist.concat([{"imgUrl":result.url}]),
                            // typeceshi:this.state.typeceshi.cloneWithRows(this.state.ceshilist.concat([{"imgUrl":result.url}]))
                        })
                        // alert(JSON.stringify(this.state.ceshilist))
                    }
                }).catch((error) => {
                    alert(error)
                })
                //
            }

        })
    }
}
const styles = StyleSheet.create({
    con: {
        height: 186,
        backgroundColor: 'white',
        flexDirection: 'column',
        // alignItems:'center',
        marginTop: 20
    },
    input: {
        alignItems: 'center', justifyContent: 'center'
    },
    tup: {
        flexDirection: 'row',
    },
    imge: {
        marginLeft: 20,
        marginTop: 0,
        marginBottom: 10,
        marginRight: 10
    },
    tups: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    imgm: {
        margin: 10
    },
    song: {
        fontSize: 12,
        color: 'white',
    },
    time: {
        marginRight: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',

    },
    mo: {
        height: 100,
        backgroundColor: 'white',
        flexDirection: 'column',

    },
    tupian: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    texts: {
        fontSize: 20,
        marginLeft: 20
    },
    video: {
        flexDirection: 'row', flexWrap: 'wrap'
    },
    progress: {
        fontSize: 16,
        color: 'white',
    },
    fengtup: {
        width: 60, height: 60, marginTop: 10, marginLeft: 10, marginRight: 10
    },
    fengtu: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    }

})