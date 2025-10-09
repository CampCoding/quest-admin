import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';


import AgoraRTC, {
  AgoraRTCProvider,
  useRTCClient,
} from "agora-rtc-react";
import { ConnectForm } from './connectForm';
import { LiveVideo } from './LiveVideo';

function Agora() {

 

  return (<ConnectForm/>
  );
}

export default Agora;
