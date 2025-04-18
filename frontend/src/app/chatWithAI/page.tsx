'use client';

import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
;
const getToken = () =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))?.split('=')[1];

const getChatId = () => {
  if (typeof window === 'undefined') return uuidv4();
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('chatId') || uuidv4();
};

export default function ChatWithAIPage() {
  const router = useRouter();
  const [chatId] = useState<string>(getChatId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/');
      return;
    }

    axios
      .get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsername(res.data.user.username);
        setIsCheckingAuth(false);
      })
      .catch(() => {
        alert("Could not get Profile")
      });
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!chatId || !token) return;

    const socket = io(API_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('load history');
    });

    socket.on('chat history', (history: Message[]) => {
      setMessages(history || []);
    });

    socket.on('receiveMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('bot reply', (msg: Message) => {
      setIsLoading(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
        setIsLoading(false);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    });

    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    socketRef.current?.emit('chat message', input);
    setInput('');
  };

  const handleClearChat = () => {
    socketRef.current?.emit('clear chat');
    setMessages([]);
  };

  return (
    <>
      {!isCheckingAuth && (
        <div className="container-fluid min-vh-100 d-flex bg-light p-0">
          <div className="position-absolute top-0 end-0 m-3" ref={profileDropdownRef}>
            <div className="dropdown">
              <button
                className="btn btn-sm rounded-circle profile-icon-btn"
                style={{ width: '40px', height: '40px', borderColor: '#28a745' }}
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                title="Profile"
              >
                🧑🏻
              </button>
              {showProfileDropdown && (
                <div
                  className="dropdown-menu dropdown-menu-end show"
                  style={{
                    position: 'absolute',
                    top: '45px',
                    right: '0',
                    zIndex: 1051,
                    display: 'block',
                  }}
                >
                  <span className="dropdown-item-text fw-bold">{username ? username : "ABCD"}</span>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item text-danger" onClick={() => setShowLogoutModal(true)}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-grow-1 d-flex flex-column justify-content-between py-5 px-4">
            <div className="w-100" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 className="text-center mb-4">Chat with AI</h2>

              <div
                className="bg-white shadow-sm p-3 mb-3 d-flex flex-column"
                style={{
                  height: '80vh',
                  border: '2px solid black',
                  borderRadius: '15px'
                }}
              >
                <div
                  className="flex-grow-1 overflow-auto mb-3"
                  style={{ paddingRight: '4px' }}
                >
                  {messages.length === 0 ? (
                    <div className="text-muted text-center mt-5">Start the conversation 👋</div>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`mb-3 d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div
                          className={`p-2 px-3 rounded-pill ${msg.sender === 'user' ? 'bg-success text-white' : 'bg-light border'}`}
                          style={{ maxWidth: '75%' }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="mb-3 d-flex justify-content-start">
                      <div className="p-2 px-3 rounded-pill bg-light border" style={{ maxWidth: '75%' }}>
                        <em>Typing...</em>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="d-flex gap-2"
                >
                  <input
                    type="text"
                    className="form-control flex-grow-1"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{ flex: '1 1 20%' }}

                    disabled={!input.trim() || isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleClearChat}
                    style={{ flex: '1 1 20%' }}

                    disabled={messages.length === 0}
                  >
                    Clear Chat
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div
            className={`modal fade ${showLogoutModal ? 'show d-block' : ''}`}
            tabIndex={-1}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Logout</h5>
                  <button type="button" className="btn-close" onClick={() => setShowLogoutModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to log out?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
