import AgoraRTC, {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  useRemoteAudioTracks,
  useRemoteUserTrack,
  useClientEvent,
} from "agora-rtc-react";
import React, { useEffect, useState } from "react";

import "./styles.css";
import logo from "./logo.png";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export const LiveVideo = () => {
  const [calling, setCalling] = useState(true);
  const navigate = useNavigate();
  const [appId, setAppId] = useState("9de3357efcb84a8184d4746b7e8e4add");
  const [channel, setChannel] = useState("");
  const [adios, setAudios] = useState([]);
  // const [token, setToken] = useState(
  //   "007eJxTYNjnrWhj/iOpP/W8afAEr+uXv7mp7iz5ILl3QarCZ6GJvt0KDJYpqcbGpuapaclJFiaJFoYWJikm5iZmSeapFqkmiSkph8Rl0xoCGRmMui2ZGBkgEMQXYkjOSSwuLsjPzCuJT85IzMtLzWFgAAAsJySr"
  // );
  const { channelName } = useParams();
  const [getToken] = useSearchParams()
  //   const xJoin = (token) =>
 console.log({ appid: "9de3357efcb84a8184d4746b7e8e4add", channel: getToken?.get("channel"), token: getToken.get("token")?.replaceAll(" ","+") })
  useJoin(
    { appid: "9de3357efcb84a8184d4746b7e8e4add", channel: getToken?.get("channel"), token: getToken.get("token")?.replaceAll(" ","+") },
    calling
  );
  useEffect(() => { 
    // xJoin(token);
  }, [getToken.get("token")]);

  //local user
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);
  //remote users
  const remoteUsers = useRemoteUsers();
  const audioTracks = AgoraRTC.getMicrophones();
  AgoraRTC.createClient();
 
 AgoraRTC.emit("mute-mic")

  const audioTrack = useRemoteAudioTracks();
  // useEffect(() => {
  //   if (remoteUsers && remoteUsers?.length) {
  //     setAudios(audioTrack(remoteUsers)?.audioTrack);
  //   }
  // }, [remoteUsers]);

  // useEffect(() => {
  //   console.log(adios)
  //   audioTrack &&
  //     audioTrack?.length &&
  //     audioTrack?.forEach((track) => console.log("track: ", track));
  // }, [adios]);

  return (
    <>
      <div className="room">
        <div className="user-list">
          <div className="user">
            <LocalUser
              audioTrack={localMicrophoneTrack}
              cameraOn={false}
              micOn={micOn}
              videoTrack={localCameraTrack}
              cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
            >
              <samp className="user-name">You</samp>
            </LocalUser>
          </div>
          {remoteUsers.map((user) => (
            <div className="user" key={user.uid}>
              <RemoteUser
                cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                user={user}
              //   playAudio={false}
              >
                /{" "}
                <samp className="user-name micc">
                  {" "}
                  <button className="btn">
                    {!user.audioTrack ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-microphone-off"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 3l18 18" />
                        <path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1" />
                        <path d="M5 10a7 7 0 0 0 10.846 5.85m2 -2a6.967 6.967 0 0 0 1.152 -3.85" />
                        <path d="M8 21l8 0" />
                        <path d="M12 17l0 4" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-microphone"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" />
                        <path d="M5 10a7 7 0 0 0 14 0" />
                        <path d="M8 21l8 0" />
                        <path d="M12 17l0 4" />
                      </svg>
                    )}
                  </button>
                </samp>
                <samp className="user-name">{user.uid}</samp>
              </RemoteUser>
            </div>
          ))}
        </div>

      </div>
      {/* {isConnected && ( */}
      <div className="control">
        <div className="left-control">
          <button className="btn" onClick={() => setMic((a) => !a)}>
            {!micOn ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-microphone-off"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 3l18 18" />
                <path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1" />
                <path d="M5 10a7 7 0 0 0 10.846 5.85m2 -2a6.967 6.967 0 0 0 1.152 -3.85" />
                <path d="M8 21l8 0" />
                <path d="M12 17l0 4" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-microphone"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <path d="M8 21l8 0" />
                <path d="M12 17l0 4" />
              </svg>
            )}
          </button>
          {/* <button className="btn" onClick={() => setCamera((a) => !a)}>
            {cameraOn ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-camera"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-camera-off"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8.297 4.289a.997 .997 0 0 1 .703 -.289h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v8m-1.187 2.828c-.249 .11 -.524 .172 -.813 .172h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1c.298 0 .58 -.065 .834 -.181" />
                <path d="M10.422 10.448a3 3 0 1 0 4.15 4.098" />
                <path d="M3 3l18 18" />
              </svg>
            )}
          </button> */}
        </div>
        <button
          className={`btn btn-phone ${calling ? "btn-phone-active" : ""}`}
          onClick={() => {setCalling(false);navigate(-1)}}
        >
          {calling ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-phone-pause"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
              <path d="M20 3l0 4" />
              <path d="M16 3l0 4" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-phone"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
            </svg>
          )}
        </button>
      </div>
      {/* )} */}
    </>
  );
};

export default LiveVideo;
