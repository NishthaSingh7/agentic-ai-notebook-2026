import { Fraunces, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import "./challenge.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex",
});

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`challenge-root ${fraunces.variable} ${sourceSerif.variable} ${ibmPlex.variable}`}>
      {children}
    </div>
  );
}
