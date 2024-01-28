import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useSearchParams } from "expo-router";

import { colors } from "../constants/Colors";
import { UserProfile } from "../constants/Types";
import useAuth from "../hooks/useAuth";
import TextArea from "../components/ui/TextArea";
import Icon from "../components/ui/Icon";

const ConfirmScreenComponent = () => {
    const {confirmCode,confirmationCode,setConfirmationCode} = useAuth()
    const obj: UserProfile = useSearchParams();

    useEffect(() => {
        setConfirmationCode(obj?.code || 0);
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient colors={["#fff", "#fff", "#fff", "#f1f7fa"]} style={styles.gradientContainer}>
                <Text style={styles.text}> We have sent the confirmation code to {obj.phoneNumber}!</Text>
                <TextArea attr={{field: "search",value: confirmationCode.toString(),icon: {name: "list",type: "Ionicons",min: 5,color: "#5586cc"},keyboardType: "default",placeholder: "Enter Confirmation Code",color: "#009387",handleChange: (field, value) => setConfirmationCode(value)}}/>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => confirmCode(obj)}>
                        <Icon type="FontAwesome" name="check-circle" size={120} color={colors.primary}/>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

export default ConfirmScreenComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    marginTop: 5,
    borderRadius: 10,
    elevation: 5,
  },
  gradientContainer: {
    flex: 1,
    paddingTop: 10,
    borderRadius: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontFamily: "fontLight",
    marginBottom: 15,
    textAlign: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  searchInputContainer: {
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#a8a6a5",
  },
  myBubble: {
    backgroundColor: "#7ab6e6",
    padding: 5,
    minWidth: 100,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
