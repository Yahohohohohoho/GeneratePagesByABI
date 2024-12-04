"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Input, Button, message } from "antd";
import { useEffect, useState } from "react";
import {
  useAccount,
  useSignMessage,
} from "wagmi";
import { ethers } from "ethers";
const { TextArea } = Input;

export default function Home() {
  // 钱包是否连接
  const { isConnected, address, chain } = useAccount();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [abiJSON, setAbiJSON] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [parsedABI, setParsedABI] = useState(null); // 存储解析后的 ABI
  // 签名
  const [messageSign, setMessageSign] = useState("Random string");
  const { signMessage } = useSignMessage();

  // 调用
  const [funcs, setFuncs] = useState([]);
  const [functionInputs, setFunctionInputs] = useState({});
  const [callResults, setCallResults] = useState({});
  const [callLoading, setCallLoading] = useState({}); // 新增：管理每个调用的加载状态

  const handleDeploy = async () => {
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
    setLoading(true);

    try {
      const parsedAbi = JSON.parse(abiJSON);
      const filteredFunctions = parsedAbi.filter(
        (item) => item.type === "function"
      );
      setFuncs(filteredFunctions);
      setParsedABI(parsedAbi);
    } catch (error) {
      console.error("Invalid ABI:", error);
      messageApi.open({
        type: "error",
        content: "ABI 解析失败，请检查输入。",
      });
    }
    setLoading(false);
  };

  const generateFormForFunction = (func) => {
    return (
      <div key={func.name} className="mb-4">
        <h3>{func.name}</h3>
        <form
          className="flex flex-row gap-8 row-start-2 items-center sm:items-start"
          onSubmit={(e) => handleSubmit(e, func)}
        >
          {func.inputs.map((input, index) => (
            <Input
              key={index}
              placeholder={`Enter ${input.name}`}
              onChange={(e) =>
                setFunctionInputs((prev) => ({
                  ...prev,
                  [`${func.name}-${input.name}`]: e.target.value,
                }))
              }
            />
          ))}
          <Button type="primary" htmlType="submit" className="leading-10">
            Call {func.name}
          </Button>
        </form>
      </div>
    );
  };

  const handleSubmit = async (event, func) => {
    event.preventDefault();
    const args = func.inputs.map(
      (input) => functionInputs[`${func.name}-${input.name}`]
    );

    if (!parsedABI || !contractAddress || !args.every(Boolean)) {
      messageApi.open({
        type: "warning",
        content: "请确保所有参数都已填写并有效。",
      });
      return;
    }

    setCallLoading((prev) => ({ ...prev, [func.name]: true }));

    // 根据函数类型判断是读取还是写入
    const isViewOrPure = ["view", "pure"].includes(func.stateMutability);

    if (isViewOrPure) {
      // 对于只读方法，使用 useReadContract
      const readConfig = {
        addressOrName: contractAddress,
        abi: parsedABI,
        functionName: func.name,
        args: args,
      };

      try {
        const INFURA_ID = "1ffdb388b04849289427741d9ec75b50";
        const provider = new ethers.JsonRpcProvider(
          `https://mainnet.infura.io/v3/${INFURA_ID}`
        );
        const contract = new ethers.Contract(
          contractAddress,
          parsedABI,
          provider
        );
        const result = await contract[func.name](...args);
        setCallResults((prev) => ({
          ...prev,
          [func.name]: `Result: ${result.toString()}`,
        }));
        messageApi.open({
          type: "success",
          content: `调用 ${func.name} 成功`,
        });
      } catch (error) {
        console.error("Error calling read method:", error);
        messageApi.open({
          type: "error",
          content: `调用 ${func.name} 失败`,
        });
      }
    } else {
      try {
        const INFURA_ID = "1ffdb388b04849289427741d9ec75b50";
        const provider = new ethers.JsonRpcProvider(
          `https://mainnet.infura.io/v3/${INFURA_ID}`
        );
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          parsedABI,
          signer
        );
        const tx = await contract[func.name](...args);
        messageApi.open({
          type: "loading",
          content: `正在调用 ${func.name}...`,
        });

        const receipt = await tx.wait();
        if (receipt.status === 1) {
          messageApi.open({
            type: "success",
            content: `交易成功确认`,
          });
          setCallResults((prev) => ({
            ...prev,
            [func.name]: `Transaction hash: ${tx.hash}`,
          }));
        } else {
          messageApi.open({
            type: "error",
            content: `交易失败`,
          });
        }
      } catch (error) {
        console.error("Error calling write method:", error);
        messageApi.open({
          type: "error",
          content: `调用 ${func.name} 失败`,
        });
      }
    }

    setCallLoading((prev) => ({ ...prev, [func.name]: false }));
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-4/5">
        <ConnectButton />
        <div className="flex flex-row gap-8 row-start-2 items-center sm:items-start">
          <Input
            value={messageSign}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            disabled={!isConnected}
            onClick={() => signMessage({ message: messageSign })}
          >
            Sign Message
          </Button>
        </div>
        <TextArea
          placeholder={
            isConnected ? "请输入合约ABI JSON字符串" : "请先连接钱包"
          }
          disabled={!isConnected}
          value={abiJSON}
          onChange={(e) => setAbiJSON(e.target.value)}
          rows={10}
        />
        <Input
          placeholder={isConnected ? "请输入合约地址" : "请先连接钱包"}
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
          loading={loading}
        >
          调用
        </Button>
        {contextHolder}
        {/* 动态生成的合约调用表单 */}
        {funcs.length > 0 && (
          <div>
            {funcs.map(generateFormForFunction)}
            {Object.entries(callResults).map(([funcName, result]) => (
              <p key={funcName}>{result}</p>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
