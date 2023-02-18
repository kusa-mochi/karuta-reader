import React, {useState} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styled from 'styled-components'
import 'text-to-speech-offline'

export default function Home() {
  const TTS = require('text-to-speech-offline');
  const MainContainer = styled.div`
    font-size: 32px;
  `;

  const [karutaText, setKarutaText] = useState<string>("");

  const LoadTextFile = (e: any): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        const fileContent: string = reader.result as string;
        setKarutaText(fileContent);
      }
    } else {
      console.log("failed to upload a file.");
    }
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContainer>
        <input type="file" onChange={LoadTextFile}></input>
        <div>{karutaText}</div>
        <button onClick={() => TTS(karutaText, 'ja-JP')}>読み上げる</button>
      </MainContainer>
    </>
  )
}
