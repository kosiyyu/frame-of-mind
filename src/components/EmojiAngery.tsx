import * as React from "react";
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  LinearGradient,
  G,
  Path
} from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
import { EmojiProps } from "@constants/types";

const EmojiAngery: React.FC<EmojiProps>  = (props) => {
  return (
    <Svg
      viewBox="0 0 800 800"
      width={props.width || 45}
      height={props.height || 45}
      {...props}
    >
      <Defs>
        <RadialGradient id="b" r="93%" cx="20%" cy="20%">
          <Stop offset="70%" stopColor="hsl(351, 100%, 67%)" stopOpacity={0} />
          <Stop offset="97%" stopColor="#c61945" />
        </RadialGradient>
        <RadialGradient id="c" r="65%" cx="28%" cy="20%">
          <Stop offset="0%" stopColor="#ff8b9e" stopOpacity={0.75} />
          <Stop offset="100%" stopColor="hsl(351, 100%, 67%)" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="e" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#555" />
          <Stop offset="100%" stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id="h" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#ff9667" />
          <Stop offset="100%" stopColor="hsl(3, 100%, 51%)" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <G strokeLinecap="round">
        <Path
          d="M650 450c0 152.958-97.042 276.954-250 276.954S150 602.958 150 450c0-152.958 97.042-276.954 250-276.954S650 297.042 650 450z"
          fill="#c61945"
          opacity={0.25}
        />
        <Path
          d="M650 400c0 161.674-88.326 235.755-250 235.755-161.673 0-250-74.081-250-235.755 0-161.673 88.327-235.755 250-235.755 161.674 0 250 74.082 250 235.755z"
          fill="hsl(351, 100%, 67%)"
        />
        <Path
          d="M650 400c0 161.674-88.326 235.755-250 235.755-161.673 0-250-74.081-250-235.755 0-161.673 88.327-235.755 250-235.755 161.674 0 250 74.082 250 235.755z"
          fill="url(#b)"
        />
        <Path
          d="M650 400c0 161.674-88.326 235.755-250 235.755-161.673 0-250-74.081-250-235.755 0-161.673 88.327-235.755 250-235.755 161.674 0 250 74.082 250 235.755z"
          fill="url(#c)"
        />
        <Path
          d="M195.182 362.5q300 50 50 0"
          strokeWidth={20}
          stroke="#000"
          fill="none"
        />
        <Path
          d="M195.182 362.5q300 50 50 0"
          strokeWidth={6.666666666666667}
          stroke="url(#e)"
          fill="none"
        />
        <Path
          d="M420.182 389.5q300-58 50 0"
          strokeWidth={20}
          stroke="#000"
          fill="none"
        />
        <Path
          d="M420.182 389.5q300-58 50 0"
          strokeWidth={6.666666666666667}
          stroke="url(#e)"
          fill="none"
        />
        <Path
          d="M356 527.25q12-9 100 0"
          strokeWidth={20}
          stroke="hsl(3, 100%, 51%)"
          fill="none"
        />
        <Path
          d="M356 527.25q12-9 100 0"
          strokeWidth={6.666666666666667}
          stroke="url(#h)"
          fill="none"
        />
      </G>
    </Svg>
  );
};

export default EmojiAngery;
