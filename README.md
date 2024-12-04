This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

/**
需求概述：根据solidity的abi动态生成前端页面

功能点1: 连接钱包（可以使用现成的钱包组件库，可以只支持 metamask 钱包）**********
功能点2: 调用钱包对随机的字符串消息进行签名  **********
功能点3: 可以在页面支持换链操作，默认是 eth 主链，可以签换到其他eth兼容的链上 **********
功能点4: 页面有一个输入框，可以输入编译好的合约的 abi json 字符串 **********
功能点5: 页面有一个输入框，可以输入合约地址 **********
功能点6: 根据编译好的abi生成前端的页面，abi描述了合约接口的输入和输出，页面根据abi生成输入框和调用按钮  **********
功能点7: 输入参数点击调用按钮后，可以调用合约唤起钱包交互，并返回结果

备注: 
abi的合约函数参数目前只考虑基本类型，不考虑数组、结构体等复杂类型
前端样式可以自定，别太丑就可以，还需要考察前端的技术能力
可以使用chatgpt等辅助工具，我们的目标是高效高质量的完成任务
可以参考 https://remix.ethereum.org/ 这个solidity IDE 部署合约然后调用的逻辑
代码可以提交到github，或者可以自己部署到免费的平台，会根据功能完成度以及bug数量评估能力
从确认收到消息开始计时，时间限期3天
**/