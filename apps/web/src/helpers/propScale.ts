function propScale(data: number[]) {
  const max = Math.max(...data);
  const min = Math.min(...data);

  const m = 1 / (max - min);
  const c = -m * min;
  return (x: number) => m * x + c;
}

export default propScale;
