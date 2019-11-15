import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { withTheme, ActivityIndicator } from 'react-native-paper';
 const Loading = (props) => {
    const {colors}=props.theme;
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={{ color: colors.text }}>Loading</Text>

            <ActivityIndicator animating={true} color={colors.primary} size={40} />

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  })

  export default withTheme(Loading);