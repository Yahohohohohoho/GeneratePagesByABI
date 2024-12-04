"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Input, Button, message } from "antd";
import { useEffect, useState } from "react";
import { useAccount, useEnsName } from 'wagmi'

const { TextArea } = Input;

export default function Home() {
  // 钱包是否连接
  const { isConnected, address } = useAccount();
  const [messageApi, contextHolder] = message.useMessage();
  const [abiJSON, setAbiJSON] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const handleDeploy = () => {
    if (!abiJSON) {
      messageApi.open({
        type: "warning",
        content: "请先输入合约ABI！",
      });
      return;
    }
    if (!contractAddress) {
      messageApi.open({
        type: "warning",
        content: "请先输入合约地址！",
      });
      return;
    }
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-4/5">
      <ConnectButton />
      <TextArea
          placeholder={isConnected ? "请输入合约ABI JSON字符串" : "请先连接钱包" }
          disabled={!isConnected}
          value={abiJSON}
          onChange={(e) => setAbiJSON(e.target.value)}
          rows={10}
        />
        <Input
          placeholder={isConnected ? "请输入合约地址" : "请先连接钱包" } 
          disabled={!isConnected}
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
        <Button
          color="default"
          variant="solid"
          block
          className="rounded-full border border-solid border-transparent transition-colors bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc]"
          onClick={handleDeploy}
        >
          调用
        </Button>
        {contextHolder}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
