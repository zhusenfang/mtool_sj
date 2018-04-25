import React, {
    AsyncStorage
}from 'react-native';

class DeviceStorage {
    /**
     * 获取
     * @param key
     * @returns {Promise<T>|*|Promise.<TResult>}
     */

    // static get(key) {
    //     return AsyncStorage.getItem(key).then((value) => {
    //         const jsonValue = JSON.parse(value);
    //         return jsonValue;
    //     });
    // }

  async get(key){
        const value=await AsyncStorage.getItem(key);
        const jsonValue=JSON.parse(value);
        return jsonValue;
    }
    /**
     * 保存
     * @param key
     * @param value
     * @returns {*}
     */
    save(key, value) {
        return AsyncStorage.setItem(key, JSON.stringify(value),(error)=>{if(error){alert(error)}else {}});
    }

    /**
     * 更新
     * @param key
     * @param value
     * @returns {Promise<T>|Promise.<TResult>}
     */
    update(key, value) {
        return DeviceStorage.get(key).then((item) => {
            value = typeof value === 'string' ? value : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        });
    }


    /**
     * 更新
     * @param key
     * @returns {*}
     */
    delete(key) {
        return AsyncStorage.removeItem(key);
    }
}
const Storage=new DeviceStorage();
export default Storage;