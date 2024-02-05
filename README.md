# react-ai-box

前面折腾了一个 flutter 版本的 ChatBox，也整过一个 Tauri 的 ChatBox，这次又来了一个 react native 版本的。

<img width="150" alt="image" src="https://github.com/bravekingzhang/react-ai-chat/assets/4476322/35fba279-4a0d-498f-ae36-451c23779058">

<img width="150" alt="image" src="https://github.com/bravekingzhang/react-ai-chat/assets/4476322/11091d71-88ad-4ec2-8e3a-e5ed4f3c3182">

<img width="150" alt="image" src="https://github.com/bravekingzhang/react-ai-chat/assets/4476322/6cbb3a66-b058-4a86-bb4e-8046498ffdf9">

<img width="150" alt="image" src="https://github.com/bravekingzhang/react-ai-chat/assets/4476322/3efa616d-839f-4751-8fd6-9673109f04f7">

基于 react-native 的 AI 盒子，用于学习 react-native 开发，技术选型如下：

- ui 组件库  react-native-elements
- 状态管理 zustand
- 路由 expo-router
- 网络请求 tanstack / react-query
- 本地缓存 async-storage

### start

```bash
npx expo start
```

### fix package
如果遇到跑不起来，可以尝试 fix 一下。
```bash
npx expo install --fix
```

### 关于
直接对接[one-api](https://github.com/songquanpeng/one-api/issues)，应该是最爽的姿势了，不需要对每一种模型做适配，只适配 openAI 的接口就 ok 了。


### 加群讨论
欢迎加群讨论技术？随意打赏，请备注 github 名

<img width="200" alt="image" src="https://github.com/bravekingzhang/react-ai-chat/assets/4476322/7c457992-a0bc-49a3-9bd6-f23b5f1a595e">

## todo

- [ ] 支持流式响应，会的人可以提 pr 了。
- [ ] 支持 markdown 代码着色
- [x] 支持显示 markdown，markdown 显示本地图片。
- [x] 支持命名对话+自动命名对话
- [x] 支持识别图片的模型如 gpt-4-vision or gemini-pro-vision，该模型下会出现上传附件📎的按钮
- [x] 支持管理会话、本地会话存储
- [x] 支持切换主题词，dark/light 模式
