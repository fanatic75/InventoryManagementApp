import { AsyncStorage } from 'react-native';
export const deviceStorage = {

    async saveItem(key: string, value: string) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            alert(' Error 500');
        }
    },
    async getItem(key: string) {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            alert(' Error 500');
        }
    },
    async deleteStorage() {
        try {
            await AsyncStorage.clear();
        }
        catch (error) {

            alert(' Error 500');
        }
    }

};