import React, {useState, useEffect} from 'react';
import {Keyboard, Text, TextInput, View} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import Clipboard from '@react-native-clipboard/clipboard';

const App = () => {
  const [otp, setOtp] = useState('');
  const [listenerActive, setListenerActive] = useState(false);

  useEffect(() => {
    // Uygulamanın hash değerini al ve konsola yazdır
    RNOtpVerify.getHash()
      .then(hash => console.log('App Hash:', hash))
      .catch(err => console.log('Error fetching hash:', err));

    // OTP dinleyicisini başlat
    RNOtpVerify.getOtp()
      .then(() => {
        setListenerActive(true);
        RNOtpVerify.addListener(otpHandler);
      })
      .catch(err => console.log('Error starting OTP listener:', err));

    return () => {
      if (listenerActive) {
        RNOtpVerify.removeListener();
        setListenerActive(false);
      }
    };
  }, [listenerActive]);

  const otpHandler = message => {
    console.log('Received message:', message);

    // Mesajdan OTP'yi kaldırma kısmı
    const match = /(\d{6})/g.exec(message);
    if (match) {
      const lOtp = match[0];
      setOtp(lOtp);

      // OTP kodunu otomatik olarak kopyala
      Clipboard.setString(lOtp);

      if (listenerActive) {
        RNOtpVerify.removeListener();
        setListenerActive(false);
      }
      Keyboard.dismiss();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'gray',
      }}>
      <Text style={{color: 'white'}}>Doğrulama Kodunuz: {otp}</Text>
      <TextInput
        style={{
          color: 'black',
          backgroundColor: 'white',
          borderRadius: 10,
          textAlign: 'center',
          marginTop: 20,
        }}
        placeholder="Enter OTP"
        onChangeText={setOtp}
      />
    </View>
  );
};

export default App;
