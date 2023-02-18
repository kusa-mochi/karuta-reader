import React, {useEffect, useState} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Iceberg, Inter } from '@next/font/google'
import styled from 'styled-components'
import 'text-to-speech-offline'

export default function Home() {
  const TTS = require('text-to-speech-offline');
  const MainContainer = styled.div`
    font-size: 20px;
  `;
  const CardsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
  `;
  const Card = styled.div`
    margin: 4px;
    border: 1px solid #303030;
    border-radius: 8px;
    padding: 8px;
    max-width: 400px;
    max-height: 500px;
  `;
  const CurrentCard = styled.div`
    margin: 4px;
    border: 1px solid #cfa984;
    border-radius: 8px;
    padding: 8px;
    max-width: 400px;
    max-height: 500px;
    background-color: #ffdfbf;
  `;
  const UsedCard = styled.div`
    margin: 4px;
    border: 1px solid #303030;
    border-radius: 8px;
    padding: 8px;
    max-width: 400px;
    max-height: 500px;
    opacity: 0.4;
  `;
  enum CardState {
    NotReadYet = 0,
    CurrentCard,
    AlreadyRead
  }
  interface CardInfo {
    text: string;
    state: CardState;
  }

  let currentCardIndex: number = -1;
  const [karutaLines, setKarutaLines] = useState<CardInfo[]>([]);

  // karutaLines更新後に実行する処理
  useEffect(() => {
    console.log(karutaLines);
    // const currentCardText: string = karutaLines[currentCardIndex].text;
    // // 現在のカードを協調表示にする。
    // setKarutaLines(karutaLines.map(function(cardInfo: CardInfo): CardInfo {
    //   return {
    //     text: cardInfo.text,
    //     state: cardInfo.text === currentCardText ? CardState.CurrentCard : cardInfo.state
    //   }
    // }));
  }, [karutaLines]);

  // 0以上max未満の乱数（整数）を1つ返す関数。
  const GetRanddomNumber = (max: number): number => {
    return Math.floor(Math.random() * max);
  }

  const LoadTextFile = (e: any): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        // かるたデータをクリアする。
        setKarutaLines([]);

        const fileContent: string = reader.result as string;
        let lines = fileContent.split(/\r\n|\n/);
        lines = lines.filter(line => line != "");
        console.log(`length of lines:${lines.length}`);
        setKarutaLines(lines.map(function(line: string): CardInfo {
          return {
            text: line,
            state: CardState.NotReadYet
          }
        }));
      }
    } else {
      console.log("failed to upload a file.");
    }
  };

  const ReadOneText = (): void => {
    // 直前に読み上げたカードを薄色表示にする。
    setKarutaLines(karutaLines.map(function(cardInfo: CardInfo): CardInfo {
      return {
        text: cardInfo.text,
        state: cardInfo.state === CardState.CurrentCard ? CardState.AlreadyRead : cardInfo.state
      }
    }));

    let cardIndex = -1;
    do {
      cardIndex = GetRanddomNumber(karutaLines.length);
    } while (karutaLines[cardIndex].state !== CardState.NotReadYet);
    currentCardIndex = cardIndex;

    const currentCardText: string = karutaLines[currentCardIndex].text;
    // 直前に読み上げたカードを薄色表示にする。現在のカードを協調表示にする。
    setKarutaLines(karutaLines.map(function(cardInfo: CardInfo): CardInfo {
      if(cardInfo.state === CardState.CurrentCard) {
        return {
          text: cardInfo.text,
          state: CardState.AlreadyRead
        }
      } else if (cardInfo.text === currentCardText) {
        return {
          text: cardInfo.text,
          state: CardState.CurrentCard
        }
      } else {
        return {
          text: cardInfo.text,
          state: cardInfo.state
        }
      }
    }));

    TTS(karutaLines[currentCardIndex].text, 'ja-JP');
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
        <CardsContainer>
          {karutaLines.map(function(lineInfo) {
            switch (lineInfo.state) {
              case CardState.AlreadyRead:
                return (<UsedCard key={lineInfo.text}>{lineInfo.text}</UsedCard>);
              case CardState.CurrentCard:
                return (<CurrentCard key={lineInfo.text}>{lineInfo.text}</CurrentCard>);
              case CardState.NotReadYet:
                return (<Card key={lineInfo.text}>{lineInfo.text}</Card>);
              default:
                return (<Card key={lineInfo.text}>{lineInfo.text}</Card>);
            }
          })}
        </CardsContainer>
        <button onClick={ReadOneText}>読み上げる</button>
      </MainContainer>
    </>
  )
}
