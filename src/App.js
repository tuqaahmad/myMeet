import React, { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

export default function App() {
  const [credentials, setUserCredentials] = useState({
    username: "",
    room: "",
  });
  const [showChat, setShowChat] = useState(false);

  const on_cred_change = (e) => {
    let newUserCred = credentials;
    newUserCred[e.target.name] = e.target.value;
    setUserCredentials(newUserCred);
  };

  const join_room = () => {
    if (credentials.username !== "" && credentials.room !== "") {
      socket.emit("join_room", credentials.room);
      setShowChat(true);
    }
  };

  return (
    <>
      {!showChat ? (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join A Room
          </h2>

          <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="username"
                    placeholder="John..."
                    onChange={(e) => {
                      on_cred_change(e);
                    }}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="room"
                    placeholder="room..."
                    onChange={(e) => {
                      on_cred_change(e);
                    }}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={join_room}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Join now
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Chat socket={socket} credentials={credentials} />
      )}
    </>
  );
}
