import { useEffect, useState } from 'react';
import { Layout, Menu } from '@arco-design/web-react';
import Cookies from 'js-cookie';
import React from 'react';
import './chat-page.css'
import ChatWindow from '../components/chat-window/chat-window.tsx';
import { message } from 'antd';
import axios from "../axios.ts";

const MenuItem = Menu.Item;
const Sider = Layout.Sider;
const Content = Layout.Content;
const collapsedWidth = 60;
const normalWidth = 260;

// 主页面
function ChatPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [siderWidth, setSiderWidth] = useState(normalWidth);
  const [chatWindows, setChatWindows] = useState([{ id: 0, topic: 'New Chat' }]);
  const [selectedKey, setSelectedKey] = useState('0'); // 添加一个 selectedKey 状态
  const [selectedTopic, setSelectedTopic] = useState('New Chat'); // 添加一个 selectedKey 状态
  const [avatar, setAvatar] = useState('')
  const [nickname, setNickName] = useState('')

  useEffect(()=>{
      axios.get("/api/v1/gpt/topic_list", {
      })
    .then((response) => {
        // 在接收到响应时更新消息列表
        console.log(response.data)
        if (response.data.data) {
          setChatWindows(response.data.data);
        }
    })
    .catch((error) => {
        console.error(error);
    });
  }, [])

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
    setSiderWidth(collapsed ? collapsedWidth : normalWidth);
  };

  const handleMoving = (_, { width }) => {
    if (width > collapsedWidth) {
      setSiderWidth(width);
      setCollapsed(!(width > collapsedWidth + 20));
    } else {
      setSiderWidth(collapsedWidth);
      setCollapsed(true);
    }
  };

  const handleMenuItemClick = (id: string, topic: string) => {
    console.log("key:", id);
    setSelectedTopic(topic);
    setSelectedKey(id);
  };

  const addChatWindow = () => {
    console.log(chatWindows[chatWindows.length-1].id);
    const id = chatWindows[chatWindows.length-1].id + 1;
    setChatWindows([...chatWindows, { id, topic: 'New Chat' }]);
    handleMenuItemClick(String(id), 'New Chat');
  };

  const LogOut = () => {
    setAvatar('');
    setNickName('');
    
    Cookies.remove('x-token');
    Cookies.remove('avatar');
    Cookies.remove('nickname');
  };

  useEffect(() => {
    const avatar = document.cookie
      .split('; ')
      .find((row) => row.startsWith('avatar'))
      ?.split('=')[1];
    avatar? setAvatar(avatar):setAvatar("https://avatars.githubusercontent.com/u/90499546?s=40&v=4");
    const nickname = document.cookie
      .split('; ')
      .find((row) => row.startsWith('nickname'))
      ?.split('=')[1];
    nickname? setNickName(nickname): message.warning('您未登陆');
  }, []);

  return (
    <Layout className='byte-layout-collapse-chat-app'>
      <Sider
        collapsible
        theme='dark'
        onCollapse={onCollapse}
        collapsed={collapsed}
        width={siderWidth}
        trigger={null}
        resizeBoxProps={{
          directions: ['right'],
          onMoving: handleMoving,
        }}
      >
        <div className='logo' />
        <Menu 
            theme='dark'
            autoOpen
            defaultSelectedKeys={[selectedKey]} // 设置 selectedKeys
            selectedKeys={[selectedKey]}
            style={{ width: '100%' }}
            className="menu-container"
          >
          <div className='new-chat'>
            <MenuItem onClick={addChatWindow} key='add' className='create-window'>
              + New Chat
            </MenuItem>
          </div>
          <div className='chat-topic'>
            {chatWindows.map((chatWindow) => (
              <MenuItem key={String(chatWindow.id)} onClick={() => handleMenuItemClick(String(chatWindow.id), chatWindow.topic)}>
                {chatWindow.topic}
              </MenuItem>
            ))}
          </div>
          <div className='nav-tool'>
            {
            nickname?
              <MenuItem key='logout' className='logout' onClick={LogOut}>
                退出登陆
              </MenuItem>
            :
            <a href="http://localhost:8080/login/chat">
              <MenuItem key='login' className='login'>
                前往登陆
              </MenuItem>
            </a>
            }
          </div>
        </Menu>
      </Sider>
      <Content style={{ width: '100%', minHeight: '100%', backgroundColor: "rgba(52,53,65)" }}>
        <div style={{ textAlign: 'center' }}>
          <ChatWindow id={selectedKey} topic={selectedTopic} avatar={avatar}/>
        </div>
      </Content>
    </Layout>
  );
}

export default ChatPage;
