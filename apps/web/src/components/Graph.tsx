import type { FC } from "react";
import propScale from "~/helpers/propScale";

interface props {
  data: number[];
}

let Graph: FC<props> = ({ data }) => {
  let scale = propScale([...data, 0]);
  let tickSize = data.length;

  let path = data.flatMap((e, i, arr) => {
    let prev: number[][] = [];
    if (i != 0) {
      if (arr[i - 1] != e) {
        let x = i * tickSize;

        let y = arr[i - 1] || 0;
        y = 100 - 90 * scale(y);
        prev.push([x, y]);
      }
    }

    let x = i * tickSize;
    let y = 100 - 90 * scale(e);

    return [...prev, [x, y]];
  });

  path = [...path, [100, 100], [0, 100]];
  return (
    <svg
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      <polygon points={path.join(" ")} fill="turquoise" stroke="black" />
    </svg>
  );
};

export default Graph;
