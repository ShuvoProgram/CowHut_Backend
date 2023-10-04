import { User } from "./users.model";

const isUserFound = async (id: string): Promise<boolean> => {
  const user = await User.findById(id);
  return !!user;
};

export default isUserFound;