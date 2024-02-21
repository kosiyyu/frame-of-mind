import React from "react";
import Svg, { Defs, RadialGradient, Stop, G, Circle } from "react-native-svg";
import { colors } from "@constants/styles";

const SvgComponent: React.FC = (props) => {
  return (
    <Svg 
      viewBox="0 0 800 500"
      width={"100%"}
      height={200}
      {...props}
    >
      <Defs>
        <RadialGradient id="a" r="50%" cx="50%" cy="50%">
        <Stop offset="0%" stopColor={colors.specialDark} stopOpacity={0.5} />
          <Stop
            offset="50%"
            stopColor={colors.specialMedium}
            stopOpacity={0.5}
          />
          <Stop offset="100%" stopColor={colors.specialLight} stopOpacity={0.5} />
        </RadialGradient>
      </Defs>
      <G fill="url(#a)">
        <Circle r={352} cx={400} cy={400} opacity={1} />
        <Circle r={320} cx={400} cy={400} opacity={0.91} />
        <Circle r={288} cx={400} cy={400} opacity={0.81} />
        <Circle r={256} cx={400} cy={400} opacity={0.72} />
        <Circle r={224} cx={400} cy={400} opacity={0.62} />
        <Circle r={192} cx={400} cy={400} opacity={0.53} />
        <Circle r={160} cx={400} cy={400} opacity={0.43} />
        <Circle r={128} cx={400} cy={400} opacity={0.34} />
        <Circle r={96} cx={400} cy={400} opacity={0.24} />
        <Circle r={64} cx={400} cy={400} opacity={0.15} />
      </G>
    </Svg>
  );
};

export default SvgComponent;