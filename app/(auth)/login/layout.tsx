import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Login",
};

const layout = ({children}:{children: React.ReactNode}) => children

export default layout
