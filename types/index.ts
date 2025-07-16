export type IUser = {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
  country?: string;
  imageUrl: string;
  role: string;
  isVerified?: boolean;
  address: string;
  subscription: any;
  createdAt: string;
};

export type INewUser = {
  name: string;
  email: string;
  password: string;
};

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type PredictionType = {
  id: string;
  datetime: string;
  league: string;
  hometeam: string;
  awayteam: string;
  tip: string;
  odd?: number;
  homescore: string;
  awayscore: string;
  status: string;
  user?: IUser;
};

export type BlogType = {
  title: string;
  imgUrl: string;
  dateTime: string;
};

export type UserRole =
  | "admin"
  | "football_manager"
  | "basketball_manager"
  | "blog_manager"
  | "seo_manager"
  | "football_staff"
  | "basketball_staff"
  | "blog_staff"
  | "user";
