import {createContext, ReactNode, useEffect, useState} from 'react';
import challenges from '../../challenges.json';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
} 

interface ChallengesContextData {
    level: number;
    levelUp :() => void;
    currentExperience:number; 
    challengesCompleted:number;
    startNewChallenge:() =>void;
    resetChallenge:() => void;
    activeChallenge: Challenge;
    experienceToNextLevel: number;
    completeChallenge: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData );

export function ChallengesProvider ({children}:ChallengesProviderProps){
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);
    const[activeChallenge, setActiveChallenge] = useState(null)

    const experienceToNextLevel = Math.pow((level+1)*4 , 2)

    useEffect(()=>{
        Notification.requestPermission();
    },[]) /*como ha um array vazio, a acao sera executada uma unica vez assim que aparecer o componente em tela */


function levelUp() {
     setLevel (level +1);
}
function startNewChallenge (){
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge)

    new Audio('/notification.mp3').play();

    if (Notification.permission=='granted') {
        new Notification('Novo desafio ', {
            body: `Valendo ${challenge.amount} xp`
        })
    }
}

  function resetChallenge() {
    setActiveChallenge(null);
}
  function completeChallenge() {
      if (!activeChallenge) {
          return;
      }

      const {amount} = activeChallenge;

      let finalExperiencwe =currentExperience +amount;

      if (finalExperiencwe >= experienceToNextLevel) {
          finalExperiencwe = finalExperiencwe-experienceToNextLevel;
          levelUp();
      }

      setCurrentExperience(finalExperiencwe);
      setActiveChallenge(null);
      setChallengesCompleted(challengesCompleted+1);     
  }

    return (
        <ChallengesContext.Provider value={{level, levelUp, currentExperience, challengesCompleted,
       startNewChallenge,
         activeChallenge,
         resetChallenge,
         experienceToNextLevel,
         completeChallenge}}>
         {children}
          </ChallengesContext.Provider>
    );
}