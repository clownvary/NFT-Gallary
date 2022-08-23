import { useState } from "react";

import {NFTCard} from '../components/NFTCard';

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection]=useState(false)

  const CONFIG = {
    BASE_URL:
      "https://eth-mainnet.g.alchemy.com/v2/YWby2EMHNr6JiIQIes5JHo2HJl157Z8O",
  };
  const fetchNFTs = async () => {
    let nfts;
    let fetchURL;
    console.log("fetching nfts");
    const getNftsUrl = `${CONFIG.BASE_URL}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };
    if (!collection.length) {
      fetchURL = `${getNftsUrl}?owner=${wallet}`;
    } else {
      fetchURL = `${getNftsUrl}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
    }
    nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());

    if (nfts) {
      console.log("nfts:", nfts);
      setNFTs(nfts.ownedNfts);
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const fetchURL = `${CONFIG.BASE_URL}/getNFTsForCollection/?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
      }
    }
  }

  const onClickHandle = async () => {
    if (fetchForCollection) {
      await fetchNFTsForCollection();
    } else {
      await fetchNFTs();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          disabled={fetchForCollection}
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={"text"}
          placeholder="Add your wallet address"
        ></input>
        <input
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address"
        ></input>
             <label className="text-gray-600 "><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button
          className={
            "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
          }
          onClick={onClickHandle}
        >
          Let's go!{" "}
        </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  );
};

export default Home;
