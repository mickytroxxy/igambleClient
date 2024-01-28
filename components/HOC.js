import { StyleSheet } from "react-native";

const UpdatedComponent = (WrappedComponent) => {
    return (props) => {
        const handleAlert = () => {
            alert("clicked ")
        }
        const { style, ...rest } = props;
        const combinedStyle = [styles.container, style];
        return <WrappedComponent style={combinedStyle} handleAlert={handleAlert} {...rest} />;
    };
};
export default UpdatedComponent;
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'red',
      padding: 10,
      flex:1,
      justifyContent:'center'
    },
    myComponent: {
      marginBottom: 20,
    },
});
/**
 * pagination
 * report, delete and block
 * Testing
 * splashScreen editing
 * 
 */