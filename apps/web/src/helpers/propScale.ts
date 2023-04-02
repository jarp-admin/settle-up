function propScale(data: number[]) {
  let max = Math.max(...data);
  let min = Math.min(...data);

  let m = 1 / (max - min);
  let c = -m * min;
  return (x: number) => m * x + c;
}

export default propScale;
