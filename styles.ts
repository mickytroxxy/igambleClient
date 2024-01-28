import { Dimensions, StyleSheet } from 'react-native';
const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
const height_logo = height * 0.28;

export const GlobalStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flex: 2,
      justifyContent: "center",
      alignItems: "center"
    },
    ProfileHeader: {
      flex: 2,
      justifyContent: "center",
      alignItems: "center"
    },
    footer: {
      flex: 1,
      backgroundColor: "#fff",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 5.9,
      shadowRadius: 2.84,
      elevation: 5,
    },
    ProfileFooter: {
      flex: 2,
      backgroundColor: "#fff",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      //paddingVertical: 10,
      //paddingHorizontal: 5,
      shadowColor: "#B0B0B0",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
      paddingBottom: 30,
      zIndex: 100,
    },
    CreditFooter: {
      flex: 1,
      backgroundColor: "#fff",
    },
    actionView: {
      margin: 5,
      marginTop: 10,
      height: 100,
      borderRadius: 5,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.9,
      shadowRadius: 2.84,
      elevation: 2,
      padding: 5,
    },
    actionViewBtnContainer: {
      width: 110,
      height: 110,
      overflow: "hidden",
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      borderBottomLeftRadius: 50,
      marginRight: 10,
    },
    actionViewBtn: {
      height: 110,
      backgroundColor: '#fff',
      alignContent: 'center',
      alignItems: 'center',
      width: 110,
    },
    actionViewText: {
      color: '#fff',
      fontWeight: '500',
      fontFamily: 'sans-serif-medium',
      textTransform: 'uppercase',
      fontSize: 9,
      alignContent: 'center',
      alignItems: 'center'
    },
    interestBtnHolder: {
      height: 60,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
      borderRadius: 100,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.9,
      shadowRadius: 2.84,
      elevation: 2,
    },
    requestTypeViewHolder: {
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      borderRadius: 20,
      padding: 2,
    },
    requestTypeView: {
      width: '100%',
      backgroundColor: '#fff',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      padding: 7
    },
    interestBtnAction: {
      width: 57,
      height: 57,
      backgroundColor: '#fff',
      borderRadius: 100,
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    MapFooter: {
      flex: 2,
      backgroundColor: "#fff",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      elevation: 10,
      paddingBottom: 30,
      zIndex: 100,
    },
    mapFooterHeader: {
  
    },
    otherPhotosScroll: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    outterHolder: {
      flex: 2,
      backgroundColor: "#fff",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 10,
      height: height - 50,
    },
    logo: {
      width: height_logo,
      height: height_logo
    },
    profilepic: {
      width: width,
      minHeight: width
    },
    title: {
      color: "#05375a",
      fontSize: 28,
    },
    text: {
      color: "grey",
      marginTop: 5
    },
    button: {
      alignItems: "flex-end",
      marginTop: 30
    },
    signIn: {
      width: 150,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      flexDirection: "row"
    },
    textSign: {
      color: "white",
    },
    searchContainer: {
      zIndex: 5,
      position: "absolute",
      flexDirection: "row",
      top: 30,
      width: width - 40,
      height: 80,
      borderRadius: 5,
      backgroundColor: '#fff',
      alignItems: 'center',
      shadowColor: '#000',
      elevation: 10,
      shadowRadius: 5,
      shadowOpacity: 1.0,
    },
    floatBtnsView: {
      zIndex: 5,
      position: "absolute",
      left: 10,
      top: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      alignContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 700,
      padding: 5,
      borderTopRightRadius: 700,
      paddingBottom: 20,
      paddingTop: 10,
      minWidth: 25,
    },
    floatBtnsViewInner: {
      backgroundColor: '#fff',
      padding: 3,
      alignItems: 'center',
      alignContent: 'center',
      borderRadius: 100,
      marginTop: 5,
      borderWidth: 0.5,
    },
    searchInputText: {
      paddingLeft: 10,
      borderRadius: 10,
      marginTop: 20,
      shadowColor: "#fff",
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowOpacity: 1,
      shadowRadius: 5,
      elevation: 1,
      height: 40,
      borderColor: 'transparent',
    },
    searchInputHolder: {
      //elevation: 1,
      height: 40,
      borderRadius: 10,
      flexDirection: 'row',
      borderWidth: 0.5,
      borderColor: '#a8a6a5'
    },
    leftCol: {
      flex: 1,
      alignItems: 'center',
    },
    centerCol: {
      flex: 6,
    },
    listAvatar: {
      width: 30,
      height: 30,
      borderRadius: 100,
    },
    rightCol: {
      flex: 1,
      borderLeftWidth: 1,
      borderColor: '#ededed',
    },
    requestBtn: {
      width: 200,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      flexDirection: "row"
    },
    requestTxt: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18
    },
    mediaImageContainer: {
      width: 150,
      height: 150,
      borderRadius: 5,
      overflow: "hidden",
      marginHorizontal: 2,
    },
    mediaCount: {
      position: "absolute",
      top: "50%",
      marginTop: -30,
      marginLeft: 30,
      width: 50,
      height: 50,
      backgroundColor:'teal',
      padding:10,
      borderRadius:100,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "rgba(0, 0, 0, 0.38)",
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
      shadowOpacity: 1
    },
    image: {
      flex: 1,
      height: undefined,
      width: undefined,
    },
    recent: {
      fontSize: 10
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16,
        padding:10,
    },
    activityIndicator: {
        marginLeft:-10,
        padding:5,
    },
  });
  