import { StarsBackground } from "../Background/stars";
import { TypewriterEffectSmooth } from "../type";




const HomePage = () => {

    const words = [
        {
          text: "Start",
        },
        {
          text: "minting",
        },
        {
          text: "your",
        },
        {
          text: "with",
        },
        {
          text: "NFT.",
          className: "text-blue-500 dark:text-blue-500",
        },
      ];
    return (
        <div className="w-full h-screen  flex flex-col items-center justify-center">
        
            <TypewriterEffectSmooth words={words} />
           
        </div>
    );
};

export default HomePage;
