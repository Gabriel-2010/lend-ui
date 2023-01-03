const axios = require("axios");
const BigNumber = require("bignumber.js");
import styles from "./index.less";
import { Input, Form, Button, Select, Radio, Row, Col } from "antd";
const { Item } = Form;
import { useState, useMemo, useEffect, useCallback } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
const cTokenAbi = require("./CErc20.json");
const erc20Abi = require("./erc20.json");
const storemanAbi = require("./abi.StoremanGroupDelegate.json");
import type { RadioChangeEvent } from "antd";

const approveAmount = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const NONE_ADDRESS = "0xbad";
const STOREMAN_SC = "0x1E7450D5d17338a348C5438546f0b4D0A5fbeaB6";
const SWAP_ROBOT_SC: any = {
  wanchain: "0xc58D5Eab2F62B259BacF8B6C19d19e192BF84dCc",
  moonriver: "0xeCe07b3450993306e1fb961dcdE279A9e6b99d67",
};

const CROSS_SC: any = {
  wanchain: "0xe85b0D89CbC670733D6a40A9450D8788bE13da47",
  moonriver: "0xdE1Ae3c465354f01189150f3836C7C15A1d6671D",
};

const GAS_LIMIT = "0x" + Number(500000).toString(16);

const providerOptions = {
  /* See Provider Options Section */
};

const WANCHAIN_MAIN_NET = Number(888);
const MOONRIVER_MAIN_NET = Number(1285);

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

const allTokenV2: any = {
  wanchain: {
    wanUSDT: {
      address: "0x11e77E27Af5539872efEd10abaA0b408cfd9fBBD",
      cToken: "0x86d6aa06b2649a68b59cd76e0195dbd26c5c6c48",
      decimals: 6,
    },
    wanUSDC: {
      address: "0x52a9cea01c4cbdd669883e41758b8eb8e8e2b34b",
      cToken: "0x53c8882b2ce3fe05b871392faacf32ec051dffec",
      decimals: 6,
    },
    wanXRP: {
      address: "0xf665E0e3E75D16466345E1129530ec28839EfaEa",
      cToken: "0xacc0475893b5e0596479c5a45c9477d418be6da6",
      decimals: 6,
    },
    wanBTC: {
      address: "0x50c439B6d602297252505a6799d84eA5928bCFb6",
      cToken: "0x040007866aa406908c70f7da53425cae191a9a46",
      decimals: 8,
    },
    wanETH: {
      address: "0xE3aE74D1518A76715aB4C7BeDF1af73893cd435A",
      cToken: "0x915059e4917d6c2f76b6cc37868cc4d61bc0c7a5",
      decimals: 18,
    },
    WAND: {
      address: "0x230f0c01b8e2c027459781e6a56da7e1876efdbe",
      cToken: "0x6b4b51cce4978c890e48080096ea915c885ccabf",
      decimals: 18,
    },
    wanLTC: {
      address: "0xd8e7bd03920ba407d764789b11dd2b5eaee0961e",
      cToken: "0x8557802730a293144748c784b9bb5e259619034c",
      decimals: 6,
    },
    wanDOGE: {
      address: "0xd3a33c6fea7f785ddc0915f6a76919c11abded45",
      cToken: "0xff10c4394dbbd786d639166163861e8636899124",
      decimals: 6,
    },
    PHX: {
      address: "0xf17c59bf0f6326da7a8cc2ce417e4f53a26707bd",
      cToken: "0x3c2edaa754cbc179cec5659483f336c8af303749",
      decimals: 18,
    },
  },
};

const allTokenV1: any = {
  wanchain: {
    wanUSDT: {
      address: "0x11e77E27Af5539872efEd10abaA0b408cfd9fBBD",
      cToken: "0xff39b35474c83f2552b0463d664dd12da5d083cf",
      decimals: 6,
    },
    wanUSDC: {
      address: "0x52a9cea01c4cbdd669883e41758b8eb8e8e2b34b",
      cToken: "0x1c6ad34e176f230f430a6e61b5088415482207e4",
      decimals: 6,
    },
    wanXRP: {
      address: "0xf665E0e3E75D16466345E1129530ec28839EfaEa",
      cToken: "0xca379fc6cb94db3c68b83bad0e574030f97eae54",
      decimals: 6,
    },
    wanBTC: {
      address: "0x50c439B6d602297252505a6799d84eA5928bCFb6",
      cToken: "0xaf96f49d92a1a4e7c9b77755364355aeee036ef5",
      decimals: 8,
    },
    wanETH: {
      address: "0xE3aE74D1518A76715aB4C7BeDF1af73893cd435A",
      cToken: "0x2411acd51122a43277d1bd8b63c478b815ae9ede",
      decimals: 18,
    },
    WASP: {
      address: "0x8b9f9f4aa70b1b0d586be8adfb19c1ac38e05e9a",
      cToken: "0x0492d201b58f748f2f2c64777bd235ff7cd3e1d5",
      decimals: 18,
    },
    wanLINK: {
      address: "0x06da85475f9d2ae79af300de474968cd5a4fde61",
      cToken: "0x3dd82c1b370e1bcb8eaebb4a4c81ebbbe2eb02c5",
      decimals: 18,
    },
    wanUNI: {
      address: "0x73eaa7431b11b1e7a7d5310de470de09883529df",
      cToken: "0x30558274e9739e8006ebddb359ae64e691747e40",
      decimals: 18,
    },
    FNX: {
      address: "0xc6f4465a6a521124c8e3096b62575c157999d361",
      cToken: "0xe2cb1756bd27fca11569513de67e203e929c591e",
      decimals: 18,
    },
  },
};

const chainList = [
  { label: "Wanchain", value: "wanchain" },
  { label: "Moonriver", value: "moonriver" },
];

function ascii2String(str: string) {
  let ret = "";
  for (let i = 2; i < str.length; i += 2) {
    let oneChar = "0x" + str.slice(i, i + 2);
    if (oneChar !== "00") {
      ret += String.fromCharCode(Number(oneChar));
    }
  }
  return ret;
}

export default function IndexPage() {
  const [payTokenSym, setPayToken] = useState("");
  const [backTokenSym, setBackToken] = useState("");
  const [chain, setChain] = useState("wanchain");
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("0x0");
  const [networkId, setNetworkId] = useState(WANCHAIN_MAIN_NET);
  const [web3, setWeb3] = useState(new Web3());
  const [actionValue, setAction] = useState("liquidate");
  const [versionValue, setVersion] = useState("v2");
  const [repayChecked, setCross] = useState(false);
  const [tokens, setTokens] = useState(allTokenV2["wanchain"]);
  const [form] = Form.useForm();

  // useEffect(() => {
  //   if (connected) {
  //     web3.eth.getChainId((e, ret) => {
  //       console.log(ret);
  //     });
  //   }
  // });
  function getTokenList(chain: string) {
    return Object.keys(tokens).map((i) => {
      return { label: i, value: i };
    });
  }

  async function onSelectPayToken(item: string) {
    setPayToken(item);
  }

  async function onSelectBackToken(item: string) {
    setBackToken(item);
  }

  function onSelectChain(item: string) {
    setChain(item);
    setTokens(allTokenV2[item]);
    form.setFieldsValue({ token: "" });
  }
  async function getFee(coinType: string) {
    let request = `v1/${coinType.toLowerCase()}/main`;

    let ret = await axios.get(request);
    console.log(ret);
    return Math.floor((ret.data.medium_fee_per_kb / 1024) * 303).toString();
  }

  async function onFinish() {
    try {
      let payToken = tokens[payTokenSym].address;
      let payCToken = tokens[payTokenSym].cToken;
      let decimals = tokens[payTokenSym].decimals;
      let cTokenSupply = null;

      if (actionValue === "liquidate") {
        cTokenSupply = tokens[backTokenSym].cToken;
      }

      let borrower = form.getFieldValue("borrower");
      let amount = form.getFieldValue("amount");
      console.log(payToken, payCToken, cTokenSupply, borrower, amount);
      console.log("type of amount", typeof amount);

      let amountWei = new BigNumber(amount).times(10 ** decimals).toString(10);
      console.log("type of amount", typeof amountWei, amountWei);

      let tx: any;

      const erc20Sc = new web3.eth.Contract(erc20Abi, payToken);
      let approved = await erc20Sc.methods.allowance(address, payCToken).call();
      console.log("approved", approved);
      if (BigNumber(approved).eq(0)) {
        console.log("Try to approve...");
        tx = await erc20Sc.methods.approve(payCToken, approveAmount).send({ from: address });
      }
      const cTokenSc = new web3.eth.Contract(cTokenAbi, payCToken);
      if (actionValue === "liquidate") {
        console.log("Try to liquidate...");
        tx = await cTokenSc.methods.liquidateBorrow(borrower, amountWei, cTokenSupply).send({ from: address, gas: GAS_LIMIT });
      } else if (actionValue === "repay") {
        console.log("Try to repay...");
        tx = await cTokenSc.methods.repayBorrowBehalf(borrower, amountWei).send({ from: address, gas: GAS_LIMIT });
      }
      console.log("tx:", tx);
    } catch (e) {
      console.log(e);
    }
  }

  async function onConnect() {
    let provider = await web3Modal.connect();
    let web3 = new Web3(provider);
    setWeb3(web3);

    const accounts = await web3.eth.getAccounts();
    const addr = accounts[0];
    const netId = await web3.eth.net.getId();
    setConnected(true);
    setAddress(addr);
    setNetworkId(netId);

    provider.on("disconnect", (error: { code: number; message: string }) => {
      console.log("Disconnected");
      setConnected(false);
    });

    provider.on("accountsChanged", (accounts: string[]) => {
      setAddress(accounts[0]);
    });

    provider.on("chainChanged", (networkId: string) => {
      setNetworkId(Number(networkId));
    });
  }

  function radioChange(e: RadioChangeEvent) {
    // console.log(e.target);
    console.log("radio checked", e.target.value);
    setAction(e.target.value);
  }

  function versionChange(e: RadioChangeEvent) {
    console.log("version checked", e.target.value);
    setVersion(e.target.value);
    if (e.target.value === "v1") {
      setTokens(allTokenV1["wanchain"]);
    } else {
      setTokens(allTokenV2["wanchain"]);
    }
  }

  return (
    <div className={styles.frame}>
      <div className={styles["normal-head"]}>
        <Button type="primary" className={styles.wallet} onClick={onConnect}>
          {!connected ? "Connect Wallet" : address.slice(0, 6) + "..." + address.slice(-4)}
        </Button>
      </div>

      <div>
        <Form
          form={form}
          labelCol={{
            span: 2,
          }}
          initialValues={{
            actions: "liquidate",
            version: "v2"
          }}
          onFinish={onFinish}
          wrapperCol={{
            span: 16,
          }}
        >
          <div>
            <Item name="version" label="Version">
              <Radio.Group onChange={versionChange} value={versionValue}>
                <Radio value={"v1"}>V1</Radio>
                <Radio value={"v2"}>V2</Radio>
              </Radio.Group>
            </Item>
          </div>
          <div>
            <Item name="actions" label="Actions">
              <Radio.Group onChange={radioChange} value={actionValue}>
                <Radio value={"liquidate"}>Liquidate</Radio>
                <Radio value={"repay"}>Repay Behalf</Radio>
              </Radio.Group>
            </Item>
          </div>
          <Item label="Repay" name="payToken" rules={[{ required: true, message: "Please select token to pay" }]}>
            <Select showSearch options={getTokenList("wanchain")} onSelect={onSelectPayToken}></Select>
          </Item>

          {actionValue === "liquidate" ? (
            <Item label="Collateral" name="backToken" rules={[{ required: true, message: "Please select token to get back" }]}>
              <Select showSearch options={getTokenList("wanchain")} onSelect={onSelectBackToken}></Select>
            </Item>
          ) : (
            ""
          )}
          <Item label="Borrower" name="borrower" rules={[{ required: true, message: "The borrower to liquidate" }]}>
            <Input />
          </Item>

          <Item label="Amount" name="amount" rules={[{ required: true, message: "Please input amount to pay" }]}>
            <Input />
          </Item>

          <Item
            className={styles.button}
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" disabled={!connected || (chain === "wanchain" && networkId !== WANCHAIN_MAIN_NET) || (chain === "moonriver" && networkId !== MOONRIVER_MAIN_NET)}>
              Submit
            </Button>
          </Item>
        </Form>
      </div>
    </div>
  );
}
