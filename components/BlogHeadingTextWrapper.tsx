import React from 'react'

const BlogHeadingTextWrapper = ({ text, bgColor, textColor }: { text: string, bgColor: string, textColor: string }) => {
  return (
    <div className={`w-full flex items-end`}>
      <span className={`${bgColor} ${textColor} max-w-fit p-1 rounded-none uppercase text-sm`}>
        {text}
      </span>
      <span className={`flex flex-1 h-[2px] ${bgColor}`} />
    </div>
  );
}

export default BlogHeadingTextWrapper
