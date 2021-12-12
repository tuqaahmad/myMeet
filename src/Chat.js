import React, { useState, useEffect } from "react";

import ScrollToBottom from "react-scroll-to-bottom";

export default function Chat({ socket, credentials }) {
  const [currentMsg, setCurrentMsg] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMsg !== "") {
      const messageData = {
        room: credentials.room,
        author: credentials.username,
        message: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div>
      <div className="font-bold bg-gray-800 text-white p-2">
        Live Chat Room : {credentials.room}
      </div>
      <ScrollToBottom className=" bg-gray-100 h-96 overflow-auto p-5">
        {messageList.map((msg) => {
          return (
            <div
              className={
                credentials.username == msg.author
                  ? "m-2 flex justify-end"
                  : "m-2"
              }
            >
              <div>
                <div className="font-bold text-sm">{msg.author}</div>
                <div
                  className={
                    credentials.username == msg.author
                      ? "p-2 rounded-2xl rounded-br-none bg-gray-200 w-fit shadow"
                      : "p-2 rounded-2xl rounded-bl-none bg-blue-200 w-fit shadow"
                  }
                >
                  {msg.message}
                </div>
                <div className="m-0.5 text-gray-500 text-sm">{msg.time}</div>
              </div>
            </div>
          );
        })}
      </ScrollToBottom>
      <div className="flex">
        <input
          type="text"
          name="currentmsg"
          value={currentMsg}
          placeholder="Message..."
          onChange={(e) => {
            setCurrentMsg(e.target.value);
          }}
          onKeyPress={(e) => {
            e.key == "Enter" && sendMessage();
          }}
          className="grow  px-3 py-2 border border-gray-300  placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          className="shrink px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white"
          onClick={sendMessage}
        >
          &#9658;
        </button>
      </div>
    </div>
  );
}
