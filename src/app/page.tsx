'use client';

import { useEffect, useState } from "react";
import { Drawer } from 'vaul';
import { IoPlayOutline } from "react-icons/io5";
import { TbReload } from "react-icons/tb";
import { HiDotsHorizontal } from "react-icons/hi";
import Ball from "@/Icons/Ball";
import bgVolleyball from "@/assets/images/background.png";
import ballIcon from "@/assets/images/ball.svg";
import Image from "next/image";

type Click = {
  x: number;
  y: number;
  number: number;
};

const colorMap: { [key: number]: string } = {
  1: 'bg-blue-500',    // Azul
  2: 'bg-green-500',   // Verde
  3: 'bg-red-500',     // Vermelho
  4: 'bg-orange-500',       // Laranja
  5: 'bg-purple-500',  // Roxo
  6: 'bg-yellow-500',  // Amarelo
};

export default function Home() {
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(1);
  const [clicks, setClicks] = useState<Click[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDrawerOpen) return;
    const target = e.target as HTMLElement;

    if (
      target.closest('#reset-button') ||
      target.closest('#config-drawer') ||
      target.closest('#play-button') ||
      target.closest('#overlay')
    ) {
      return;
    }
    if (clicks.length >= 6) {
      alert('Limite de clicks atingido');
      return;
    };

    const newClick: Click = {
      x: e.clientX,
      y: e.clientY,
      number: clicks.length + 1,
    };

    setClicks([...clicks, newClick]);
  };

  const resetClicks = () => {
    setClicks([]);
    setSelectedNumbers([]);
  };

  const playGame = () => {
    if (clicks.length < numberOfPlayers) {
      alert('Número de cliques insuficiente para a quantidade de jogadores.');
      return;
    }

    const numbers = clicks.map((click) => click.number);
    const shuffled = numbers.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numberOfPlayers);

    setSelectedNumbers(selected);
  };

  useEffect(() => {
    resetClicks();
  }, [numberOfPlayers]);

  return (
    <div
      style={{
        backgroundImage: `url(${bgVolleyball.src})`,
      }}
      className="h-dvh w-full bg-gray-600 relative bg-cover bg-center"
      onClick={handleClick}
    >
      {clicks.map((click, index) => (
        <div
          key={index}
          className={`absolute font-bold rounded-full size-12 flex items-center justify-center transition-all ${selectedNumbers.includes(click.number)
            ? 'scale-125'
            : ''
            }`}
          style={{
            left: click.x,
            top: click.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="relative flex size-12">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 transition-all ${selectedNumbers.includes(click.number)
                ? `${colorMap[click.number]} animate-ping scale-125`
                : colorMap[click.number]
                }`}
            />
            <span
            className={`relative size-12 rounded-full text-white flex items-center transition-all justify-center ${selectedNumbers.includes(click.number)
              ? `${colorMap[click.number]} text-white scale-125`
              : colorMap[click.number]
              }`}
            >
              {/* {click.number} */}
              <Image src={ballIcon} alt="ball" width={45} height={45} />
            </span>
          </span>
        </div>
      ))}

      <div className="flex items-center justify-between absolute right-0 bottom-6 w-full px-4">
        <button
          id="reset-button"
          className="bg-gray-300 p-2 size-10 flex items-center justify-center rounded-full cursor-pointer"
          onClick={resetClicks}
        >
          <TbReload size={20} />
        </button>

        <button
          id="play-button"
          className="bg-gray-300 p-2 size-10 flex items-center justify-center rounded-full cursor-pointer"
          onClick={playGame}
        >
          <IoPlayOutline size={20} />
        </button>

        <div id="config-drawer" className="">
          <Drawer.Root open={isDrawerOpen} onOpenChange={(open) => setIsDrawerOpen(open)}>
            <Drawer.Trigger className="focus:outline-none focus-within:outline-none">
              <div className='bg-gray-300 p-2 size-10 flex items-center justify-center rounded-full cursor-pointer'>
                <HiDotsHorizontal size={20} />
              </div>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay id="overlay" className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="bg-gray-200 h-fit fixed bottom-0 left-0 right-0 outline-none pt-2 rounded-t-xl">
                <Drawer.Title>
                  <div className='w-10 h-1 rounded-full bg-gray-400 mx-auto' />
                </Drawer.Title>
                <div className="p-4 bg-gray-200 flex flex-col items-end">
                  <div className='w-full flex flex-col items-center justify-between gap-2 pb-6'>
                    <span>
                      Quantas jogadoras vão entrar?
                    </span>
                    <div className='flex gap-2 bg-white rounded-md p-2'>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => setNumberOfPlayers(num)}
                          className={`
                            size-10 rounded-md flex items-center justify-center cursor-pointer
                            ${numberOfPlayers === num ? 'bg-blue-500 text-white' : 'bg-gray-100'}
                        `}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      </div>
    </div>
  );
}
