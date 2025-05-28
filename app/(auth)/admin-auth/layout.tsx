import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Authentication"
}

const AuthLayout = ({children}: {children: React.ReactNode}) => children;

export default AuthLayout;