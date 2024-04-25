import * as React from 'react';
import { Text, View, StyleSheet,SafeAreaView, Platform } from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'react-native'
import SpinnerOverlay from './SpinnerOverlay';

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [appFirstWebViewReady, setAppFirstWebViewReady] = React.useState(false)
  const [onWebViewLoad, setOnWebViewLoad] = React.useState(false)
  const [showSpinner, setShowSpinner] = React.useState(false)
  const [errorOccured, setErrorOccured] = React.useState(false)

  const [lastLoadCode, setlastLoadCode] = React.useState(undefined)
  const lastLoadCodeRef = React.useRef(null);
  lastLoadCodeRef.current = lastLoadCode;

  const lastTimeoutRef = React.useRef(null);


  const checkHideLoading = () => {
    if (lastTimeoutRef.current != null)
      clearTimeout(lastTimeoutRef.current);

    lastTimeoutRef.current = setTimeout(() => {

      if (lastLoadCodeRef.current == undefined) {
        setErrorOccured(false);
        hideSplashScreen();
        setShowSpinner(false);
      }
    }, 3000);
  }

  React.useEffect(() => {

    checkHideLoading();
  }, [lastLoadCode])

  const webViewRef = React.useRef(null);

  const hideSplashScreen = async (e) => {
    setAppFirstWebViewReady(true);
    setOnWebViewLoad(false);
    await SplashScreen.hideAsync()

  }
  React.useEffect(() => {

    if (appFirstWebViewReady && onWebViewLoad) {
      setShowSpinner(true);
    }
  }, [onWebViewLoad, appFirstWebViewReady])

  const refreshWebView = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }
  return (
      <View style={styles.container}>
        {Platform.OS  === 'android' && <StatusBar hidden />}
        {Platform.OS  === 'ios' &&     <SafeAreaView />}
  
      <SpinnerOverlay
      overlayColor={errorOccured ? "black" : "rgba(0, 0, 0, 0.74)"}
        visible={showSpinner}
        textContent={'Loading...'}

      />


      <WebView
        ref={webViewRef}
        onError={(e) => {
          console.log(e.nativeEvent)
          setErrorOccured(true);
          refreshWebView();
        }}

        onLoadEnd={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
   
          setlastLoadCode(nativeEvent.code);
          checkHideLoading();
        }}
        onLoadStart={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
       
          setOnWebViewLoad(true);
        }}

        source={{ uri: "https://www.leopardsgroups.co.uk/" }}
      />
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'



  },
  paragraph: {

    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
