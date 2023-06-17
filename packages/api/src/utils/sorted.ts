import { User } from "database";

export default function sorted(a: User, b: User) {
  return a.id < b.id ? ([a, b, false] as const) : ([b, a, true] as const);
}
